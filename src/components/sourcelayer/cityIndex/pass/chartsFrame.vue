<template>
  <div class="chartframe">
    <ul>
      <li v-for="(item, index) in charts" :key="index">
        <header>{{ item }}<i> / 2010-2019年</i></header>
        <ChartCore :chartId="`chart-${index}`" />
      </li>
    </ul>
  </div>
</template>

<script>
import ChartCore from "components/sourcelayer/commonFrame/ChartCore/ChartCore.vue";
export default {
  name: "chartframe",
  data() {
    return {
      charts: ["温州GDP", "常驻人口", "三产增加值", "一般公共预算收入"],
    };
  },
  components: { ChartCore },
};
</script>

<style lang="less" scoped>
.chartframe {
  position: fixed;
  top: 15vh;
  bottom: 40px;
  overflow: hidden;
  right: 20px;
  width: 320px;
  height: 700px;
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
        height: 35px;
        line-height: 35px;
        font-family: YouSheBiaoTiHei;
        font-size: 24px;
        letter-spacing: 0px;
        color: #ffffff;
        text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
        position: relative;
        margin-bottom: 3vh;
        padding-left: 15px;
        > i {
          font-style: normal;
          font-size: 12px;
        }
        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 5px;
          width: 150px;
          height: 15px;
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