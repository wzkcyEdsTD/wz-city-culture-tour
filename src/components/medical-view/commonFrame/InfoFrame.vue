<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-12 20:35:31
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div>
        <!-- 医院详情框，未写 -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InfoFrame",
  data() {
    return {
      rtmpURL:
        "http://10.36.226.3:8089/video/index.html?url=rtmp://172.20.23.37:1935/service/PuId-ChannelNo=127905000100000001-003569&PlayMethod=0&StreamingType=1&NetType=1&FCode=9",
    };
  },
  computed: {
    ...mapGetters("map", ["isInfoFrame"]),
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    closeBimFrame() {
      // this.SetIsInfoFrame(false);
      this.$parent.isInfoFrame = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>
