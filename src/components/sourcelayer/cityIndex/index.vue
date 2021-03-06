<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2020-09-15 11:04:10
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\cityIndex\index.vue
-->
<template>
  <div class="cityIndex-source">
    <!-- 事件不加入fixForceIndex判断，来回切换保持原先force -->
    <div v-if="forceTime == 'now'">
      <component v-if="isSourceLayer" :is="fixForceIndex" />
      <!-- 拿数据 -->
      <eventIndex v-show="!isSourceLayer" />
    </div>
    <div v-if="forceTime == 'pass'">
      <cityIndexPass />
    </div>
    <scene-switch />
  </div>
</template>

<script>
const indexHash = {
  城市总览: "cityIndex",
  医疗专题: "medicalIndex",
  教育专题: "educationIndex",
  旅游专题: "tourIndex",
  文化专题: "cultureIndex",
  应急专题: "emergencyIndex",
  规划专题: "basicIndex",
  公共专题: "sourceIndex",
  交通专题: "trafficIndex",
  经济专题: "keyIndex",
};
import { mapGetters } from "vuex";
import SceneSwitch from "../commonFrame/SceneSwitch/SceneSwitch";
//  now
import cityIndex from "./now/cityIndex";
import medicalIndex from "./now/medicalIndex";
import educationIndex from "./now/educationIndex";
import tourIndex from "./now/tourIndex";
import cultureIndex from "./now/cultureIndex";
import emergencyIndex from "./now/emergencyIndex";
import basicIndex from "./now/basicIndex";
import sourceIndex from "./now/sourceIndex";
import trafficIndex from "./now/trafficIndex";
import keyIndex from "./now/keyIndex";
import eventIndex from "./now/eventIndex";
//  pass
import cityIndexPass from "./pass/cityIndex";

export default {
  data() {
    return { indexHash };
  },
  computed: {
    ...mapGetters("map", ["forceTime", "forceIndex", "isSourceLayer"]),
    fixForceIndex() {
      return indexHash[this.forceIndex] || "cityIndex";
    },
  },
  watch: {
    forceIndex(n) {
      console.log("[forceIndex]", n);
    },
  },
  components: {
    SceneSwitch,
    cityIndex,
    medicalIndex,
    educationIndex,
    tourIndex,
    cultureIndex,
    emergencyIndex,
    basicIndex,
    sourceIndex,
    trafficIndex,
    keyIndex,
    eventIndex,
    cityIndexPass,
  },
};
</script>

<style lang="less">
@import url(./index.less);
</style>
