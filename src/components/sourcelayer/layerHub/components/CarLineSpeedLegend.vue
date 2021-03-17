<template>
  <ul class="car-line-speed-legend">
    <li>
      <div>
        <i>阻塞道路</i><img :src="`/static/images/map-ico/道路车辆分析_high.png`" />
      </div>
    </li>
    <li>
      <div>
        <i>拥挤道路</i><img :src="`/static/images/map-ico/道路车辆分析_middle.png`" />
      </div>
    </li>
    <li>
      <div>
        <i>通畅道路</i><img :src="`/static/images/map-ico/道路车辆分析_low.png`" />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "carLineSpeedLegend",
};
</script>

<style lang="less" scoped>
.car-line-speed-legend {
  width: 100%;
  box-sizing: border-box;
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
</style>
