<!--
 * @Author: eds
 * @Date: 2020-08-25 14:06:37
 * @LastEditTime: 2020-08-31 15:11:46
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\m-bottom\m-bottom.vue
-->
<template>
  <div class="bottom-wrapper">
    <div class="bottom-layers-container" v-show="forceTreeTopic.length">
      <div class="swiper-buttons swiper-button-left"></div>
      <swiper ref="mySwiper" class="layers" :options="swiperOptions">
        <swiper-slide
          v-for="(item,i) in forceTreeTopic"
          :key="i"
          :class="{item:true,active:~forceTrueTopicLabels.indexOf(item.id)}"
        >
          <div>
            <img
              :src="`/static/images/hub-ico/${item.icon}@2x.png`"
              @click="doForceTrueTopicLabels(item.id)"
            />
            <p>{{item.id}}</p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-buttons swiper-button-right"></div>
    </div>
    <div class="bottom-topics-container">
      <ul class="labels">
        <li
          v-for="(item,i) in CESIUM_TREE_OPTION"
          :key="i"
          :class="{item:true,active:item.id==forceTreeLabel,disabled:item.disabled}"
          @click="!item.disabled?forceTreeLabel=item.id:undefined"
        >
          <i>{{item.label}}</i>
        </li>
      </ul>
    </div>
    <!-- extra Components -->
    <transition name="fade">
      <KgLegend v-if="forceTreeLabel == '控规信息'" />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import KgLegend from "./components/KgLegend";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EXTRA_DATA,
  CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
  SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
} from "config/server/medicalTreeOption";
const Cesium = window.Cesium;

export default {
  name: "layerHub",
  data() {
    return {
      //  底部树
      CESIUM_TREE_OPTION,
      forceTreeLabel: "旅游专题",
      forceTreeTopic: [],
      //  资源选中层
      forceTrueTopicLabels: [],
      swiperOptions: {
        slidesPerView: 8,
        navigation: {
          nextEl: ".swiper-button-right",
          prevEl: ".swiper-button-left",
        },
      },
      //  tile layers
      tileLayers: {},
      //  cesium Object
      entityMap: {},
      featureMap: {}, //  源数据,量小
    };
  },
  components: { KgLegend },
  computed: {
    ...mapGetters("map", [
      ...CESIUM_TREE_EXTRA_DATA,
      ...CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
    ]),
  },
  watch: {
    forceTreeLabel(n) {
      this.initForceTreeTopic();
      this.SetForceIndex(n);
    },
  },
  created() {
    this.initForceTreeTopic();
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", [
      ...SET_CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
      ...["SetForceIndex"],
    ]),
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("check-hub");
      this.$bus.$on("check-hub", ({ key }) => {
        this.forceTreeLabel = key;
      });
    },
    /**
     * 一级菜单点击切换
     * 默认选中二级菜单第一个点
     */
    initForceTreeTopic() {
      //  清除旧图层
      this.forceTreeTopic
        .filter((v) => ~this.forceTrueTopicLabels.indexOf(v.id))
        .map((v) => this.nodeCheckChange(v, false));
      //  处理新图层
      const Topics = this.CESIUM_TREE_OPTION.filter(
        (v) => v.label == this.forceTreeLabel
      );
      this.forceTreeTopic = Topics.length ? Topics[0].children : [];
      if (this.forceTreeTopic.length) {
        const forceNode = this.forceTreeTopic[0];
        this.forceTrueTopicLabels = [forceNode.id];
        this.nodeCheckChange(forceNode, true, true);
      } else {
        this.forceTrueTopicLabels = [];
      }
    },
    /**
     * 选中状态
     * @param {string} id
     */
    doForceTrueTopicLabels(id) {
      const label = this.forceTreeTopic.filter((v) => v.id == id)[0];
      if (~this.forceTrueTopicLabels.indexOf(label.id)) {
        if (this.forceTrueTopicLabels.length > 1) {
          this.forceTrueTopicLabels.splice(
            this.forceTrueTopicLabels.indexOf(label.id),
            1
          );
          this.nodeCheckChange(label, false);
        }
      } else {
        this.forceTrueTopicLabels = [
          ...new Set(this.forceTrueTopicLabels.concat([label.id])),
        ];
        this.nodeCheckChange(label, true);
      }
    },
    /**
     * POI fetch
     * @param {object} node
     */
    getPOIPickedFeature(node, fn) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID <= 1000`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            const fields = await getIserverFields(url, newdataset);
            treeDrawTool(this, res, node, fields);
            fn && fn();
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    nodeCheckChange(node, checked, topicLoad) {
      if (checked) {
        if (node.type == "mvt" && node.id) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;
            //  若该节点有额外数据/模块,则触发
            node.withExtraData
              ? fixTreeWithExtra(
                  this.featureMap[node.id],
                  this[node.withExtraData],
                  node,
                  this
                )
              : null;
          } else {
            this.getPOIPickedFeature(node, () => {
              this.switchSearchBox(node, topicLoad);
            });
          }
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          const LAYER = this.tileLayers[node.id];
          this.tileLayers[
            node.id
          ] = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              url: node.url,
              name: node.id,
            })
          );
        }
        this.switchSearchBox(node, topicLoad);
        //  有相机视角配置 -> 跳视角
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (
          node.icon &&
          this.entityMap[node.id] &&
          window.earth.dataSources.length
        ) {
          this.entityMap[node.id].show = false;
          if (node.withExtraData) {
            this[node.saveExtraDataByGeometry]([]);
          }
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    //  先只显示医疗
    switchSearchBox(node, topicLoad) {
      topicLoad && this.forceTreeLabel == "医疗专题"
        ? this.$bus.$emit("cesium-3d-switch-searchBox", {
            shall: node.withExtraData ? true : false,
            node,
          })
        : undefined;
    },
  },
};
</script>

<style scoped lang="less">
@import url("./layerHub.less");
</style>
