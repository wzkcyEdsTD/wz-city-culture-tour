<template>
  <div class="videoDemoPlayer">
    <div :id="id" class="frequency-pic type1" />
  </div>
</template>
<script>
import { getRtmpVideoURL } from "api/cityBrainAPI";
const Aliplayer = window.Aliplayer;
export default {
  name: "Rtsp1",
  data() {
    return {
      id: "Rtsp1",
      video: undefined,
      videoTimer: undefined,
    };
  },
  beforeDestroy() {
    this.video && this.video.dispose();
    this.video && (this.video = undefined);
    window.earth.entities.removeById(this.id);
    clearInterval(this.videoTimer);
  },
  async mounted() {
    const { data } = await getRtmpVideoURL("122213000100000131003310");
    this.initRtmp(data);
  },
  methods: {
    initRtmp({ flv }) {
      this.video = undefined;
      this.video = new Aliplayer(
        {
          id: this.id,
          source: flv,
          width: "100%",
          height: "100%",
          autoplay: true,
          controlBarVisibility: "hover",
          useFlashPrism: false,
          useH5Prism: true,
        },
        (player) => {
          console.log("Rtsp1播放器创建");
          player.mute();
          player.play();
          this.initVideoToMap();
          this.videoTimer = setInterval(() => {
            if (this.video) {
              player && player.play();
            } else {
              clearInterval(this.videoTimer);
            }
          }, 1 * 60 * 1000);
        }
      );
    },
    initVideoToMap() {
      window.earth.entities.add({
        id: this.id,
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray([
              120.698893798466,
              28.001919490126,
              120.698012161289,
              28.0018447184291,
              120.697656034724,
              28.0028060447815,
              120.698349855701,
              28.0030819575945,
            ])
          ),
          height: 5,
          stRotation: 1.2,
          material: document.getElementById(this.id).children[0],
          classificationType: Cesium.ClassificationType.BOTH,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.videoDemoPlayer {
  position: fixed;
  height: 315px;
  width: 523px;
  top: 0px;
  right: 0px;
  z-index: 30;
  visibility: hidden;
}
</style>