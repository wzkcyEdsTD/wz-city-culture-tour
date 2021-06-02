<template>
  <div class="grid-visual-legend">
    <div class="grid-visual-bar">
      <div class="grid-visual-tag">
        <p>密集</p>
        <p>稀疏</p>
      </div>
      <div class="grid-visual-map" />
    </div>
    <ul class="car-line-speed-legend">
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
    </ul>
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
        rgb(27, 29, 41) 0%,
        rgb(0, 73, 135) 10%,
        rgb(26, 116, 192) 20%,
        rgb(139, 185, 227) 30%,
        rgb(220, 238, 255) 40%,
        rgb(255, 255, 255) 50%,
        rgb(232, 232, 189) 60%,
        rgb(243, 208, 139) 70%,
        rgb(249, 172, 98) 80%,
        rgb(229, 80, 56) 90%,
        rgb(166, 0, 21) 100%
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
