<template>
  <div class="videoPlayer">
    <div v-if="type" id="player-con-1" class="frequency-pic type1" />
    <div v-if="!type" id="player-con-2" class="frequency-pic type2" />
  </div>
</template>
<script>
const Aliplayer = window.Aliplayer;
export default {
  data() {
    return {
      video: undefined,
    };
  },
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
  beforeDestroy() {
    this.video.dispose();
    this.video = undefined;
  },
  mounted() {
    this.initRtmp();
  },
  methods: {
    initRtmp() {
      this.video = undefined;
      this.video = new Aliplayer(
        {
          id: `player-con-${this.type ? 1 : 2}`,
          source: this.url,
          width: "100%",
          height: "100%",
          autoplay: true,
          controlBarVisibility: "hover",
          useFlashPrism: !this.type || false,
          useH5Prism: this.type || true,
        },
        (player) => {
          console.log(this.type ? "[h5]" : "[flash]", "播放器创建");
          player.mute();
          player.play();
        }
      );
    },
  },
};
</script>
<style lang="less">
.videoPlayer {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style>
