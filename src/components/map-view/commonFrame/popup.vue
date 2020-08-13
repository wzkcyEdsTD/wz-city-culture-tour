<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-08-12 21:21:03
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\commonFrame\popup.vue
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
const mvtObj = {
  名称: "鹿城区南塘街-夜景",
  地址: "鹿城区南塘街",
  简介:
    "	南塘风貌街是一条集休闲、时尚、餐饮、娱乐、文化于一体的商业街区，沿南塘河而建。与白鹿洲公园近在咫尺。这里不仅一年四季风景如画，而且美食琳琅满目，有高档酒店，咖啡美食，日韩料理等。茶余饭后，或泛舟南塘河，或逛逛街区，都不失悠然自得。",
  类型: "观光旅游,人文景观,夜景",
};
const data = {
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
  default: `<div><img style="width:300px;" src="/static/images/nantang.jpg"/><ul>${Object.keys(
    mvtObj
  )
    .map((v) => `<li style="width:300px;"><strong>${v}</strong> : <span>${mvtObj[v]}</span></li>`)
    .join("")}</ul></div>`,
};
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
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-mvt");
      this.$bus.$on("cesium-3d-mvt", ({ pickResult, pointToWindow, name }) => {
        this.htmlContent = data[name] || data.default;
        this.x = pointToWindow.x - $("#trackPopUpContent").width() / 2;
        this.y = pointToWindow.y - $("#trackPopUpContent").height();
        this.picked = pickResult;
        this.$nextTick(() => {
          this.shallPop = true;
        });
      });
    },
    closePopup() {
      this.$bus.$emit("cesium-3d-mvt-down");
      this.shallPop = false;
      this.picked = {};
    },
  },
};
</script>

<style>
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
</style>
