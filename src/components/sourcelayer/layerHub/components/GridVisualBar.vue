<template>
  <div class="grid-visual-bar">
    <div class="grid-visual-map" />
    <div class="grid-visual-tag">
      <p>8000 人</p>
      <p>0 人</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "gridVisualBar",
};
</script>

<style lang="less" scoped>
.grid-visual-bar {
  height: 14vh;
  width: 8vh;
  float: right;
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
