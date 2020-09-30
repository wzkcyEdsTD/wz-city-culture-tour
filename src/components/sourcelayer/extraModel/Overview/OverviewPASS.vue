<template>
  <div class="overviewPASS" />
</template>

<script>
export default {
  name: "overviewPASS",
  created() {
    // window.earth.scene.layers.find("RIVER").visible = false;
    setTimeout(() => {
      this.cameraMove(true);
    }, 800);
  },
  beforeDestroy() {
    // window.earth.scene.layers.find("RIVER").visible = true;
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
              x: -2875513.233796373,
              y: 4843811.440808885,
              z: 2993304.9641675064,
            },
            orientation: {
              heading: 6.274379450234763,
              pitch: -0.5186801226963254,
              roll: 0,
            },
          })
        : window.earth.camera.flyTo({
            destination: {
              x: -2876033.009557322,
              y: 4844567.333011177,
              z: 2995247.9787359363,
            },
            orientation: {
              heading: 6.26232552542095,
              pitch: -1.570117584168707,
              roll: 0,
            },
          });
    },
  },
};
</script>

<style>
</style>