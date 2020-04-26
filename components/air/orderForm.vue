<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人{{$store.state.air.allPrice}}</h2>
      <el-form class="member-info" :rules="rules" ref="form" :model="form">
        <div class="member-info-item" v-for="(item, index) in form.users" :key="index">
          <el-form-item prop="users">
            <el-form-item label="乘机人类型">
              <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
                <el-select slot="prepend" value="1" placeholder="请选择">
                  <el-option label="成人" value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item label="证件类型">
              <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
                <el-select slot="prepend" value="1" placeholder="请选择">
                  <el-option label="身份证" value="1" :checked="true"></el-option>
                </el-select>
              </el-input>
            </el-form-item>

            <span class="delete-user" @click="handleDeleteUser(index)">-</span>
          </el-form-item>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item, index) in detail.insurances" :key="index">
          <el-checkbox
            :label="
              `${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`
            "
            @change="handleCheckbox(item.id)"
            border
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="80px" :rules="rules" :model="form" ref="form2">
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <span v-show="false">{{allPrice}}</span>
  </div>
</template>

<script>
export default {
  computed: {
    allPrice() {
      console.log(this.detail.seat_infos);
      if (!this.detail.seat_infos) {
        return 0;
      }
      //计算机票总金额
      let price = 0;
      // 首先先加上单价和燃油费
      price += this.detail.seat_infos.org_settle_price;
      price += this.detail.airport_tax_audlet;
      // 添加保险金额
      // 说明勾选了保险
      this.form.insurances.forEach(v => {
        this.detail.insurances.forEach(item => {
          if (v === item.id) {
            price += item.price;
          }
        });
      });
      //人数新增
      price *= this.form.users.length;
      //存储到公共的仓库中
      this.$store.commit("air/setAllPrice", price);
      return price;
    }
  },
  data() {
    const validatorUser = (rule, value, callback) => {
      let valid = true;
      console.log(value);
      value.forEach(v => {
        if (!valid) return;
        if (v.username.trim() === "") {
          valid = false;
          return callback(new Error("乘机人姓名不能为空"));
        }
        if (v.id.trim() === "") {
          valid = false;

          return callback(new Error("乘机人证件号码不能为空"));
        }
      });
      if (valid) {
        callback();
      }
    };
    return {
      form: {
        users: [{ username: "", id: "" }], //乘车人
        insurances: [], //	保险id
        contactName: "", //联系人名字
        contactPhone: "", //联系人电话
        invoice: false, //发票
        seat_xid: "", //座位id
        air: "", //航班信息
        captcha: "" //验证码
      },
      //   存储机票信息
      detail: {},
      rules: {
        users: [{ validator: validatorUser, trigger: "blur" }],
        contactName: [{ required: true, message: "联系人不能为空" }],
        contactPhone: [{ required: true, message: "联系人电话不能为空" }],
        captcha: [{ required: true, message: "验证码不能为空" }]
      }
    };
  },

  mounted() {
    this.$store.commit("air/setAirLength", 1);
    //获取机票信息
    const { id, seat_xid } = this.$route.query;
    this.form.seat_xid = seat_xid;
    this.form.air = id;

    this.$axios({
      url: "/airs/" + id,
      params: {
        seat_xid
      }
    }).then(res => {
      this.detail = res.data;
      // console.log(this.detail);
      this.$store.commit("air/setFlightData", this.detail);
    });
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 点击给数组追加一个对象
      this.form.users.push({
        username: "",
        id: ""
      });
      //传递此时的user长度给仓库
      this.$store.commit("air/setAirLength", this.form.users.length);
    },
    handleCheckbox(id) {
      console.log(id);
      // 查找该id在其中是否已经存在  ---查找数组中的元素的索引,如果存在值返回索引,不存在返回-1
      const index = this.form.insurances.indexOf(id);
      if (index > -1) {
        //已经存在,删除
        this.form.insurances.splice(index, 1);
      } else {
        this.form.insurances.push(id);
      }
      console.log(this.form.insurances);
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      //调用库里公共的方法
      if (this.form.contactPhone) {
        this.$store
          .dispatch("user/sendCaptcha", this.form.contactPhone)
          .then(code => {
            this.$message.success("验证码发送成功，模拟的验证码是:" + code);
          });
      } else {
        // this.$message.error("手机号码不能为空");
        this.$refs.form2.validateField('contactPhone')

      }
    },

    // 提交订单
    handleSubmit() {
      // console.log(this.form);
      this.$refs.form.validate(valid => {
        this.$refs.form2.validate(valid2 => {
          //两个表单都是valid为tre的时候才可以发送请求
          if (valid && valid2) {
            this.$axios({
              url: "/airorders",
              method: "POST",
              headers: {
                Authorization: `Bearer ` + this.$store.state.user.userInfo.token
              },
              data: this.form
            }).then(res => {
              console.log(res);
              const { id } = res.data.data;
              this.$message.success("订单提交成功");
              this.$router.push({
                path: "/air/pay",
                query: {
                  id
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
/deep/.el-row {
  border-top: 0 !important;
}
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
