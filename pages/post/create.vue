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
            <vue-editor v-model="form.content"></vue-editor>
          </no-ssr>
        </el-form-item>

        <el-form-item label="选择城市" prop="city">
          <el-input placeholder="请搜索游玩城市" class="inp-city" v-model="form.city"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="publish">
            <el-button type="primary" class="btn-publish" @click="handleCreate()">发布</el-button>
            <span class="or">或者</span>
            <a href="#" class="save">保存到草稿</a>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 侧边栏草稿箱 -->
    <createAside />
  </div>
</template>

<script>
import createAside from "@/components/post/createAside";
export default {
  components: {
    createAside
  },
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
        callback(this.validateError("标题"));
      } else {
        callback();
      }
    };

    // 内容不能为空
    var validateContent = (rule, value, callback) => {
      if (this.form.title !== "" && value === "") {
        callback(this.validateError("内容"));
      } else {
        callback();
      }
    };

    // 城市不能为空
    var validateCity = (rule, value, callback) => {
      if (this.form.title !== "" && this.form.content !== "" && value === "") {
        callback(this.validateError("城市"));
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
      }
    };
  },
  methods: {
    // 点击发布按钮时触发
    handleCreate() {
      // console.log(this.$refs.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form);
        }
      });
    },
    // 标题不能为空 错误信息弹窗提示方法
    validateError(str) {
      this.$alert(`请填写` + str, "提示", {
        confirmButtonText: "确定",
        type: "warning"
      });
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
  .inp-city {
    width: 202px;
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