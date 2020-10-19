<!--
 * @Author: eds
 * @Date: 2020-08-26 15:35:51
 * @LastEditTime: 2020-08-31 15:12:37
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\area\area.vue
-->
<template>
  <div class="area-wrapper">
    <div class="area-item">
      温州市
      <i class="ratio-down"></i>
    </div>
    <div class="area-item">
      鹿城区
      <i class="ratio-down"></i>
    </div>
    <div class="area-item">
      滨江街道
      <i class="ratio-down"></i>
    </div>
  </div>
</template>

<script>
// import { getDate } from 'common/js/util'

export default {
  name: "MHeader",
  data() {
    return {
      date: "",
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.area-wrapper {
  position: absolute;
  top: 0.1rem;
  left: 55px;
  z-index: 200000;
  display: flex;

  .area-item {
    display: block;
    width: 84px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0px;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    margin-right: 20px;
  }

  .area-item::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 15px;
    z-index: -1;
    background-image: linear-gradient(0deg, #2acbfe 0%, transparent 100%);
    transform: skewX(-30deg);
  }

  .ratio-down {
    cursor: pointer;
    position: relative;
    top: -2px;
    left: 3px;
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
}
</style>
