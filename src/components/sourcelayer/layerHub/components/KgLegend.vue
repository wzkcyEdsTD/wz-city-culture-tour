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
  right: 0;
  bottom: 0;
  height: 292px;
  width: 216px;
  box-sizing: border-box;
  padding: 0 10px;
  background-image: url(/static/images/common/kg-legend-frame.png);
  background-size: 100% 100%;
  > header {
    height: 48px;
    line-height: 48px;
    font-size: 1.1em;
    color: #fff;
  }
  > div {
    height: 240px;
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