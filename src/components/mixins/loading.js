export default {
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch('changeLoad', false)
    })
  }
}
