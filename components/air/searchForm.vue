<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" :model="form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="出发城市" prop="departCity">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="handleDepartBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市" prop="destCity">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handleDestBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间" prop="departDate">
        <!-- change 用户确认选择日期时触发 -->
        <!--  value-format  设置绑定值的格式,不设置的话默认为Date对象 -->
        <!-- picker-options  设置日期的禁用 -->
        <el-date-picker
          type="date"
          v-model="form.departDate"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      form: {
        departCity: "", //出发城市
        departCode: "", //出发城市代码
        destCity: "", //目标城市
        destCode: "", //目标城市代码
        departDate: "" //日期
      },
      rules: {
        // 为了交互效果覆盖掉trigger的设置,只有在提交时才触发
        departCity: [
          { required: true, message: "请输入出发城市", trigger: "abc" }
        ],
        destCity: [
          { required: true, message: "请输入到达城市", trigger: "abc" }
        ],
        departDate: [
          { required: true, message: "请选择出发时间", trigger: "abc" }
        ]
      },
      currentTab: 0,
      departCities: [], //存储出发城市下拉列表的数据
      destCities: [], //存储到达城市下拉列表的数据
      flag: true
    };
  },
  methods: {
    //封装搜索城市方法
    getCities(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        const { data } = res.data;
        // cb这个参数是一个方法,需要传参,参数需要有value属性
        const cites = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // this.departCities = cites;
        // cb(cites);
        return cites;
        // console.log(cites);
      });
    },

    // tab切换时触发
    handleSearchTab(item, index) {
      if(index===1){
         this.$alert('暂不支持往返机票', '温馨提示', {
          confirmButtonText: '确定',})
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      // value的值是输入框的值
      if (!value) {
        cb([]);
        this.departCities = [];
        return;
      }
      this.$refs.form.validateField("departCity");
      // this.$axios({
      //   url: "/airs/city",
      //   params: {
      //     name: value
      //   }
      // }).then(res => {
      //   console.log(res);
      //   const { data } = res.data;
      //   // cb这个参数是一个方法,需要传参,参数需要有value属性
      //   const cites = data.map(v => {
      //     v.value = v.name.replace("市", "");
      //     return v;
      //   });
      //   this.departCities = cites;
      //   cb(cites);
      //   console.log(cites);
      // });
      this.getCities(value).then(res => {
        // res的值为函数中return出来的cites
        this.departCities = res;
        cb(res);
      });
    },
    // 出发城市失焦出发函数
    handleDepartBlur() {
      if (this.departCities.length > 0) {
        this.form.departCity = this.departCities[0].value;
        this.form.departCode = this.departCities[0].sort;
      }
    },
    // 到达城市失焦出发函数
    handleDestBlur() {
      if (this.destCities.length > 0) {
        this.form.destCity = this.destCities[0].value;
        this.form.destCode = this.destCities[0].sort;
      }
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      if (!value) {
        cb([]);
        this.departCities = [];
        return;
      }
      this.$refs.form.validateField("destCity");

      // this.$axios({
      //   url: "/cities",
      //   params: {
      //     name: value
      //   }
      // }).then(res => {
      //   console.log(res);
      //   const { data } = res.data;
      //   const cites = data.map(v => {
      //     v.value = v.name.replace("市", "");
      //     return v;
      //   });
      //   this.destCities = cites;
      //   cb(cites);
      //   // console.log(cites);
      // });
      this.getCities(value).then(res => {
        // res的值为函数中return出来的cites
        this.destCities = res;
        cb(res);
      });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      console.log(item);
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      this.$refs.form.validateField("departDate");

      console.log(value);
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      if (!this.flag) return;
      this.flag = false;
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
      this.flag = true;

      console.log("完全赋值完毕", this.form);
    },

    // 提交表单是触发
    handleSubmit() {
      console.log(this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          // 将表单信息存储到store的仓库中
          this.$store.commit("air/amendList", this.form);
          console.log(this.form);
          this.$router.push({
            path: "air/flights",
            query: this.form
          });
        }
      });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
