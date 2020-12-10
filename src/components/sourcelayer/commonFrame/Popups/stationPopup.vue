<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-03 21:24:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\stationPopup.vue
-->
<template>
  <div id="trackPopUp" v-if="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`trackPopUpContent_${index}`"
      class="leaflet-popup-station"
      :style="{ transform: `translate3d(${item.x}px,${item.y + 50}px, 0)` }"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name">铁路站点</div>
          <div class="tip-num">
            <p>{{ item.name }}</p>
            <table border="0">
              <tbody>
                <tr>
                  <td>进站流量</td>
                  <td>
                    <p>{{ item.extra_data.in || "-" }}人</p>
                  </td>
                </tr>
                <tr>
                  <td>出站流量</td>
                  <td :class="item.color">
                    <p>{{ item.extra_data.out || "-" }}人</p>
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
  name: "stationPopup",
  data() {
    return {
      shallPop: false,
      popList: [],
      // 保存是否周边查询
      bufferHash: {},
    };
  },
  computed: {
    ...mapGetters("map", ["stationList", "forceTrueTopicLabels"]),
  },
  async created() {
    await this.fetchStationList();
    //  5分钟取一次卡口信息
    setInterval(() => {
      this.fetchStationList();
    }, 1000 * 60 * 5);
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["fetchStationList"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.bufferHash[id] = result;
      });
    },
    fixPopup() {
      if (
        !window.entityMapGeometry ||
        !window.entityMapGeometry["S1站点"] ||
        !~this.forceTrueTopicLabels.indexOf("S1站点")
      ) {
        this.doPopup([]);
      } else {
        const stationList = this.stationList;
        if (stationList && Object.keys(stationList).length) {
          const G_stationList = [];
          for (let key in stationList) {
            if (window.entityMapGeometry["S1站点"][key]) {
              const item = window.entityMapGeometry["S1站点"][key];
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              pointToWindow &&
                G_stationList.push({
                  ...item,
                  geometry: { x, y },
                  extra_data: stationList[key],
                  pointToWindow,
                });
            }
          }
          this.doPopup(G_stationList);
        }
      }
    },
    doPopup(G_stationList) {
      const popList = [];
      if (G_stationList.length) {
        G_stationList.map((item, index) => {
          popList.push({
            id: item.id,
            name: item.attributes.NAME,
            attributes: item.attributes,
            extra_data: item.extra_data,
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
.leaflet-popup-station {
  position: fixed;
  text-align: center;
  top: -20px;
  left: 0;
  cursor: pointer;
  .main-body {
    width: 100%;
    height: 0;
    > .station-ico {
      position: absolute;
      width: 30px;
      height: 30px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-32%);
    }
    > .station-warn {
      position: absolute;
      width: 70px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-44%);
    }
  }
  .popup-tip-container {
    width: 24vh;
    height: 21vh;
    background-image: url("/static/images/common/station-frame@2x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .popup-tip-inner {
    height: 12vh;
    display: flex;
    color: #fff;
  }

  .tip-name {
    width: 20%;
    box-sizing: border-box;
    writing-mode: vertical-lr;
    letter-spacing: -0.34em;
    height: 100%;
    padding: 20px 0 10px 12px;
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
    padding: 2vh 0.6vh 0.6vh 0.8vh;
    display: flex;
    flex-direction: column;
  }

  .tip-num > p {
    font-family: YouSheBiaoTiHei;
    font-size: 2vh;
    text-shadow: 0 2px 2px #000;
    text-align: left;
    &::before {
      content: url("/static/images/icons/bus.png");
      width: 2vh;
      vertical-align: middle;
    }
  }

  .tip-num table {
    flex: 1;
    border-collapse: separate;
    border-spacing: 0px 5px;
    font-size: 10px;
    width: 100%;
  }

  .tip-num table tbody tr td {
    font-size: 1.4vh;
  }

  .tip-num table tbody tr td:first-child {
    width: 50%;
    font-weight: bolder;
    vertical-align: middle;
    line-height: 2vh;
    text-align: left;
  }

  .tip-num table tbody tr td:last-child {
    vertical-align: middle;
    font-family: DIN;
    font-weight: 700;
    color: #2acbfe;
    font-size: 1.4vh;
  }

  .tip-num table tbody tr:first-child td {
    &:first-child::before {
      content: url("/static/images/icons/station-in.png");
      width: 2vh;
      vertical-align: middle;
    }
    &:last-child {
      color: rgb(82, 255, 47);
    }
  }

  .tip-num table tbody tr:last-child td {
    &:first-child::before {
      content: url("/static/images/icons/station-out.png");
      width: 2vh;
      vertical-align: middle;
    }
    &:last-child {
      color: #fcce26;
    }
  }
  .right-btns {
    width: 100%;
    box-sizing: border-box;
    padding: 0px 20px 0 30px;
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
    background-image: url("/static/images/common/station-rtmpVideo.png");
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
