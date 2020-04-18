<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名手机"></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item class="form-item">
        <el-input placeholder="验证码" v-model="form.captcha">
          <template slot="append">
            <el-button @click.native="handleSendCaptcha">
              发送验证码
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="form.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          placeholder="密码"
          type="password"
          @keyup.enter.native="onSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkpassword">
        <el-input
          v-model="form.checkpassword"
          placeholder="确认密码"
          type="password"
          @keyup.enter.native="onSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        password: "",
        captcha: "",
        nickname: "",
        checkpassword: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        nickname: [],
        checkpassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },

  methods: {
    handleSendCaptcha() {
      //发送验证码
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form);
          //  调用仓库里的公共的方法
          this.$store.dispatch("user/login", this.form).then(res => {
            // 因为需要获取用户名,此时的res值由上一个then return的值决定
            console.log(res);

            this.$message.success("登录成功,欢迎回来 " + res.user.nickname);
            this.$router.push("/");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // 换一种写法
      // this.$refs.form.validate(async valid => {
      //   if (valid) {
      //     console.log(this.form);
      //     //  调用仓库里的公共的方法
      //     await this.$store.dispatch("user/login", this.form);
      //     // 因为需要获取用户名,此时的res值由上一个then return的值决定
      //     console.log(res);

      //     this.$message.success("登录成功,欢迎回来");
      //     this.$router.push("/");
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-form {
  margin-top: 20px;
}
/deep/.el-form-item {
  padding: 0 20px;
  /deep/.el-form-item__content {
    margin-left: 0 !important;
  }
}
/deep/ .el-button {
  width: 100%;
}
.pwdNone {
  text-align: right;
  margin: 0 20px 10px 0;
  a {
    font-size: 12px;
    color: #409eff;
  }
}
</style>
