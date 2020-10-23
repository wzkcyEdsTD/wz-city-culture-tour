
<template>
  <div class="videoDemoPlayer">
    <div :id="id" class="frequency-pic type1" />
  </div>
</template>
<script>
import { getRtmpVideoURL } from "api/cityBrainAPI";
const Aliplayer = window.Aliplayer;
export default {
  name: "Rtsp2",
  data() {
    return {
      id: "Rtsp2",
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
    const { data } = await getRtmpVideoURL("122213000100000599000199");
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
          console.log("Rtsp2播放器创建");
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
              120.665339088154,
              28.0112313409688,
              120.664863489796,
              28.010710592295,
              120.665451673662,
              28.0099911617623,
              120.665961931677,
              28.0109347497287,
            ])
          ),
          height: 5,
          stRotation: 2.15,
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
  right: 100px;
  z-index: 30;
  visibility: hidden;
}
</style>