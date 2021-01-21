<template>
  <div class="videoDemoPlayer">
    <div :id="`video_grid_${index}`" class="frequency-pic type1" />
  </div>
</template>
<script>
import { getRtmpVideoURL } from "api/cityBrainAPI";
const Aliplayer = window.Aliplayer;
export default {
  name: "Rtsp1",
  data() {
    return {
      video: undefined,
      videoTimer: undefined,
    };
  },
  props: ["mp_id", "index"],
  beforeDestroy() {
    this.video && this.video.dispose();
    this.video && (this.video = undefined);
    clearInterval(this.videoTimer);
  },
  mounted() {
    setTimeout(() => {
      this.getVideoURL();
    }, this.index * 2000);
  },
  methods: {
    async getVideoURL() {
      const { data } = await getRtmpVideoURL(this.mp_id);
      console.log(this.mp_id, data);
      data && this.initRtmp(data);
    },
    initRtmp({ flv }) {
      this.video = undefined;
      this.video = new Aliplayer(
        {
          id: `video_grid_${this.index}`,
          source: flv,
          width: "100%",
          height: "100%",
          autoplay: true,
          controlBarVisibility: "hover",
          useFlashPrism: false,
          useH5Prism: true,
        },
        (player) => {
          console.log(this.mp_id, "播放器创建");
          player.mute();
          player.play();
          this.videoTimer = setInterval(() => {
            if (this.video) {
              player && player.play();
            } else {
              clearInterval(this.videoTimer);
            }
          }, 10 * 1000);
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.videoDemoPlayer {
  flex: 1;
  margin-top: 1vh;
  overflow: hidden;
  border-radius: 1vh;
}
</style>
