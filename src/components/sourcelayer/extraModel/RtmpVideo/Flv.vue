<template>
  <div class="videoPlayer">
    <div id="player-con" class="frequency-pic"></div>
  </div>
</template>
<script>
const Aliplayer = window.Aliplayer;
export default {
  props: ["url", "mode"],
  mounted() {
    const aliplayer = new Aliplayer(
      {
        id: "player-con",
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
        // controlBarVisibility: "hover",
        // useH5Prism: this.mode === "h5",
        // useFlashPrism: this.mode === "flash",
        useH5Prism: true,
      },
      function (player) {
        console.log("播放器创建了。");
      }
    );
  },
  methods: {},
};
</script>
<style lang="less">
.videoPlayer {
  height: 100%;
  width: 100%;
}
</style>
