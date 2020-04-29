<template>
  <div class="hotel">
    <div class="title">
      <!-- 修改:要用图标分隔符 -->
      <nuxt-link to="#">酒店</nuxt-link>
      <span>></span>
      <nuxt-link to="#">酒店预订</nuxt-link>
    </div>
    <div class="filter">
      <el-autocomplete
        v-model="city"
        :fetch-suggestions="querySearch"
        placeholder="切换城市"
        @select="handleSelect"
        style="margin-right:10px"
      ></el-autocomplete>

      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <!-- 乘坐人 -->
      <el-popover placement="bottom" width="326" v-model="visible">
        <div class="people" style=" border-bottom: 1px solid #ddd;padding-bottom:20px">
          <!-- 多选 -->
          <span style="margin-right:80px">每间</span>
          <span class="select1">
            <el-select v-model="value1" size="mini" style="width:93px">
              <el-option
                v-for="item in options"
                :key="item.value"
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
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div style="text-align: right; margin-top: 20px">
          <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
        </div>
        <el-input
          style="width:200px"
          placeholder="未定人数"
          slot="reference"
          suffix-icon="el-icon-user"
          v-model="people"
        ></el-input>
      </el-popover>
      <!-- 确认按钮 -->
      <el-button type="primary">查找酒店</el-button>
    </div>
    <!-- 地图部分 -->
    <el-row style="height:260px">
      <el-col :span="14">
        <div class="left">
          <el-row style="margin-bottom:20px">
            <el-col :span="3">区域:</el-col>
            <el-col :span="21">
              <!-- 需要循环处理的数据 -->
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
              <a href="#">人民广场</a>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              均价
              <el-tooltip
                class="item"
                effect="dark"
                content="等级均价由平日价格计算得出，节假日价格会有上浮。"
                placement="top-start"
              >
                <i class="el-icon-question" style="color:#cccccc;vertical-align: top;"></i>
              </el-tooltip>:
            </el-col>
            <el-col :span="21">
              <el-tooltip
                class="item start"
                effect="dark"
                content="等级评定是针对房价，设施和服务等各方面水平的综合评估。"
                placement="top-start"
              >
                <span>
                  <i
                    class="el-icon-star-off icon"
                    style="color:#f90;vertical-align:top"
                    v-for="(index) in [1,2,3]"
                    :key="index"
                  ></i>
                  ￥200
                </span>
              </el-tooltip>
              <el-tooltip
                class="item start"
                effect="dark"
                content="等级评定是针对房价，设施和服务等各方面水平的综合评估。"
                placement="top-start"
              >
                <span>
                  <i
                    class="el-icon-star-off icon"
                    style="color:#f90;vertical-align:top"
                    v-for="(index) in [1,2,3,4]"
                    :key="index"
                  ></i>
                  ￥400
                </span>
              </el-tooltip>
              <el-tooltip
                class="item start"
                effect="dark"
                content="等级评定是针对房价，设施和服务等各方面水平的综合评估。"
                placement="top-start"
              >
                <span>
                  <i
                    class="el-icon-star-off icon"
                    style="color:#f90;vertical-align:top"
                    v-for="(index) in [1,2,3,4,5]"
                    :key="index"
                  ></i>
                  ￥600
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!-- 地图
      -->
      <el-col :span="10">
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&plugin=AMap.Driving"
        ></script>
        <div id="container"></div>
      </el-col>
    </el-row>
    <!-- 筛选框 -->
    <el-row class="filter2">
      <el-col :span="6" class="col-item">
        <el-col :span="24" class="col-item-first">
          <span>价格</span>
          <!-- 双向数据绑定 -->
          <span style="float:right">0-{{price}}</span>
        </el-col>
        <el-col :span="24" class="col-item-first">
          <el-slider v-model="price" :max="4000"></el-slider>
        </el-col>
      </el-col>

      <!-- 循环的数据 -->
      <el-col :span="18">
        <el-col :span="6" class="col-item" v-for="(item,index) in hoteltype" :key="index">
          <el-col :span="24" class="col-item-second">
            <span>{{item.label}}</span>
            <!-- 双向数据绑定 -->
          </el-col>
          <!-- 下拉菜单 -->
          <el-col :span="24">
            <el-dropdown>
              <span class="el-dropdown-link link">
                {{item.value}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="padding:10px">
                <!-- 循环的数据 -->
                <el-checkbox
                  v-model="item1.checked"
                  v-for="(item1,index1) in item.levCommand"
                  :key="index1"
                  :label="item1.label"
                  @change="handleSelectLev(item1,index)"
                  style="display:block;margin-bottom:10px"
                ></el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      value1: "",
      value2: "",
      time: "",
      // 人数
      people: "",
      city: "",
      visible: false,
      price: 0,
      hoteltype: [
        {
          label: "酒店等级",
          value: "不限",
          selectLev: [],
          levCommand: [
            { label: "1星", checked: false },
            { label: "2星", checked: false },
            { label: "3星", checked: false }
          ]
        },
        {
          label: "住宿类型",
          value: "不限",
          selectLev: [],
          levCommand: [
            { label: "1星", checked: false },
            { label: "2星", checked: false },
            { label: "3星", checked: false }
          ]
        },
        {
          label: "酒店设施",
          value: "不限",
          selectLev: [],
          levCommand: [
            { label: "1星", checked: false },
            { label: "2星", checked: false },
            { label: "3星", checked: false }
          ]
        },
        {
          label: "酒店品牌",
          value: "不限",
          selectLev: [],
          levCommand: [
            { label: "1星", checked: false },
            { label: "2星", checked: false },
            { label: "3星", checked: false }
          ]
        }
      ],
      levCommand: [],
      levIndex: 0,
      checked1: true,
      checked2: false
    };
  },
  methods: {
    querySearch(value, cb) {
      if (!value) {
        cb([]);
        return;
      }
      cb([{ value: "1" }, { value: "2" }, { value: "3" }]);
    },
    handleSelect(item) {
      // console.log(item);
    },
    //获取下拉框的index
    getIndex(index) {
      //外层框的index
      console.log("index:" + index);
      this.levIndex = index;
    },
    //选择下拉列表
    handleSelectLev(item1, index) {
      console.log(item1, index);
      // 查找是否已有值
      const res = this.hoteltype[index].selectLev.indexOf(item1.label);
      if (res > -1) {
        // 已有值
        this.hoteltype[index].selectLev.splice(res, 1);
      } else {
        // 没有值-
        this.hoteltype[index].selectLev.push(item1.label);
      }
      console.log(this.hoteltype[index].selectLev);

      //修改不限的值
      if (this.hoteltype[index].selectLev.length > 1) {
        this.hoteltype[
          index
        ].value = `已选${this.hoteltype[index].selectLev.length}项`;
      } else {
        this.hoteltype[index].value = this.hoteltype[index].selectLev[0];
      }
      // 判断length是不是为0
      if (this.hoteltype[index].selectLev.length === 0) {
        this.hoteltype[index].value = "不限";
      }
    }
  },
  mounted() {
    var map = new AMap.Map("container");
    var map = new AMap.Map("container", {
      zoom: 11, //级别
      center: [113.3245904, 23.1066805], //中心点坐标
      viewMode: "3D" //使用3D视图
    });
    //点标记
    // 根据酒店的数量生成对应的标记标到地图上
    var marker = new AMap.Marker({
      position: new AMap.LngLat(113.3245904, 23.1066805), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: "北京"
    });
    map.add(marker);
  }
};
</script>

<style lang='less' scoped>
.hotel {
  width: 1000px;
  color: #606266;
  margin: 0 auto;
  .title {
    margin: 20px 0;
    font-size: 14px;
    span {
      margin: 0 10px;
    }
  }
  .filter {
    margin-bottom: 30px;
  }
  /deep/.el-row {
    font-size: 14px;
    a {
      margin-right: 20px;
    }
  }
}
/deep/.start {
  margin-right: 20px;
}
// 地图样式
#container {
  width: 420px;
  height: 260px;
}
.filter2 {
  border: 1px solid #ddd;
  margin: 10px 0;
  box-sizing: border-box;
  padding: 5px 0;
  .first {
    width: 245px;
  }
  /deep/.col-item {
    height: 67px;
    border-right: 1px solid #ddd;
    padding: 0 20px;
    box-sizing: border-box;
  }
  /deep/.col-item:last-child {
    border-right: 0;
  }
  /deep/.el-dropdown {
    width: 100%;
    margin-top: 10px;
  }
  /deep/.el-icon--right {
    float: right;
  }
  .link {
    display: inline-block;
    width: 100%;
  }
}
</style>