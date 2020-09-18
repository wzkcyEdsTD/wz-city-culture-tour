<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2020-09-15 11:04:10
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\cityIndex\index.vue
-->
<template>
  <div class="cityIndex">
    <component :is="fixForceIndex" />
    <scene-switch />
  </div>
</template>

<script>
const indexHash = {
  城市总览: "cityIndex",
  医疗专题: "medicalIndex",
  旅游专题: "tourIndex",
  文化专题: "cultureIndex",
  应急专题: "emergencyIndex",
  基础设施: "basicIndex",
  资源专题: "sourceIndex",
  交通专题: "trafficIndex",
};
import { mapGetters } from "vuex";
import SceneSwitch from "../commonFrame/SceneSwitch/SceneSwitch";
//  components
import cityIndex from "./cityIndex";
import medicalIndex from "./medicalIndex";
import tourIndex from "./tourIndex";
import cultureIndex from "./cultureIndex";
import emergencyIndex from "./emergencyIndex";
import basicIndex from "./basicIndex";
import sourceIndex from "./sourceIndex";
import trafficIndex from "./trafficIndex";
export default {
  data() {
    return { indexHash };
  },
  computed: {
    ...mapGetters("map", ["forceIndex"]),
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
    cityIndex,
    medicalIndex,
    tourIndex,
    cultureIndex,
    emergencyIndex,
    basicIndex,
    sourceIndex,
    trafficIndex,
  },
};
</script>

<style lang="less">
@import url(./index.less);
</style>
