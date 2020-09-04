<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-04 16:33:01
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\commonFrame\DetailPopup\DetailPopup.vue
-->
<template>
  <div id="forcePopUp" v-if="forcePosition.x && forcePosition.y">
    <div
      id="forcePopUpContent"
      class="leaflet-popup"
      :style="{transform:`translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`}"
    >
      <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div id="forcePopUpLink" class="leaflet-popup-content">
          <div class="leaflet-popup-content">
            <header>{{forceEntity.extra_data.SHORTNAME || forceEntity.extra_data.NAME}}</header>
            <ul class="content-body">
              <li v-for="(item,key,index) in forceEntity.fix_data" :key="index">
                <span>{{key}}</span>
                <span>{{item}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forceEntity: {},
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
    closePopup() {
      this.forcePosition = {};
      this.forceEntity = {};
    },
  },
};
</script>

<style lang="less" scoped>
#forcePopUp {
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
    cursor: pointer;
  }

  .leaflet-popup-content-wrapper {
    background-image: url("./images/detail.png");
    text-align: center;
    height: 151px;
    width: 271px;
    box-sizing: border-box;
    padding: 28px 26px;
  }

  .leaflet-popup-content {
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    > header {
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
      padding-right: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    > .content-body {
      flex: 1;
      overflow-y: auto;
      > li {
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        font-weight: 300;
        float: left;
        width: 100%;
        // border-bottom: 1px rgba(255,255,255,0.6) solid;
        > span {
          display: inline-block;
          vertical-align: top;
          height: 100%;
          float: left;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 122px;
        }
        > span:first-child {
          width: 90px;
        }
      }
    }
  }
}
</style>
