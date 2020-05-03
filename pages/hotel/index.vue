<template>
  <div class="hotel">
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&&plugin=AMap.CitySearch"
    ></script>
    <div class="title">
      <!-- 修改:要用图标分隔符 -->
      <nuxt-link to="#">酒店</nuxt-link>
      <span>></span>
      <nuxt-link to="#">酒店预订</nuxt-link>
    </div>
    <!--   第一个筛选表单 -->
    <div class="filter">
      <el-form ref="form" :inline="true" :model="pushUrl" label-width="80px" v-model="pushUrl">
        <!-- 城市 -->
        <el-form-item>
          <el-autocomplete
            v-model="pushUrl.cityName"
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
                    v-for="(item, index) in options"
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
                    v-for="(item, index) in options"
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
            <el-col :span="21" class="area">
              <!-- 需要循环处理的数据 -->
              <a
                href="#"
                v-for="(item, index) in $store.state.hotel.area"
                :key="index"
              >{{ item.name }}</a>
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
                    v-for="index in [1, 2, 3]"
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
                    v-for="index in [1, 2, 3, 4]"
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
                    v-for="index in [1, 2, 3, 4, 5]"
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
          <span style="float:right">0-{{ price }}</span>
        </el-col>
        <el-col :span="24" class="col-item-first">
          <el-slider v-model="price" :max="4000"></el-slider>
        </el-col>
      </el-col>

      <el-col :span="18">
        <!-- 四个筛选 -->
        <!-- 住宿等级 -->
        <el-col :span="6" class="col-item">
          <el-col :span="24" class="col-item-second">
            <span>酒店等级</span>
            <!-- 双向数据绑定 -->
          </el-col>
          <!-- 下拉菜单 -->
          <el-col :span="24">
            <el-dropdown placement="bottom-start">
              <span class="el-dropdown-link link">
                {{ leveValue }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="padding:10px">
                <!-- 循环的数据 -->
                <el-checkbox
                  v-for="(item, index) in levels"
                  v-model="item.checked"
                  :key="index"
                  :label="item.name"
                  @change="handleLeves(item, index)"
                  style="display:block;margin-bottom:10px"
                ></el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
        <!-- 住宿类型 -->
        <el-col :span="6" class="col-item">
          <el-col :span="24" class="col-item-second">
            <span>住宿类型</span>
            <!-- 双向数据绑定 -->
          </el-col>
          <!-- 下拉菜单 -->
          <el-col :span="24">
            <el-dropdown placement="bottom-start">
              <span class="el-dropdown-link link">
                {{ typeValue }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="padding:10px">
                <!-- 循环的数据 -->
                <el-checkbox
                  v-for="(item, index) in types"
                  v-model="item.checked"
                  :key="index"
                  :label="item.name"
                  @change="handleTypes(item, index)"
                  style="display:block;margin-bottom:10px"
                ></el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
        <!-- 酒店设施 -->
        <el-col :span="6" class="col-item">
          <el-col :span="24" class="col-item-second">
            <span>酒店设施</span>
            <!-- 双向数据绑定 -->
          </el-col>
          <!-- 下拉菜单 -->
          <el-col :span="24">
            <el-dropdown placement="bottom-start">
              <span class="el-dropdown-link link">
                {{ assetsValue }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="padding:10px">
                <!-- 循环的数据 -->
                <el-checkbox
                  v-for="(item, index) in assets"
                  v-model="item.checked"
                  :key="index"
                  :label="item.name"
                  @change="handleAssets(item, index)"
                  style="display:block;margin-bottom:10px"
                ></el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
        <el-col :span="6" class="col-item">
          <el-col :span="24" class="col-item-second">
            <span>酒店品牌</span>
            <!-- 双向数据绑定 -->
          </el-col>
          <!-- 下拉菜单 -->
          <el-col :span="24">
            <el-dropdown placement="bottom-start">
              <span class="el-dropdown-link link">
                {{ brandsValue }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="padding:10px">
                <!-- 循环的数据 -->
                <el-checkbox
                  v-for="(item, index) in brands"
                  v-model="item.checked"
                  :key="index"
                  :label="item.name"
                  @change="handleBrands(item, index)"
                  style="display:block;margin-bottom:10px"
                ></el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
      </el-col>
    </el-row>

    <!-- 酒店部分 -->
    <el-row class="hotelitem" v-if="$store.state.hotel.hotelList.length > 0">
      <HotelItem v-for="(item, index) in $store.state.hotel.hotelList" :key="index" :data="item" />
    </el-row>
    <el-row class="none" v-else>
      <p>暂无符合条件的酒店</p>
    </el-row>
    <!-- 分页器 -->
    <el-row v-if="$store.state.hotel.hotelList.length > 0">
      <el-pagination layout="prev, pager, next" :pager-count="5" :total="total"></el-pagination>
    </el-row>
  </div>
</template>

<script>
import HotelItem from "@/components/hotel/hotelItem";

export default {
  async beforeRouteUpdate(to, from, next) {
    next();

    // this.$store.commit("hotel/setHotelForm", );
    // 修改query里面的cityName的值为city
    const { cityName, ...other } = this.$route.query;
    //  重新请求酒店数据
    this.pushUrl.cityName = cityName;
    // 追加城市信息获取id
    await this.$axios({
      url: "/cities",
      params: {
        name: cityName
      }
    }).then(res => {
      const { data } = res.data;

      data.forEach(v => {
        if (v.name === cityName) {
          other.city = v.id;
        }
      });
      // 处理hotellevel
      other.hotellevel_in = this.$route.query.hotellevel;
      other.hoteltype_in = this.$route.query.hoteltype;
      other.hotelasset_in = this.$route.query.hotelasset;
      other.hotelbrand_in = this.$route.query.hotelbrand;
    });
    const qs = require("qs");

    await this.$axios({
      url: "/hotels",
      params: other,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    }).then(res => {
      // 存到本地的仓库
      const { data } = res.data;
      // if (data) {
      //   //  获取仓库旧的数据
      //   const storeLocation = this.$store.state.hotel.hotelList[0].location;
      //   data.push({
      //     location: storeLocation
      //   });
      // }
      this.$store.commit("hotel/setHotelList", data);
      if (this.$store.state.hotel.hotelList.length < 1) {
        // 重新画图
        this.getMap();
      } else {
        // 如果此时lenth大于1,说明数据被修改了,修改中心点的值
        this.$store.commit(
          "hotel/setLatitude",
          this.$store.state.hotel.hotelList[0].location.latitude
        );
        this.$store.commit(
          "hotel/setLongitude",
          this.$store.state.hotel.hotelList[0].location.longitude
        );
        this.getMap();
      }
    });

    // this.getList();
  },
  components: {
    HotelItem
  },
  data() {
    return {
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
      //左侧区域列表
      area: [],
      // 下拉框的所有值
      cityList: [],

      //分割线---
      value1: "",
      value2: "",
      time: "",
      // 人数
      people: "",
      visible: false,
      price: 4000,
      //分割线--------------
      //酒店选项
      levels: [], //等级
      leveValue: "不限", //星级的下拉文本默认值
      leveList: [], //星级多选存储
      types: [], //住宿类型
      typeValue: "不限", //住宿文本
      typeList: [], //住宿下拉选项
      assets: [], //酒店设施
      assetsValue: "不限",
      assetsList: [],
      brands: [], //酒店品牌
      brandsValue: "不限",
      brandsList: [],
      //分割线--------------

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
      levIndex: 0,
      checked1: true,
      checked2: false,
      // 弹出框文本
      mapCity: "上海市",
      total: 0,
      pushUrl: {
        cityName: "", //跳转的城市名字,输入框值
        enterTime: "",
        leftTime: "",
        price_lt: 4000,
        hotellevel: [],
        hoteltype: [],
        hotelasset: [],
        hotelbrand: []
      } //筛选框用于跳转的地址
    };
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
        this.cityList = list;
        cb(list);
      });
    },
    //城市下拉触发
    handleSelect(item) {
      this.area = item.scenics;
      // 存进仓库缓存
      this.$store.commit("hotel/setArea", this.area);
      this.pushUrl.cityName = item.name;
      this.city = item.id;
      // 传递当前form给仓库
      // 修改this.form里面的内容
      const { cityName, ...other } = this.pushUrl;
      other.city = this.city;
      this.$store.commit("hotel/setPushUrl", other);

      this.$router.push({
        path: "/hotel",
        query: {
          cityName
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
      // 处理入店时间和离开事件
      if (!this.time) return;
      this.pushUrl.enterTime = this.time[0];
      this.pushUrl.leftTime = this.time[1];
      // 跳转页面
      //
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });

      //将表单存到仓库 此时form城市id值不对
      // const { cityName, ...other } = this.form;
      // other.city = this.city;
      // console.log(this.city);
      // console.log(other);
      // this.$store.commit("hotel/setHotelForm", other);
    },

    //分割线
    //子组件传递form参数给父组件请求酒店数据
    //data为form表单数据
    getCity(city) {
      return this.$axios({
        url: "/cities",
        params: {
          name: city
        }
      }).then(res => {
        return res;
      });
    },
    // getList() {
    //   this.$axios({
    //     url: "/hotels",
    //     params: this.$route.query
    //   }).then(res => {
    //     const { data } = res.data;

    //     // this.latitude = Number(data[0].location.latitude);
    //     // this.longitude = Number(data[0].location.longitude);

    //     // this.centerLocation = data[0].location;
    //     // 存进公共仓库
    //     this.$store.commit("hotel/setHotelList", data);
    //     // 重新画图
    //     this.getMap();
    //   });
    // },
    // 请求酒店选项
    getOption() {
      this.$axios({
        url: "/hotels/options"
      }).then(res => {
        const { levels, types, assets, brands } = res.data.data;
        // 先给每一个选项添加checked属性 用来筛选的四个值

        this.levels = levels.map(v => {
          v.checked = false;
          return v;
        });
        this.types = types.map(v => {
          v.checked = false;
          return v;
        });
        this.assets = assets.map(v => {
          v.checked = false;
          return v;
        });
        this.brands = brands.map(v => {
          v.checked = false;
          return v;
        });
        // console.log(this.types);
        // console.log(this.assets);
        // console.log(this.brands);
      });
    },
    //获取下拉框的index
    getIndex(index) {
      //外层框的index
      this.levIndex = index;
    },
    //酒店星级筛选
    handleLeves(item, index) {
      //静态样式
      console.log(item);

      const res = this.leveList.indexOf(item.name);
      if (res > -1) {
        // 已经存在
        this.leveList.splice(res, 1);
      } else {
        //  追加
        this.leveList.push(item.name);
      }
      //r如果长度大于1,修改属性

      if (this.leveList.length > 1) {
        this.leveValue = `已选${this.leveList.length}项`;
      } else {
        //没有值,或者此时值为1
        this.leveValue = this.leveList[this.leveList.length - 1];
      }

      if (this.leveList.length === 0) {
        this.leveValue = "不限";
      }
      //筛选功能
      //触发的时候拼接路劲
      for (let key in this.form) {
        if (this.form[key]) {
          this.pushUrl[key] = this.form[key];
        }
      }
      // 查找当前数组中是否已有该id
      const idIndex = this.pushUrl.hotellevel.indexOf(item.level);
      if (idIndex > -1) {
        this.pushUrl.hotellevel.splice(idIndex, 1);
      } else {
        // 没有值
        this.pushUrl.hotellevel.push(item.level);
      }

      console.log(this.pushUrl.hotellevel);

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店住宿类型筛选
    handleTypes(item, index) {
      const res = this.typeList.indexOf(item.name);
      if (res > -1) {
        // 已经存在
        this.typeList.splice(res, 1);
      } else {
        //  追加
        this.typeList.push(item.name);
      }
      //r如果长度大于1,修改属性

      if (this.typeList.length > 1) {
        this.typeValue = `已选${this.typeList.length}项`;
      } else {
        //没有值,或者此时值为1
        this.typeValue = this.typeList[this.typeList.length - 1];
      }

      if (this.typeList.length === 0) {
        this.typeValue = "不限";
      }
      //筛选功能
      for (let key in this.form) {
        if (this.form[key]) {
          this.pushUrl[key] = this.form[key];
        }
      }

      const idIndex = this.pushUrl.hoteltype.indexOf(item.id);
      if (idIndex > -1) {
        this.pushUrl.hoteltype.splice(idIndex, 1);
      } else {
        this.pushUrl.hoteltype.push(item.id);
      }

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店设施筛选
    handleAssets(item, index) {
      const res = this.assetsList.indexOf(item.name);
      if (res > -1) {
        // 已经存在
        this.assetsList.splice(res, 1);
      } else {
        //  追加
        this.assetsList.push(item.name);
      }
      //r如果长度大于1,修改属性

      if (this.assetsList.length > 1) {
        this.assetsValue = `已选${this.assetsList.length}项`;
      } else {
        //没有值,或者此时值为1
        this.assetsValue = this.assetsList[this.assetsList.length - 1];
      }

      if (this.assetsList.length === 0) {
        this.assetsValue = "不限";
      }

      //筛选功能
      for (let key in this.form) {
        if (this.form[key]) {
          this.pushUrl[key] = this.form[key];
        }
      }

      const idIndex = this.pushUrl.hotelasset.indexOf(item.id);
      if (idIndex > -1) {
        this.pushUrl.hotelasset.splice(idIndex, 1);
      } else {
        this.pushUrl.hotelasset.push(item.id);
      }

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店品牌筛选
    handleBrands(item, index) {
      const res = this.brandsList.indexOf(item.name);
      if (res > -1) {
        // 已经存在
        this.brandsList.splice(res, 1);
      } else {
        //  追加
        this.brandsList.push(item.name);
      }

      if (this.brandsList.length > 1) {
        this.brandsValue = `已选${this.brandsList.length}项`;
      } else {
        //没有值,或者此时值为1
        this.brandsValue = this.brandsList[this.brandsList.length - 1];
      }

      if (this.brandsList.length === 0) {
        this.brandsValue = "不限";
      }
      //筛选功能
      for (let key in this.form) {
        if (this.form[key]) {
          this.pushUrl[key] = this.form[key];
        }
      }

      const idIndex = this.pushUrl.hotelbrand.indexOf(item.id);
      if (idIndex > -1) {
        this.pushUrl.hotelbrand.splice(idIndex, 1);
      } else {
        this.pushUrl.hotelbrand.push(item.id);
      }

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //弹出框
    open() {
      this.$alert(`定位当前城市:${this.mapCity}`, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          // 点击确认的时候用这个城市名请求城市信息
          this.$axios({
            url: "/cities",
            params: {
              name: this.mapCity
            }
          }).then(res => {
            const { data } = res.data;
            this.area = data.scenics;
          });
          this.pushUrl.cityName = this.mapCity;
          const { cityName } = this.pushUrl;
          //跳转到cityname
          this.$router.push({
            path: "/hotel",
            query: {
              cityName
            }
          });
          if (this.$route.query.cityName && this.form.cityName === "") {
            this.form.cityName = this.$route.query.cityName;
          }
        }
      });
    },
    // 生成地图
    getMap() {
      // 随机获取一个酒店的地点作为地图的中心点

      if (this.$store.state.hotel.hotelList.length > 1) {
        console.log("触发了长度大于1");
        console.log(this.$store.state.hotel.hotelList[0].location.latitude);

        this.$store.commit(
          "hotel/setLatitude",
          this.$store.state.hotel.hotelList[0].location.latitude
        );
        this.$store.commit(
          "hotel/setLongitude",
          this.$store.state.hotel.hotelList[0].location.longitude
        );
      }

      console.log(
        this.$store.state.hotel.longitude,
        this.$store.state.hotel.latitude
      );

      var map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [
          this.$store.state.hotel.longitude,
          this.$store.state.hotel.latitude
        ], //中心点坐标
        viewMode: "3D", //使用3D视图
        resizeEnable: true
      });

      //画点标记 --从仓库循环
      if (this.$store.state.hotel.hotelList.length > 1) {
        this.$store.state.hotel.hotelList.forEach((item, index) => {
          const hotelLatitude = item.location.latitude;
          const hotelLongitude = item.location.longitude;

          var marker = new AMap.Marker({
            position: new AMap.LngLat(hotelLongitude, hotelLatitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: `${item.name}`
          });
          map.add(marker);
        });
      }

      // 根据酒店的数量生成对应的标记标到地图上

      // map.add(marker);
      //获取当前定位的城市用于显示
      // 获取当前连接是否有query参数cityName值,如果为true,则执行定位
    },
    // 定位
    getLocation() {
      // 如果地址没有城市则触发
        var citysearch = new AMap.CitySearch();
        citysearch.getLocalCity((status, result) => {
          if (status === "complete" && result.info === "OK") {
            if (result && result.city && result.bounds) {
              var cityinfo = result.city;
              var citybounds = result.bounds;
              //弹出框
              // cityinfo --当前城市
              // 定位发送城市的请求
              const data = this.getCity(cityinfo);

              this.mapCity = cityinfo;
              this.getMap();
              this.open();
            }
          }
      });
    }
  },
  mounted() {
    // 刷新进来的时候通过url请求数据
    setTimeout(() => {
      console.log(this.$store.state.hotel.hotelList);
      this.getMap();
    }, 1000);

    // 请求酒店选项
    this.getOption();
    this.pushUrl.price_lt = this.price;
    console.log(this.$route.query.cityName);

    if (!this.$route.query.cityName) {
      //定位
      setTimeout(() => {
        this.getLocation();
        console.log("定位");
      }, 1000);
      console.log("定位");
    }
    console.log("改值");
    if (this.$route.query.cityName && this.pushUrl.cityName === "") {
      this.pushUrl.cityName = this.$route.query.cityName;
    }
    console.log(111);
  }
};
</script>

<style lang="less" scoped>
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
//区域样式
.area {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  width: 80%;
  a {
    display: inline-block;
  }
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

.el-dropdown-menu {
  max-height: 200px !important;
  overflow: auto;
  width: 135px !important;
}
.none {
  padding: 30px 0;
  text-align: center;
}

//标记的样式
</style>
