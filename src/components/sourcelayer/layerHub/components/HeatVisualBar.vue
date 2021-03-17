<template>
  <div class="heat-visual-bar">
    <div class="heat-visual-map" />
    <div class="heat-visual-tag">
      <p>2000 人</p>
      <p>0 人</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "heatVisualBar",
};
</script>

<style lang="less" scoped>
.heat-visual-bar {
  height: 14vh;
  width: 8vh;
  float: right;
  display: flex;
  margin-bottom: 1vh;
  > .heat-visual-map {
    height: 100%;
    width: 2vh;
    border-radius: 1vh;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0) 0%,
      rgb(0, 0, 255) 25%,
      rgb(0, 255, 0) 55%,
      yellow 85%,
      red 100%
    );
  }
  > .heat-visual-tag {
    color: white;
    font-size: 1.5vh;
    margin-left: 0.8vh;
    position: relative;
    flex: 1;
    overflow: hidden;
    > p {
      position: absolute;
      left: 0;
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
</style>
