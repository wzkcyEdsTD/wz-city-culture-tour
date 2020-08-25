<template>
  <div class="bottom-wrapper">
    <div class="bottom-select-container">
      <ul class="list">
        <li class="item">教育体征</li>
        <li class="item">交通体征</li>
        <li class="item">经济运行</li>
        <li class="item">城市体征</li>
        <li class="item active">医疗体征</li>
        <li class="item">文化旅游</li>
        <li class="item">资源体征</li>
      </ul>
    </div>
    <div class="bottom-bg"></div>
  </div>
</template>

<script>
// import { getDate } from 'common/js/util'

export default {
  name: "MHeader",
  data() {
    return {
      date: "",
    };
  },
  mounted() {
    // this.date = getDate()
    // setInterval(() => {
    //   this.date = getDate()
    // }, 1000)
  },
  methods: {},
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    },
  },
};
</script>

<style scoped lang="less">
.bottom-wrapper {
  z-index: 999;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  .bottom-select-container {
    height: 0.25rem;
    .list {
      display: flex;
      justify-content: center;
      .item {
        .bg-image("./images/unselected");
        margin: 0 0.06rem;
        padding: 5px 0;
        width: 0.8rem;
        height: 0.25rem;
        text-align: center;
        font-size: 14px;
        color: #ccc;
        opacity: 0.7;
        &.active {
          .bg-image("./images/selected");
          width: 1rem;
          height: 0.35rem;
          color: #fff;
          opacity: 1;
        }
      }
    }
  }
  .bottom-bg {
    width: 100%;
    height: 0.2rem;
    .bg-image("./images/bottom");
  }
}
</style>
