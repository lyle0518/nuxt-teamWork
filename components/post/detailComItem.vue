<template>
  <div>
    <div class="reply-item">
      <detailComItem v-if="data.parent" :data="data.parent" />
      <div class="user">
        <span class="username">{{data.account.nickname}}</span>
        <span class="date">2020-04-25 10:18</span>
      </div>
      <div>
        <p class="txt">{{data.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "detailComItem",
  props: {
    data: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style scoped leng="less">
.reply-item {
  padding: 4px;
  font-size: 12px;
  background: #f9f9f9;
  border: 1px #ccc solid;
}
.date {
  color: #ccc;
}
.txt {
  padding: 8px 0;
  margin-left: 20px;
  font-size: 15px;
}
</style>