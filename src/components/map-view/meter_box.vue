<template>
  <transition
    enter-active-class="animated lightSpeedIn"
    leave-active-class="animated bounceOutDown"
  >
    <div class="meter" v-show="isShow">{{data}}
      <i class="close" @click="hide"></i></div>
  </transition>
</template>

<script>
/* eslint-disable */
export default {
  name: 'MeterBox',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  },
  watch: {
    'data'(data) {
      // if (data != "") {
      //   this.show();
      // } else {
      //   this.hide();
      // }
    }
  }
}
/* eslint-disable */
</script>

<style scoped lang="less">
  .meter {
    transition: all 0.3s linear;
    background: rgba(38, 104, 159, 0.4);
    position: absolute;
    bottom: 1.1rem;
    left: 4rem;
    z-index: 3;
    color: @color-text;
    padding: 0.1rem 0.35rem 0.1rem 0.1rem;
    height: 0.4rem;
    width: auto;
    .no-wrap();
    .close {
      position: absolute;
      right: 0.05rem;
      top: 0.1rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../page/map/images/zoom-in');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        transform: rotate(45deg);
      }
    }
  }
</style>
