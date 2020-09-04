<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-04 16:33:16
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\commonFrame\popup.vue
-->
<template>
  <div id="trackPopUp" v-show="shallPop">
    <div
      id="trackPopUpContent"
      class="leaflet-popup"
      :style="{transform:`translate3d(${x}px,${y}px, 0)`}"
    >
      <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div id="trackPopUpLink" class="leaflet-popup-content">
          <div class="leaflet-popup-content" v-html="htmlContent"></div>
        </div>
      </div>
      <div class="leaflet-popup-tip-container">
        <div class="leaflet-popup-tip"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shallPop: false,
      x: 0,
      y: 0,
      picked: {},
      htmlContent: "",
    };
  },
  mounted() {
    const that = this;

    this.mvtObj = {
      名称: "鹿城区南塘街-夜景",
      地址: "鹿城区南塘街",
      类型: "观光旅游,人文景观,夜景",
    };
    this.data = {
      vr:
        "<div style='height:700px;width:1100px;'><iframe style='width:100%;height:100%' src='https://720yun.com/t/3nqw9w9889fo6e741g'></div>",
      people: `<div><table style='border:1;' border="1">
        <tr>
          <th>时间</th>
          <th>当前人数</th>
          <th>顺势承载客流量</th>
          <th>当天承载客流量</th>
        </tr>
        <tr>
          <td>8.11晚9:20</td>
          <td>1436</td>
          <th>5900</th>
          <th>13600</th>
        </tr>
        <tr>
          <td>8.12早9:30</td>
          <th>200</th>
          <th>5900</th>
          <th>13600</th>
        </tr>
      </table></div>`,
      travel: "<div><img src='src' alt='图片'/><p>简介：123</p></div>",
      default: `<div><ul>${Object.keys(that.mvtObj)
        .map(
          (v) =>
            `<li style="width:300px;"><strong>${v}</strong> : <span>${that.mvtObj[v]}</span></li>`
        )
        .join("")}</ul></div>`,
    };

    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-mvt");
      this.$bus.$on(
        "cesium-3d-mvt",
        ({ pickResult, pointToWindow, name, attrs }) => {
          console.log("oncesium-3d-mvt");
          if (attrs) {
            console.log(999);
            this.mvtObj.名称 = attrs.NAME;
            this.mvtObj.地址 = attrs.ADDRESS;
            this.mvtObj.类型 = attrs.STYLENAME || attrs.LB || attrs.TYPE;

            this.data.default = `<div><ul>${Object.keys(that.mvtObj)
              .map(
                (v) =>
                  `<li style="width:300px;"><strong>${v}</strong> : <span>${that.mvtObj[v]}</span></li>`
              )
              .join("")}</ul></div>`;
          }

          this.htmlContent = this.data[name] || this.data.default;
          this.x = pointToWindow.x - $("#trackPopUpContent").width() / 2;
          this.y = pointToWindow.y - $("#trackPopUpContent").height();
          this.picked = pickResult;

          this.$nextTick(() => {
            this.shallPop = true;
          });
        }
      );
    },
    closePopup() {
      this.$bus.$emit("cesium-3d-mvt-down");
      this.shallPop = false;
      this.picked = {};
    },
  },
};
</script>

<style lang="less" scoped>
#trackPopUp {
  .leaflet-popup {
    position: absolute;
    text-align: center;
    top: -20px;
    left: 0;
    z-index: 99999;
  }

  .leaflet-popup-close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 4px 0 0;
    text-align: center;
    width: 18px;
    height: 14px;
    font: 16px/14px Tahoma, Verdana, sans-serif;
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
  }

  .leaflet-popup-content-wrapper {
    text-align: center;
    /* max-height: 200px; */
    overflow-y: auto;
    background: white;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    padding: 1px;
    text-align: left;
    border-radius: 12px;
  }

  .leaflet-popup-content {
    margin: 13px 19px;
    line-height: 1.4;
  }

  .leaflet-popup-tip-container {
    margin: 0 auto;
    width: 40px;
    height: 20px;
    position: relative;
    overflow: hidden;
  }

  .leaflet-popup-tip {
    background: white;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    width: 17px;
    height: 17px;
    padding: 1px;
    margin: -10px auto 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}
</style>
