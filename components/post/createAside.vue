<template>
  <div class="aside clearfix">
    <div class="draft">
      <h4 class="draft-title">草稿箱 ( 5 )</h4>
      <div class="draf-list">
        <div class="draf-item">
          <span class="draf-title">
            闲云旅游1
            <i class="el-icon-edit draf-icon"></i>
          </span>

          <p class="draf-date">2020-05-01</p>
        </div>
        <div class="draf-item">
          <span class="draf-title">
            闲云旅游2
            <i class="el-icon-edit draf-icon"></i>
          </span>

          <p class="draf-date">2020-05-01</p>
        </div>
        <div class="draf-item">
          <span class="draf-title">
            闲云旅游3
            <i class="el-icon-edit draf-icon"></i>
          </span>
          <p class="draf-date">2020-05-01</p>
        </div>
        <div class="draf-item">
          <span class="draf-title">
            <i class="el-icon-edit draf-icon"></i>
          </span>
          <p class="draf-date">2020-05-01</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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