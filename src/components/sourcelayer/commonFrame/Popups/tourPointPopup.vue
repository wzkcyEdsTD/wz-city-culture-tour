<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-03 21:24:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\tourPointPopup.vue
-->
<template>
  <div id="trackPopUp" v-if="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`trackPopUpContent_${index}`"
      class="leaflet-popup-tourPoint"
      :style="{ transform: `translate3d(${item.x}px,${item.y + 40}px, 0)` }"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name">{{ item.name }}</div>
          <div class="tip-num">
            <table border="0">
              <tbody>
                <tr>
                  <td>
                    <p>景区等级</p>
                    <p>{{ item.attributes.LEVEL_USER || "-" }}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>实时人口流量</p>
                    <p>{{ item.extra_data.dataVal || "-" }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="right-btns">
          <span @click="doVideoRtmp(item)">直达现场</span>
          <span @click="doCircleBuffer(item)">周边人口</span>
        </div>
        <div class="around-people" v-if="bufferHash[item.id]">
          <img src="/static/images/common/frameline@2x.png" />
          <div>
            <header>周边实时人口</header>
            <div>
              <p>范围：500米</p>
              <strong>{{ `人数：${bufferHash[item.id].data || "-"}人` }}</strong>
              <p>{{ bufferHash[item.id].task_time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "tourPointPopup",
  data() {
    return {
      shallPop: false,
      popList: [],
      // 保存是否周边查询
      bufferHash: {},
    };
  },
  computed: {
    ...mapGetters("map", ["tourPointList", "forceTrueTopicLabels"]),
  },
  async created() {
    await this.fetchTourPointList();
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["fetchTourPointList"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.bufferHash[id] = result;
      });
    },
    fixPopup() {
      if (
        !window.entityMapGeometry ||
        !window.entityMapGeometry["重点景区"] ||
        !~this.forceTrueTopicLabels.indexOf("重点景区")
      ) {
        this.doPopup([]);
      } else {
        const tourPointList = this.tourPointList;
        if (tourPointList && Object.keys(tourPointList).length) {
          const G_tourPointList = [];
          for (let key in tourPointList) {
            if (window.entityMapGeometry["重点景区"][key]) {
              const item = window.entityMapGeometry["重点景区"][key];
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              pointToWindow &&
                G_tourPointList.push({
                  ...item,
                  geometry: { x, y },
                  extra_data: tourPointList[key],
                  pointToWindow,
                });
            }
          }
          this.doPopup(G_tourPointList);
        }
      }
    },
    doPopup(G_tourPointList) {
      const popList = [];
      if (G_tourPointList.length) {
        G_tourPointList.map((item, index) => {
          popList.push({
            id: item.id,
            name: item.attributes.NAME,
            attributes: item.attributes,
            extra_data: item.extra_data,
            color:
              item.extra_data.status == "绿"
                ? "green"
                : item.extra_data.status == "红"
                ? "red"
                : "gold",
            geometry: item.geometry,
            x: item.pointToWindow.x - ($(`#trackPopUpContent_${index}`).width() || 0) / 2,
            y: item.pointToWindow.y - ($(`#trackPopUpContent_${index}`).height() || 0),
          });
        });
        this.popList = popList;
        !this.shallPop &&
          this.$nextTick(() => {
            this.shallPop = true;
          });
      } else {
        this.shallPop && this.closePopup();
      }
    },

    closePopup() {
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      this.shallPop = false;
      this.bufferHash = {};
    },

    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer(obj) {
      this.bufferHash[obj.id] = this.bufferHash[obj.id] ? null : {};
      this.$bus.$emit("cesium-3d-population-circle", {
        doDraw: this.bufferHash[obj.id],
        id: obj.id,
        geometry: {
          lng: obj.geometry.x,
          lat: obj.geometry.y,
        },
      });
    },

    /**
     * 仅传参数给RtmpVideo组件,不参与后续功能
     * @param {object} param0 该医疗点的对象信息
     */
    doVideoRtmp({ shortname, geometry }) {
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-rtmpFetch", {
        shortname,
        geometry: { lng: x, lat: y },
      });
    },
  },
};
</script>

<style lang="less">
@import url("./aroundPeople.less");
.leaflet-popup-tourPoint {
  position: fixed;
  text-align: center;
  top: -20px;
  left: 0;
  cursor: pointer;
  .main-body {
    width: 100%;
    height: 0;
    > .tourPoint-ico {
      position: absolute;
      width: 30px;
      height: 30px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-32%);
    }
    > .tourPoint-warn {
      position: absolute;
      width: 70px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-44%);
    }
  }
  .popup-tip-container {
    width: 26vh;
    height: 20vh;
    background-image: url("/static/images/common/station-frame@2x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .popup-tip-inner {
    height: 10.6vh;
    display: flex;
    color: #fff;
  }

  .tip-name {
    width: 38%;
    box-sizing: border-box;
    writing-mode: vertical-lr;
    letter-spacing: -0.34em;
    height: 100%;
    text-align: center;
    padding: 8px 0 2px 7px;
    position: relative;
    font-family: YouSheBiaoTiHei;
    font-size: 1.8vh;
    text-shadow: 0 2px 2px #000;
    display: flex;
    align-items: center;
  }

  .tip-num {
    flex: 1;
    box-sizing: border-box;
    padding: 2vh 0.6vh 0.6vh 0.6vh;
    table {
      height: 100%;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0px 5px;
      font-size: 1.6vh;
    }

    table tbody tr td {
      &:first-child {
        width: 100%;
        font-weight: bolder;
        vertical-align: middle;
      }
      &:last-child {
        p {
          &.people-icon {
            content: url("/static/images/icons/people.png");
          }
        }
      }
    }

    p {
      font-size: 1.6vh;
      &:first-child {
        font-weight: bolder;
      }
      &:last-child {
        font-weight: 700;
        color: #2fc25a;
        font-family: DIN;
      }
    }
  }

  .green {
    color: #2fc25a !important;
  }

  .right-btns {
    width: 100%;
    height: 26px;
    box-sizing: border-box;
    padding: 2px 20px 0 30px;
    color: #fff;
  }

  .right-btns span {
    font-family: YouSheBiaoTiHei;
    font-size: 1.8vh;
    display: block;
    width: 50%;
    height: 2.8vh;
    line-height: 2.8vh;
    letter-spacing: 1px;
    float: left;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0);
  }

  .right-btns span:first-child {
    background-image: url("/static/images/common/tourPoint-rtmpVideo.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .right-btns span:last-child {
    background-image: url("/static/images/common/population.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
