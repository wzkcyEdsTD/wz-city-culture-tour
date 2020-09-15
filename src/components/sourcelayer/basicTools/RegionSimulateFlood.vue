<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'700px'}">
    <div class="RegionSimulateFlood tframe">
      <el-form ref="dxForm" :rules="regionSimulaterules" :model="dxForm" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="流域" prop="rivername">
              <el-select
                v-model="dxForm.rivername"
                popper-class="select-option"
                placeholder="请选择流域"
                size="small"
                @change="changedxRiver($event)"
              >
                <el-option
                  v-for="item in riveroption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="淹没速度（米/秒）" prop="floodspeed">
              <el-input v-model="dxForm.floodspeed" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最大高度（米）" prop="maxheight">
              <el-input v-model="dxForm.maxheight" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="startRegionSimulate('dxForm')">开始</el-button>
              <el-button class="elformbtn" @click="clearRegionSimulate">清除</el-button>
              <el-button class="elformbtn" @click="closeRegionSimulate">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
import riveroption from "mock/riverOption.json";
import riverdata from "mock/riverData.js";
export default {
  name: "RegionSimulateFlood",
  data() {
    return {
      // 地形淹没
      dxForm: {
        rivername: "",
        floodspeed: "",
        maxheight: ""
      },
      primitivelist: [],
      riveroption,
      currentHeight: 0,
      // 地形淹没模拟定时器
      simulatetimer: null,
      regionSimulaterules: {
        rivername: [
          { required: true, message: "请选择流域", trigger: "change" }
        ],
        floodspeed: [
          { required: true, message: "请输入淹没速度", trigger: "blur" }
        ],
        maxheight: [
          { required: true, message: "请输入最大高度", trigger: "blur" }
        ]
      },
      // 流域位置
      curRiverPosition: [],
      coords: []
    };
  },
  mounted() {
    this.$bus.$off("clearRegionSimulateFloodForm");
    this.$bus.$on("clearRegionSimulateFloodForm", () => {
      // 清除所有表单数据
      this.dxForm = { rivername: "", floodspeed: "", maxheight: "" };
      // 清除计时器
      if (this.simulatetimer) {
        this.clearRegionSimulate();
      }
    });
  },
  methods: {
    // 流域改变时改变分析区域
    changedxRiver(prov) {
      // 先清除已有模拟
      this.currentHeight = 0;
      // 定位到流域范围
      const entities = window.earth.entities.values;
      const length = entities.length;
      for (var i = 0; i < length; i++) {
        if (entities[i].name.indexOf(prov) !== -1) {
          window.earth.zoomTo(entities[i]);
        }
      }
      // 获取流域范围
      this.curRiverPosition = [];
      this.coords = [];
      var arr = riverdata.features;
      arr.forEach((i, index) => {
        if (i.properties.Name.indexOf(prov) !== -1) {
          var coords = i.geometry.coordinates[0];
          for (var x = 0; x < coords.length; x++) {
            this.curRiverPosition.push(coords[x][0]);
            this.curRiverPosition.push(coords[x][1]);
            this.coords.push(coords[x][0]);
            this.coords.push(coords[x][1]);
            this.curRiverPosition.push(0);
          }
        }
      });
    },
    // 模拟地形淹没
    startRegionSimulate(formName) {
      this.currentHeight = 0;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.simulatetimer = setInterval(() => {
            this.simulateRegionFlood();
          }, 500);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 地形淹没实时模拟
    simulateRegionFlood() {
      if (this.currentHeight > this.dxForm.maxheight) {
        clearInterval(this.simulatetimer);
        return;
      }

      // 使用primitive模拟洪水淹没
      this.hidePrimitive();
      var Primits = new Cesium.PrimitiveCollection();
      const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(this.coords)
          ),
          // height: 10,
          extrudedHeight: this.currentHeight
        })
      });
      const primitive = new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.MaterialAppearance({
          material: new Cesium.Material({
            fabric: {
              type: "Color",
              uniforms: {
                color: Cesium.Color.fromCssColorString("#3371D6").withAlpha(0.6)
              }
            }
            // translucent:true
          })
        })
      });
      Primits.add(primitive);
      window.earth.scene.primitives.add(Primits);
      this.primitivelist.push(Primits._guid); // 存储guid，方便清空
      this.currentHeight += parseInt(this.dxForm.floodspeed);
    },
    closeRegionSimulate() {
      this.clearRegionSimulate();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    // 清除地形淹没效果
    clearRegionSimulate() {
      clearInterval(this.simulatetimer);
      this.clearPrimitive();
    },
    // 隐藏primitive
    hidePrimitive() {
      const primitives = window.earth.scene.primitives;
      var length = primitives.length;
      // 清除primitive
      for (var i = 0; i < length; ++i) {
        window.earth.scene.primitives.get(i).show = false;
      }
      // this.primitivelist = []
    },
    // 清空primitive
    clearPrimitive() {
      const primitives = window.earth.scene.primitives;
      var length = primitives.length;
      // 清除primitive
      for (var i = 0; i < length; ++i) {
        const prim = window.earth.scene.primitives.get(i);
        if (prim && prim._guid) {
          // 筛选已添加的数据并清空
          const newArr = this.primitivelist.filter(p => {
            return p === prim._guid;
          });
          if (newArr.length > 0) {
            window.earth.scene.primitives.remove(prim);
          }
          if (window.earth.scene.primitives.length !== length) {
            length = window.earth.scene.primitives.length;
            i = 0;
          }
        }
      }
      this.primitivelist = [];
    }
  }
};
</script>
