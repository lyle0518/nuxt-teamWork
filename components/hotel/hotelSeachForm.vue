<template>
  <div class="filter">
    <el-form ref="form" :inline="true" :model="form" label-width="80px" v-model="form">
      <!-- 城市 -->
      <el-form-item>
        <el-autocomplete
          v-model="cityName"
          :fetch-suggestions="querySearch"
          placeholder="切换城市"
          @select="handleSelect"
          style="margin-right:10px"
        ></el-autocomplete>
      </el-form-item>
      <!-- 时间 -->
      <el-form-item>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <!-- 乘坐人 -->
      <el-form-item>
        <el-popover placement="bottom" width="326" v-model="visible">
          <div class="people" style=" border-bottom: 1px solid #ddd;padding-bottom:20px">
            <!-- 多选 -->
            <span style="margin-right:80px">每间</span>
            <span class="select1">
              <el-select v-model="value1" size="mini" style="width:93px">
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
                <!-- 定位--大人字样 -->
              </el-select>
            </span>
            <span>
              <el-select
                v-model="value2"
                size="mini"
                style="margin-left: 10px;
            width:93px"
                class="select2"
              >
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div style="text-align: right; margin-top: 20px">
            <el-button type="primary" size="mini" @click="setPeople">确定</el-button>
          </div>
          <el-input
            style="width:200px"
            placeholder="未定人数"
            slot="reference"
            suffix-icon="el-icon-user"
            v-model="peopleNum"
            readonly="readonly"
          ></el-input>
        </el-popover>
      </el-form-item>
      <!-- 提交 -->
      <el-form-item>
        <el-button type="primary" @click="submit">查找酒店</el-button>
      </el-form-item>
      <!-- 确认按钮 -->
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        //切换城市
        city: "",
        //入店时间
        enterTime: "",
        //;离店
        leftTime: ""
      },
      //条数
      _limit: 1,
      //开始页数
      _start: 0,
      //入住人数
      person: 1,
      // 城市value值
      cityName: "",

      //时间
      time: "",
      //时期禁用
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      //乘坐人框显示/隐藏
      visible: false,
      // 乘坐人成人数据
      select1: "",
      // 乘坐人小孩数据
      select2: "",
      //乘车人框的下拉选项
      options: [
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "7",
          label: "7"
        }
      ],
      //乘车人成人下拉框绑定值
      value1: "",
      //乘车人小孩下拉框绑定值
      value2: "",
      // 乘车框value值
      peopleNum: ""
    };
  },

  mounted() {
    // 判断cityName是否为空
    console.log(this.cityName);
    if (this.$route.query.cityName) {
      this.cityName = this.$route.query.cityName;
    }
  },
  methods: {
    // 下拉请求城市
    querySearch(value, cb) {
      console.log(value);

      if (!value) {
        cb([]);
        return;
      }
      this.$axios({
        url: "/cities",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        const { data } = res.data;
        const list = data.map(v => {
          v.value = v.name;
          return v;
        });

        cb(list);
      });
    },
    //城市下拉触发
    handleSelect(item) {
      this.cityName = item.name;
      this.form.city = item.id;
      console.log(this.form);
      // 传递当前form给仓库
      this.$store.commit("hotel/setHotelForm", this.form);
      this.$router.push({
        path: "/hotel",
        query: {
          cityName: this.cityName
        }
      });
    },
    //乘车人框确定事件
    setPeople() {
      this.visible = false;
      console.log(this.value1, this.value2);
      this.peopleNum = `${this.value1}成人`;
    },
    //提交请求
    submit() {
      // 处理入店时间和离开事件
      this.form.enterTime = this.time[0];
      this.form.leftTime = this.time[1];
      console.log(this.form);
      //将表单存到仓库
      this.$store.commit("hotel/setHotelForm", this.form);
    }
  }
};
</script>

<style lang='less' scoped>
</style>