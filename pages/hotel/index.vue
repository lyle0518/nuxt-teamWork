<template>
  <div class="hotel">
    <div class="title">
      <!-- 修改:要用图标分隔符 -->
      <nuxt-link to="#">酒店</nuxt-link>
      <span>></span>
      <nuxt-link to="#">{{title}}</nuxt-link>
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
    <el-row>
      <el-col :span="14">
        <div class="left">
          <el-row style="margin-bottom:20px">
            <el-col :span="3">区域:</el-col>
            <el-col :span="21">
              <!-- 需要循环处理的数据 -->
              <div class="area" :style="`height:${height}`">
                <a
                  href="#"
                  v-for="(item, index) in $store.state.hotel.area"
                  :key="index"
                  class="hotLocation"
                >{{ item.name }}</a>
              </div>

              <div class="clickLocation" @click="clickLocation">
                <i class="el-icon-d-arrow-left iconBottom" v-if="show"></i>
                <i class="el-icon-d-arrow-left iconTop" v-else></i>

                <span>等{{$store.state.hotel.area.length}}个区域</span>
              </div>
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
          <span style="float:right">0-{{pushUrl.price_lt }}</span>
        </el-col>
        <el-col :span="24" class="col-item-first">
          <el-slider v-model="pushUrl.price_lt " :max="4000" @change="changePrice"></el-slider>
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
    <el-row class="hotelitem" v-if="$store.state.hotel.hotelData.data.length > 0">
      <HotelItem
        v-for="(item, index) in $store.state.hotel.hotelData.data"
        :key="index"
        :data="item"
      />
    </el-row>
    <el-row class="none" v-else>
      <p>暂无符合条件的酒店</p>
    </el-row>
    <!-- 分页器 -->
    <el-row v-if="$store.state.hotel.hotelData.data.length > 0" class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="$store.state.hotel.pageSize"
        :page-size="10"
        layout="prev, pager, next"
        :pager-count="5"
        :total="$store.state.hotel.total"
      ></el-pagination>
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
    const other = {};
    // const { cityName, page, hotellevel,hoteltype,hotelasset,hotelbrand,...other } = this.$route.query;
    //  重新请求酒店数据
    this.pushUrl.cityName = this.$route.query.cityName;
    // 页面发生跳转获取cityName值修改title的值
    if (this.$route.query.cityName) {
      this.title = `${this.$route.query.cityName}酒店预订`;
    }
    // let title = `${this.$store.state.hotel.title}`;
    // 追加城市信息获取id
    await this.$axios({
      url: "/cities",
      params: {
        name: this.$route.query.cityName
      }
    }).then(res => {
      const { data } = res.data;
      this.$store.commit("hotel/setArea", data[0].scenics);
      data.forEach(v => {
        if (v.name === this.$route.query.cityName) {
          other.city = v.id;
        }
      });
      // 处理hotellevel
      other.hotellevel_in = this.$route.query.hotellevel;
      other.hoteltype_in = this.$route.query.hoteltype;
      other.hotelasset_in = this.$route.query.hotelasset;
      other.hotelbrand_in = this.$route.query.hotelbrand;
    });
    if (this.$route.query.price_lt) {
      other.price_lt = this.$route.query.price_lt;
    }
    // 处理page参数
    if (this.$route.query.page) {
      other._start = (this.$route.query.page - 1) * 5;
    }
    if (this.$route.query.enterTime) {
      other.enterTime = this.$route.query.enterTime;
    }
    if (this.$route.query.leftTime) {
      other.leftTime = this.$route.query.leftTime;
    }
    const qs = require("qs");

    await this.$axios({
      url: "/hotels",
      params: other,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    }).then(res => {
      // 存到本地的仓库
      const { data } = res;
      console.log(data.total);

      this.$store.commit("hotel/setTotal", data.total);
      // if (data) {
      //   //  获取仓库旧的数据
      //   const storeLocation = this.$store.state.hotel.hotelList[0].location;
      //   data.push({
      //     location: storeLocation
      //   });
      // }
      this.$store.commit("hotel/setHotelData", data);
      setTimeout(() => {
        if (this.$store.state.hotel.hotelData.data.length < 1) {
          // 重新画图
          this.getMap();
        } else {
          // 如果此时lenth大于1,说明数据被修改了,修改中心点的值
          this.$store.commit(
            "hotel/setLatitude",
            this.$store.state.hotel.hotelData.data[0].location.latitude
          );
          this.$store.commit(
            "hotel/setLongitude",
            this.$store.state.hotel.hotelData.data[0].location.longitude
          );

          this.getMap();
          var url =
            "https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&plugin=AMap.CitySearch&callback=onLoad";
          var jsapi = document.createElement("script");
          jsapi.charset = "utf-8";
          jsapi.src = url;
          document.head.appendChild(jsapi);
        }
      }, 400);
    });

    // this.getList();
  },

  components: {
    HotelItem
  },
  data() {
    return {
      title: "酒店预订",
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
      //区域的参数
      show: true,
      height: "36px",
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

        price_lt: 4000,
        hotellevel: [],
        hoteltype: [],
        hotelasset: [],
        hotelbrand: []
      } //筛选框用于跳转的地址
    };
  },

  methods: {
    handleCurrentChange(val) {
      // 跳转页面 追加页码\
      this.pushUrl.page = Number(val);
      this.$store.commit("hotel/setPageSize", Number(val));
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
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
        query: this.pushUrl
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
    //控制区域显示数量
    clickLocation() {
      this.show = !this.show;
      // 判断show值操控dom元素的高度
      if (this.show) {
        this.height = "36px";
      } else {
        this.height = "";
      }
    },
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
        const {
          hotellevel,
          hoteltype,
          hotelasset,
          hotelbrand
        } = this.$route.query;
        //处理酒店等级的缓存显示

        if (hotellevel) {
          if (hotellevel.length > 1) {
            this.leveValue = `已选${hotellevel.length}项`;
            hotellevel.forEach(v => {
              //修改checked属性
              this.levels[v - 1].checked = true;
              //修改levelist里面的数据
              this.leveList.push(Number(v));
            });
          } else if (hotellevel.length === 1) {
            this.levels[hotellevel - 1].checked = true;
            this.leveValue = this.levels[hotellevel - 1].name;
            //修改leveList数据
            this.leveList.push(
              Number(this.levels[hotellevel.length - 1].level)
            );
            // 找星级
          } else {
            this.leveValue = `不限`;
            this.leveList = [];
          }
        }
        //处理住宿类型的缓存显示
        if (hoteltype) {
          if (hoteltype.length > 1) {
            this.typeValue = `已选${hoteltype.length}项`;
            hoteltype.forEach(v => {
              //修改checked属性
              this.types[v - 1].checked = true;
              //修改levelist里面的数据
              this.typeList.push(Number(v));
            });
          } else if (hoteltype.length === 1) {
            this.types[hoteltype - 1].checked = true;
            this.typeValue = this.types[hoteltype - 1].name;
            //修改leveList数据
            this.typeList.push(Number(this.types[hoteltype.length - 1].id));
            // 找星级
          } else {
            this.typeValue = `不限`;
            this.typeList = [];
          }
        }
        //处理酒店设施
        if (hotelasset) {
          if (hotelasset.length > 1) {
            this.assetsValue = `已选${hotelasset.length}项`;
            hotelasset.forEach(v => {
              //修改checked属性
              this.assets[v - 1].checked = true;
              //修改levelist里面的数据
              this.assetsList.push(Number(v));
            });
          } else if (hotelasset.length === 1) {
            this.assets[hotelasset - 1].checked = true;
            this.assetsValue = this.assets[hotelasset - 1].name;
            //修改leveList数据
            this.assetsList.push(Number(this.assets[hotelasset.length - 1].id));
            // 找星级
          } else {
            this.assetsValue = `不限`;
            this.assetsList = [];
          }
        }
        //处理酒店品牌设施
        if (hotelbrand) {
          if (hotelbrand.length > 1) {
            this.brandsValue = `已选${hotelbrand.length}项`;
            hotelbrand.forEach(v => {
              //修改checked属性
              this.brands.forEach((item, index) => {
                if (v === item.id) {
                  this.brands[index].checked = true;
                  this.brandsList.push(Number(v));
                }
              });
            });
          } else if (hotelbrand.length === 1) {
            hotelbrand.forEach(v => {
              this.brands.forEach((item, index) => {
                if (v === item.id) {
                  this.brands[index].checked = true;
                  this.brandsList.push(Number(v));
                }
              });
            });
          } else {
            this.brandsValue = `不限`;
            this.brandsList = [];
          }
        }
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
      //查询名字修改'不限字样'

      const res = this.leveList.indexOf(item.level);
      if (res > -1) {
        // 已经存在
        this.leveList.splice(res, 1);
      } else {
        //  追加
        this.leveList.push(item.level);
      }

      if (this.leveList.length > 1) {
        this.leveValue = `已选${this.leveList.length}项`;
      } else if (this.leveList.length === 1) {
        //没有值,或者此时值为1
        this.leveValue = this.levels[this.leveList[0] - 1].name;
      } else if (this.leveList.length === 0) {
        this.leveValue = "不限";
      }

      // 将leveList里的数据赋值给pushUrl当前数组中是否已有该id

      this.pushUrl.hotellevel = this.leveList;

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店住宿类型筛选
    handleTypes(item, index) {
      const res = this.typeList.indexOf(item.id);
      if (res > -1) {
        // 已经存在
        this.typeList.splice(res, 1);
      } else {
        //  追加
        this.typeList.push(item.id);
      }
      //r如果长度大于1,修改属性

      if (this.typeList.length > 1) {
        this.typeValue = `已选${this.typeList.length}项`;
      } else if (this.typeList.length === 1) {
        //没有值,或者此时值为1
        this.typeValue = this.types[this.typeList[0] - 1].name;
      } else if (this.typeList.length === 0) {
        this.typeValue = "不限";
      }
      this.pushUrl.hoteltype = this.typeList;
      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店设施筛选
    handleAssets(item, index) {
      const res = this.assetsList.indexOf(item.id);
      if (res > -1) {
        // 已经存在
        this.assetsList.splice(res, 1);
      } else {
        //  追加
        this.assetsList.push(item.id);
      }
      //r如果长度大于1,修改属性

      if (this.assetsList.length > 1) {
        this.assetsValue = `已选${this.assetsList.length}项`;
      } else if (this.assetsList.length === 1) {
        //没有值,或者此时值为1
        this.assetsValue = this.assets[this.assetsList[0] - 1].name;
      } else if (this.assetsList.length === 0) {
        this.assetsValue = "不限";
      }

      //筛选功能
      this.pushUrl.hotelasset = this.assetsList;

      // 跳转页面;触发路由守卫,重新请求getList,传递form的参数,更改cityName的值
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    },
    //酒店品牌筛选
    handleBrands(item, index) {
      const res = this.brandsList.indexOf(item.id);
      if (res > -1) {
        // 已经存在
        this.brandsList.splice(res, 1);
      } else {
        //  追加
        this.brandsList.push(item.id);
      }

      if (this.brandsList.length > 1) {
        this.brandsValue = `已选${this.brandsList.length}项`;
      } else if (this.brandsList.length === 1) {
        //没有值,或者此时值为1 id值不对
        const Data = this.brands.filter(v => {
          return v.id == this.brandsList[0];
        });
        this.brandsValue = Data[0].name;
      } else if (this.brandsList.length === 0) {
        this.brandsValue = "不限";
      }
      //筛选功能
      this.pushUrl.hotelbrand = this.brandsList;
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
      if (this.$store.state.hotel.hotelData.data.length > 1) {
        this.$store.commit(
          "hotel/setLatitude",
          this.$store.state.hotel.hotelData.data[0].location.latitude
        );
        this.$store.commit(
          "hotel/setLongitude",
          this.$store.state.hotel.hotelData.data[0].location.longitude
        );
      }

      window.onLoad = () => {
        var map = new AMap.Map("container", {
          zoom: 11, //级别
          center: [
            this.$store.state.hotel.longitude,
            this.$store.state.hotel.latitude
          ], //中心点坐标
          // center: [113.3245904, 23.1066805], //中心点坐标
          viewMode: "3D", //使用3D视图
          resizeEnable: true
        });

        //画点标记 --从仓库循环
        if (this.$store.state.hotel.hotelData.data.length > 1) {
          this.$store.state.hotel.hotelData.data.forEach((item, index) => {
            const hotelLatitude = item.location.latitude;
            const hotelLongitude = item.location.longitude;
            var content = `<span class="marker">${index}</span>`;
            var marker = new AMap.Marker({
              content: content,
              position: new AMap.LngLat(hotelLongitude, hotelLatitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: `${item.name}`,
              offset: new AMap.Pixel(-17, -42)
            });
            map.add(marker);
          });
        }
      };

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
    },
    changePrice() {
      this.$router.push({
        path: "/hotel",
        query: this.pushUrl
      });
    }
  },
  mounted() {
    // 刷新进来的时候通过url请求数据
    this.getMap();
    var url =
      "https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&plugin=AMap.CitySearch&callback=onLoad";
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
    // 请求酒店选项
    this.getOption();
    // 处理页面刷新是的title的值
    const {
      cityName,
      price_lt,
      hotellevel,
      hoteltype,
      hotelasset,
      hotelbrand,
      ...other
    } = this.$route.query;

    if (cityName) {
      this.title = `${cityName}酒店预订`;
    } else {
      //cityName没有值---触发定位
      setTimeout(() => {
        this.getLocation();
      }, 1000);
    }
    if (price_lt) {
      this.pushUrl.price_lt = Number(price_lt);
    }
    if (hotellevel) {
      this.pushUrl.hotellevel = hotellevel;
    }
    if (hoteltype) {
      this.pushUrl.hoteltype = hoteltype;
    }
    if (hotelasset) {
      this.pushUrl.hotelasset = hotelasset;
    }
    if (hotelbrand) {
      this.pushUrl.hotelbrand = hotelbrand;
    }
    if (this.$route.query.cityName && this.pushUrl.cityName === "") {
      this.pushUrl.cityName = this.$route.query.cityName;
    }
    // 刷新缓存筛选框
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
  line-height: 18px;

  overflow: hidden;

  a {
    display: inline-block;
  }
}
.clickLocation {
  cursor: pointer;
  .iconBottom {
    color: #f90;
    transform: rotate(-90deg);
  }
  .iconTop {
    color: #f90;
    transform: rotate(90deg);
  }
}

// 地图样式
#container {
  width: 420px;
  height: 260px;
}
/deep/.marker {
  display: inline-block;
  width: 22px;
  height: 36px;
  background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png);
  background-size: 22px 36px;
  text-align: center;
  line-height: 24px;
  color: #fff;
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
.page {
  text-align: right;
  margin: 30px 0;
}
//标记的样式
</style>
