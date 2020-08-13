<template>
  <div class="wrapper flex flex-y" v-show="isShow">
    <div class="video-header">
      监控视频
      <i class="close" @click="close"></i>
    </div>
    <div class="video-content flex-1">
      <iframe :src="url"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BigVideo',
  data() {
    return {
      isShow: false,
      url: ''
    }
  },
  methods: {
    close() {
      this.isShow = false
      this.url = ''
    },
    show(url) {
      this.url = url
      this.isShow = true
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: fixed;
    width: 80%;
    height: 80%;
    background: #1d4a60;
    border: 0.02rem solid #1a96c7;
    z-index: 999;
    top: 10%;
    left: 10%;
    border-radius: 0.04rem;
    .video-content {
      padding: 0 0.2rem 0.3rem;
      > iframe {
        width: 100%;
        height: 100%;
        display: block;
        background: #000;
      }
    }
    .video-header {
      font-size: 0.24rem;
      font-weight: bold;
      color: #ffc824;
      text-align: center;
      line-height: 0.46rem;
      position: relative;
      .close {
        position: absolute;
        right: 0.13rem;
        top: 0.13rem;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image('images/close');
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
          transform: rotate(45deg);
        }
      }
    }
  }
</style>
