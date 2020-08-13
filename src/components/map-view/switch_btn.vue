<template>
  <div class="mapCard">
    <div class="toCenterRight" :class="{active: centerShow}" title>
      <i style="width: 100%;height: 0.42rem;" @click="showTool"></i>
      <div
        class="center-item"
        :class="'btn'+(index+1)"
        :key="index"
        :title="item.name"
        v-for="(item, index) in mapType"
        @click="changeMapTollBarTop(item, index)"
      >{{item.abbrev}}</div>
    </div>
    <div class="closeMap" @click="closeMap('closeMap')">关闭分屏</div>
    <!-- <div @mouseover="mouseOver()" @mouseleave="mouseLeave()"> -->
    <!-- <div class="switch-box tiMapStyle" @click="setMap('standard-raster',$event)" @mouseover="mouseOverbox($event)" @mouseleave="mouseLeavebox($event)">
      <span>矢量图</span>
    </div>-->
    <!-- <div class="switch-box imgMapStyle" @click="setMap('2012YX',$event)" @mouseover="mouseOverbox($event)" @mouseleave="mouseLeavebox($event)">
      <span>影像图</span>
    </div>
    <div class="switch-box tiMapStyle" @click="setMap('globe_3D',$event)" @mouseover="mouseOverbox($event)" @mouseleave="mouseLeavebox($event)">
      <span>三维球</span>
    </div>-->
    <!-- <div class="switch-box tilesMapStyle" @click="setMap('2017YX',$event)" @mouseover="mouseOverbox($event)" @mouseleave="mouseLeavebox($event)">
      <span>瓦片图</span>
    </div>-->
    <!-- </div> -->
  </div>
</template>
<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["isShwo"],
  data() {
    return {
      isShow: true,
      mapType: [
        {
          name: "影像",
          abbrev: "影像"
        }
        // {
        //   name: '三维',
        //   abbrev: '三维'
        // }
      ],
      centerShow: false
    };
  },
  computed: {
    ...mapGetters("map", ["splitScreen"])
  },
  methods: {
    ...mapActions("map", ["setSplitScreen"]),
    showTool() {
      this.centerShow = !this.centerShow;
    },
    changeMapTollBarTop(item, index) {
      if (item.name === "影像") {
        this.setMap("2012YX");
      } else if (item.name === "三维") {
        this.setMap("globe_3D");
      }
    },
    closeMap(val) {
      this.$emit("switchMap", val);
      this.$bus.emit("close_splitScreen", val);
      this.setSplitScreen(false);
      this.$parent.$parent.SetCollapse1(false);
      const data = this.$parent.$parent.currentOnePoint;
      let hasInfo = false;
      // 如果是面
      if (data.level - 0 >= 3 && data.num !== 0) {
        if (data.geotype === "polygon" && data.num === 0) {
          //  并且没有children
          if (!data.children || (data.children && data.children.length === 0)) {
            // this.SetCollapse2(true)
            hasInfo = false;
          } else if (data.children.length > 0) {
            let hasPoint = false;
            for (let i = 0; i < data.children.length; i++) {
              if (data.children[i].geotype === "point") {
                hasPoint = true;
                i = data.children.length;
              }
            }
            if (!hasPoint) {
              hasInfo = false;
            } else {
              hasInfo = true;
            }
            // 如果当前节点是面 并且有children 并且children没有点 隐藏
          } else {
            hasInfo = true;
          }
        } else {
          hasInfo = true;
        }
      } else {
        hasInfo = false;
      }
      if (hasInfo) {
        this.$parent.$parent.SetCollapse2(false);
      } else {
        this.$parent.$parent.SetCollapse2(true);
      }
    },
    setMap(val) {
      this.$emit("switchMap", val);
    },
    // 移入
    mouseOver() {
      $(".closeMap")
        .stop()
        .animate({ top: "-160px" }, 200);
      $(".tiMapStyle")
        .stop()
        .animate({ top: "-60px", opacity: "1" }, 200);
      $(".imgMapStyle")
        .stop()
        .animate({ top: "-120px", opacity: "1" }, 200);
    },
    mouseOverbox(evl) {
      var a = $(evl.currentTarget).data("flag");
      if (a === 1) {
        $(evl.currentTarget)
          .siblings()
          .css({ border: "1px solid #ffffff" });
        $(evl.currentTarget)
          .siblings()
          .children()
          .css({ background: "none" });
      } else {
        $(evl.currentTarget).css({ border: "1px solid #3385FF" });
        $(evl.currentTarget.lastElementChild).css({ background: "#3385ff" });
      }
    },
    mouseLeavebox(evl) {
      var a = $(evl.currentTarget).data("flag");
      if (a != 1) {
        $(evl.currentTarget).css({ border: "1px solid #ffffff" });
        $(evl.currentTarget.lastElementChild).css({ background: "none" });
      } else {
        $(evl.currentTarget)
          .siblings()
          .css({ border: "1px solid #ffffff" });
        $(evl.currentTarget)
          .siblings()
          .children()
          .css({ background: "none" });
      }
    },
    // 移出
    mouseLeave() {
      $(".closeMap")
        .stop()
        .animate({ top: "-50px" }, 200);
      $(".tiMapStyle")
        .stop()
        .animate({ top: "-5px", opacity: "0.5" }, 200);
      $(".imgMapStyle")
        .stop()
        .animate({ top: "-10px", opacity: "0.5" }, 200);
    }
  },
  watch: {}
};
</script>

