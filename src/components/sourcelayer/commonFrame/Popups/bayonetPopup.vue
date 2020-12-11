<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-03 21:24:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\bayonetPopup.vue
-->
<template>
  <div id="trackPopUp" v-if="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`trackPopUpContent_${index}`"
      class="leaflet-popup-bayonet"
      :style="{ transform: `translate3d(${item.x}px,${item.y + 10}px, 0)` }"
    >
      <div class="around-people" v-if="bufferHash[item.id]">
        <div>
          <header>周边实时人口</header>
          <div>
            <p>范围：500米</p>
            <strong>{{ `人数：${bufferHash[item.id].data || "-"}人` }}</strong>
            <p>{{ bufferHash[item.id].task_time }}</p>
          </div>
        </div>
      </div>
      <div class="main-body">
        <img
          @mouseover="hiddenHash[item.id] = true"
          @mouseleave="hiddenHash[item.id] = false"
          class="bayonet-ico"
          :src="`/static/images/common/${item.extra_data.category}-${item.extra_data.status}.png`"
        />
      </div>
      <div
        class="popup-tip-container"
        v-show="item.extra_data.status == '红' || hiddenHash[item.id]"
        @mouseover="hiddenHash[item.id] = true"
        @mouseleave="hiddenHash[item.id] = false"
      >
        <div class="popup-tip-inner">
          <!-- <div class="tip-name">{{ item.name }}</div> -->
          <div class="tip-num">
            <table border="0">
              <tbody>
                <tr>
                  <td>卡口名称</td>
                  <td style="color: #2fc25a">
                    {{ item.name || "-" }}
                  </td>
                </tr>
                <tr>
                  <td>卡口流量</td>
                  <td :class="item.color">
                    {{ item.extra_data.current_num || "-" }}
                  </td>
                </tr>
                <!-- <tr>
                  <td>卡口状态</td>
                  <td :class="item.color">
                    {{ item.extra_data.status || "-" }}
                  </td>
                </tr> -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="right-btns">
          <span @click="doVideoRtmp(item)">直达现场</span>
          <span @click="doCircleBuffer(item)">周边人口</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "bayonetPopup",
  data() {
    return {
      shallPop: false,
      popList: [],
      // 保存是否周边查询
      bufferHash: {},
      //  是否展示
      hiddenHash: {},
    };
  },
  computed: {
    ...mapGetters("map", ["bayonetList", "forceTrueTopicLabels"]),
  },
  async created() {
    await this.fetchBayonetList();
    //  5分钟取一次卡口信息
    setInterval(() => {
      this.fetchBayonetList();
    }, 1000 * 60 * 5);
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["fetchBayonetList"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.bufferHash[id] = result;
      });
    },
    fixPopup() {
      if (
        !window.entityMapGeometry ||
        !window.entityMapGeometry["交通卡口"] ||
        !~this.forceTrueTopicLabels.indexOf("交通卡口")
      ) {
        this.doPopup([]);
      } else {
        const bayonetList = this.bayonetList;
        if (bayonetList && Object.keys(bayonetList).length) {
          const G_bayonetList = [];
          for (let key in bayonetList) {
            if (window.entityMapGeometry["交通卡口"][key]) {
              const item = window.entityMapGeometry["交通卡口"][key];
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              pointToWindow &&
                G_bayonetList.push({
                  ...item,
                  geometry: { x, y },
                  extra_data: bayonetList[key],
                  pointToWindow,
                });
            }
          }
          this.doPopup(G_bayonetList);
        }
      }
    },
    doPopup(G_bayonetList) {
      const popList = [];
      if (G_bayonetList.length) {
        G_bayonetList.map((item, index) => {
          popList.push({
            id: item.id,
            name: item.attributes.MC,
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
.leaflet-popup-bayonet {
  position: fixed;
  text-align: center;
  top: -20px;
  left: 0;
  height: 0;
  width: 0;
  cursor: pointer;
  .around-people {
    left: -32vh;
  }
  .main-body {
    width: 100%;
    height: 0;
    position: absolute;
    z-index: 2;
    > .bayonet-ico {
      position: absolute;
      width: 30px;
      height: 30px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-32%);
    }
    > .bayonet-warn {
      position: absolute;
      width: 70px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-44%);
    }
  }
  .popup-tip-container {
    position: absolute;
    bottom: 0vh;
    right: -10.5vh;
    width: 21vh;
    height: 15vh;
    background-image: url(/static/images/common/bayonet-frame@2x.png);
    background-size: 100% 118%;
    background-repeat: no-repeat;
  }

  .popup-tip-inner {
    height: 9vh;
    display: flex;
    color: #fff;
  }

  .tip-name {
    width: 28%;
    box-sizing: border-box;
    writing-mode: vertical-lr;
    letter-spacing: -0.34em;
    height: 100%;
    padding: 8px 0 8px 12px;
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
    padding: 1.4vh 0.6vh 0vh 0.6vh;
  }

  .tip-num table {
    height: 100%;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 10px;
    font-size: 10px;
  }

  .tip-num table tbody tr td {
    font-size: 1.5vh;
  }

  .tip-num table tbody tr td:first-child {
    width: 40%;
    font-weight: bolder;
    vertical-align: middle;
  }

  .tip-num table tbody tr td:last-child {
    width: 60%;
    vertical-align: middle;
    font-family: DIN;
    font-weight: 700;
    color: #2acbfe;
  }

  .green {
    color: #2fc25a !important;
  }

  .gold {
    color: gold !important;
  }

  .red {
    color: rgb(255, 72, 72) !important;
  }

  .right-btns {
    width: 100%;
    box-sizing: border-box;
    padding: 2px 20px 0 30px;
    color: #fff;
  }

  .right-btns span {
    font-family: YouSheBiaoTiHei;
    font-size: 1.8vh;
    display: block;
    width: 50%;
    height: 2.4vh;
    line-height: 2.4vh;
    letter-spacing: 1px;
    float: left;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0);
  }

  .right-btns span:first-child {
    background-image: url("/static/images/common/bayonet-rtmpVideo.png");
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
