<template>
  <div class="compare">
    <p>同比2019年</p>
    <p :class="data >= 0 ? 'pos' : 'neg'">{{ fixData }}</p>
  </div>
</template>

<script>
export default {
  name: "compare",
  props: ["data"],
  computed: {
    fixData() {
      return `${this.data}%`;
    },
  },
};
</script>

<style lang="less" scoped>
.compare {
  display: inline-block;
  float: right;
  margin-left: 10px;
  p {
    font-size: 10px;
    color: white;
    font-weight: 300;
    line-height: 14px;
    &:last-child {
      font-weight: 700;
      font-size: 13px;
    }
  }
  .pos {
    color: #2fc25a !important;
  }
  .neg {
    color: rgb(255, 72, 72) !important;
  }
}
</style>