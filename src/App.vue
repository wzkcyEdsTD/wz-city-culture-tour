<template>
  <div id="app">
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    // 监听父窗口事件
    window.addEventListener(
      "message",
      (e) => {
        let data = e.data;
        if (!data.layer) return;
        console.log("message", e);
        window._POST_MESSAGE_ = data.layer;
        this.$bus.$emit("source-message");
      },
      false
    );
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less">
@import "common/css/reset";
@import "common/css/rem";
@import "common/css/app";
@import "./font/font.css";
</style>
