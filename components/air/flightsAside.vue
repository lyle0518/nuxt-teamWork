<template>
  <div class="aside">
    <div class="statement">
      <el-row type="flex" justify="space-between" class="statement-list">
        <el-col :span="8">
          <i
            class="iconfont iconweibiaoti-_huabanfuben"
            style="color:#409EFF;"
          ></i>
          <span>航协认证</span>
        </el-col>
        <el-col :span="8">
          <i class="iconfont iconbaozheng" style="color:green;"></i>
          <span>出行保证</span>
        </el-col>
        <el-col :span="8">
          <i class="iconfont icondianhua" style="color:#409EFF;"></i>
          <span>7x24</span>
        </el-col>
      </el-row>
      <p class="service-tel">免费客服电话：4006345678转2</p>
    </div>

    <div class="history">
      <h5>历史查询</h5>
      <div>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="history-item"
          v-for="(item, index) in this.$store.state.air.searchList"
          :key="index"
        >
          <div class="air-info">
            <div class="to-from">
              {{ item.departCity }} - {{ item.destCity }}
            </div>
            <p>{{ item.departDate }}</p>
          </div>
          <span @click="handleClick(item)">选择</span>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  methods: {
    handleClick(item) {
      //点击跳转到这个数据的搜索页面
      //判断点击时的时间是否小于今天
      const data = { ...item };
      //今天的时间
      const time = moment().format("YYYY-MM-DD");
      // 获取查询的日期
      const curren = data.departDate;
      // 去除-
      const timeNum = +time.replace(/-/g, "");
      const currenNum = +curren.replace(/-/g, "");
      if (timeNum > currenNum) {
        data.departDate = time;
      }
      this.$router.push({
        path: "/air/flights",
        query: data
      });
    }
  }
};
</script>

<style scoped lang="less">
.statement {
  border: 1px #ddd solid;

  .statement-list {
    padding: 10px 0;
    > div {
      text-align: center;
      i {
        display: block;
        font-size: 40px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .service-tel {
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    background: #f6f6f6;
    font-size: 14px;
  }
}

.history {
  border: 1px #ddd solid;
  padding: 10px;
  margin-top: 10px;

  h5 {
    font-size: 16px;
    font-weight: normal;
    padding-bottom: 10px;
    border-bottom: 1px #eee solid;
  }

  .history-item {
    padding: 10px 0;
    font-size: 14px;
    border-bottom: 1px #eee solid;

    &:last-child {
      border: none;
    }

    .to-from {
      margin-bottom: 5px;
    }

    p {
      font-size: 12px;
      color: #666;
    }

    span {
      color: #fff;
      display: block;
      padding: 2px 10px;
      background: orange;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
