<template>
  <div class="wrapper map-tools">
    <div
      class="map-toolbar-box map-toolbar-spc"
      :class="currentMapType == 'cesiumMap' || this.collapse1?'collapse':''"
    >
      <div class="map-type">
        <div
          class="item"
          :class="'item'+(index+1) + ' ' + (item.value===mapNowType?'active' + (index + 1):'')"
          @click="changeMapType(item)"
          :title="item.name"
          :key="index"
          v-for="(item,index) in mapType"
        >{{item.name}}</div>
      </div>
    </div>
    <div
      class="map-toolbar-box-map"
      :class="{'collapse': currentMapType == 'cesiumMap' || collapse1, active: toolShow}"
    >
      <span class="collapse-btn" :class="{active: toolShow}" title="地图工具">
        <i style="width: 32px;height: 32px;" @click="mapTool"></i>
      </span>
      <!-- 3d地图工具 -->
      <div
        v-show="currentMapType == 'cesiumMap'"
        class="map-toolbar-box"
        :class="{active: toolShow}"
      >
        <div class="map-type tool-detail">
          <div
            class="item item-spc"
            :class="'btn'+(index+1)"
            :key="index"
            :title="item.name"
            v-for="(item, index) in map3DTool"
            @click="changeMap3DToolBar(item, index)"
          >{{item.abbrev}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MapCenterBtn",
  data() {
    return {
      toolShow: false,
      mapNowType: "datalayer",
      mapType: [
        { name: "大数据", value: "datalayer" },
        { name: "影像", value: "imagelayer" },
      ],
      map3DTool: [
        { name: "测量工具", value: "3t1", abbrev: "测量工具" },
        { name: "可视分析", value: "3t2", abbrev: "可视分析" },
        { name: "剖面分析", value: "3t3", abbrev: "剖面分析" },
      ],
      isPointSearch: false,
      isSetOpacity: false,
      isCoverToolbarShow: false,
    };
  },
  computed: {
    ...mapGetters("map", ["currentMapType"]),
  },
  methods: {
    mapTool() {
      this.toolShow = !this.toolShow;
    },
    changeMap3DToolBar(item, index) {
      this.$bus.$emit("cesium-3d-maptool", item);
    },
    changeMapType(item) {
      if (item.value === this.mapNowType) return;
      this.$bus.$emit("cesium-3d-mapType", { value: item.value });
      this.mapNowType = item.value;
    },
  },
};
</script>

