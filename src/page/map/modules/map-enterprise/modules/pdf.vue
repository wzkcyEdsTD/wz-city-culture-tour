<template>
  <div class="pdf" v-show="isShow" ref="pdf">
    <iframe :src="url"></iframe>
    <i class="close" @click="hide" title="关闭"></i>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      defalut: ''
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
      this.$emit('init')
    }
  }
}
</script>
<style scoped lang="less">
  .pdf {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 70%;
    height: 60%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 999;
    overflow: auto;
    padding: 0.1rem 0;
    border-radius: 0.04rem;
    .close {
      position: absolute;
      right: 0.18rem;
      top: 0.23rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('./images/close');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        transform: rotate(45deg);
      }
    }
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
