<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-03 21:24:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\medicalPopup.vue
-->
<template>
  <div id="trackPopUp" v-if="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`trackPopUpContent_${index}`"
      class="leaflet-popup-medical"
      :style="{ transform: `translate3d(${item.x}px,${item.y + 10}px, 0)` }"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name" @click="showDetail(item)">
            {{ item.shortname }}
          </div>
          <div class="tip-num">
            <table border="0">
              <tbody>
                <tr>
                  <td>等级</td>
                  <td>{{ item.grade || "-" }}</td>
                </tr>
                <tr>
                  <td>发热人数</td>
                  <td>{{ item.extra_data["发热病人"] || "-" }}</td>
                </tr>
                <tr>
                  <td>门诊人次</td>
                  <td>{{ item.extra_data["实时门诊人次"] || "-" }}</td>
                </tr>
                <tr>
                  <td>住院人数</td>
                  <td>{{ item.extra_data["住院人次"] || "-" }}</td>
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
  name: "medicalPopup",
  data() {
    return {
      shallPop: false,
      popList: [],
      // 保存是否周边查询
      bufferHash: {},
    };
  },
  computed: {
    ...mapGetters("map", ["medicalList", "forceTrueTopicLabels"]),
  },
  async created() {
    await this.fetchMedicalList();
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["fetchMedicalList"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.bufferHash[id] = result;
      });
    },
    fixPopup() {
      if (
        !window.entityMapGeometry ||
        !window.entityMapGeometry["医疗场所"] ||
        !~this.forceTrueTopicLabels.indexOf("医疗场所")
      ) {
        this.doPopup([]);
      } else {
        const medicalList = this.medicalList;
        if (medicalList && Object.keys(medicalList).length) {
          const G_medicalList = [];
          for (let key in medicalList) {
            if (window.entityMapGeometry["医疗场所"][key]) {
              const item = window.entityMapGeometry["医疗场所"][key];
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              pointToWindow &&
                G_medicalList.push({
                  ...item,
                  geometry: { x, y },
                  extra_data: medicalList[key],
                  pointToWindow,
                });
            }
          }
          this.doPopup(G_medicalList);
        }
      }
    },
    doPopup(G_medicalList) {
      const popList = [];
      if (G_medicalList.length) {
        G_medicalList.map((item, index) => {
          popList.push({
            id: item.id,
            name: item.attributes.NAME,
            grade: this.fixGrade(item.attributes.DEFINING_T),
            // grade: item.attributes.DEFINING_T,
            shortname: item.attributes.SHORTNAME,
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

    fixGrade(defining) {
      return ~defining.indexOf("三级甲等") ? "三级甲等" : "";
    },

    closePopup() {
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      this.shallPop = false;
      this.bufferHash = {};
    },

    // 展示详情
    showDetail(obj) {
      this.$parent.isInfoFrame = true;
      this.$parent.$refs.infoframe.attributes = {
        ...obj.attributes,
        ...obj.extra_data,
      };
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
.leaflet-popup-medical {
  position: absolute;
  text-align: center;
  top: -20px;
  left: 0;
  cursor: pointer;
  .popup-tip-container {
    width: 26vh;
    height: 24vh;
    background-image: url("/static/images/common/pop_bg@2x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .popup-tip-inner {
    height: 12vh;
    display: flex;
    color: #fff;
  }

  .tip-name {
    width: 30%;
    box-sizing: border-box;
    writing-mode: vertical-lr;
    letter-spacing: -0.34em;
    height: 100%;
    padding: 4px 0 2px 7px;
    position: relative;
    font-family: YouSheBiaoTiHei;
    font-size: 1.8vh;
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
    padding: 2vh 0.6vh 0.6vh 0.6vh;
  }

  .tip-num table {
    height: 100%;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 5px;
    font-size: 10px;
  }

  .tip-num table tbody tr td {
    font-size: 1.4vh;
  }

  .tip-num table tbody tr td:first-child {
    width: 50%;
    font-weight: bolder;
    vertical-align: middle;
  }

  .tip-num table tbody tr td:last-child {
    vertical-align: middle;
    font-family: DIN;
    font-weight: 700;
    color: #2acbfe;
    font-size: 1.6vh;
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
    background-image: url("/static/images/common/rtmpVideo.png");
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
