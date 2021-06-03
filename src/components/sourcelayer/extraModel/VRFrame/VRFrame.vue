<template>
  <div class="vr-frame" v-if="frameObject">
    <header>
      <span>{{ frameObject.name }}</span>
      <i class="close" @click="closeFrame" />
    </header>
    <div class="vr-frame-content">
      <iframe :src="frameObject.vr" />
    </div>
  </div>
</template>

<script>
export default {
  name: "VRFrame",
  data() {
    return {
      frameObject: undefined,
    };
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$on("cesium-iframe", (frameObject) => {
        this.frameObject = frameObject;
      });
    },
    closeFrame() {
      this.frameObject = undefined;
    },
  },
};
</script>

<style lang="less" scoped>
.vr-frame {
  height: 60vh;
  width: 130vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-size: 100% 100%;
  background-image: url("/static/images/common/rtmp-frame.png");
  box-sizing: border-box;
  padding: 2.6vh 4.4vh 2vh 4.4vh;
  z-index: 100;
  color: white;
  > header {
    height: 4vh;
    line-height: 4vh;
    > span {
      font-size: 1.8vh;
    }
    .close {
      position: absolute;
      right: 46px;
      top: 24px;
      width: 2.6vh;
      height: 2.6vh;
      display: block;
      .bg-image("/static/images/icons/zoom-in");
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      z-index: 10;

      &:hover {
        transform: rotate(45deg);
      }
    }
  }
  > .vr-frame-content {
    height: 49vh;
    border-radius: 2vh;
    overflow: hidden;
    > iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>