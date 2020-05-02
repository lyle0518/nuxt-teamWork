<template>
  <div class="editor">
    <no-ssr placeholder="Loading Your Editor...">
      <vue-editor v-model="content"></vue-editor>
    </no-ssr>
  </div>
</template>

<script>
export default {
  asyncData() {
    return {
      content: "",
      pageIsMounted: false,
      isSSR: process.server ? true : false
    };
  }

  // components: { VueEditor },
};
</script>

<style scoped lang="less">
/deep/ .ql-container {
  height: 400px;
}
</style>
