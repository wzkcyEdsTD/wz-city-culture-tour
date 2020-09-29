<template>
  <div class="overviewPASS" />
</template>

<script>
export default {
  name: "overviewPASS",
  created() {
    window.earth.scene.layers.find("RIVER").visible = false;
    setTimeout(() => {
      this.cameraMove(true);
    }, 800);
  },
  beforeDestroy() {
    window.earth.scene.layers.find("RIVER").visible = true;
    setTimeout(() => {
      this.cameraMove(false);
    }, 800);
    //
  },
  methods: {
    cameraMove(boolean) {
      !boolean
        ? window.earth.camera.flyTo({
            destination: {
              x: -2875301.1196146533,
              y: 4843728.17360857,
              z: 2993569.51865382,
            },
            orientation: {
              heading: 0.0033168860454315663,
              pitch: -0.5808830390057396,
              roll: 0,
            },
          })
        : window.earth.camera.flyTo({
            destination: {
              x: -2875491.3076729006,
              y: 4843712.080363573,
              z: 2994741.4349476523,
            },
            orientation: {
              heading: 6.262323073407475,
              pitch: -1.5701273902506663,
              roll: 0,
            },
          });
    },
  },
};
</script>

<style>
</style>