<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="aircity" @getData="getData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
      <!-- 底部分页器 -->
      <!-- 数据量少,可以一次性获取后台的数据,在前端进行分页处理 -->
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters";

export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters
  },
  data() {
    return {
      aircity: {
        //渲染的时候已经做了传值,如果没有做默认值设定,会报undefined
        flights: [],
        info: {},
        options: []
      },
      //当前页面
      pageIndex: 1,
      total: 0,
      // 存放剪切出来的数据列表
      //dataList: [],
      //   每页显示的数据量
      pageSize: 3
    };
  },
  computed: {
    dataList() {
      //如果flights的值变化,会重新计算
      const arr = this.aircity.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // console.log(res);
      this.aircity = res.data;
      console.log(this.aircity);

      this.total = res.data.total;
      //   请求成功后剪切出第一页5条数据
      // this.dataList = this.aircity.flights.slice(0, this.pageSize);
    });
  },
  methods: {
    handleSizeChange(val) {
      //   切换页面数据条数 val为 :page-sizes定义的值
      this.pageSize = val;
      this.pageIndex = 1;
      //   重新切割航班数据
      console.log(this.pageIndex);
    },
    // 切换页数触发
    handleCurrentChange(val) {
      // val为当前页码
      //   切换页码,剪切出第二页的数据,赋值给dataList
      console.log("val的值" + val);
      console.log("pageIndex的值" + this.pageIndex);
      this.pageIndex = val;
    },
    // 组件传值
    getData(arr) {
      console.log(arr);
      this.aircity.flights = arr;
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
.el-pagination {
  text-align: center;
}
</style>