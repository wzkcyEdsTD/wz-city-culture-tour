<template>
  <div class="wrapper flex flex-y" :class="bg+' '+region+' '+isCollapse">
    <div class="btn" @click="changeCollapse">
      <i :class="btnisCollapse"></i>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MapBox",
  props: {
    // 渲染方位
    region: {
      type: String,
      default: ""
    },
    // 背景图
    bg: {
      type: String,
      default: ""
    },
    // 是否折叠
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnisCollapse: "" // 按钮是否折叠
    };
  },
  computed: {
    // 是否折叠
    isCollapse() {
      return this.collapse ? "collapse" : "";
    }
  },
  mounted() {
    this.initBtnCollapse();
    this.$bus.on("close_rightWrapper", val => {
      this.$emit("changeCollapse", true);
    });
    this.$bus.on("close_splitScreen", val => {
      this.$emit("changeCollapse", true);
    });
  },
  methods: {
    // 初始化按钮是否折叠
    initBtnCollapse() {
      this.btnisCollapse = this.collapse ? "collapse" : "";
    },
    changeCollapse() {
      this.$emit("changeCollapse", !this.collapse);
    }
  },
  watch: {
    collapse() {
      setTimeout(() => {
        this.initBtnCollapse();
      }, 300);
    }
  }
};
</script>

<style scoped lang="less">
.wrapper {
  position: absolute;
  padding: @font-size-medium;
  transition: left 0.3s linear, right 0.3s linear;
  background: rgba(3, 67, 106, 0.9);
  width: 3.8rem;
  top: 60px;
  bottom: 10px;
  .btn {
    .bg-image("images/collapse");
    width: 0.15rem;
    height: 1rem;
    margin-top: -0.75rem;
    position: absolute;
    top: 50%;
    text-align: center;
    cursor: pointer;
  }
  &.west {
    left: @font-size-medium;
    .btn {
      right: -0.15rem;
    }
    &.collapse {
      left: -3.8rem;
    }
    /*&:after {
        content: '';
        display: block;
        width: 3.8rem;
        height: 0.04rem;
        position: absolute;
        right: 0.04rem;
        bottom: 0;
        .bg-image('images/line');
        transform-origin: right bottom;
        transform: rotate(90deg);
      }*/
  }
  &.east {
    right: @font-size-medium;
    .btn {
      left: -0.15rem;
      transform: rotate(180deg);
    }
    &.collapse {
      right: -3.8rem;
    }
    /*&:after {
        content: '';
        display: block;
        width: 3.8rem;
        height: 0.04rem;
        position: absolute;
        left: 0.04rem;
        bottom: 0;
        .bg-image('images/line');
        transform-origin: left bottom;
        transform: rotate(-90deg);
      }*/
  }
  /*&:before {
       content: '';
       display: block;
       width: 3.8rem;
       height: 0.04rem;
       position: absolute;
       right: 0;
       bottom: 0;
       .bg-image('images/line');
     }*/
}
</style>
