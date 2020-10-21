<template>
  <div class="compare">
    <p>2019年同比</p>
    <p :class="data >= 0 ? 'pos' : 'neg'">
      {{ data >= 0 ? "+" : "-" }}{{ fixData }}
    </p>
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
    font-size: 1vh;
    color: white;
    font-weight: 300;
    line-height: 1.4vh;
    &:last-child {
      font-weight: 700;
      font-size: 1.3vh;
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