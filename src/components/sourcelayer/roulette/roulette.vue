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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "roulette",
  data() {
    return {
      shallOverview: true,
      lastIndex: "旅游专题",
    };
  },
  computed: {
    ...mapGetters("map", ["forceIndex"]),
    selectedValue() {
      return this.shallOverview ? "overview" : "source";
    },
  },
  methods: {
    ...mapActions("map", ["SetForceIndex"]),
    changeOverview() {
      const toValue = !this.shallOverview;
      this.shallOverview = toValue;
      this.$parent.isOverview = !this.$parent.isOverview;
      //  切换城市 记住上一次选项
      if (toValue) {
        this.lastIndex = this.forceIndex;
        this.SetForceIndex("城市总览");
      } else {
        this.SetForceIndex(this.lastIndex);
      }
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
