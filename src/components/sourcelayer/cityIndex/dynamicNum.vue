<template>
  <countTo
    :startVal="0"
    :endVal="value?parseFloat(value):0"
    :duration="1000"
    :autoplay="true"
    :decimals="2"
  />
</template>

<script>
import countTo from "vue-count-to";

export default {
  name: "dynamicNum",
  components: { countTo },
  props: ["value"],
};
</script>