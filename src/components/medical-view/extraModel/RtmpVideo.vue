<!--
 * @Author: eds
 * @Date: 2020-08-12 15:17:46
 * @LastEditTime: 2020-08-20 19:25:26
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\extraModel\RtmpVideo.vue
-->
<template>
  <div class="rtmpVideo">
    <div class="rtmpListFrame" v-if="doRtmpListFrame"></div>
    <div class="rtmpVideoFrame" v-if="RtmpVideoURL">
      <iframe />
    </div>
  </div>
</template>

<script>
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      doRtmpListFrame: false,
      RtmpVideoURL: undefined,
      //  cesium Object
      viewer: undefined,
    };
  },
  computed: {
    ...mapGetters("map", ["rtmpList"]),
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {},
  methods: {
    ...mapActions("map", ["SetRtmpList"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-rtmpFetch");
      this.$bus.$on("cesium-3d-rtmpFetch", ({ value }) => {
        //  code fetch rtmpURLs
      });
    },
  },
};
</script>

<style>
</style>
