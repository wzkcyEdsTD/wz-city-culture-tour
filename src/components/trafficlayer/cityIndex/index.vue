<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2020-09-15 11:04:10
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\trafficlayer\cityIndex\index.vue
-->
<template>
  <div class="cityIndex-traffic">
    <div v-if="forceTime == 'now'">
      <component :is="fixForceIndex" />
    </div>
    <scene-switch />
  </div>
</template>

<script>
const indexHash = {
  交通专题: "trafficIndex",
};
import { mapGetters } from "vuex";
import SceneSwitch from "../commonFrame/SceneSwitch/SceneSwitch";
//  now
import trafficIndex from "./now/trafficIndex";

export default {
  data() {
    return { indexHash };
  },
  computed: {
    ...mapGetters("traffic", ["forceTime", "forceIndex"]),
    fixForceIndex() {
      return indexHash[this.forceIndex] || "cityIndex";
    },
  },
  watch: {
    forceIndex(n) {
      console.log(n);
    },
  },
  components: {
    SceneSwitch,
    trafficIndex,
  },
};
</script>

<style lang="less">
@import url(./index.less);
</style>
