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
      :style="{transform:`translate3d(${item.x}px,${item.y+4}px, 0)`}"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name">{{ item.attributes.MC }}</div>
          <div class="tip-num">
            <table border="0">
              <tbody>
                <tr>
                  <td>卡口类型</td>
                  <td style="color:#2fc25a;">{{ item.extra_data.category || '-' }}</td>
                </tr>
                <tr>
                  <td>卡口流量</td>
                  <td style="color:gold;">{{ item.extra_data.current_num || '-' }}</td>
                </tr>
                <tr>
                  <td>卡口状态</td>
                  <td style="color:#2acbfe;">{{ item.extra_data.status || '-' }}</td>
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
            <header>周边500米实时人口</header>
            <div>
              <p>{{bufferHash[item.id].task_time}}</p>
              <p>{{`人数：${bufferHash[item.id].data || '-'}人`}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-body">
        <!-- <img :src="`/static/images/common/快速路流量-绿.png`" />
        <img src="/static/images/common/warn@2x.png" />-->
        <img
          class="bayonet-ico"
          :src="`/static/images/common/${item.extra_data.category}-${item.extra_data.status}.png`"
        />
        <img
          class="bayonet-warn"
          v-if="item.extra_data.status=='红'"
          src="/static/images/common/warn@2x.png"
        />
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
    };
  },
  computed: {
    ...mapGetters("map", ["bayonetListWithGeometry"]),
  },
  async created() {
    await this.fetchBayonetList();
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["fetchBayonetList"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        console.log(id, result);
        this.bufferHash[id] = result;
      });
    },
    fixPopup() {
      const bayonetList = this.bayonetListWithGeometry;
      if (bayonetList && bayonetList.length) {
        const G_bayonetList = [];
        bayonetList.map((item) => {
          if (item.geometry) {
            const { x, y } = item.geometry;
            const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              window.earth.scene,
              Cesium.Cartesian3.fromDegrees(x, y, 0)
            );
            pointToWindow && G_bayonetList.push({ ...item, pointToWindow });
          }
        });
        this.doPopup(G_bayonetList);
      } else {
        this.doPopup([]);
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
            geometry: item.geometry,
            x:
              item.pointToWindow.x -
              ($(`#trackPopUpContent_${index}`).width() || 0) / 2,
            y:
              item.pointToWindow.y -
              ($(`#trackPopUpContent_${index}`).height() || 0),
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
      this.shallPop = false;
      this.bufferHash = {};
    },

    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer(obj) {
      if (!this.bufferHash[obj.id]) {
        this.bufferHash[obj.id] = {};
      } else {
        this.bufferHash[obj.id] = null;
      }
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
.leaflet-popup-bayonet {
  position: fixed;
  text-align: center;
  top: -20px;
  left: 0;
  cursor: pointer;
  .main-body {
    width: 100%;
    height: 0;
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
      width: 100px;
      bottom: -24px;
      left: 50%;
      transform: translateX(-44%);
    }
  }
  .popup-tip-container {
    width: 200px;
    height: 200px;
    background-image: url("/static/images/common/bayonet-frame@2x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .popup-tip-inner {
    height: 102px;
    display: flex;
    color: #fff;
  }

  .tip-name {
    width: 60px;
    box-sizing: border-box;
    writing-mode: vertical-lr;
    letter-spacing: -0.34em;
    height: 100%;
    line-height: 17px;
    padding: 4px 0 2px 7px;
    position: relative;
    font-family: YouSheBiaoTiHei;
    font-size: 17px;
    text-shadow: 0 2px 2px #000;
    display: flex;
    align-items: center;
  }

  .tip-name::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -1px;
    transform: translate(0, -50%);
    height: 100%;
    width: 1px;
    background-color: #fff;
    opacity: 0.43;
  }

  .tip-num {
    flex: 1;
    box-sizing: border-box;
    padding: 18px 6px 6px 6px;
  }

  .tip-num table {
    height: 100%;
    border-collapse: separate;
    border-spacing: 0px 5px;
    font-size: 10px;
  }

  .tip-num table tbody tr td {
    font-family: PingFang;
  }

  .tip-num table tbody tr td:first-child {
    width: 54px;
    font-weight: bolder;
    vertical-align: middle;
  }

  .tip-num table tbody tr td:last-child {
    vertical-align: middle;
    font-family: DIN;
    font-weight: 700;
    color: #2acbfe;
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
    font-size: 16px;
    display: block;
    width: 50%;
    height: 26px;
    line-height: 26px;
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

.around-people {
  height: 0px;
  > img {
    width: 350px;
    height: 70px;
    position: absolute;
    right: 90px;
    bottom: 10px;
  }
  > div {
    position: absolute;
    width: 170px;
    height: 70px;
    left: -240px;
    bottom: 10px;
    box-sizing: border-box;
    padding: 2px 8px;
    background: url("/static/images/common/people-frame.png");
    background-size: 100% 100%;
    // background: linear-gradient(to bottom, #2287f1 0%, rgba(0, 0, 0, 0.2) 50%);
    > header {
      width: 100%;
      height: 24px;
      line-height: 24px;
      color: #fff;
      font-size: 0.9em;
      text-align: left;
    }
    > div {
      color: #cbcbcb;
      text-align: left;
      font-size: 0.8em;
      line-height: 20px;
    }
  }
}
</style>
