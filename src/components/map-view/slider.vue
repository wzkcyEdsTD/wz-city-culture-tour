<template>
  <div class="slider-wrapper" @click.stop>
    <el-slider
      @change="changeValue"
      :min="min"
      :max="max"
      :step="step"
      v-model="sliderValue"
    ></el-slider>
  </div>
</template>

<script>

export default {
  data() {
    return {
      min: 0,
      max: 1,
      step: 0.1,
      sliderValue: 0
    }
  },
  mounted() {
    this.sliderValue = this.$parent.$parent.$refs.baseMap.sliderValue
  },
  methods: {
    changeValue(val) {
      this.$parent.$parent.$refs.baseMap.changeSliderValue(val)
    }
  }
}
</script>

<style scoped lang="less">
  .slider-wrapper {
    position: relative;
    width: 1rem;
  }
</style>
