<template>
  <div class="dynamicNum">
    <countTo
      v-if="value"
      :startVal="0"
      :endVal="value ? parseFloat(value) : 0"
      :duration="parseInt(Math.random(1) * 600 + 900)"
      :autoplay="true"
      :decimals="decimals || decimals == 0 ? parseInt(decimals) : 2"
    />
    <span v-if="!value">-</span>
  </div>
</template>

<script>
import countTo from "vue-count-to";

export default {
  name: "dynamicNum",
  components: { countTo },
  props: ["value", "decimals"],
};
</script>

<style lang="less" scoped>
.dynamicNum {
  display: inline-block;
}
</style>