<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-04 16:33:01
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\DetailPopup\DetailPopup.vue
-->
<template>
  <div id="forcePopUp" v-show="forcePosition.x && forcePosition.y">
    <div
      id="forcePopUpContent"
      class="leaflet-popup"
      :style="{
        transform: `translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`,
      }"
    >
      <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div id="forcePopUpLink" class="leaflet-popup-content">
          <div class="leaflet-popup-content">
            <header>
              {{ forceEntity.name }}
            </header>
            <ul class="content-body">
              <li
                v-for="(item, key, index) in forceEntity.fix_data"
                :key="index"
                v-show="item && !~filterKey.indexOf(key)"
              >
                <span>{{ key }}</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <div class="btns-body">
              <span @click="doVideoRtmp"
                ><img src="/static/images/popup-icon/现场直达.png" />
                <p>现场直达</p></span
              >
              <span @click="doCircleBuffer"
                ><img src="/static/images/popup-icon/人口动态.png" />
                <p>人口动态</p></span
              >
              <span @click="doAroundSourceAnalyse"
                ><img src="/static/images/popup-icon/周边分析.png" />
                <p>周边分析</p></span
              >
              <span class="btns-body-disable"
                ><img src="/static/images/popup-icon/在线批示.png" />
                <p>在线批示</p></span
              >
              <span class="btns-body-disable"
                ><img src="/static/images/popup-icon/业务直达.png" />
                <p>业务直达</p></span
              >
            </div>
          </div>
        </div>
        <div class="around-people" v-if="buffer && buffer.success">
          <!-- <img src="/static/images/common/frameline@2x.png" /> -->
          <div>
            <header>周边实时人口</header>
            <div>
              <p>范围：500米</p>
              <strong>{{ `人数：${buffer.data || "-"}人` }}</strong>
              <p>{{ buffer.task_time }}</p>
            </div>
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
      buffer: null,
      filterKey: ["永久固定码", "唯一码", "分类代码"],
    };
  },
  created() {
    window.billboardMap["pathRoute_analyse_points"] = window.earth.scene.primitives.add(
      new Cesium.PointPrimitiveCollection()
    );
    window.labelMap["pathRoute_analyse_labels"] = window.earth.scene.primitives.add(
      new Cesium.LabelCollection()
    );
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      //  周边实时人口分析
      this.$bus.$on("cesium-3d-around-people", ({ id, result, type }) => {
        if (type == "event") this.buffer = result;
      });
      //  清除pop附带信息
      this.$bus.$on("cesium-3d-event-pop-clear", () => {
        this.closePopup();
      });
    },
    /**
     *  详情点赋值
     *  @param {object} forceEntity 详情点信息
     */
    getForceEntity(forceEntity) {
      this.forceEntity = forceEntity;
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
    },
    /**
     *  框体移动
     *  @param {object} position
     */
    renderForceEntity() {
      const forceEntity = this.forceEntity;
      if (forceEntity.fix_data) {
        const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.earth.scene,
          forceEntity.position
        );
        if (
          pointToWindow &&
          (this.forcePosition.x !== pointToWindow.x ||
            this.forcePosition.y !== pointToWindow.y)
        ) {
          this.forcePosition = {
            x:
              pointToWindow.x -
              (($(".leaflet-popup-content-wrapper").width() || 0) * 2) / 2,
            y: pointToWindow.y - ($(".leaflet-popup-content-wrapper").height() || 0) - 90,
          };
        }
      }
    },
    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer() {
      this.buffer = this.buffer ? null : {};
      const { name, geometry } = this.forceEntity;
      this.$bus.$emit("cesium-3d-population-circle", {
        doDraw: this.buffer,
        id: name,
        geometry: {
          lng: geometry.x,
          lat: geometry.y,
        },
        type: "event",
      });
    },

    /**
     * 仅传参数给RtmpVideo组件,不参与后续功能
     * @param {object} param0 该医疗点的对象信息
     */
    doVideoRtmp() {
      const { geometry, name } = this.forceEntity;
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-rtmpFetch", {
        shortname: name,
        geometry: { lng: x, lat: y },
      });
    },
    /**
     * 周边分析跳转
     */
    doAroundSourceAnalyse() {
      const { geometry, fix_data } = this.forceEntity;
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-around-analyse-pick", { lng: x, lat: y, fix_data });
    },
    closePopup() {
      this.forcePosition = {};
      this.forceEntity = {};
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      this.$bus.$emit("cesium-3d-around-analyse-clear");
      this.$bus.$emit("cesium-3d-navigation-clear");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./aroundPeople.less");
#forcePopUp {
  .leaflet-popup {
    top: 0;
    left: 0;
    position: absolute;
    text-align: center;
  }

  .leaflet-popup-close-button {
    position: absolute;
    top: 2vh;
    right: 4vh;
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

  .leaflet-popup-content-wrapper {
    background-image: url("/static/images/common/detail@2x.png");
    background-size: 100% 100%;
    text-align: center;
    height: 27vh;
    width: 46vh;
    box-sizing: border-box;
    padding: 3vh;
  }

  .leaflet-popup-content {
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    > header {
      height: 2.6vh;
      line-height: 2.6vh;
      box-sizing: border-box;
      padding-right: 2vh;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    > .btns-body {
      > span {
        display: inline-block;
        cursor: pointer;
        color: white;
        background: linear-gradient(to top, rgba(71, 98, 161, 0.4), #3498db);
        padding: 1vh 0.6vh;
        border-radius: 0.4vh;
        text-align: center;
        > img {
          width: 2vh;
          height: 2vh;
          display: inline-block;
        }
      }
      > .btns-body-disable {
        background: gray;
        cursor: unset !important;
      }
    }
    > .content-body {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 1vh;
      > li {
        font-size: 1.4vh;
        line-height: 2.4vh;
        font-weight: 300;
        float: left;
        width: 100%;
        display: flex;
        // border-bottom: 1px rgba(255,255,255,0.6) solid;
        > span {
          display: inline-block;
          vertical-align: top;
          height: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        > span:first-child {
          width: 9vh;
        }
        > span:last-child {
          flex: 1;
        }
      }
    }
  }
}
</style>
