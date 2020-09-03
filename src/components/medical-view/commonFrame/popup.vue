<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2020-09-03 11:53:11
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
      :style="{transform:`translate3d(${item.x}px,${item.y+4}px, 0)`}"
    >
      <div class="popup-tip-container">
        <div class="popup-tip-inner">
          <div class="tip-name" @click="showDetail(item)">{{ item.shortname }}</div>
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
        <div class="right-btns">
          <span @click="doVideoRtmp(item)">直达现场</span>
          <span @click="doCircleBuffer(item)">周边人口</span>
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
      // 保存是否周边查询
      bufferHash: {},
    };
  },
  async mounted() {
    //  await feverList();
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {},
    doPopup(pickedList, pointList) {
      const popList = [];
      if (pickedList.length) {
        pickedList.map((item, index) => {
          if (pointList[index]) {
            popList.push({
              id: item.id,
              name: item.attributes.NAME,
              grade: this.fixGrade(item.attributes.DEFINING_T),
              shortname: item.attributes.SHORTNAME,
              feverNum: item.feverNum || 0,
              attributes: item.attributes,
              geometry: item.geometry,
              x:
                pointList[index].x -
                ($(`#trackPopUpContent_${index}`).width() || 0) / 2,
              y:
                pointList[index].y -
                ($(`#trackPopUpContent_${index}`).height() || 0),
            });
          }
        });
      }
      this.popList = popList;
      !this.shallPop &&
        this.$nextTick(() => {
          this.shallPop = true;
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
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.shallPop = false;
    },

    // 展示详情
    showDetail(obj) {
      console.log("showDetail", obj);
      this.$parent.isInfoFrame = true;
      this.$parent.$refs.infoframe.indexOption = obj;
    },

    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer(obj) {
      const that = this;
      console.log(obj);

      if (!this.bufferHash[obj.id]) {
        this.bufferHash[obj.id] = true;
      } else {
        this.bufferHash[obj.id] = !this.bufferHash[obj.id];
      }

      this.$bus.$emit("cesium-3d-population-circle", {
        doDraw: that.bufferHash[obj.id],
        id: obj.id,
        geometry: {
          lng: obj.geometry.x,
          lat: obj.geometry.y,
        },
      });
    },

    /**
     * @param {string} id?:string 有id去id 没有id去全部
     * 关闭周边人口按钮触发
     */
    clearCircleBuffer(id) {
      //  code
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

<style>
.leaflet-popup {
  position: absolute;
  text-align: center;
  top: -20px;
  left: 0;
  z-index: 99999;
  cursor: pointer;
}

.popup-tip-container {
  position: relative;
  width: 160px;
  height: 130px;
  background-image: url("../../../common/images/pop_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.popup-tip-inner {
  position: relative;
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

.right-btns {
  width: 160px;
  color: #fff;
  margin-top: 14px;
  padding-left: 19px;
}

.right-btns span {
  font-family: YouSheBiaoTiHei;
  font-size: 14px;
  display: block;
  width: 63px;
  height: 20px;
  line-height: 20px;
  letter-spacing: 1px;
  float: left;
  padding: 2px;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
}

.right-btns span:first-child {
  background-image: url("../../../common/images/rtmpVideo.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.right-btns span:last-child {
  background-image: url("../../../common/images/population.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
