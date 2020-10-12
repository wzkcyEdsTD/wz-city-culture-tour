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
    <div class="forceImg">
      <img :src="`/static/images/roulette/${forceTime}.png`" />
    </div>
    <div class="roulette-btns">
      <div @click.prevent="changeOverview(1)" />
      <div />
      <div @click.prevent="changeOverview(3)" />
    </div>
    <div class="roulette-bg">
      <div class="future-bg" v-show="forceTime == 'future'"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "roulette",
  computed: {
    ...mapGetters("map", ["forceTime"]),
  },
  methods: {
    ...mapActions("map", ["SetForceTime", "SetForceTreeLabel"]),
    changeOverview(index) {
      const value =
        this.forceTime == "now"
          ? index == 1
            ? "future"
            : "pass"
          : this.forceTime == (index == 1 ? "future" : "pass")
          ? index == 1
            ? "pass"
            : "future"
          : "now";
      this.SetForceTreeLabel("城市总览");
      setTimeout(() => {
        this.SetForceTime(value);
      }, 500);
    },
  },
};
</script>

<style scoped lang="less">
.roulette-wrapper {
  > div {
    height: 100%;
  }
  > .roulette-bg {
    height: 0;
    width: 0;
    .future-bg {
      background-image: url("/static/images/roulette/future-bg.png");
    }
    .pass-bg {
      background-image: url("/static/images/roulette/pass-bg.png");
    }
    > div {
      background-size: 100% 100%;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 8;
    }
  }
  > .roulette-btns {
    position: absolute;
    top: 0;
    right: 0;
    width: 28vh;
    height: 13vh;
    z-index: 9;
    > div {
      width: 32%;
      height: 100%;
      display: inline-block;
      cursor: pointer;
    }
  }
  > .forceImg {
    position: absolute;
    top: 0px;
    right: 0px;
    width: auto;
    height: 13vh;
    z-index: 9;
    > img {
      height: 100%;
    }
  }
}
</style>
