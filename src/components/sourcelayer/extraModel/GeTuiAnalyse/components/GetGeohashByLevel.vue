<template>
  <div class="get-geohash-by-level">
    <span class="header">粒度分析</span>
    <div class="form-content">
      <el-button
        v-for="(item, index) in level"
        :key="index"
        :disabled="!!!~$props.forceLevels.indexOf(item.key)"
        :class="{ 'form-active': $props.forceLevel == item.key }"
        @click="doDrawGridByForceLevel(item.key)"
        >{{ item.label }}</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "getGeohashByGeometry",
  data() {
    return {
      level: [
        { key: "area", label: "县市区" },
        { key: "street", label: "街镇" },
        { key: "estate", label: "小区" },
        { key: "grid", label: "网格" },
      ],
    };
  },
  props: ["BUS_EVENT_TAG", "isLoading", "forceLevels", "forceLevel"],
  created() {},
  beforeDestroy() {},
  methods: {
    doDrawGridByForceLevel(forceLevel) {
      forceLevel != this.$props.forceLevel &&
        this.$bus.$emit(this.BUS_EVENT_TAG, forceLevel);
    },
  },
};
</script>

<style lang="less" scoped>
.get-geohash-by-level {
  margin-bottom: 1.5vh;
  .header {
    display: block;
    height: 4vh;
    line-height: 4vh;
    font-family: YouSheBiaoTiHei;
    font-size: 3.2vh;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    padding-left: 1.6vh;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0.6vh;
      width: 14vh;
      height: 1.6vh;
      z-index: -1;
      background-image: linear-gradient(90deg, #2acbfe 0%, transparent 100%);
      transform: skewX(-30deg);
    }
  }
}
</style>
