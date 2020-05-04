<template>
  <div>
    <el-row class="item" @click.native="handle">
      <el-col :span="8" class="item-left">
        <nuxt-link to="#">
          <img :src="data.photos" />
        </nuxt-link>
      </el-col>
      <el-col :span="10" class="item-center">
        <nuxt-link to="#" class="title">{{data.name}}</nuxt-link>
        <p>{{data.alias}}</p>
        <!-- 评分 -->
        <el-row :span="24" class="appraise-text">
          <el-col :span="10">
            <el-rate
              v-model="start"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            ></el-rate>
          </el-col>
          <el-col :span="7">
            <span class="color">{{data.all_remarks}}</span>条评价
          </el-col>
          <el-col :span="7">
            <span class="color">{{data.common_remarks}}</span>篇游记
          </el-col>
        </el-row>
        <el-row>
          <i class="el-icon-location" style="color:#666"></i>
          <span>位于:{{data.address}}</span>
        </el-row>
      </el-col>
      <el-col :span="6" class="item-right">
        <a
          target="_blank"
          href="https://hotels.ctrip.com/hotel/694679.html"
          class="linkItem"
          v-for="(item,index) in data.products"
          :key="index"
        >
          <span class="left">{{item.name}}</span>
          <div style="float:right">
            <span class="color">￥{{item.price}}</span>
            起 >
          </div>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      start: this.data.stars,
      tableData: [
        {
          label: "携程",
          price: "197"
        },
        {
          date: "215",
          name: "艺龙"
        },
        {
          date: "193",
          name: "Hotels.com"
        }
      ]
    };
  },
  methods: {
    handle() {
      console.log(this.data);
    }
  }
};
</script>

<style lang='less' scoped>
.item {
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
  .item-left {
    padding-right: 10px;
    a {
      img {
        width: 323px;
        height: 198px;
        object-fit: cover;
      }
    }
  }
  .item-center {
    padding-left: 10px;
    .title {
      font-size: 24px;
      font-weight: 400;
      color: #000;
    }

    .appraise-text {
      margin: 10px 0;
    }
  }
  .item-right {
    padding-top: 30px;
    .linkItem {
      display: inline-block;
      box-sizing: border-box;
      width: 100% !important;
      padding: 10px;
      //   padding: 10px;
      border-bottom: 1px solid #ebeef5;
    }
    .linkItem:hover {
      background-color: #f5f7fa;
    }
  }
  .color {
    color: #f90;
  }
}
</style>