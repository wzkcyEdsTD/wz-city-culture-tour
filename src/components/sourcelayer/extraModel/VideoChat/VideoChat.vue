<template>
  <div class="video-chat" v-show="isOn">
    <span class="header"
      >视频通话
      <i class="video-chat-close" @click="closeVideoChat">x</i>
    </span>
    <div class="video-chat-container">
      <div><span></span><span></span></div>
    </div>
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
