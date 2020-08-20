<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-08-20 19:34:07
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\commonFrame\popup.vue
-->
<template>
  <div id="trackPopUp" v-show="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`trackPopUpContent_${index}`"
      class="leaflet-popup"
      :style="{transform:`translate3d(${item.x}px,${item.y}px, 0)`}"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name">{{ item.shortname }}</div>
          <div class="tip-num">
            <table border="0">
              <tbody>
                <tr>
                  <td>等级</td>
                  <td>{{ item.grade }}</td>
                </tr>
                <tr>
                  <td>人数</td>
                  <td>{{ item.feverNum }}</td>
                </tr>
              </tbody>
            </table>
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
      shallPop: false,
      popList: [],
    };
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-mvt");
      this.$bus.$on("cesium-3d-mvt", ({ scene, pickedList, pointList }) => {
        // console.log("list", pickedList, pointList);

        that.popList = [];

        if (pickedList.length) {
          pickedList.map((item, index) => {
            // console.log(item);
            if (pointList[index]) {
              that.popList.push({
                id: item.id,
                name: item.attributes.NAME,
                grade: that.fixGrade(item.attributes.DEFINING_T),
                shortname: item.attributes.SHORTNAME,
                feverNum: item.feverNum || 0,
                x:
                  pointList[index].x -
                  $(`#trackPopUpContent_${index}`).width() / 2,
                y:
                  pointList[index].y -
                  $(`#trackPopUpContent_${index}`).height(),
              });
            }
          });
        }

        this.$nextTick(() => {
          this.shallPop = true;
        });
      });
    },

    /**
     * 2020/8/20
     * 等级展示（目前先展示三甲医院）
     */
    fixGrade(defining) {
      if (~defining.indexOf("三级甲等")) {
        return "三级甲等";
      } else {
        return "";
      }
    },

    closePopup() {
      this.$bus.$emit("cesium-3d-mvt-down");
      this.shallPop = false;
    },

    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer() {},
    /**
     * @param {string} id?:string 有id去id 没有id去全部
     * 关闭周边人口按钮触发
     */
    clearCircleBuffer(id) {
      //  code
    },
    /**
     * 仅传参数给RtmpVideo组件,不参与后续功能
     * @param {object} 该医疗点的对象信息
     */
    doVideoRtmp(obj) {
      this.$bus.$emit("cesium-3d-rtmpFetch", { obj });
    },
  },
};
</script>

<style>
.leaflet-popup {
  position: absolute;
  text-align: center;
  top: -20px;
  left: 0;
  z-index: 99999;
}

.popup-tip-container {
  position: relative;
  width: 160px;
  height: 100px;
  background-image: url("../../../common/images/pop_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.popup-tip-inner {
  position: absolute;
  left: 10px;
  top: 7px;
  height: 50px;
  display: flex;
  color: #fff;
}

.tip-name {
  width: 60px;
  height: 100%;
  padding: 0 2px;
  position: relative;
  font-family: YouSheBiaoTiHei;
  font-size: 14px;
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
  padding: 0px 2px;
}

.tip-num table {
  height: 100%;
  border-collapse: separate;
  border-spacing: 0px 4px;
  font-size: 10px;
}

.tip-num table tbody tr td {
  font-family: PingFang;
}

.tip-num table tbody tr td:first-child {
  width: 30px;
  font-weight: bolder;
  vertical-align: middle;
}

.tip-num table tbody tr td:last-child {
  text-align: left;
  vertical-align: middle;
}
</style>
