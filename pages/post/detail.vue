<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- 左内容 -->
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <!-- 面包屑导航 -->
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
              <p>评论({{postCommentsData.length}})</p>
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
                placeholder="说点什么..."
              ></textarea>
              <div class="btn clearfix">
                <div class="left">
                  <el-upload
                    class="avatar-uploader"
                    :action="$axios.defaults.baseURL + '/upload'"
                    name="files"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </div>
                <div class="right">
                  <el-button type="primary">提交</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comment_content">
            <div v-if="postCommentsData.length > 0" class="comment_items">
              <!-- 评论 -->
              <div class="com" v-for="(item,index) in postCommentsData" :key="index">
                <div class="user">
                  <img
                    :src="$axios.defaults.baseURL +  item.account.defaultAvatar"
                    alt
                    class="avatar"
                  />
                  <span class="username">{{item.account.nickname}}</span>
                  <span class="date">2020年4月30日19:39:33</span>
                </div>
                <div class="reply">
                  <!-- 回复组件 -->
                  <DetailComItem v-if="item.parent" :data="item.parent" />
                </div>
                <p class="txt">{{item.content}}</p>
              </div>
            </div>
            <div
              v-if="postCommentsData.length == 0 || postCommentsData.length <0 "
              class="zeroComment"
            >暂无评论,赶紧抢占沙发！</div>
          </div>
        </div>
      </el-col>

      <!-- 右 相关攻略-->
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <h4
            style="font-size:18px;font-weight:400;padding-bottom:10px;border-bottom: 1px #ccc solid;"
          >相关攻略</h4>
          <div v-for="(item,index) in postRecommend" :key="index">
            <nuxt-link class="strategy clearfix" :to="`/post/detail?id=${item.id}`">
              <div class="left" v-if="item.images.length > 0">
                <img :src="item.images[0]" alt />
              </div>
              <div class="right">
                <h4>{{item.title}}</h4>
                <div class="strategyText">攻略：{{item.created_at}} 阅读：{{item.watch}}</div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//时间 组件
import moment from "moment";
//评论 组件
import DetailComItem from "@/components/post/detailComItem.vue";

export default {
  watch: {
    $route() {
      //页面地址栏变化时重新请求数据
      this.getPostData();
    }
  },
  mounted() {
    this.getPostData();
    this.getCommentsData();
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
      post: "", //  文章ID
      detail: {}, // 文章详情 数据
      createDate: "", // 文章详情 时间
      postRecommend: {}, //侧栏 推荐文章 数据
      postCommentsData: [], //文章 评论、回复 数据
      //图片上传缩略图
      dialogVisible: false,
      dialogImageUrl: "",

      //文章评论
      _limit: 5, //评论条数
      _start: 0 //开始数据
    };
  },
  methods: {
    //图片上传成功时
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file);
    },

    //文章详情请求
    getPostData() {
      const { id } = this.$route.query;
      this.post = id;

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
    },

    //文章评论请求
    getCommentsData() {
      //评论数据请求
      this.$axios({
        url: "/posts/comments",
        params: {
          post: this.post,
          _start: 0,
          _limit: 5
        }
      }).then(res => {
        const { data } = res.data;
        this.postCommentsData = data;
        console.log(this.postCommentsData);
      });
    }
  },
  components: {
    moment,
    DetailComItem
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
          /deep/.el-upload-list__item-actions {
            width: 100px;
            height: 100px;
          }
          /deep/.el-upload-list--picture-card .el-upload-list__item {
            width: 100px;
            height: 100px;
          }
          /deep/.el-upload--picture-card {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            // vertical-align: top;
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

    //侧栏攻略
    .strategy {
      position: relative;
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
        h4 {
          position: absolute;
          top: 20px;
          font-size: 14px;
          font-weight: 400;
        }
        .strategyText {
          position: absolute;
          bottom: 20px;
          font-size: 12px;
          color: #ccc;
        }
      }
    }

    .comment_content {
      border: 1px #ddd solid;
      .comment_items {
        padding: 0 15px;
        margin: 10px 0;
        .avatar {
          width: 13px;
          height: 13px;
        }
        .com {
          font-size: 14px;
          border-bottom: 1px #ccc dashed;
          .user {
            padding: 10px 0;
          }
          .date {
            color: #ccc;
          }
          .txt {
            padding: 8px 0;
            margin-left: 20px;
            font-size: 16px;
          }
        }
        // .reply {
        //   .reply-item {
        //     padding: 4px;
        //     font-size: 12px;
        //     background: #f9f9f9;
        //     border: 1px #ccc solid;
        //   }
        //   .date {
        //     color: #ccc;
        //   }
        // }
      }
      .zeroComment {
        line-height: 100px;
        color: #ccc;
        text-align: center;
        border: 1px #ccc dashed;
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