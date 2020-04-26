<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <!-- 传一个不会被更改的值给子组件使用筛选功能 -->
        <FlightsFilters :data="Copyaircity" @getData="getData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />
        <div v-if="aircity.flights.length">
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
        <div v-else class="empty">当前没有查询到适合的航班列表</div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
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
import FlightsAside from "@/components/air/flightsAside";

export default {
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    // 进入下个页面后重新触发请求机票数据

    next();
    this.getList();
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      aircity: {
        //渲染的时候已经做了传值,如果没有做默认值设定,会报undefined
        flights: [],
        info: {},
        options: []
      },
      Copyaircity: {
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
    this.getList();
  },
  methods: {
    // 封装请求机票数据的方法
    getList() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        // console.log(res);
        this.aircity = res.data;
        // 复制一个不会修改的数组用于传值给子组件筛选
        this.Copyaircity = { ...res.data };
        console.log(this.aircity);

        this.total = res.data.total;
        //   请求成功后剪切出第一页5条数据
        // this.dataList = this.aircity.flights.slice(0, this.pageSize);
      });
    },
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
      this.total = arr.length;
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
.empty {
  text-align: center;
  line-height: 200px;
  color: #999;
}
</style>