<template>
  <div
    class="wrapper-tabs"
    :class="{'collapse1':collapse1,'collapse2':collapse2,'legendHide':!legendShow,'splitScreen':splitScreen}"
  >
    <div class="tabs">
      <div ref="itemBox" class="tabs-content">
        <div
          ref="item"
          @click="itemClick(index)"
          class="tab-box"
          :class="index === typeIndex? 'active' : ''"
          :key="index"
          v-for="(item,index) in treeCheckedList"
        >
          <el-tooltip :content="item.name" placement="bottom" :disabled="setDisabled(item.name)">
            <div class="tab">
              <span>
                <b>{{item.name}}</b>
                <i @click.stop="del(index)"></i>
              </span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <span @click="move('prev')" :class="prevActive?'active':''" class="prev" v-show="showBtn"></span>
    <span @click="move('next')" :class="nextActive?'active':''" class="next" v-show="showBtn"></span>
    <div class="loading" v-show="isLoading">
      <Loading></Loading>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Loading from "components/loading/loading";

export default {
  name: "CheckItem",
  computed: {
    ...mapGetters("map", [
      "treeCheckedList",
      "typeIndex",
      "collapse1",
      "collapse2",
      "legendShow",
      "splitScreen"
    ]),
    ...mapGetters(["resize"])
  },
  data() {
    return {
      flag: true,
      showBtn: false,
      prevActive: false,
      nextActive: false,
      isLoading: false
    };
  },
  methods: {
    // 设置是否显示tip框
    setDisabled(value) {
      let num = 0;
      var reg = new RegExp("[\\u4E00-\\u9FFF]+");
      for (let i = 0; i < value.length; i++) {
        if (reg.test(value[i])) {
          num += 2;
        } else {
          num += 1;
        }
      }
      return num <= 8;
    },
    // 按钮的移动
    move(direction) {
      const contentEl = this.$refs.itemBox;
      const firstWidth = parseInt(
        window.getComputedStyle(this.$refs.item[1]).width
      );
      const count = parseInt(
        parseInt(window.getComputedStyle(contentEl).width) / firstWidth
      );
      if (direction === "prev") {
        contentEl.scrollLeft = contentEl.scrollLeft - count * firstWidth;
      } else if (direction === "next") {
        contentEl.scrollLeft = contentEl.scrollLeft + count * firstWidth;
      }
      this.showbtn();
    },
    // 是否显示左右按钮
    showbtn() {
      this.$nextTick(() => {
        setTimeout(() => {
          // 做判断 是否显示左右箭头
          const contentEl = this.$refs.itemBox;
          const itemsEl = this.$refs.item;
          if (!itemsEl) {
            return;
          }
          const allWidth = parseInt(window.getComputedStyle(contentEl).width);
          let allItemWidth = 0;
          itemsEl.forEach(item => {
            allItemWidth += parseInt(window.getComputedStyle(item).width);
          });
          // 如果是有滚动条的情况下
          if (allItemWidth >= allWidth) {
            this.showBtn = true;
            if (contentEl.scrollLeft > 0) {
              this.prevActive = true;
            } else {
              this.prevActive = false;
            }
            if (allWidth + contentEl.scrollLeft >= allItemWidth) {
              this.nextActive = false;
            } else {
              this.nextActive = true;
            }
          } else {
            this.showBtn = false;
            this.prevActive = false;
            this.nextActive = false;
          }
        }, 20);
      });
    },
    // 标志位
    isFlag() {
      if (this.flag) {
        this.flag = false;
        setTimeout(() => {
          this.flag = true;
        }, 20);
        return true;
      }
      return false;
    },
    itemClick(index) {
      if (this.typeIndex === index) {
        return;
      }
      // this.isLoading = true;
      this.SetTypeIndex(index);
      this.$emit("click", index);
      this.isLoading = false;
    },
    del(index) {
      if (this.treeCheckedList[index].allCheckData) {
        this.treeCheckedList[index].allCheckData = null;
      }
      var data = JSON.parse(JSON.stringify(this.treeCheckedList[index]));
      // data.refresh = true
      // data.noAddMapPoint = true
      data.checked = false;
      this.$emit("del", data);
    },
    // 设置当前页签的数据
    getCurrentData() {
      const dData = this.treeCheckedList[this.typeIndex];
      this.SetCurrentOnePoint(dData);
    },
    ...mapActions("map", [
      "DeleteTreeCheckedList",
      "SetTypeIndex",
      "SetCurrentOnePoint"
    ])
  },
  watch: {
    treeCheckedList() {
      if (this.isFlag()) {
        this.getCurrentData();
      }
      this.showbtn();
    },
    typeIndex() {
      if (this.isFlag()) {
        this.getCurrentData();
      }
    },
    collapse1() {
      setTimeout(() => {
        this.showbtn();
      }, 300);
    },
    collapse2() {
      setTimeout(() => {
        this.showbtn();
      }, 300);
    },
    resize() {
      this.showbtn();
    }
  },
  components: {
    Loading
  }
};
</script>

<style scoped lang="less">
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.prev {
  width: 0.26rem;
  height: 0.26rem;
  line-height: 0.26rem;
  position: absolute;
  top: 50%;
  left: 0.05rem;
  transform: translate(0, -50%);
  border-radius: 50%;
  text-align: center;
  .bg-image("images/prev");
  opacity: 0.3;
  &.active {
    cursor: pointer;
    .bg-image("images/prev-active");
    opacity: 1;
  }
}
.next {
  width: 0.26rem;
  height: 0.26rem;
  line-height: 0.26rem;
  position: absolute;
  top: 50%;
  right: 0.05rem;
  transform: translate(0, -50%);
  border-radius: 50%;
  text-align: center;
  .bg-image("images/next");
  opacity: 0.3;
  &.active {
    cursor: pointer;
    .bg-image("images/next-active");
    opacity: 1;
  }
}
.wrapper-tabs {
  transition: left 0.3s linear, right 0.3s linear;
  position: absolute;
  bottom: 0.05rem;
  left: 4.1rem;
  right: 5.94rem;
  z-index: 2;
  padding: 0 0.4rem;
  &.collapse1 {
    left: 0.14rem;
  }
  &.collapse2 {
    right: 2.04rem;
  }
  &.splitScreen {
    right: calc(50% + 2.04rem);
  }
  /*&.legendHide {
      right: 4.1rem;
    }
    &.collapse2 {
      right: 2.04rem;
      &.legendHide {
        right: 0.54rem;
      }
    }
    */
  .tabs {
    height: 0.38rem;
    overflow: hidden;
    .tabs-content {
      height: 0.6rem;
      // white-space: nowrap;
      overflow-y: hidden;
      font-size: 0;
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      .tab-box {
        display: inline-block;
        padding-left: 0.07rem;
        height: 0.38rem;
        cursor: pointer;
        &:first-child {
          padding-left: 0;
        }
        &.active {
          .tab {
            background: #0fc1ff;
            .bg-image("./images/bg-active");
          }
        }
        .tab {
          width: 1.04rem;
          height: 0.38rem;
          line-height: 0.38rem;
          text-align: center;
          background: #274369;
          &:hover {
            // height: 0.5rem;
            box-shadow: rgb(0, 204, 255) 0px 0px 18px inset;
          }
          .bg-image("./images/bg");
          padding: 0 0.3rem 0 0.1rem;
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
              .bg-image("images/btn_delete");
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
</style>
