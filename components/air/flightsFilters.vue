<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in airSizeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  //   props: ["data"],
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      airSizeList: [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ]
    };
  },

  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      console.log(value);
      const arr = this.data.flights.filter(v => {
        // 筛选起飞机场和选择的机场一致
        return v.org_airport_name === this.airport;
      });
      this.$emit("getData", arr);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      console.log(value);
      const time = this.flightTimes.split(","); //[6,12]
      const arr = this.data.flights.filter(v => {
        const current = v.dep_time.split(":")[0];
        return +time[0] <= +current && +current < +time[1];
      });
      //   传出筛选好的数据
      this.$emit("getData", arr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      console.log(value);
      // 筛选出符合条件的传递给父组件
      const arr = this.data.flights.filter(v => {
        return v.airline_name === value;
      });
      console.log(arr);
      //   将值传递给父组件
      this.$emit("getData", arr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      console.log(value);
      const arr = this.data.flights.filter(v => {
        return v.plane_size === this.airSize;
      });
      console.log(arr);
      //   将值传递给父组件
      this.$emit("getData", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {}
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>