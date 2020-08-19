<!--
 * @Author: eds
 * @Date: 2020-07-21 18:38:39
 * @LastEditTime: 2020-07-28 11:00:21
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\CesiumMapTool.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'680px'}">
    <div class="cesiummaptool tframe">
      <el-form label-width="100px" :rules="toolTypeRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="测量工具" prop="toolType">
              <el-select
                v-model="toolType"
                popper-class="select-option"
                placeholder="测量类型"
                size="small"
                @change="changeMapType($event)"
              >
                <el-option
                  v-for="item in toolTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="gaugeDistance">测距</el-button>
              <el-button class="elformbtn" @click="gaugeArea">测面</el-button>
              <el-button class="elformbtn" @click="gaugeHeight">测高</el-button>
              <el-button class="elformbtn" @click="clearGauge">清除</el-button>
              <el-button class="elformbtn" @click="closeGauge">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
export default {
  name: "CesiumMapTool",
  data() {
    return {
      toolTypeRules: {
        rivername: [
          { required: true, message: "请选择测量类型", trigger: "change" },
        ],
      },
      toolTypes: [
        { label: "空间测量", value: "空间测量" },
        { label: "贴地测量", value: "贴地测量" },
      ],
      toolType: "空间测量",
      // cesium Object
      viewer: undefined,
      handlerDis: undefined,
      handlerArea: undefined,
      handlerHeight: undefined,
      clampMode: 0,
    };
  },
  created() {
    this.viewer = window.earth;
    this.handlerDis = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.Distance,
      this.clampMode
    );
    this.handlerArea = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.Area,
      this.clampMode
    );
    this.handlerHeight = new Cesium.MeasureHandler(
      this.viewer,
      Cesium.MeasureMode.DVH
    );
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.viewer = undefined;
    this.handlerDis = undefined;
    this.handlerArea = undefined;
    this.handlerHeight = undefined;
    this.clearGauge();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handlerDis.measureEvt.addEventListener(function (result) {
        var dis = Number(result.distance);
        var positions = result.positions;
        var distance =
          dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
        that.handlerDis.disLabel.text = "距离:" + distance;
      });
      that.handlerDis.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body").removeClass("measureCur").addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
      that.handlerArea.measureEvt.addEventListener(function (result) {
        var mj = Number(result.area);
        var positions = result.positions;
        var area =
          mj > 1000000
            ? (mj / 1000000).toFixed(2) + "km²"
            : mj.toFixed(2) + "㎡";
        that.handlerArea.areaLabel.text = "面积:" + area;
      });
      that.handlerArea.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body").removeClass("measureCur").addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
      that.handlerHeight.measureEvt.addEventListener(function (result) {
        var distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + "km"
            : result.distance + "m";
        var vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + "km"
            : result.verticalHeight + "m";
        var hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + "km"
            : result.horizontalDistance + "m";
        that.handlerHeight.disLabel.text = "空间距离:" + distance;
        that.handlerHeight.vLabel.text = "垂直高度:" + vHeight;
        that.handlerHeight.hLabel.text = "水平距离:" + hDistance;
      });
      that.handlerHeight.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body").removeClass("measureCur").addClass("measureCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    //  改变select
    changeMapType(prov) {
      this.handlerArea.clampMode = prov == "空间测量" ? 0 : 1;
      this.handlerDis.clampMode = prov == "空间测量" ? 0 : 1;
    },
    //  测距
    gaugeDistance() {
      this.deactiveAll();
      this.handlerDis && this.handlerDis.activate();
    },
    //  测面
    gaugeArea() {
      this.deactiveAll();
      this.handlerArea && this.handlerArea.activate();
    },
    //  测高
    gaugeHeight() {
      this.deactiveAll();
      this.handlerHeight && this.handlerHeight.activate();
    },
    //  关闭地图测量
    closeGauge() {
      this.clearGauge();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    //  清除分析结果
    clearGauge() {
      this.handlerDis && this.handlerDis.clear();
      this.handlerArea && this.handlerArea.clear();
      this.handlerHeight && this.handlerHeight.clear();
    },
    deactiveAll() {
      this.handlerDis && this.handlerDis.deactivate();
      this.handlerArea && this.handlerArea.deactivate();
      this.handlerHeight && this.handlerHeight.deactivate();
    },
  },
};
</script>
