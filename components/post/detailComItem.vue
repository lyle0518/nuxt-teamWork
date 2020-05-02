<template>
  <div>
    <div class="reply-item">
      <detailComItem v-if="data.parent" :data="data.parent" />
      <div class="user">
        <span class="username">{{data.account.nickname}}</span>
        <span class="date">{{data.created_at}}</span>
      </div>
      <div>
        <div class="txt">
          {{data.content}}
          <!-- 图片预览组件 -->
          <div class="demo-image__preview" v-if="data.pics.length > 0">
            <el-image
              v-for="(item,index) in data.pics"
              :key="index"
              style="width: 100px; height: 100px"
              :src="$axios.defaults.baseURL + item.url"
            ></el-image>
          </div>
        </div>
        <div class="replyURL">
          <a href="javascript:;">回复</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  mounted() {
    this.data.created_at = moment(this.data.created_at).format(
      "YYYY-MM-DD hh:mm"
    );
  },

  name: "detailComItem",
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {
    moment
  }
};
</script>

<style scoped lang="less">
.reply-item {
  padding: 4px;
  font-size: 12px;
  background: #f9f9f9;
  border: 1px #ccc solid;
}
.date {
  color: #ccc;
}
.replyURL {
  text-align: right;
  padding-right: 10px;
  color: #1e50a2;
}

.txt {
  padding: 8px 0;
  margin-left: 20px;
  font-size: 14px;
}

/deep/.el-image {
  margin-right: 5px;
}
</style>