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
      <img :src="todayImg" />
    </div>
    <div class="forceBtn">
      <div
        v-for="(item,index) in ['history','today','future']"
        :key="index"
        @click="turnAround(item)"
      />
    </div>
  </div>
</template>

<script>
const rouletteIndex = {
  history: "left",
  today: "center",
  future: "right",
};
export default {
  name: "roulette",
  data() {
    return {
      selectedValue: "today",
      todayImg: require("./images/roulette@2x.png"),
    };
  },
  methods: {
    turnAround(index) {},
  },
};
</script>

<style scoped lang="less">
.roulette-wrapper {
  position: absolute;
  top: -7vh;
  right: 0vh;
  height: 11vw;
  z-index: 1;
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
