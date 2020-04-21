import { Message } from "element-ui";
export default nuxt => {
  // plugins的所有文件都会导入到项目中，并且是全局的，
  nuxt.$axios.onError(err => {
    const { statusCode, message } = err.response.data;
    if (statusCode === 400) {
      //   Message.error(message);
      console.log(111);
    }
  });
};
