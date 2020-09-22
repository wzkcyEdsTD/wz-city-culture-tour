<template>
  <div>
    <countTo
      v-if="value"
      :startVal="0"
      :endVal="value?parseFloat(value):0"
      :duration="1000"
      :autoplay="true"
      :decimals="2"
    />
    <span v-if="!value">-</span>
  </div>
</template>

<script>
import countTo from "vue-count-to";

export default {
  name: "dynamicNum",
  components: { countTo },
  props: ["value"],
};
</script>