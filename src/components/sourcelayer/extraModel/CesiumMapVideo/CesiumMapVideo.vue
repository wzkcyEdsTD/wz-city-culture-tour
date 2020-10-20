<template>
  <div class="rtspVideo">
    <Rtsp1 />
    <Rtsp2 />
  </div>
</template>

<script>
import Rtsp1 from "./Rtsp1";
import Rtsp2 from "./Rtsp2";
export default {
  name: "rtspVideo",
  data() {
    return {};
  },
  mounted() {
    this.eventRegsiter();
    this.initRtspVideo();
  },
  components: { Rtsp1, Rtsp2 },
  beforeDestroy() {},
  methods: {
    eventRegsiter() {},
    initRtspVideo() {},
  },
};
</script>

<style lang="less" scoped>
</style>