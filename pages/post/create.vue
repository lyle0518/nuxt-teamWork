<template>
  <div class="container clearfix">
    <!-- 左侧主体部分 -->
    <div class="main">
      <h2>发表新攻略</h2>
      <p class="share">分享你的个人游记，让更多人看到哦！</p>

      <!-- 表单 -->
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="title">
          <el-input placeholder="请输入标题" v-model="form.title"></el-input>
        </el-form-item>

        <!-- 富文本编辑器 -->
        <el-form-item prop="content">
          <no-ssr placeholder="Loading Your Editor...">
            <vue-editor placeholder="......" v-model="form.content"></vue-editor>
          </no-ssr>
        </el-form-item>

        <el-form-item label="选择城市" prop="city">
          <!-- 带输入建议输入框 -->
          <el-autocomplete
            :fetch-suggestions="queryCity"
            placeholder="请搜索游玩城市"
            @select="handleCitySelect"
            class="el-autocomplete"
            v-model="form.city"
            @blur="handleCity"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <div class="publish">
            <el-button type="primary" class="btn-publish" @click="handleCreate()">发布</el-button>
            <span class="or">或者</span>
            <a href="javascript:;" class="save" @click="saveDraft">保存到草稿</a>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 侧边栏草稿箱 -->
    <!-- <createAside /> -->
    <div class="aside">
      <div class="draft">
        <h4 class="draft-title">草稿箱 ( {{this.$store.state.post.draftList.length}} )</h4>
        <div
          class="draf-list"
          v-for="(item,index) in this.$store.state.post.draftList"
          :key="index"
        >
          <div class="draf-item">
            <span class="draf-title textone" @click="handleClick(item)">
              {{item.title}}
              <i class="el-icon-edit draf-icon"></i>
            </span>
            <p class="draf-date">{{item.timeDate}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import createAside from "@/components/post/createAside";
import moment from "moment";
export default {
  // components: {
  //   createAside
  // },
  // 富文本编辑器
  asyncData() {
    return {
      content: "",
      pageIsMounted: false,
      isSSR: process.server ? true : false
    };
  },
  data() {
    // 标题不能为空
    var validateTitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.validateError("标题")));
      } else {
        callback();
      }
    };
    // 内容不能为空
    var validateContent = (rule, value, callback) => {
      if (this.form.title !== "" && value === "") {
        callback(new Error(this.validateError("内容")));
      } else {
        callback();
      }
    };
    // 城市不能为空
    var validateCity = (rule, value, callback) => {
      if (this.form.title !== "" && this.form.content !== "" && value === "") {
        callback(new Error(this.validateError("城市")));
      } else {
        callback();
      }
    };
    return {
      form: {
        title: "",
        content: "",
        city: ""
      },
      // 表单验证规则
      rules: {
        title: [{ validator: validateTitle, trigger: "blur1" }],
        content: [{ validator: validateContent, trigger: "blur1" }],
        city: [{ validator: validateCity, trigger: "blur1" }]
      },
      citys: [] // 存储游玩城市 下拉列表的数据
    };
  },
  methods: {
    // 标题不能为空 错误信息弹窗提示方法
    validateError(str) {
      this.$alert(`请填写` + str, "提示", {
        confirmButtonText: "确定",
        type: "warning"
      });
    },

    //封装搜索城市方法
    getCities(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        // console.log(res);
        const { data } = res.data;
        // cb这个参数是一个方法,需要传参,参数需要有value属性,
        // 遍历data给把每一个元素的name值赋给 value属性
        const cites = data.map(v => {
          // v.value = v.name.replace("市", "");
          v.value = v.name;
          return v;
        });
        // console.log(cites);
        return cites;
      });
    },

    // 点击发布按钮时触发
    handleCreate() {
      console.log(this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          // 新增文章请求
          this.$axios({
            url: "/posts",
            method: "POST",
            headers: {
              Authorization: `Bearer ` + this.$store.state.user.userInfo.token
            },
            data: {
              title: this.form.title,
              content: this.form.content,
              city: this.form.city
            }
          }).then(res => {
            const { data } = res.data;
            console.log(res);
            // if (res.statusCode === 400) {
            // axios.js的400编码错误信息提示 注释起来了
            //   Message.error(message);
            // }
            this.$message({
              message: "新增成功",
              type: "success"
            });
            // // 清空表单内容
            // this.form.title = "";
            // this.form.content = "";
            // this.form.city = "";
            this.$router.push("/post");
          });
        }
      });
    },

    // 游玩城市 输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的城市
    queryCity(value, cb) {
      // value的值是输入框的值，非空的时候
      if (!value) {
        cb([]);
        this.citys = [];
        return;
      }

      this.getCities(value).then(res => {
        // res的值为函数中return出来的cites
        this.citys = res;
        cb(res);
      });
    },

    // 游玩城市 输入框下拉 选定选项时触发
    handleCitySelect(item) {
      // console.log(item);
    },

    // 游玩城市 输入框 失去焦点时触发  自动匹配第一项
    handleCity() {
      if (this.citys.length > 0) {
        this.form.city = this.citys[0].value;
      }
    },

    // 保存到草稿箱
    saveDraft() {
      // 将表单信息存储到store的仓库中
      const time = moment().format("YYYY-MM-DD");
      this.form.timeDate = time;
      // console.log(this.form);
      const list = { ...this.form };
      this.$store.commit("post/setDraftList", this.form);
      this.form = list;
    },

    handleClick(item) {
      // 草稿箱数据回显
      // console.log(this.form);
      this.form.title = item.title;
      this.form.content = item.content;
      this.form.city = item.city;
    }
  }
};
</script>

<style scoped lang="less">
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}
/deep/ .el-form-item__label:before {
  display: none;
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
  // 富文本编辑器高度
  /deep/ #quill-container {
    height: 400px;
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

.aside {
  width: 200px;
  float: right;

  .draft {
    padding: 10px;
    border: 1px solid #ccc;
    .draft-title {
      color: #666;
      font-weight: 400;
      margin-bottom: 10px;
    }
    .draf-list {
      .draf-item {
        margin-bottom: 10px;
        font-size: 14px;
        .draf-title {
          .draf-icon {
            font-size: 16px;
            &:hover {
              color: #ffa500;
              cursor: pointer;
            }
          }
          &:hover {
            color: #ffa500;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        //标题一行文字溢出隐藏
        .textone {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          line-height: 20px;
          max-height: 20px;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .draf-date {
          color: #999;
        }
      }
    }
  }
}

// 清除浮动
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