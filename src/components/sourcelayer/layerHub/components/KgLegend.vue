<template>
  <div class="kg-legend">
    <header>控制性规划</header>
    <div>
      <img src="/static/images/common/kg-legend.png" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.kg-legend {
  position: fixed;
  right: -1vh;
  bottom: 0;
  height: 30vh;
  width: 22vh;
  box-sizing: border-box;
  padding: 0 10px;
  background-image: url(/static/images/common/kg-legend-frame.png);
  background-size: 100% 100%;
  > header {
    height: 4.8vh;
    line-height: 4.8vh;
    font-size: 1.8vh;
    color: #fff;
  }
  > div {
    height: 24vh;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    overflow-y: auto;
    > img {
      width: 100%;
    }
  }
}
</style>