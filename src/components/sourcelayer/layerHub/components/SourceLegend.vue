<template>
  <div class="source-legend">
    <ul>
      <li v-for="(val, i) in forceTrueTopicLabels" :key="i" v-show="val != '城市总览'">
        <img :src="`/static/images/map-ico/${val}.png`" /> <span>{{ val }}</span>
      </li>
    </ul>
    <KgLegend v-if="~forceTrueTopicLabels.indexOf('控规信息')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import KgLegend from "./KgLegend";
export default {
  name: "SourceLegend",
  components: { KgLegend },
  computed: {
    ...mapGetters("map", ["forceTrueTopicLabels"]),
  },
};
</script>

<style scoped lang="less">
.source-legend {
  position: fixed;
  right: 2vh;
  bottom: 8vh;
  width: 22vh;
  box-sizing: border-box;
  padding: 0 10px;
  > header {
    height: 4.8vh;
    line-height: 4.8vh;
    font-size: 1.8vh;
    color: #fff;
  }
  > ul {
    max-height: 24vh;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    overflow-y: auto;
    > li {
      height: 3.2vh;
      padding: 0.2vh 0;
      display: flex;
      > * {
        display: inline-block;
        vertical-align: middle;
        height: 2.8vh;
        line-height: 2.8vh;
      }
      > span {
        color: white;
        flex: 1;
      }
    }
  }
}
</style>
