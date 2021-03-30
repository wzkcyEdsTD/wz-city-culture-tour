<template>
  <div class="all-legend">
    <HeatVisualBar v-if="~forceTrueTopicLabels.indexOf('人口密集分析')" />
    <GridVisualBar v-if="~forceTrueTopicLabels.indexOf('人口网格分析')" />
    <ul>
      <li v-for="(val, i) in forceTrueTopicLabels" :key="`s_${i}`" class="source-legend">
        <div v-if="!~filterKey.indexOf(val)">
          <i>{{ val }}</i
          ><img :src="`/static/images/map-ico/${val}.png`" />
        </div>
      </li>
      <li v-for="(val, i) in forceEventTopicLabels" :key="`e_${i}`" class="event-legend">
        <div>
          <i>{{ val }} - 24小时内</i
          ><img :src="`/static/images/map-ico/${val}_today.png`" />
        </div>
      </li>
      <li v-for="(val, i) in forceEventTopicLabels" :key="`ed_${i}`" class="event-legend">
        <div>
          <i>{{ val }} - 24小时前</i><img :src="`/static/images/map-ico/${val}.png`" />
        </div>
      </li>
      <li v-for="(val, i) in forceEventTopicLabels" :key="`eo_${i}`" class="event-legend">
        <div>
          <i>{{ val }} - 已处理</i><img :src="`/static/images/map-ico/${val}_off.png`" />
        </div>
      </li>
    </ul>
    <CarLineSpeedLegend v-if="~forceTrueTopicLabels.indexOf('交通路况分析')" />
    <CarLineCountLegend v-if="~forceTrueTopicLabels.indexOf('交通车辆检测')" />
    <KgLegend v-if="~forceTrueTopicLabels.indexOf('控规信息')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import KgLegend from "./KgLegend";
import HeatVisualBar from "./HeatVisualBar";
import GridVisualBar from "./GridVisualBar";
import CarLineSpeedLegend from "./CarLineSpeedLegend";
import CarLineCountLegend from "./CarLineCountLegend";

export default {
  name: "SourceLegend",
  data() {
    return {
      filterKey: [
        "城市总览",
        "控规信息",
        "交通路况分析",
        "交通车辆检测",
        "人口密集分析",
        "人口网格分析",
      ],
    };
  },
  components: {
    KgLegend,
    HeatVisualBar,
    GridVisualBar,
    CarLineSpeedLegend,
    CarLineCountLegend,
  },
  computed: {
    ...mapGetters("map", ["forceTrueTopicLabels", "forceEventTopicLabels"]),
  },
};
</script>

<style scoped lang="less">
.all-legend {
  position: fixed;
  right: 2vh;
  bottom: 8vh;
  width: 26vh;
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
    padding: 0.6vh 0;
    overflow-y: auto;
    > li {
      > div {
        height: 3.2vh;
        padding: 0.2vh 0;
        box-sizing: border-box;
        width: 100%;
        text-align: right;
        color: white;
        flex: 1;
        margin-right: 1vh;
        font-size: 1.6vh;
        > * {
          display: inline-block;
          vertical-align: middle;
          height: 2.8vh;
        }
        > i {
          line-height: 2.8vh;
          font-style: normal;
        }
      }
    }
  }
}
</style>
