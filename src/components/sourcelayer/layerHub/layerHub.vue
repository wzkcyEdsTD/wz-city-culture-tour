<!--
 * @Author: eds
 * @Date: 2020-08-25 14:06:37
 * @LastEditTime: 2020-08-31 15:11:46
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\m-bottom\m-bottom.vue
-->
<template>
  <div class="bottom-wrapper" v-show="forceTime == 'now'">
    <div
      class="bottom-layers-container bottom-line-left"
      v-show="
        isSourceLayer && forceTreeLabel != '城市总览' && forceTreeTopic.length
      "
    >
      <div class="swiper-buttons swiper-button-left" />
      <swiper ref="mySwiper1" class="layers" :options="swiperOptions">
        <swiper-slide
          v-for="(item, i) in forceTreeTopic"
          :key="i"
          :class="{
            item: true,
            active: ~forceTrueTopicLabels.indexOf(item.id),
          }"
        >
          <div>
            <img
              :src="`/static/images/hub-ico/${item.icon}@2x.png`"
              @click="doForceTrueTopicLabels(item.id)"
            />
            <!-- 先不用::after 伪类绑定 -->
            <div
              class="rings"
              v-if="~forceTrueTopicLabels.indexOf(item.id)"
              @click="doForceTrueTopicLabels(item.id)"
            />
            <p>{{ item.label }}</p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-buttons swiper-button-right" />
    </div>
    <div
      class="bottom-layers-container bottom-line-right"
      v-show="!isSourceLayer && forceTreeEventTopic.length"
    >
      <div class="swiper-buttons swiper-button-left" />
      <swiper ref="mySwiper2" class="layers" :options="swiperOptions">
        <swiper-slide
          v-for="(item, i) in forceTreeEventTopic"
          :key="i"
          :class="{
            item: true,
            active: ~forceEventTopicLabels.indexOf(item.id),
          }"
        >
          <div>
            <img
              :src="`/static/images/hub-ico/${item.icon}@2x.png`"
              @click="doForceEventTopicLabels(item.id)"
            />
            <!-- 先不用::after 伪类绑定 -->
            <div
              class="rings"
              v-if="~forceEventTopicLabels.indexOf(item.id)"
              @click="doForceEventTopicLabels(item.id)"
            />
            <p>{{ item.label }}</p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-buttons swiper-button-right" />
    </div>
    <div class="bottom-topics-container">
      <div
        class="layer-btn source"
        :class="{ active: isSourceLayer }"
        @click="changeLayer('source')"
      >
        <img src="/static/images/layer-ico/source.png" />
        <span class="source-count tag-count" v-show="!isSourceLayer">{{
          TREE_OPTION
        }}</span>
      </div>
      <div class="lay-hub">
        <div class="swiper-layerhub-buttons swiper-layerhub-button-left" />
        <swiper
          ref="mySwiper3"
          class="labels"
          v-show="isSourceLayer"
          :options="swiperExtraOptions"
        >
          <swiper-slide v-for="(item, i) in CESIUM_TREE_OPTION" :key="i">
            <div
              :class="{
                item: true,
                active: item.id == forceTreeLabel,
              }"
              @click="doSetForceTreeLabel(item.id)"
            >
              <i>{{ item.label }}</i>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-layerhub-buttons swiper-layerhub-button-right" />
      </div>

      <!-- <ul class="labels"></ul> -->
      <ul class="labels" v-show="false">
        <li
          v-for="(item, i) in CESIUM_TREE_EVENT_OPTION"
          :key="i"
          :class="{
            item: true,
            active: item.id == forceTreeEventLabel,
          }"
          @click="doSetForceTreeEventLabel(item.id)"
        >
          <i>{{ item.label }}</i>
        </li>
      </ul>
      <EventForm v-show="!isSourceLayer" />
      <div
        class="layer-btn event"
        :class="{ active: !isSourceLayer }"
        @click="changeLayer('event')"
      >
        <img src="/static/images/layer-ico/event.png" />
        <span
          class="event-count tag-count"
          v-show="isSourceLayer && WzEventData.day"
          >{{ WzEventData.day || 0 }}</span
        >
      </div>
    </div>
    <!-- extra Components -->
    <transition name="fade">
      <SourceLegend />
    </transition>
    <ClearLayer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SourceLegend from "./components/SourceLegend";
