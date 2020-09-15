<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:40
 * @LastEditTime: 2020-07-29 10:01:54
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\SectionAnalyse.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'400px'}">
    <div class="sectionanalyse tframe">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="剖面分析" class="elformbtns">
              <el-button class="elformbtn" @click="startVisualize">开始</el-button>
              <el-button class="elformbtn" @click="clearVisualize">清除</el-button>
              <el-button class="elformbtn" @click="closeVisualize">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <canvas
      style="position : fixed;z-index: 10, right : 2%; bottom : 2%;background-color:rgba(65, 65, 65, 0.5)"
      id="pro"
      height="0"
      width="0"
    ></canvas>
  </div>
</template>
<script>
const Cesium = window.Cesium;
export default {
  name: "VisualizationAnalyse",
  data: {
    handlerLine: undefined,
    handler: undefined,
    profile: undefined,
    tooltip: undefined,
    viewer: undefined
  },
  created() {
    this.viewer = window.earth;
    this.handlerLine = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Line
    );
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.profile = new Cesium.Profile(this.viewer.scene);
    this.tooltip = this.createTooltip(document.body);
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.handlerLine.destroy();
    this.handler.destroy()
    this.profile = undefined;
    this.tooltip = undefined;
    this.viewer = undefined;
    this.clearVisualize();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handlerLine.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
          $("body")
            .removeClass("drawCur")
            .addClass("drawCur");
        } else {
          that.viewer.enableCursorStyle = true;
          $("body").removeClass("drawCur");
        }
      });
      that.handlerLine.movingEvt.addEventListener(function(windowPosition) {
        if (that.handlerLine.isDrawing) {
          that.tooltip.showAt(windowPosition, "<p>右键单击结束绘制</p>");
        } else {
          that.tooltip.showAt(windowPosition, "<p>点击绘制第一个点</p>");
        }
      });
      that.handlerLine.drawEvt.addEventListener(function(result) {
        that.tooltip.setVisible(false);
        var line = result.object;
        var startPoint = line._positions[0];
        var endPoint = line._positions[line._positions.length - 1];
        var scartographic = Cesium.Cartographic.fromCartesian(startPoint);
        var slongitude = Cesium.Math.toDegrees(scartographic.longitude);
        var slatitude = Cesium.Math.toDegrees(scartographic.latitude);
        var sheight = scartographic.height;
        var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
        var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
        var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
        var eheight = ecartographic.height;

        //设置坡面分析的开始和结束位置
        that.profile.startPoint = [slongitude, slatitude, sheight];
        that.profile.endPoint = [elongitude, elatitude, eheight];

        that.profile.extendHeight = 40;

        //分析完毕的回调函数
        that.profile.getBuffer(function(buffer) {
          var canvas = document.getElementById("pro");
          canvas.height = that.profile._textureHeight;
          canvas.width = that.profile._textureWidth;
          var ctx = canvas.getContext("2d");
          var imgData = ctx.createImageData(
            that.profile._textureWidth,
            that.profile._textureHeight
          );
          imgData.data.set(buffer);
          //在canvas上绘制图片
          ctx.putImageData(imgData, 0, 0);
          $("#pro").width(300);
          $("#pro").height(225);
        });
        that.profile.build();
      });
    },
    //  可视域分析
    startVisualize() {
      const that = this;
      that.handlerLine.clear();
      $("#pro").width(0);
      $("#pro").height(0);
      if (that.handlerLine.active) {
        return;
      } else {
        that.handlerLine.activate();
        //由于剖面分析只能绘制直线，此处绘制时单击两次就触发结束事件
        that.handler.setInputAction(function(e) {
          if (that.handlerLine.polyline._actualPositions.length == 2) {
            var result = {};
            result.object = that.handlerLine.polyline;
            that.handlerLine.drawEvt.raiseEvent(result);
            that.handlerLine.deactivate();
            that.handler.removeInputAction(
              Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    },
    //  关闭分析
    closeVisualize() {
      this.clearVisualize();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    //  清除分析结果
    clearVisualize() {
      this.handlerLine && this.handlerLine.clear();
    },
    createTooltip(frameDiv) {
      var tooltip = function(frameDiv) {
        var div = document.createElement("DIV");
        div.className = "twipsy right";
        var arrow = document.createElement("DIV");
        arrow.className = "twipsy-arrow";
        div.appendChild(arrow);
        var title = document.createElement("DIV");
        title.className = "twipsy-inner";
        div.appendChild(title);
        this._div = div;
        this._title = title;
        this.message = "";
        // add to frame div and display coordinates
        frameDiv.appendChild(div);
        var that = this;
        div.onmousemove = function(evt) {
          that.showAt({ x: evt.clientX, y: evt.clientY }, that.message);
        };
      };
      tooltip.prototype.setVisible = function(visible) {
        this._div.style.display = visible ? "block" : "none";
      };
      tooltip.prototype.showAt = function(position, message) {
        if (position && message) {
          this.setVisible(true);
          this._title.innerHTML = message;
          this._div.style.left = position.x + 10 + "px";
          this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
          this.message = message;
        }
      };
      return new tooltip(frameDiv);
    }
  }
};
</script>
