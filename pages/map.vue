<template>
  <div style="width:1000px;margin:0 auto;padding:50px 0">
    <h2>高德地图</h2>
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=1ea10649493202a3fe81c42b68584b65&plugin=AMap.Driving"
    ></script>
    <el-row>
      <el-col :span="12">
        <div id="container"></div>
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
          <el-tab-pane label="驾车" name="first"></el-tab-pane>
          <el-tab-pane label="公交" name="second"></el-tab-pane>
          <el-tab-pane label="步行" name="third"></el-tab-pane>
        </el-tabs>
        <div class="form">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="出发地点">
              <el-input v-model="form.start"></el-input>
            </el-form-item>
            <el-form-item label="目的地">
              <el-input v-model="form.end"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 展示路线 -->
        <div id="panel"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      form: {
        start: "",
        end: ""
      },
      map: ""
    };
  },
  methods: {
    //   查询
    handleSearch() {
      console.log(this.form);
      //清空原本地图上的数据
      this.map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [113.3245904, 23.1066805] //中心点坐标
      });
      document.querySelector("#panel").innerHTML = "";

      this.handleDrive();
    },
    //查询路线
    handleDrive() {
      if (this.activeName === "first") {
        AMap.plugin("AMap.Driving", () => {
          var driving = new AMap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: this.map,
            panel: "panel"
          });
          var points = [
            { keyword: this.form.start, city: "广州" },
            { keyword: this.form.end, city: "广州" }
          ];
          driving.search(points, function(status, result) {
            // 未出错时，result即是对应的路线规划方案
          });
        });
      } else if (this.activeName === "second") {
        console.log("公交");
      }
    },
    handleClick(activeName) {
      console.log(activeName);
    }
  },
  mounted() {
    var map = new AMap.Map("container", {
      zoom: 11, //级别
      center: [113.3245904, 23.1066805]
    });
    this.map = map;
    // var marker = new AMap.Marker({
    //   position: new AMap.LngLat(113.3245904, 23.1066805), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //   title: "广州塔"
    // });
    // var icon = new AMap.Icon({
    //   size: new AMap.Size(40, 40), // 图标尺寸
    //   image: "/aaaa.jpg", // Icon的图像
    //   //   imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
    //   imageSize: new AMap.Size(40, 40) // 根据所设置的大小拉伸或压缩图片
    // });
    // var marker2 = new AMap.Marker({
    //   position: new AMap.LngLat(113.191098, 23.081027),
    //   //   offset: new AMap.Pixel(-10, -10),
    //   icon: icon, // 添加 Icon 实例
    //   title: "郑"
    //   //   zoom: 13
    // });
    // //自定义
    // var content = `<div style="
    //     width:40px;
    //     height: 40px;
    //     background: url('/aaaa.jpg');
    //     border-radius: 50%;
    //     background-size: 100%">
    //     </div>`;
    // var marker3 = new AMap.Marker({
    //   content: content, // 自定义点标记覆盖物内容
    //   position: [113.3545904, 23.1066805], // 基点位置
    //   offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
    // });
    //路线规划

    // map.add([marker, marker2, marker3]);
  }
};
</script>

<style scoped lang='less'>
.navigation {
  display: flex;
}
#container {
  width: 500px;
  height: 500px;
}
/deep/.amap-icon {
  border-radius: 50%;
}
/deep/#panel {
  max-height: 313px !important;
  overflow-y: auto;
  width: 100%;
}
</style>