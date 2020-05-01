<template>
  <div class="hotel">
    <div class="title">
      <!-- 修改:要用图标分隔符 -->
      <nuxt-link to="#">酒店</nuxt-link>
      <span>></span>
      <nuxt-link to="#">酒店预订</nuxt-link>
    </div>
    <!--   第一个筛选表单 -->
    <div class="filter">
      <el-form ref="form" :inline="true" :model="form" label-width="80px" v-model="form">
        <!-- 城市 -->
        <el-form-item>
          <el-autocomplete
            v-model="form.cityName"
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
          src="https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&&plugin=AMap.CitySearch"
        ></script>
        <div id="container"></div>
      </el-col>
      <el-button type="text" @click="open"></el-button>
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

    <!-- 酒店部分 -->
    <el-row class="hotelitem">
      <HotelItem v-for="(item,index) in $store.state.hotel.hotelList" :key="index" :data="item" />
    </el-row>
  </div>
</template>

<script>
import HotelItem from "@/components/hotel/hotelItem";

export default {
  beforeRouteUpdate(to, from, next) {
    console.log("触发");
    next();
    //  重新请求酒店数据
    this.form.cityName = this.$route.query.cityName;
    // this.$store.commit("hotel/setHotelForm", );
    this.getList();
  },
  components: {
    HotelItem
  },
  data() {
    return {
      //第一个删选框的参数
      form: {
        //切换城市value值
        cityName: "",
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
      // 城市的id-请求参数
      city: "",

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
      peopleNum: "",

      //分割线---
      // 画图的参数
      //纬度
      latitude: 0,
      //经度
      longitude: 0,

      //分割线---
      value1: "",
      value2: "",
      time: "",
      // 人数
      people: "",
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
      checked2: false,
      // 弹出框文本
      mapCity: "上海市"
    };
  },
  destroyed() {
    this.getList();
  },
  methods: {
    //筛选框的方法
    querySearch(value, cb) {
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
      this.form.cityName = item.name;
      this.city = item.id;
      // 传递当前form给仓库
      // 修改this.form里面的内容
      const { cityName, ...other } = this.form;
      other.city = this.city;
      this.$store.commit("hotel/setHotelForm", other);
      this.getList();
      this.$router.push({
        path: "/hotel",
        query: {
          cityName: this.form.cityName
        }
      });
    },
    //乘车人框确定事件
    setPeople() {
      this.visible = false;
      this.peopleNum = `${this.value1}成人`;
    },
    //提交请求
    submit() {
      console.log(111);
      // 处理入店时间和离开事件
      if (!this.time) return;
      this.form.enterTime = this.time[0];
      this.form.leftTime = this.time[1];
      // 跳转页面
      console.log(this.form);
      //
      this.$router.push({
        path: "/hotel",
        query: this.form
      });

      //将表单存到仓库 此时form城市id值不对
      const { cityName, ...other } = this.form;
      other.city = this.city;
      this.$store.commit("hotel/setHotelForm", other);
    },

    //分割线
    //子组件传递form参数给父组件请求酒店数据
    //data为form表单数据
    getList() {
      this.$axios({
        url: "/hotels",
        params: this.$store.state.hotel.hotelForm
      }).then(res => {
        const { data } = res.data;
        // this.latitude = Number(data[0].location.latitude);
        // this.longitude = Number(data[0].location.longitude);
        console.log(this.latitude, this.longitude);

        // this.centerLocation = data[0].location;
        // 存进公共仓库
        this.$store.commit("hotel/setHotelList", data);
        // 重新画图
        this.getMap();
      });
    },
    //获取下拉框的index
    getIndex(index) {
      //外层框的index
      this.levIndex = index;
    },
    //选择下拉列表
    handleSelectLev(item1, index) {
      // 查找是否已有值
      const res = this.hoteltype[index].selectLev.indexOf(item1.label);
      if (res > -1) {
        // 已有值
        this.hoteltype[index].selectLev.splice(res, 1);
      } else {
        // 没有值-
        this.hoteltype[index].selectLev.push(item1.label);
      }

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
    },

    //弹出框
    open() {
      this.$alert(`定位当前城市:${this.mapCity}`, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          // console.log(111);
          // 点击确认的时候用这个城市名请求城市信息
          console.log(this.mapcity);

          this.$axios({
            url: "/cities",
            params: {
              name: this.mapCity
            }
          }).then(res => {
            const { data } = res.data;
            console.log(res);

            data.forEach(v => {
              if (v.name === this.mapCity) {
                // 备份一份当前的id用作使用
                this.cityId = v.id;
                this.$store.commit("hotel/setHotelFormCity", v.id);
                this.getList();
              }
            });
          });
          //跳转到cityname
          this.$router.push({
            path: "/hotel",
            query: {
              cityName: this.mapCity
            }
          });
        }
      });
    },
    // 画图
    getMap() {
      // 随机获取一个酒店的地点作为地图的中心点
      const { location } = this.$store.state.hotel.hotelList[0];
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      var map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [this.longitude, this.latitude], //中心点坐标
        viewMode: "3D", //使用3D视图
        resizeEnable: true
      });
      //点标记 --从仓库循环
      this.$store.state.hotel.hotelList.forEach((item, index) => {
        const hotelLatitude = item.location.latitude;
        const hotelLongitude = item.location.longitude;

        var marker = new AMap.Marker({
          position: new AMap.LngLat(hotelLongitude, hotelLatitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: `${item.name}`
        });
        map.add(marker);
      });

      // 根据酒店的数量生成对应的标记标到地图上
      // var marker = new AMap.Marker({
      //   // position: new AMap.LngLat(113.3245904, 23.1066805), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   // title: "广州塔"
      // });
      // map.add(marker);
      //获取当前定位的城市用于显示
      // 获取当前连接是否有query参数cityName值,如果为true,则执行定位
      if (this.$route.query.cityName) return;
      var citysearch = new AMap.CitySearch();
      citysearch.getLocalCity((status, result) => {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            var cityinfo = result.city;
            var citybounds = result.bounds;
            //弹出框
            // cityinfo --当前城市
            this.mapCity = cityinfo;
            this.open();
          }
        }
      });
    }
  },
  mounted() {
    // this.open();
    // 判断cityname是否有值
    if (this.$route.query.cityName && this.form.cityName === "") {
      this.form.cityName = this.$route.query.cityName;
    }

    // this.getList();

    setTimeout(() => {
      // 请求酒店的数据
      this.getMap();
    }, 0);
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
/deep/.el-checkbox__inner {
  border-radius: 50%;
}
//标记的样式
</style>