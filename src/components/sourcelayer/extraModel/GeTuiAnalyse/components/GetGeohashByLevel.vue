<template>
  <div class="get-geohash-by-level">
    <span class="header">粒度分析</span>
    <div class="level-content">
      <el-button
        size="small"
        v-for="(item, index) in level"
        :key="index"
        :disabled="!!!~$props.forceLevels.indexOf(item.key)"
        :class="{ 'level-active': $props.forceLevel == item.key }"
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
        { key: "grid", label: "网格" },
        { key: "estate", label: "小区" },
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
  > .level-content {
    margin-top: 1vh;
    /deep/ .el-button {
      border: 2px rgb(76, 151, 227) solid;
      background-color: rgba(5, 17, 62, 0.4);
      color: #ffffff;
    }

    /deep/ .level-active {
      background-image: linear-gradient(
        to top,
        rgba(42, 203, 254, 1),
        rgba(42, 203, 254, 0.4)
      );
    }

    /deep/ .is-disabled {
      border: 2px rgb(77, 77, 77) solid;
      background-color: rgba(77, 77, 77, 0.4);
    }
  }
}
</style>
