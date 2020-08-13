<template>
  <div class="wrapper-tabs">
    <div class="tabs">
      <div class="tabs-content">
        <div
          v-show="isShow(index)"
          class="tab-box"
          :class="current===index?'active':''"
          :key="index"
          v-for="(item,index) in newData">
          <div class="tab" @click="setCurent(index)" :class="newData.length===1?'oneTab':''">
            <span><b>{{item.name}}</b><i @click.stop="del(index)"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        layout="pager"
        :page-size="pageNum"
        :current-page="activePage"
        :total="newData.length"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapTabs',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      current: 0, // 当前激活的tab
      activePage: 1,
      pageNum: 3, // 每页条数
      newData: [] // 复制一份的tab数据
    }
  },
  methods: {
    // 页码的改变
    pageChange(num) {
      this.activePage = num
    },
    // 设置当前激活tab
    setCurent(index) {
      this.current = index
    },
    // 根据页码显示tab
    isShow(index) {
      if (index >= this.pageNum * (this.activePage - 1) && index <= this.pageNum * this.activePage) {
        return true
      } else {
        return false
      }
    },
    // 初始化复制一份数据
    initData() {
      this.newData = [...this.data]
    },
    // 删除一个
    del(index) {
      if (this.newData.length === 1) {
        return
      }
      this.newData.splice(index, 1)
      const num = Math.ceil(this.newData.length / this.pageNum)
      if (this.activePage > num) {
        this.activePage = num
      }
      if (this.current > index || index === this.newData.length) {
        this.current -= 1
      }
    }
  },
  created() {
    this.initData()
  },
  watch: {
    data() {
      this.initData()
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper-tabs {
    width: 100%;
    .tabs {
      width: 100%;
      height: 0.68rem;
      overflow: hidden;
      padding: 0.15rem 0;
      .tabs-content {
        width: calc(100% + 0.07rem);
        height: 100%;
        overflow: hidden;
        .tab-box {
          width: 33.33%;
          float: left;
          padding-right: 0.07rem;
          height: 100%;
          cursor: pointer;
          &.active {
            .tab {
              background: #0fc1ff;
            }
          }
          .tab {
            width: 100%;
            text-align: center;
            background: #274369;
            padding: 0 0.3rem 0 0.1rem;
            height: 100%;
            line-height: 0.38rem;
            border-radius: 0.02rem;
            &.oneTab {
              padding-right: 0.1rem;
              > span > i {
                display: none;
              }
            }
            > span {
              color: #f3f3f3;
              font-size: 0.16rem;
              width: 100%;
              display: block;
              position: relative;
              > b {
                display: block;
                .no-wrap();
              }
              > i {
                width: 0.14rem;
                height: 0.14rem;
                display: inline-block;
                .bg-image('images/btn_delete');
                position: absolute;
                top: 50%;
                right: -0.2rem;
                transform: translate(0, -50%);
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .page {
    width: 100%;
    text-align: center;
  }
  /deep/ .el-pager li {
    background: #1d538d;
    height: 0.2rem;
    width: 0.2rem;
    line-height: 0.2rem;
    padding: 0;
    border-radius: 50%;
    min-width: auto;
    color: #fefefe;
    font-size: 0.12rem;
    font-weight: 400;
    margin: 0 0.02rem;
  }
  /deep/ .el-pager li.active {
    background: #1aaffe;
  }
</style>
