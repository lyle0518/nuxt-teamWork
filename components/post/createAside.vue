<template>
  <div class="aside clearfix">
    <div class="draft">
      <h4 class="draft-title">草稿箱 ( 5 )</h4>
      <div class="draf-list" v-for="(item,index) in this.$store.state.post.draftList" :key="index">
        <div class="draf-item">
          <span class="draf-title textone" @click="handleClick(item)">
            {{item.title}}
            <i class="el-icon-edit draf-icon"></i>
          </span>
          <p class="draf-date">{{item.timeDate}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(item) {
      console.log(item);
    }
  }
};
</script>

<style scoped lang="less">
.draft {
  float: right;
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  .draft-title {
    color: #666;
    font-weight: 400;
    margin-bottom: 10px;
  }
  .draf-list {
    .draf-item {
      margin-bottom: 10px;
      font-size: 14px;
      .draf-title {
        .draf-icon {
          font-size: 16px;
          &:hover {
            color: #ffa500;
            cursor: pointer;
          }
        }
        &:hover {
          color: #ffa500;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      //标题一行文字溢出隐藏
      .textone {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 20px;
        max-height: 20px;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .draf-date {
        color: #999;
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