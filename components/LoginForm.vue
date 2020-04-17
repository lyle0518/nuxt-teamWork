<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <p class="pwdNone">
        <a href="/">忘记密码</a>
      </p>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form);
          this.$axios({
            url: "/accounts/login",
            method: "POST",
            data: this.form
          }).then(res => {
            console.log(res);
            const { data } = res;
            // console.log(this.$store.state);
            this.$store.commit("user/setUserInfo", data);
            console.log(this.$store.state);
            this.$router.push("/");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang='less'>
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