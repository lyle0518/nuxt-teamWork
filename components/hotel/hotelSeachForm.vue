<template></template>

<script>
export default {
  data() {
    return {};
  },

  mounted() {
    // 判断cityName是否为空
    console.log(this.cityName);
    if (this.$route.query.cityName) {
      this.cityName = this.$route.query.cityName;
    }
  },
  methods: {
    // 下拉请求城市
  }
};
</script>

<style lang='less' scoped>
</style>