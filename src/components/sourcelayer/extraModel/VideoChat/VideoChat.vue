<template>
  <div class="video-chat" v-show="isOn">
    <span class="header"
      >视频通话
      <i class="video-chat-close" @click="closeVideoChat">x</i>
    </span>
    <div class="link"><i>联系人: -</i><i>联系方式: -</i></div>
    <div class="operation"><span>拨号</span><span>断开</span></div>
    <div class="video-chat-container"></div>
  </div>
</template>

<script>
export default {
  name: "VideoChat",
  data() {
    return { isOn: false };
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {},
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-video-chat-on");
      this.$bus.$on("cesium-3d-video-chat-on", () => {
        this.doVideoChat();
      });
      this.$bus.$off("cesium-3d-video-chat-clear");
      this.$bus.$on("cesium-3d-video-chat-clear", () => {
        this.closeVideoChat();
      });
    },
    doVideoChat() {
      this.isOn = true;
    },
    closeVideoChat() {
      this.isOn = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./VideoChat.less");
</style>
