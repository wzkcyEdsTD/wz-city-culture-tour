<template>
  <div class="page-map">
    <MapCenterBtn
      ref="mapCenterBtn"
      class="no-print"
      @setMapTollBar="setMapTollBar"
    ></MapCenterBtn>
    <div class="cesium-map" v-if="currentMapType == 'cesiumMap'">
      <CesiumMap />
    </div>
  </div>
</template>
<script>
import MapCenterBtn from "./modules/map-center-btn/map-center-btn";
import CesiumMap from "components/map-view/cesium_map";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Map",
  data() {
    return {
      mapTollBar: {}, // 地图按钮操作
      currentBaseMapType:""
    };
  },
  computed: {
    ...mapGetters("map", ["currentMapType"]),
  },
  mounted() {
    window.onresize = () => {
      this.timer && (this.timer = false);
    };
  },
  methods: {
    // 点击地图按钮的操作传值给地图
    setMapTollBar(obj) {
      this.mapTollBar = obj;
    },
  },
  components: {
    MapCenterBtn,
    CesiumMap,
  },
  watch: {},
};
</script>
<style scoped lang="less">
.print {
  position: fixed;
  top: 0.58rem;
  right: 4rem;
  z-index: 1;
  width: 0.3rem;
  height: 0.3rem;
  display: block;
  border: 1px solid #5ab0e5;
  border-radius: 6px;
  background: #03315a;
  font-style: normal;
  transition: all 0.3s linear;
  cursor: pointer;
  > span {
    display: block;
    width: 0.26rem;
    height: 0.26rem;
    .bg-image("./images/print");
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &.collapse {
    right: 0.14rem;
  }
}
.page-map {
  .map {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    .cover-map {
      width: 100%;
      height: 100%;
    }
  }
  .cesium-map {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: "#204f77";
  }
  .box {
    z-index: 2;
  }
  .tree {
    overflow: auto;
  }
}
.right-title {
  text-align: center;
  color: @color-text;
  margin-bottom: 0.05rem;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.2rem;
  margin-top: -0.1rem;
  font-family: "黑体";
}
.statistics {
  height: 50%;
  position: relative;
  /*&:before {
      content: '';
      display: block;
      width: 3.8rem;
      height: 0.04rem;
      position: absolute;
      right: 50%;
      bottom: 0;
      transform: translate(50%, 0);
      .bg-image('./modules/map-box/images/line');
    }
    &:after {
      content: '';
      display: block;
      width: 3.8rem;
      height: 0.04rem;
      position: absolute;
      left: -0.1rem;
      bottom: 0;
      .bg-image('./modules/map-box/images/line');
      transform-origin: left bottom;
      transform: rotate(-90deg);
    }*/
}
.details {
  height: 50%;
  padding-top: 0.2rem;
}
.title-btn-wrapper {
  width: 0.34rem;
  height: 0.34rem;
  position: relative;
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.26rem;
    height: 0.26rem;
    cursor: pointer;
  }
}
// 地图标志按钮
/deep/ .mapboxgl-ctrl-bottom-left {
  z-index: 0;
  left: 4rem;
  bottom: 0.5rem;
  transition: left 0.3s linear;
}
/deep/ .mapboxgl-ctrl-scale {
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  float: left;
}
/deep/ .mapboxgl-ctrl-lngLat {
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  margin: 0 0 10px 10px;
  float: none;
  display: inline-block;
  padding: 0 5px;
}
.map.collapse {
  /deep/ .mapboxgl-ctrl-bottom-left {
    left: 0.04rem;
  }
}
// 隐藏地图自己的按钮
/deep/ .mapboxgl-ctrl-top-left {
  left: 4.1rem !important;
  top: 1rem !important;
  visibility: hidden;
}
// 修改地图poptip样式
/deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  border-top-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip,
/deep/ .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  border-bottom-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: rgba(3, 67, 106, 0.9);
}
/deep/ .mapboxgl-popup-content {
  background: rgba(3, 67, 106, 0.9);
  color: #fff;
}
/deep/ .mapboxgl-popup {
  top: -0.14rem;
  min-width: 1.5rem;
  max-width: 6rem !important;
}
/deep/ .mapboxgl-popup-close-button {
  right: 0.05rem;
  z-index: 1;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0;
  position: absolute;
  top: 0.1rem;
  width: 0.2rem;
  height: 0.2rem;
  display: block;
  .bg-image("./images/zoom-in");
  transform: rotate(-45deg);
  transition: all 0.1s linear;
  outline: none;
  text-indent: -9999rem;
  &:hover {
    transform: rotate(45deg);
  }
}
@media print {
  .no-print {
    display: none;
  }
  /deep/ .is-print {
    .legend-box {
      right: 0.14rem !important;
      .panel-body {
        /*max-height: calc(50vh - 0.3rem) !important;*/
        overflow: hidden;
      }
      .isSmall {
        display: none !important;
      }
    }
    .mapboxgl-ctrl-bottom-left {
      left: 0.04rem !important;
      bottom: 0.05rem;
    }
    .search-body,
    .longitudeSearch,
    .mapboxgl-ctrl-lngLat {
      display: none !important;
    }
    .slider-wrapper,
    .toCenterRight,
    .closeMap {
      display: none;
    }
    #base-map {
      background: transparent !important;
      canvas {
        display: none;
      }
    }
  }
}
</style>
