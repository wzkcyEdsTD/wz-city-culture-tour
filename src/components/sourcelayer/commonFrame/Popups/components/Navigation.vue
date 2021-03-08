<template>
  <div class="navigation" v-show="isNavigation">
    <header>
      路径分析<a class="navigation-close" href="#" @click="closeNavigation">×</a>
    </header>
    <div class="start-to-end">
      <img />
      <div class="s-t-e">
        <div>{{ start.name }}</div>
        <div>{{ end.name }}</div>
      </div>
    </div>
    <ul class="navigation-detail">
      <li v-for="(item, i) in routeList" :key="i">
        <i>{{ i == 0 ? "推荐" : `备选${i}` }}</i>
        <p>{{ item.route ? parseInt(item.route.length) || 100 : "-" }} 米</p>
        <i>{{ item.route ? parseInt(item.route.length / 50) : "-" }} 分钟</i>
      </li>
    </ul>
  </div>
</template>

<script>
import { _RESULT_SETTING_ } from "config/local/findPathParams";
import { PathURL } from "config/server/mapConfig";
import { dealPathWithXhr, clearPath } from "../tools/PathTools";
export default {
  name: "Navigation",
  data() {
    return {
      isNavigation: false,
      start: {},
      end: {},
      routeList: [],
    };
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-navigation");
      this.$bus.$on("cesium-3d-navigation", ({ start, end }) => {
        this.start = start;
        this.end = end;
        this.isNavigation = true;
        this.findPath(start.geometry, end.geometry);
      });
      this.$bus.$off("cesium-3d-navigation-clear");
      this.$bus.$on("cesium-3d-navigation-clear", () => {
        this.closeNavigation();
      });
    },
    /**
     * 查找最佳路线
     * @param {object} 起始点位
     */
    findPath(start, end) {
      const nodes = [
        new SuperMap.Geometry.Point(start.x, start.y),
        new SuperMap.Geometry.Point(end.x, end.y),
      ];
      const findPathParameter = new SuperMap.REST.FindPathParameters({
        isAnalyzeById: false,
        nodes,
        hasLeastEdgeCount: false,
        parameter: new SuperMap.REST.TransportationAnalystParameter({
          resultSetting: new SuperMap.REST.TransportationAnalystResultSetting(
            _RESULT_SETTING_
          ),
          weightFieldName: "SmLength",
        }),
      });
      const findPathService = new SuperMap.REST.FindPathService(PathURL.findPathWz, {
        eventListeners: {
          processCompleted: ({ originResult }) => {
            if (!originResult.pathList.length) return;
            this.routeList = originResult.pathList.concat([{}, {}]);
            dealPathWithXhr(originResult.pathList[0]);
          },
        },
      });
      findPathService.processAsync(findPathParameter);
    },
    closeNavigation() {
      this.isNavigation = false;
      this.start = {};
      this.end = {};
      this.routeList = [];
      clearPath();
    },
  },
};
</script>

<style lang="less" scoped>
.navigation {
  position: absolute;
  top: 2vh;
  right: -34vh;
  background-image: url("/static/images/common/detail@2x.png");
  background-size: 100% 100%;
  text-align: center;
  height: 22vh;
  width: 32vh;
  box-sizing: border-box;
  padding: 2.2vh 3vh 3vh 3vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > header {
    line-height: 3vh;
    .navigation-close {
      position: absolute;
      top: 2vh;
      right: 3vh;
      text-align: center;
      width: 2vh;
      height: 2vh;
      font: 2.2vh/2vh Tahoma, Verdana, sans-serif;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      background: transparent;
      cursor: pointer;
    }
  }
  .start-to-end {
    width: 100%;
    height: auto;
    height: 4.6vh;
    border-radius: 1vh;
    display: flex;
    background: rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    padding: 0.4vh 1vh;
    > img {
      width: 3vh;
      background: gray;
    }
    > .s-t-e {
      flex: 1;
      margin-left: 0.6vh;
      overflow: hidden;
      > div {
        width: 100%;
        height: 50%;
        line-height: 1.9vh;
        color: #fff;
        box-sizing: border-box;
        padding-left: 0.4vh;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      > div:first-child {
        border-bottom: 1px solid #fff;
      }
    }
  }
  .navigation-detail {
    flex: 1;
    margin: 1vh 0;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    > li {
      box-sizing: border-box;
      padding-left: 1vh;
      width: 33.3%;
      cursor: pointer;
      text-align: left;
      position: relative;
      &:last-child::after {
        display: none;
      }
      &::after {
        content: "";
        display: block;
        width: 1px;
        position: absolute;
        top: 20%;
        bottom: 20%;
        right: 0%;
        background: rgba(255, 255, 255, 0.7);
      }
      > * {
        line-height: 2.4vh;
      }
      > i {
        font-size: 1.2vh;
        font-style: normal;
        color: rgba(255, 255, 255, 0.4);
      }
      > p {
        font-size: 1.6vh;
        font-weight: bold;
      }
    }
  }
}
</style>
