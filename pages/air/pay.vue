<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{ Number(detail.price).toFixed(2) }}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <div>
              <img src="../../static/pay.png" alt />
            </div>
            <!-- <canvas id="qrcode-stage"></canvas> -->
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      detail: {
        price: 0
      },
      time: ""
    };
  },
  mounted() {
    //请求机票的信息
    setTimeout(async () => {
      const res = await this.$axios({
        url: "/airorders/" + this.$route.query.id,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      });

      console.log(res);
      this.detail = res.data;
      //获取元素
      const canvas = document.querySelector("#qrcode-stage");
      QRCode.toCanvas(canvas, this.detail.payInfo.code_url, {
        width: 200
      });
      //每三秒自动询问后台接口是否支付
      this.time = setInterval(async () => {
        const checkRes = await this.$axios({
          url: "/airorders/checkpay",
          method: "post",
          headers: {
            Authorization: `Bearer ` + this.$store.state.user.userInfo.token
          },
          data: {
            id: this.detail.id, //订单id
            nonce_str: this.detail.price, //订单金额
            out_trade_no: this.detail.orderNo
          }
        });
        if (checkRes.data.statusTxt == "支付完成") {
          {
            this.$message.success("订单支付完成");
            clearInterval(this.time);
            this.$router.push("/air");
          }
        }
      }, 3000);
    }, 0);
  },
  // 组件销毁时清楚定时器
  destroyed() {
    clearInterval(this.time);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
