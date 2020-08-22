<template>
  <div class="videoPlayer">
    <div id="player-con" class="frequency-pic"></div>
  </div>
</template>
<script>
export default {
  props: ["url"],
  mounted() {
    const aliplayer = new Aliplayer(
      {
        id: "player-con",
        source: this.url,
        width: "100%",
        height: "100%",
        autoplay: true,
        isLive: false,
        rePlay: true,
        playsinline: true,
        preload: true,
        language: "zh-cn",
        controlBarVisibility: "hover",
        useH5Prism: true,
      },
      function (player) {
        console.log("播放器创建了。");
      }
    );
    aliplayer.autoplay = true;
    var whereYouAt = parseFloat(aliplayer.getCurrentTime()) + 1;
    var totalTime = parseFloat(aliplayer.getDuration());
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
