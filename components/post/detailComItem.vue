<template>
  <div>
    <div class="reply-item">
      <detailComItem v-if="data.parent" :data="data.parent" @reply="handleReply" />
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
              :preview-src-list="[$axios.defaults.baseURL + item.url]"
            ></el-image>
          </div>
        </div>

        <div class="replyBtn">
          <div class="show">
            <div class="hide">
              <a href="javascript:;" @click="handleReply(data)">回复</a>
            </div>
          </div>
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
  methods: {
    handleReply(data) {
      this.$emit("reply", data);
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
  word-break: break-all;
}

.replyBtn {
  height: 20px;
  .show {
    height: 100%;
  }
  .show:hover {
    .hide {
      display: block;
      padding-bottom: 10px;
      text-align: right;
      padding-right: 10px;
      color: #1e50a2;
    }
  }
  .hide {
    display: none;
  }
}

/deep/.el-image {
  margin-right: 5px;
}
</style>