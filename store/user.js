export const state = {
  userInfo: "李四"
};
export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data;
  }
};
// 公共的方法,用来处理同个功能不同需求操作
export const actions = {
  // 第一个参数是Store对象, 第二个参数是传入的参数(不固定)
  login(store, data) {
    return this.$axios({
      url: "/accounts/login",
      method: "POST",
      data
    }).then(res => {
      // console.log(res);
      const { data } = res;
      // console.log(this.$store.state);
      // 同个模块调用可以省去user
      store.commit("setUserInfo", data);
      // console.log(this.$store.state);
      // this.$router.push("/");
      return data;
    });
  },
  //验证码功能
  sendCaptcha(store, tel) {
    return this.$axios({
      url: "captchas",
      method: "POST",
      data: { tel }
    }).then(res => {
      // console.log(res);
      const { code } = res.data;
      console.log("js文件内" + code);
      return code;
    });
  },
  //注册功能
  register(store, data) {
    return this.$axios({
      url: "accounts/register",
      method: "post",
      data
    }).then(res => {
      const { data } = res;
      // this.$message.success("注册成功");
      // this.$router.push("/");
      // 修改用户信息
      store.commit("setUserInfo", data);
    });
  }
};
