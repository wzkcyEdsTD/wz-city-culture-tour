<!--
 * @Author: eds
 * @Date: 2020-08-06 15:51:22
 * @LastEditTime: 2020-09-15 10:54:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\commonFrame\rtmpVideo.vue
-->
<template>
  <div class="rtmpVideo">
    <i class="close" @click="closeRtmpVideo"></i>
    <iframe
      src="http://10.36.226.3:8089/video/index.html?url=rtmp://172.20.23.37:1935/service/PuId-ChannelNo=127905000100000001-003569&PlayMethod=0&StreamingType=1&NetType=1&FCode=9"
    ></iframe>
  </div>
</template>

<script>
export default {
  methods: {
    closeRtmpVideo() {
      this.$parent.isRtmpVideoOpen = false;
    },
  },
};
</script>

<style lang="less" scoped>
.rtmpVideo {
  position: fixed;
  top: 100px;
  right: 400px;
  width: 400px;
  height: 300px;
  > iframe {
    width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    right: 4px;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image("/static/images/icons/zoom-in.png");
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    z-index: 10;

    &:hover {
      transform: rotate(45deg);
    }
  }
}
</style>
