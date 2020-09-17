<!--
 * @Author: eds
 * @Date: 2020-08-26 15:35:52
 * @LastEditTime: 2020-09-15 10:42:06
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\roulette\roulette.vue
-->
<template>
  <div class="roulette-wrapper">
    <div class="forceImg" @click="this.changeOverview">
      <img :src="`/static/images/common/roulette-${selectedValue}@2x.png`" />
    </div>
  </div>
</template>

<script>
export default {
  name: "roulette",
  data() {
    return {
      shallOverview: true,
    };
  },
  computed: {
    selectedValue() {
      return this.shallOverview ? "overview" : "source";
    },
  },
  methods: {
    changeOverview() {
      this.shallOverview = !this.shallOverview;
      this.$parent.isOverview = !this.$parent.isOverview;
    },
  },
};
</script>

<style scoped lang="less">
.roulette-wrapper {
  position: absolute;
  top: 0vh;
  right: 0vh;
  height: 6.6vw;
  z-index: 9;
  cursor: pointer;
  > div {
    height: 100%;
  }
  > .forceImg {
    > img {
      height: 100%;
    }
  }
}
</style>