import ClearLayer from "./components/ClearLayer";
import EventForm from "./components/EventForm";
import { treeDrawTool, treeDrawEventTool } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EVENT_OPTION,
} from "config/server/sourceTreeOption";
import dnFields from "config/local/dnFields";
import { getEventData, getDNList } from "api/cityBrainAPI";
const TREE_OPTION_HUB = {};
const TREE_OPTION =
  CESIUM_TREE_OPTION.map((v) => v.children).flat(2).length - 1;
CESIUM_TREE_OPTION.concat(CESIUM_TREE_EVENT_OPTION)
  .map((v) => v.children)
  .flat(2)
  .map((v) => (TREE_OPTION_HUB[v.id] = v));

export default {
  name: "layerHub",
  data() {
    return {
      //  底部树
      CESIUM_TREE_OPTION,
      CESIUM_TREE_EVENT_OPTION,
      forceTreeTopic: [],
      forceTreeEventTopic: [],
      //  资源选中层
      swiperOptions: {
        slidesPerView: 6,
        navigation: {
          nextEl: ".swiper-button-right",
          prevEl: ".swiper-button-left",
        },
      },
      //  专题图层
      swiperExtraOptions: {
        slidesPerView: 8,
        navigation: {
          nextEl: ".swiper-layerhub-button-right",
          prevEl: ".swiper-layerhub-button-left",
        },
      },
      //  tile layers
      tileLayers: {},
      //  tree count
      TREE_OPTION,
    };
  },
  components: { SourceLegend, ClearLayer, EventForm },
  computed: {
    ...mapGetters("map", [
      //  tab下标
      "forceTreeLabel",
      "forceTreeEventLabel",
      //  选中子节点
      "forceTrueTopicLabels",
      "forceEventTopicLabels",
      //  是否为资源图层tab
      "isSourceLayer",
      //  事件总数
      "WzEventData",
      //  事件下方筛选条件
      "eventFormParams",
      //  时间轴
      "forceTime",
    ]),
  },
  watch: {
    forceTreeLabel(n) {
      this.SetForceTime("now");
      this.initForceTreeTopic();
      this.SetForceIndex(n);
      this.$bus.$emit("cesium-3d-detail-pop-clear", {});
      this.$bus.$emit("cesium-3d-detail-info-clear", {});
    },
  },
  created() {
    this.initForceTreeTopic();
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", [
      ...[
        "SetForceIndex",
        "SetForceTime",
        //  选中tab下标
        "SetForceTreeLabel",
        "SetForceTreeEventLabel",
        //  选中子节点
        "SetForceTrueTopicLabels",
        "SetForceEventTopicLabels",
        //  当前选中节点
        "SetForceTrueTopicLabelId",
        "SetForceEventTopicLabelId",
        //  tab模块
        "SetIsSourceLayer",
      ],
    ]),
    /**
     * 事件传递打开对应专题图层
     */
    eventRegsiter() {
      this.$bus.$off("check-hub");
      this.$bus.$on("check-hub", ({ key }) => {
        this.SetForceTreeLabel(key);
      });
      this.$bus.$off("check-clear-topic");
      this.$bus.$on("check-clear-topic", () => {
        this.clearForceTopic();
      });
      //  事件筛选重新查询渲染
      this.$bus.$off("cesium-3d-event-form-update");
      this.$bus.$on("cesium-3d-event-form-update", () => {
        this.eventFromUpdate();
      });
    },
    /**
     * 专题切换
     */
    doSetForceTreeLabel(id) {
      this.clearForceTopic();
      this.SetForceTreeLabel(id);
    },
    doSetForceTreeEventLabel(id) {
      this.clearForceTopic();
      this.SetForceTreeEventLabel(id);
    },
    /**
     * 清除图层
     * 包括资源和事件
     */
    clearForceTopic() {
      //  资源图层
      this.forceTrueTopicLabels.map((v) =>
        this.nodeCheckChange(TREE_OPTION_HUB[v], false, "source")
      );
      this.SetForceTrueTopicLabelId("");
      this.SetForceTrueTopicLabels([]);
      //  事件图层
      this.forceEventTopicLabels.map((v) =>
        this.nodeCheckChange(TREE_OPTION_HUB[v], false, "event")
      );
      this.SetForceEventTopicLabelId("");
      this.SetForceEventTopicLabels([]);
    },
    /**
     * 城市总览剔除
     * labels数组内不剔除，多一步操作
     */
    pickCityOverview() {
      this.forceTreeTopic.map(
        (v) => v.label == "城市总览" && this.nodeCheckChange(v, false, "source")
      );
    },
    /**
     * 一级菜单点击切换
     * 默认选中二级菜单第一个点
     */
    initForceTreeTopic() {
      //  处理新图层
      this.pickCityOverview();
      if (this.isSourceLayer) {
        const Topics = this.CESIUM_TREE_OPTION.filter(
          (v) => v.label == this.forceTreeLabel
        );
        this.forceTreeTopic = Topics.length ? Topics[0].children : [];
        if (this.forceTreeTopic.length) {
          const forceNode = this.forceTreeTopic[0];
          this.SetForceTrueTopicLabelId(forceNode.label);
          this.SetForceTrueTopicLabels([
            ...new Set(this.forceTrueTopicLabels.concat([forceNode.label])),
          ]);
          this.nodeCheckChange(forceNode, true, "source");
        } else {
          this.SetForceTrueTopicLabels([]);
        }
      } else {
        const Topics = this.CESIUM_TREE_EVENT_OPTION.filter(
          (v) => v.label == this.forceTreeEventLabel
        );
        this.forceTreeEventTopic = Topics.length ? Topics[0].children : [];
        if (this.forceTreeEventTopic.length) {
          const forceNode = this.forceTreeEventTopic[0];
          this.SetForceEventTopicLabelId(forceNode.label);
          this.SetForceEventTopicLabels([
            ...new Set(this.forceEventTopicLabels.concat([forceNode.label])),
          ]);
          this.nodeCheckChange(forceNode, true, "event");
        } else {
          this.SetForceEventTopicLabels([]);
        }
      }
    },
    /**
     * 选中状态
     * @param {string} id
     */
    doForceTrueTopicLabels(id) {
      const label = this.forceTreeTopic.filter((v) => v.id == id)[0];
      if (~this.forceTrueTopicLabels.indexOf(label.id)) {
        let _fttl_ = [...this.forceTrueTopicLabels];
        _fttl_.splice(_fttl_.indexOf(label.id), 1);
        this.SetForceTrueTopicLabels(_fttl_);
        this.nodeCheckChange(label, false, "source");
      } else {
        this.SetForceTrueTopicLabels([
          ...new Set(this.forceTrueTopicLabels.concat([label.id])),
        ]);
        this.SetForceTrueTopicLabelId(label.id);
        this.nodeCheckChange(label, true, "source");
      }
    },
    doForceEventTopicLabels(id) {
      const label = this.forceTreeEventTopic.filter((v) => v.id == id)[0];
      if (~this.forceEventTopicLabels.indexOf(label.id)) {
        let _fttl_ = [...this.forceEventTopicLabels];
        _fttl_.splice(_fttl_.indexOf(label.id), 1);
        this.SetForceEventTopicLabels(_fttl_);
        this.nodeCheckChange(label, false, "event");
      } else {
        this.SetForceEventTopicLabels([
          ...new Set(this.forceEventTopicLabels.concat([label.id])),
        ]);
        this.SetForceEventTopicLabelId(label.id);
        this.nodeCheckChange(label, true, "event");
      }
    },
    /**
     * POI fetch
     * @param {object} node
     * @param {function} fn callback hook
     */
    getPOIPickedFeature(node, fn) {
      const { dataSource, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        // attributeFilter: `SMID <= 1000`,
        attributeFilter: `SMID >= 0`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [dataSource],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            const fields = await getIserverFields(url, dataSource);
            treeDrawTool(this, res, node, fields, fn);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    /**
     * 动态获取资源数据
     * @param {object} node 节点数据
     * @param {function} fn 回调钩子
     */
    async getSourceAPIFeature(node, fn) {
      let res = await getDNList(node);
      let features = [];
      res.data.forEach((item) => {
        features.push({
          attributes: { ...item, SMID: `设备号[${item.dn}]` },
          geometry: {
            x: item.longitude,
            y: item.latitude,
          },
        });
      });
      treeDrawTool(this, { result: { features } }, node, dnFields, fn);
    },
    /**
     * 动态获取事件数据
     * @param {object} node 节点数据
     * @param {function} fn 回调钩子
     */
    async getEventAPIFeature(node, fn) {
      const { timeType, areaCode, status } = this.eventFormParams;
      let res = await getEventData(node.event, { areaCode, status }, timeType);
      let features = [];
      res.forEach((item) => {
        features.push({
          attributes: {
            ...item,
            ...{ NAME: item.title, SMID: item.innerEventId },
          },
          geometry: {
            x: +item.eventCoordinate.split(",")[0],
            y: +item.eventCoordinate.split(",")[1],
          },
        });
      });
      treeDrawEventTool({ result: { features } }, node);
      fn && fn();
    },
    nodeCheckChange(node, checked, type) {
      if (checked) {
        if (~["mvt", "xhr"].indexOf(node.type) && node.id) {
          if (node.id && window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.labelMap[node.id].setAllLabelsVisible(true);
          } else {
            if (this.isSourceLayer) {
              node.type == "mvt"
                ? this.getPOIPickedFeature(node, () => {
                    this.switchSearchBox(node, type);
                  })
                : this.getSourceAPIFeature(
                    node,
                    () => {
                      this.switchSearchBox(node, type);
                    },
                    node
                  );
            } else {
              this.getEventAPIFeature(node, () => {
                this.switchSearchBox(node, type);
              });
            }
            return;
          }
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          if (this.tileLayers[node.id]) {
            this.tileLayers[node.id].show = true;
          } else {
            this.tileLayers[
              node.id
            ] = window.earth.imageryLayers.addImageryProvider(
              new Cesium.SuperMapImageryProvider({
                url: node.url,
                name: node.id,
              })
            );
          }
        }
        this.switchSearchBox(node, type);
        //  有相机视角配置 -> 跳视角
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (node.icon && window.billboardMap[node.id]) {
          window.billboardMap[node.id]._billboards.map((v) => (v.show = false));
          window.labelMap[node.id].setAllLabelsVisible(false);
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    //  事件传递，重新查询、渲染页面
    eventFromUpdate() {
      this.CESIUM_TREE_EVENT_OPTION[0].children.map((node) => {
        //  消除featureMap
        delete window.featureMap[node.id];
        //  消除label、billboard
        window.billboardMap[node.id] &&
          window.billboardMap[node.id].removeAll();
        delete window.billboardMap[node.id];
        window.labelMap[node.id] && window.labelMap[node.id].removeAll();
        delete window.labelMap[node.id];
        console.log();
        if (~this.forceEventTopicLabels.indexOf(node.id)) {
          //  选择已勾选的label重新叠加点位
          this.nodeCheckChange(node, true, "event");
        }
      });
    },
    /**
     * 展示对应资源列表搜索框
     * @param {object} node 节点
     * @param {string} type 类型
     */
    switchSearchBox(node, type) {
      this.$bus.$emit(`cesium-3d-switch-searchBox-${type}`, {
        shall: ~["mvt", "xhr"].indexOf(node.type) && node.id ? true : false,
        node,
      });
    },
    /**
     * 改变图层模块
     * @param {string} layer 图层
     * 如果转到事件图层，则默认点击开启事件图层第一个
     */
    changeLayer(layer) {
      const _IS_SOURCE_ = layer == "source";
      if (_IS_SOURCE_ == this.isSourceLayer) return;
      this.clearForceTopic();
      this.SetIsSourceLayer(_IS_SOURCE_);
      if (_IS_SOURCE_) {
        const Topics = this.CESIUM_TREE_OPTION.filter(
          (v) => v.label == this.forceTreeLabel
        );
        this.forceTreeTopic = Topics.length ? Topics[0].children : [];
      } else {
        const Topics = this.CESIUM_TREE_EVENT_OPTION.filter(
          (v) => v.label == this.forceTreeEventLabel
        );
        this.forceTreeEventTopic = Topics.length ? Topics[0].children : [];
      }
      this.initForceTreeTopic();
    },
  },
};
</script>

<style scoped lang="less">
@import url("./layerHub.less");
</style>
