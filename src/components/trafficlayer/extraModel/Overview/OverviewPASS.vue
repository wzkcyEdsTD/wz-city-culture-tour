<template>
  <div class="overviewPASS" />
</template>

<script>
import { CenterPoint } from "mock/overview.js";
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
        ? window.earth.camera.flyTo(CenterPoint)
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