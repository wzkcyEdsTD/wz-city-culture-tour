<template>
  <div class="area-wrapper">
    <div class="area-item" style="padding-left:20px">温州市<i class="ratio-down"></i></div>
    <div class="area-item" style="padding-left:20px">鹿城区<i class="ratio-down"></i></div>
    <div class="area-item">滨江街道<i class="ratio-down"></i></div>
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
  top: 0.3rem;
  left: 50px;
  z-index: 200000;
  display: flex;
    
  .area-item {
    display: block;
    height: 30px;
    line-height: 30px;
    font-family: PingFang;
    font-size: 14px;
    letter-spacing: 0px;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    margin-right: 30px;
    padding-left: 15px;
  }

  .area-item::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 5px;
    width: 80px;
    height: 15px;
    z-index: -1;
    background-image: linear-gradient(0deg, #0addca 0%, transparent 100%);
    transform: skewX(-30deg);
  }

  .ratio-down {
    position: relative;
    top: -2px;
    left: 2px;
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
}
</style>
