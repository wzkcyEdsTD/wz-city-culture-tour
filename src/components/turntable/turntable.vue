<template>
  <div class="turntable-wrapper">
    <div class="history" v-show="selectedValue == 'history'" @click="selectedValue='today'">
      <img
        src="./images/history.png"
        border="0" usemap="#planetmap"
        alt="Planets" />
    </div>
    <div class="today" v-show="selectedValue == 'today'" @click="selectedValue='future'">
      <img
        src="./images/today.png"
        border="0" usemap="#planetmap"
        alt="Planets" />
    </div>
    <div class="future" v-show="selectedValue == 'future'" @click="selectedValue='history'">
      <img
        src="./images/future.png"
        border="0" usemap="#planetmap"
        alt="Planets" />
    </div>
  </div>
</template>

<script>

export default {
  name: "MHeader",
  data() {
    return {
      date: "",
      selectedValue: "today"
    };
  },
  mounted() {
  },
  methods: {},
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    },
  },
};
</script>

<style scoped lang="less">
.turntable-wrapper {
  position: absolute;
  top: 0.8rem;
  right: 0.5rem;
  z-index: 999;
  img {
    height: 1rem;
  }
}
</style>
