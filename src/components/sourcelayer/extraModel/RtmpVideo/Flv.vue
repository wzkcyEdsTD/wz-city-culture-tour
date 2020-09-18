<template>
  <div class="videoPlayer">
    <div v-if="type" id="player-con-1" class="frequency-pic type1" />
    <div v-if="!type" id="player-con-2" class="frequency-pic type2" />
  </div>
</template>
<script>
const Aliplayer = window.Aliplayer;
export default {
  props: ["url", "mode", "type"],
  watch: {
    type: {
      handler(n) {
        this.$nextTick(() => {
          this.initRtmp();
        });
      },
    },
  },
  mounted() {
    this.initRtmp();
  },
  methods: {
    initRtmp() {
      const aliplayer = new Aliplayer(
        {
          id: `player-con-${this.type ? 1 : 2}`,
          source: this.url,
          width: "100%",
          height: "100%",
          autoplay: true,
          isLive: true,
          rePlay: true,
          playsinline: true,
          preload: true,
          skinLayout: false,
          stashInitialSizeForFlv: 30,
          trackLog: false,
          controlBarVisibility: "hover",
          useFlashPrism: !this.type,
          useH5Prism: this.type,
        },
        (player) => console.log(type ? "[h5]" : "[flash]", "播放器创建")
      );
    },
  },
};
</script>
<style lang="less">
.videoPlayer {
  height: 100%;
  width: 100%;
}
</style>
