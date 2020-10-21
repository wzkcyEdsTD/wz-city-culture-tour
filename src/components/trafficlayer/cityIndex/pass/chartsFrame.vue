<template>
  <div class="chartframe">
    <ul>
      <li v-for="(item, index) in charts" :key="index">
        <header>{{ item }}<i> / 2010-2019年</i></header>
        <ChartCore
          :chartId="`chart-${index}`"
          :option="$data._CHART_CONFIG_[item]"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import ChartCore from "components/sourcelayer/commonFrame/ChartCore/ChartCore.vue";
import {
  gdpOption,
  populationOption,
  threeIndustriesOption,
  revenuesOption,
} from "./chartsConfig";
const _CHART_CONFIG_ = {
  温州GDP: gdpOption,
  常驻人口: populationOption,
  三产增加值: threeIndustriesOption,
  一般公共预算收入: revenuesOption,
};
export default {
  name: "chartframe",
  data() {
    return {
      _CHART_CONFIG_,
      charts: ["温州GDP", "常驻人口", "三产增加值", "一般公共预算收入"],
    };
  },
  components: { ChartCore },
};
</script>

<style lang="less" scoped>
.chartframe {
  position: fixed;
  top: 12vh;
  bottom: 0vh;
  overflow: hidden;
  right: 1vw;
  width: 36vh;
  color: white;
  box-sizing: border-box;
  padding: 10px;
  z-index: 2;
  > ul {
    height: 100%;
    > li {
      height: 24.9%;
      display: flex;
      flex-direction: column;
      > header {
        display: block;
        height: 3.4vh;
        line-height: 3.4vh;
        font-family: YouSheBiaoTiHei;
        font-size: 2.8vh;
        letter-spacing: 0px;
        color: #ffffff;
        text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
        position: relative;
        margin-bottom: 10px;
        padding-left: 15px;
        > i {
          font-style: normal;
          font-size: 1.2vh;
        }
        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0.6vh;
          width: 14vh;
          height: 1.6vh;
          z-index: -1;
          background-image: linear-gradient(
            90deg,
            #2acbfe 0%,
            transparent 100%
          );
          transform: skewX(-30deg);
        }
      }
    }
  }
}
</style>