<style scoped lang="less">
.toCenterRight {
  width: 0.5rem;
  height: 0.46rem;
  display: block;
  background: #03315a !important;
  position: absolute;
  transition: all 0.3s linear;
  top: -60px;
  border-radius: 6px;
  right: 2vw;
  border: 1px #5ab0e5 solid !important;
  cursor: pointer;
  overflow: hidden;
  &.active {
    height: 1.4rem;
    > i {
      .bg-image("./../../page/map/modules/map-center-btn/images/draw_type-act");
      background-size: 0.34rem;
      color: #0d6aad;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  }
  .center-item {
    width: 0.32rem;
    height: 0.46rem;
    margin-left: 7px;
    text-align: center;
    line-height: 0.46rem;
    color: #fff;
  }
  .center-item:hover {
    color: #00baff;
  }
  .center-item.active {
    color: #00baff;
  }
  > i {
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image("./../../page/map/modules/map-center-btn/images/draw_type");
    background-size: 0.34rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  > i:hover {
    .bg-image("./../../page/map/modules/map-center-btn/images/draw_type-act");
    background-size: 0.34rem;
    color: #0d6aad;
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
  &.collapse {
    left: 0.16rem;
  }
}
.mapCard {
  width: 86px;
  position: absolute;
  top: 12vh;
  right: 45vw;
  height: 60px;
}
.switch-box {
  height: 60px;
  width: 86px;
  float: left;
  color: white;
  border: "1px solid #ffffff";
}
.switch-box span {
  position: absolute;
  right: 0;
  bottom: 0px;
  width: auto;
  padding: 2px;
}
.closeMap {
  cursor: pointer;
  background: cornflowerblue;
  color: white;
  position: absolute;
  right: -50px;
  top: -60px;
  z-index: 1;
  height: 30px;
  width: 100%;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
}
.closeMap:hover {
  background: #286090;
}
.tiMapStyle {
  background: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype_a6d3e9b.png);
  position: absolute;
  right: 0;
  top: -5px;
  opacity: 0.5;
  z-index: 3;
}
.imgMapStyle {
  border: 1px solid rgba(153, 153, 153, 0.42);
  background: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype_a6d3e9b.png);
  background-position: 0 -181px;
  position: absolute;
  right: 0;
  top: -10px;
  z-index: 2;
  opacity: 0.5;
}
.tilesMapStyle {
  border: 1px solid rgba(153, 153, 153, 0.42);
  background-image: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype_a6d3e9b.png);
  background-position: 0 -121px;
  z-index: 3;
  right: 0;
  position: absolute;
}
</style>
