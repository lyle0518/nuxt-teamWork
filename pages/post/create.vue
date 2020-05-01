<template>
  <div class="container clearfix">
    <div class="main">
      <h2>发表新攻略</h2>
      <p class="share">分享你的个人游记，让更多人看到哦！</p>
      <el-input placeholder="请输入标题" class="inp-title"></el-input>
      <createUI />
      <div class="city">
        <span>选择城市</span>
        <el-input placeholder="请搜索游玩城市" class="inp-city"></el-input>
      </div>
      <div class="publish">
        <el-button type="primary" class="btn-publish">发布</el-button>
        <span class="or">或者</span>
        <a href="#" class="save">保存到草稿</a>
      </div>
    </div>

    <createAside />
  </div>
</template>

<script>
import createAside from "@/components/post/createAside";
import createUI from "@/components/post/createUI";
export default {
  components: {
    createAside,
    createUI
  }
};
</script>

<style scoped lang="less">
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}
.main {
  float: left;
  width: 750px;

  h2 {
    font-weight: 400;
    font-size: 22px;
    margin-bottom: 10px;
  }

  .share {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }

  .inp-title {
    margin-bottom: 20px;
  }

  .city {
    margin: 20px 0;

    span {
      font-size: 14px;
      color: #606266;
      margin-right: 6px;
    }
    .inp-city {
      width: 202px;
    }
  }

  .publish {
    .btn-publish {
      width: 56px;
      height: 32px;
      padding: 9px 15px;
      font-size: 12px;
      margin-right: 10px;
    }
    .or {
      font-size: 14px;
      // margin: 0 0px 0 10px;
    }
    .save {
      font-size: 14px;
      color: #ffa500;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.clearfix:after,
.clearfix:before {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
</style>