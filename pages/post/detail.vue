<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- 左内容 -->
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path:'/post' }">旅游攻略</el-breadcrumb-item>
            <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
          </el-breadcrumb>
          <!--  头部-->
          <h1 class="title">{{detail.title}}</h1>
          <!-- 阅读量、时间 -->
          <el-col :span="24" class="text">
            <span>攻略：{{createDate}}</span>
            <span>阅读：{{detail.watch}}</span>
          </el-col>
          <!-- 文章内容 -->
          <div class="postContent" v-html="detail.content"></div>
          <!-- 评论、分享 按钮 -->
          <div class="share">
            <div class="share-item">
              <i class="iconfont iconpinglun-"></i>
              <p>评论(0)</p>
            </div>
            <div class="share-item">
              <i class="iconfont iconfenxiang"></i>
              <p>分享</p>
            </div>
          </div>

          <!-- 评论模块 -->
          <div class="comment">
            <h4 class="com_title">评论</h4>
            <div class="form">
              <textarea
                style="resize:none;width:100%;min-height:60px;border-raidus:10px;border:1px #dcdfe6 solid;border-radius:5px;"
              ></textarea>
              <div class="btn clearfix">
                <div class="left">
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div class="right">
                  <el-button type="primary">提交</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comment_content">
            <div v-if="true" class="comment_items">
              <!-- 评论 -->
              <div class="com">
                <div class="user">
                  <img src="#" alt class="avatar" />
                  <span class="username">管理员</span>
                  <span class="date">2020-04-25 10:18</span>
                </div>

                <p class="txt">评论评论评论评论评论</p>
              </div>
              <!-- 回复 -->
              <div class="reply">
                <div>
                  <div class="user">
                    <span class="username">管理员</span>
                    <span class="date">2020-04-25 10:18</span>
                  </div>
                  <p class="txt">回复回复回复回复回复回复</p>
                </div>
              </div>
            </div>
            <div v-else class="zeroComment">暂无评论,赶紧抢占沙发！</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <!-- 右 相关攻略-->
        <div class="grid-content bg-purple">
          <h4
            style="font-size:18px;font-weight:400;padding-bottom:10px;border-bottom: 1px #ccc solid;"
          >相关攻略</h4>
          <!-- 有图 -->
          <nuxt-link
            class="strategy clearfix"
            v-for="(item,index) in postRecommend"
            :key="index"
            to="#"
          >
            <div class="left" v-if="item.images.length > 0">
              <img :src="item.images[0]" alt />
            </div>
            <div class="right">
              <h4>{{item.title}}</h4>
              <div class="strategyText">攻略：{{item.created_at}} 阅读：{{item.watch}}</div>
            </div>
          </nuxt-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";

export default {
  mounted() {
    const { id } = this.$route.query;

    //文章详情
    this.$axios({
      url: "/posts",
      params: {
        id
      }
    }).then(res => {
      const { data } = res.data;
      this.detail = { ...data[0] };
      //   console.log(this.detail);
      let createDate = moment(this.detail.created_at).format(
        "YYYY-MM-DD hh:mm"
      );
      this.createDate = createDate;
    });
    //推荐文章
    this.$axios({
      url: "/posts/recommend"
    }).then(res => {
      const { data } = res.data;
      //循环修改时间格式
      const postRecommend = data.map(v => {
        v.created_at = moment(v.created_at).format("YYYY-MM-DD hh:mm");
        return v;
      });
      this.postRecommend = postRecommend;
    });
  },
  data() {
    return {
      imageUrl: "",
      detail: {}, // 文章详情 数据
      createDate: "",
      postRecommend: {}
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  components: {
    moment
  }
};
</script>

<style scoped lang="less">
//导入字体图标
@import url("//at.alicdn.com/t/font_1426139_jm7n2373nlh.css");
//详情页面样式
.container {
  width: 1000px;
  margin: 0 auto;
  .el-row {
    margin: 20px 0;

    //头部
    .title {
      padding: 20px 0;
      border-bottom: 1px #ddd solid;
    }
    .text {
      padding: 20px 0;
      text-align: right;
      color: #bbb;
    }
    .postContent {
      font-size: 16px;
      line-height: 26px;
      /deep/img {
        max-width: 100%;
      }
    }
    // 评论/分享 按钮
    .share {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
      .share-item {
        margin: 0 20px;
        text-align: center;
        .iconfont {
          font-size: 31px;
          color: #ffa500;
        }
        p {
          font-size: 14px;
          color: #aaa;
        }
      }
    }

    //发表评论
    .comment {
      margin-bottom: 20px;
      .com_title {
        margin-bottom: 20px;
        font-weight: 400;
        font-size: 18px;
      }
      .btn {
        padding: 5px 0;
        .left {
          float: left;
          //上传组件样式
          /deep/.avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          /deep/.avatar-uploader .el-upload:hover {
            border-color: #409eff;
          }
          /deep/.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
          }
          /deep/.avatar {
            width: 100px;
            height: 100px;
            display: block;
          }
        }
        .right {
          float: right;
          /deep/.el-button {
            font-size: 12px;
            padding: 10px 17px;
          }
        }
      }
    }

    //评论区
    .comment_content {
      border: 1px #ddd solid;
      .comment_items {
        padding: 0 20px;
        margin: 10px 0;
        border-bottom: 1px #ddd dashed;
        .com {
          font-size: 12px;
          .user {
            padding: 10px 0;
          }
          .date {
            color: #ccc;
          }
        }
        .reply {
          padding: 10px;
          font-size: 12px;
          background: #f9f9f9;
          border: 1px #ccc solid;
          .date {
            color: #ccc;
          }
        }
        .txt {
          padding: 15px 0;
          margin-left: 20px;
          font-size: 16px;
        }
      }
      .zeroComment {
        line-height: 100px;
        color: #ccc;
        text-align: center;
        border: 1px #ccc dashed;
      }
    }

    //侧栏攻略
    .strategy {
      border-bottom: 1px #ccc solid;
      padding: 20px 0;
      display: flex;
      .left {
        margin-right: 10px;
        img {
          width: 100px;
        }
      }
      .right {
        // padding-left: 10px;
        h4 {
          font-size: 14px;
          font-weight: 400;
        }
        .strategyText {
          font-size: 12px;
          color: #ccc;
          line-height: 40px;
        }
      }
    }
  }
}

.clearfix:after {
  content: "";

  display: table;

  clear: both;
}
</style>