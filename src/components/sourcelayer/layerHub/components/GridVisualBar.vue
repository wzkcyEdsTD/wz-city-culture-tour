<template>
  <div class="grid-visual-legend">
    <div class="grid-visual-bar">
      <div class="grid-visual-tag">
        <p>密集</p>
        <p>稀疏</p>
      </div>
      <div class="grid-visual-map" />
    </div>
    <!-- <ul class="car-line-speed-legend">
      <li>
        <div>
          <i>阻塞道路</i
          ><img :src="`/static/images/map-ico/道路车辆分析_high.png`" />
        </div>
      </li>
      <li>
        <div>
          <i>拥挤道路</i
          ><img :src="`/static/images/map-ico/道路车辆分析_middle.png`" />
        </div>
      </li>
      <li>
        <div>
          <i>通畅道路</i
          ><img :src="`/static/images/map-ico/道路车辆分析_low.png`" />
        </div>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  name: "gridVisualBar",
};
</script>

<style lang="less" scoped>
.grid-visual-legend {
  width: 10vh;
  float: right;
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
  .grid-visual-bar {
    width: 100%;
    height: 14vh;
    display: flex;
    margin-bottom: 1vh;
    > .grid-visual-map {
      height: 100%;
      width: 2vh;
      border-radius: 1vh;
      background: linear-gradient(
        to top,
        rgb(77, 104, 239) 0%,
        rgb(77, 141, 255) 10%,
        rgb(98, 180, 250) 20%,
        rgb(145, 200, 203) 30%,
        rgb(203, 217, 141) 40%,
        rgb(246, 221, 91) 50%,
        rgb(253, 203, 70) 60%,
        rgb(253, 170, 65) 70%,
        rgb(253, 133, 60) 80%,
        rgb(242, 79, 32) 90%,
        rgb(211, 25, 0) 100%
      );
    }
    > .grid-visual-tag {
      color: white;
      font-size: 1.5vh;
      margin-left: 0.8vh;
      position: relative;
      flex: 1;
      overflow: hidden;
      > p {
        position: absolute;
        right: 1vh;
        font-family: DIN !important;
        &:first-child {
          top: 0;
        }
        &:last-child {
          bottom: 0;
        }
      }
    }
  }
}
</style>