<style scoped lang="less">
.map-tools {
  > * {
    z-index: 2;
  }
}
.map-toolbar-box-map.active {
  height: 2.6rem;
}
.toCenter.moveRight1 {
  left: 0.8rem !important;
}
.toCenter1.moveRight2 {
  left: 1.45rem !important;
}
.map-toolbar-box-map {
  overflow: hidden;
  position: absolute;
  top: 0.6rem;
  left: 4.1rem;
  width: 0.5rem;
  height: 0.46rem;
  transition: all 0.3s linear;
  border-radius: 6px;
  background: #03315a !important;
  border: 1px #5ab0e5 solid !important;
  &.collapse {
    left: 0.16rem;
    .item-child {
      left: 0.54rem !important;
    }
  }
  /*.map-toolbar-box {*/
  /*  transition: height .3s linear !important;*/
  /*  padding: 0.06rem !important;*/
  /*  height: 3.94rem !important;*/
  /*}*/
  .collapse-btn:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  .collapse-btn.active {
    background: rgba(0, 0, 0, 0.4);
    > i {
      .bg-image("images/tool-act");
    }
  }
  .collapse-btn {
    width: 0.5rem;
    height: 0.46rem;
    display: inline-block;
    background: #03315a;
    cursor: pointer;
    > i {
      width: 0.16rem;
      height: 0.16rem;
      display: block;
      .bg-image("images/tool");
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    > i:hover {
      .bg-image("images/tool-act");
    }
  }
  .map-toolbar-box {
    height: 0;
    padding: 0 0.06rem;
    position: relative;
    top: -0.1rem;
    left: 0;
    margin: 0;
    overflow-y: hidden;
  }
  .map-toolbar-box.active {
    transition: height 0.3s linear;
    padding: 0.06rem 0;
    height: 100%; // 多
    padding-top: 0px;
  }
}
.map-toolbar-spc {
  background: #03315a !important;
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  border: 1px #5ab0e5 solid !important;
  padding: 0rem 0rem !important;
}
.map-toolbar-box {
  position: absolute;
  padding: 0.05rem 0.06rem;
  margin: 0.1rem 0 0 0;
  background: rgba(0, 0, 0, 0);
  /*box-shadow: 0 0 0 0.02rem rgba(0, 0, 0, 0.1);*/
  /*border:1px #5ab0e5 solid;*/
  border-radius: 6px;
  left: 4.1rem;
  top: 0rem;
  z-index: 2;
  transition: left 0.3s linear;
  &.collapse {
    left: 0.16rem;
  }
  .tool-detail {
    .item {
      margin-top: 0.08rem !important;
      line-height: 0.18rem !important;
      padding-top: 0.12rem;
      padding-bottom: 0.05rem;
      & + .item {
        &:after {
          top: -0.04rem;
        }
      }
    }
  }
  .map-type {
    .item {
      width: 0.34rem;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 2px;
      position: relative;
      line-height: 0.26rem;
      color: #fff;
      text-align: center;
      & + .item {
        margin-top: 0rem;
        &:after {
          content: "";
          height: 0.01rem;
          width: 80%;
          position: absolute;
          // top: -0.1rem;
          left: 50%;
          top: 0rem;
          transform: translate(-50%, 0);
          background: rgba(255, 255, 255, 0.3);
        }
      }
      /*&:hover > .item-child {*/
      /*  display: block;*/
      /*}*/
    }
    .item:hover,
    .item.active {
      color: #00baff;
    }
    .item.disabled:hover,
    .item.disabled {
      color: #999;
      cursor: default;
    }
    .item1 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
      margin-left: 0px !important;
    }
    .item2 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      border-right: 1px #5ab0e5 solid;
      margin-left: 0px !important;
      text-align: center;
    }
    .item3 {
      float: left;
      width: 1.5rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      border-right: 1px #5ab0e5 solid;
      text-align: center;
    }
    .item4 {
      float: left;
      width: 0.8rem !important;
      height: 0.28rem !important;
      margin-left: 0px !important;
      text-align: center;
    }
    .item1:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item2:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item3:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .item4:hover {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active1 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active2 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active3 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
    .active4 {
      background-color: #002749;
      box-shadow: 0px 0px 10px rgba(137, 210, 255, 0.8) inset;
      color: #00baff;
    }
  }
  .item-child {
    transition: left 0.3s linear !important;
    position: fixed;
    left: 4.44rem;
    color: #fff;
    z-index: 9999;
    > div {
      margin-left: 0.24rem;
      padding: 0.12rem 0.25rem;
      border-radius: 4px;
      background-color: rgba(0, 47, 87, 0.9);
      box-shadow: rgb(46, 208, 255, 0.4) 0px 0px 12px inset;
      > div {
        line-height: 0.25rem;
        white-space: nowrap;
        label {
          margin: 0;
          display: inline-block;
          span {
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid #007ce4;
            border-radius: 0;
            display: inline-block;
            height: 0.16rem;
            margin-right: 0.1rem;
            margin-top: -0.02rem;
            vertical-align: middle;
            width: 0.16rem;
            line-height: 1;
          }
          &.active {
            span:after {
              background-color: #1167af;
              border-radius: 0;
              content: "";
              display: inline-block;
              height: 0.08rem;
              margin: 0rem 0.02rem 0.04rem 0.02rem;
              width: 0.08rem;
            }
          }
        }
      }
    }
  }
}
.item-child {
  transition: left 0.3s linear !important;
  position: fixed;
  left: 5rem;
  color: #fff;
  z-index: 9999;
  &.collapse {
    left: 0.5rem;
  }
  > div {
    margin-left: 0.24rem;
    padding: 0.12rem 0.25rem;
    border-radius: 4px;
    background-color: rgba(0, 47, 87, 0.9);
    box-shadow: rgb(46, 208, 255, 0.4) 0px 0px 12px inset;
    > div {
      line-height: 0.25rem;
      white-space: nowrap;
      label {
        margin: 0;
        display: inline-block;
        span {
          background-color: rgba(0, 0, 0, 0);
          border: 2px solid #007ce4;
          border-radius: 0;
          display: inline-block;
          height: 0.16rem;
          margin-right: 0.1rem;
          margin-top: -0.02rem;
          vertical-align: middle;
          width: 0.16rem;
          line-height: 1;
        }
        &.active {
          span:after {
            background-color: #1167af;
            border-radius: 0;
            content: "";
            display: inline-block;
            height: 0.08rem;
            margin: 0rem 0.02rem 0.04rem 0.02rem;
            width: 0.08rem;
          }
        }
      }
    }
  }
}
.children_point {
  position: fixed;
  left: -100%;
  top: -100%;
  height: 0.3rem;
  z-index: 999;
}
.children_opacity {
  position: fixed;
  left: -100%;
  top: -100%;
  height: 0.3rem;
  z-index: 999;
}
</style>
