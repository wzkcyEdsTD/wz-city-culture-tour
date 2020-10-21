<!--
 * @Author: eds
 * @Date: 2020-09-02 16:38:50
 * @LastEditTime: 2020-09-02 19:23:51
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\AuthFailPopup\AuthFailPopup.vue
-->
<template>
  <div class="authfail-popup">
    <a class="authfail-popup-close-button" href="#" @click="closePopup">×</a>
    <div class="authfail-popup-content-wrapper">
      <div class="authfail-popup-content">
        <header>温馨提示</header>
        <p class="desc">当前用户没有查看权限</p>
        <div class="btn" @click="closePopup">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {},
  methods: {
    closePopup() {
      this.$parent.authFailshallPop = false;
    },
  },
};
</script>

<style lang="less" scoped>
.authfail-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.authfail-popup-close-button {
  position: absolute;
  top: 20px;
  right: 30px;
  text-align: center;
  width: 18px;
  height: 18px;
  font: 20px/14px Tahoma, Verdana, sans-serif;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
  cursor: pointer;
}

.authfail-popup-content-wrapper {
  background-image: url("./images/detail.png");
  text-align: center;
  height: 151px;
  width: 271px;
  box-sizing: border-box;
  padding: 28px 26px;
}

.authfail-popup-content {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
  > header {
    height: 24px;
    line-height: 24px;
    font-size: 15px;
    font-weight: bold;
  }
  .desc {
    margin-top: 5px;
    font-size: 13px;
  }
  .btn {
    margin-top: 20px;
    width: 76px;
    height: 28px;
    line-height: 28px;
    .bg-image("./images/btn");
    font-size: 14px;
    color: #2acbfe;
  }
}
</style>
