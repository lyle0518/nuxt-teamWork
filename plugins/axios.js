import { Message } from "element-ui";
export default nuxt => {
  // plugins的所有文件都会导入到项目中，并且是全局的，
  console.log(nuxt);

  nuxt.$axios.onError(err => {
    const { statusCode, message } = err.response.data;
    if (statusCode === 400) {
      //   Message.error(message);
      console.log(111);
    }
    if (statusCode === 401) {
      Message.error("当前没有登录");
      nuxt.redirect("/user/login");
    }
    if (statusCode === 403) {
      Message.error("当前没有登录");
      nuxt.redirect("/user/login");
    }
  });
};
