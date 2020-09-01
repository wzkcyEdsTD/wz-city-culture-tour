<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-01 17:33:23
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\commonFrame\DetailPopup\DetailPopup.vue
-->
<template>
  <div id="forcePopUp" v-show="forcePosition.x && forcePosition.y">
    <div
      id="forcePopUpContent"
      class="leaflet-popup"
      :style="{transform:`translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`}"
    >
      <a class="leaflet-popup-close-button" href="#">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div id="forcePopUpLink" class="leaflet-popup-content" style="max-width: 300px;">
          <div class="leaflet-popup-content">这是弹窗</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forceEntity: undefined,
      forcePosition: {},
    };
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {},
    /**
     *  详情点赋值
     *  @param {object} forceEntity 详情点信息
     */
    getForceEntity(forceEntity) {
      this.forceEntity = forceEntity;
    },
    /**
     *  框体移动
     *  @param {object} position
     */
    renderForceEntity(pointToWindow) {
      if (
        this.forcePosition.x !== pointToWindow.x ||
        this.forcePosition.y !== pointToWindow.y
      ) {
        this.forcePosition = pointToWindow;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.leaflet-popup {
  top: -80px;
  left: 30px;
  position: absolute;
  text-align: center;
}

.leaflet-popup-close-button {
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
}

.leaflet-popup-content-wrapper {
  background-image: url("./images/detail.png");
  text-align: center;
  height: 151px;
  width: 271px;
}

.leaflet-popup-content {
  margin: 13px 19px;
  line-height: 1.4;
}
</style>
