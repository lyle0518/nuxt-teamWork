<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名手机"></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item class="form-item" prop="captcha">
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
        <el-button type="primary" @click="RegisterSubmit">注册</el-button>
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
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        checkpassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },

  methods: {
    handleSendCaptcha() {
      //发送验证码
      console.log(this.form.username);

      // 自定义验证手机号码输入
      if (this.form.username === "") {
        this.$refs.form.validateField("username");
        return;
      }
      //验证码功能
      this.$store.dispatch("user/sendCaptcha", this.form.username).then(res => {
        console.log(res);
        this.$message.success("手机验证码为" + res);
      });
    },
    //注册
    RegisterSubmit() {
      // 删除this.form中的checkpassword
      const { checkpassword, ...other } = this.form;
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form);
          //  调用仓库里的公共的方法
          this.$store.dispatch("user/register", other).then(res => {
            this.$message.success("恭喜您,注册成功");
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
