<template>
  <header class="header">
    <el-row type="flex" justify="space-between" class="main">
      <!-- logo -->
      <div class="logo">
        <nuxt-link to="/"></nuxt-link>
      </div>

      <!-- 菜单栏 -->
      <el-row type="flex" class="navs">
        <nuxt-link to="/" :class="index === 0?'actives':''">首页</nuxt-link>
        <nuxt-link to="/post?start=0&limit=3" :class="index === 1?'actives':''">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel" :class="index === 2?'actives':''">酒店</nuxt-link>
        <nuxt-link to="/air" :class="index === 3?'actives':''">国内机票</nuxt-link>
      </el-row>

      <!-- 登录后的用户信息 -->
      <el-dropdown v-if="$store.state.user.userInfo.token">
        <el-row type="flex" align="middle" class="el-dropdown-link">
          <img
            :src="
              $axios.defaults.baseURL +
                $store.state.user.userInfo.user.defaultAvatar
            "
            alt
          />
          <span>{{ $store.state.user.userInfo.user.nickname }}</span>
          <span class="el-icon-caret-bottom"></span>
        </el-row>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 登录/用户信息 -->
      <el-row type="flex" align="middle" v-else>
        <!-- 如果用户存在则展示用户信息，用户数据来自store -->
        <el-dropdown v-if="false">
          <el-row type="flex" align="middle" class="el-dropdown-link">
            <nuxt-link to="#">
              <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" />
              用户名
            </nuxt-link>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-row>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link to="#">个人中心</nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleLogout">退出</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 不存在用户信息展示登录注册链接 -->
        <nuxt-link to="/user/login" class="account-link" v-else>登录 / 注册</nuxt-link>
      </el-row>
    </el-row>
  </header>
</template>
<script>
export default {
  data() {
    return {
      actives: false,
      index: 999
    };
  },
  methods: {
    // 用户退出
    handleLogout() {
      this.$store.commit("user/setUserInfo", {});
      this.$message.success("退出成功!");
    }
  },
  watch: {
    $route() {
      // if(this.$route.query.limit || this.$route.query.id || this.$route.path === '/post/create'){
      // 	this.actives = true
      // }else{
      // 	this.actives = false
      // }
      if (this.$route.name == "index") {
        this.index = 0;
      }
      if (this.$route.name.indexOf("post") > -1) {
        this.index = 1;
      }
      if (this.$route.name.indexOf("hotel") > -1) {
        this.index = 2;
      }
      if (this.$route.name.indexOf("air") > -1) {
        this.index = 3;
      }
    }
  }
};
</script>
<style scoped lang="less">
.header {
  height: 60px;
  line-height: 60px;
  background: #fff;
  border-bottom: 1px #ddd solid;
  box-shadow: 0 3px 0 #f5f5f5;
  box-sizing: border-box;

  .main {
    width: 1000px;
    margin: 0 auto;
  }

  .logo {
    width: 156px;
    overflow: hidden;
    a {
      display: inline-block;
      width: 156px;
      height: 58px;
      background: url("../static/logo.png") no-repeat 52% 35%;
      background-size: 155px;
      margin-left: 20px;
    }
  }

  .navs {
    // margin: 0 20px;
    flex: 1;

    a {
      display: block;
      padding: 0 20px;
      height: 60px;
      box-sizing: border-box;

      &:hover,
      &:focus,
      &:active {
        border-bottom: 5px #409eff solid;
        color: #409eff;
      }
    }

    /deep/ .nuxt-link-exact-active {
      background: #409eff;
      color: #fff !important;
    }
  }

  .message {
    height: 36px;
    line-height: 1;
    cursor: pointer;
    .el-icon-bell {
      margin-right: 2px;
      font-size: 18px;
    }
  }

  .el-dropdown-link {
    margin-left: 20px;

    &:hover {
      img {
        border-color: #409eff;
      }
    }

    a {
      display: block;
    }

    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      border: 2px #fff solid;
      border-radius: 50px;
    }
  }

  .account-link {
    font-size: 14px;
    margin-left: 10px;
    color: #666;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
.actives {
  color: #fff;
  background: #409eff;
  &:hover {
    color: #fff !important;
  }
}
</style>
