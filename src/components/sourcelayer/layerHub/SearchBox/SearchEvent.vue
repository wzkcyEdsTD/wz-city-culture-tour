<template>
  <div class="search-main search-event">
    <div class="searchHeader">
      <el-input
        v-model="searchText"
        class="searchFilterInput"
        :placeholder="`附近的${forceEventTopicLabelId}有哪些？`"
        size="small"
        @keyup.enter.native="searchFilter"
      />
      <div class="button-container">
        <div class="button-item">
          <i class="icon-common icon-clear" @click="searchClear"></i>
        </div>
        <div class="button-item">
          <i class="icon-common icon-search" @click="searchFilter"></i>
        </div>
      </div>
    </div>
    <div class="search-count">共找到 {{ extraSearchList.length }} 个结果</div>
    <div class="result-wrapper" v-show="searchBoxResult">
      <ul class="result-list">
        <li
          class="result-item"
          :class="{
            checked: searchChecked == i,
          }"
          v-for="(item, i) in extraSearchList"
          :key="`sitem-${i}`"
          @click="checkedOne(item, i)"
        >
          <p class="name" :title="item.attributes.eventPlaceName || item.name">
            {{ i + 1 }}. {{ item.attributes.eventPlaceName || item.name }}
          </p>
          <p class="event-time" v-show="item.attributes.eventTime">
            {{ item.attributes.eventTime }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CESIUM_TREE_EXTRA_DATA } from "config/server/sourceTreeOption";
import { arrayCompareWithParam } from "common/js/util";

export default {
  name: "SearchEvent",
  data() {
    return {
      searchBoxResult: true,
      searchText: "",
      forceNode: {},
      extraSearchList: [],
      searchChecked: undefined,
    };
  },
  computed: {
    ...mapGetters("map", [
      ...CESIUM_TREE_EXTRA_DATA,
      "forceEventTopicLabelId",
      "searchBoxVisible",
    ]),
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetSearchBoxVisible"]),
    /**
     * 事件传递打开对应专题图层
     */
    eventRegsiter() {
      this.$bus.$off("cesium-3d-switch-searchBox-event");
      this.$bus.$on("cesium-3d-switch-searchBox-event", ({ shall, node }) => {
        this.SetSearchBoxVisible(shall);
        this.forceNode = node || {};
        this.searchClear();
        this.$nextTick(() => {
          this.extraSearchList.length &&
            this.checkedOne(this.extraSearchList[0], 0);
        });
      });
    },
    toogleVisible() {
      this.searchBoxResult = !this.searchBoxResult;
    },
    searchClear() {
      this.searchText = "";
      this.extraSearchList = [];
      this.searchChecked = undefined;
      this.searchFilter();
    },
    searchFilter() {
      if (!this.searchBoxVisible) return;
      const featureMap = window.featureMap[this.forceNode.id];
      // const withExtraData = this[this.forceNode.withExtraData];
      let allSearchList = [];
      for (let key in featureMap) {
        const item = window.featureMap[this.forceNode.id][key];
        const { x, y } = item.geometry;
        if (x <= 121.408 && x >= 119.407 && y <= 28.692 && y >= 27.059) {
          allSearchList.push(item);
        }
      }
      allSearchList = allSearchList
        .sort(arrayCompareWithParam("eventTime"))
        .reverse();
      console.log(this.searchText);
      this.extraSearchList = this.searchText
        ? allSearchList.filter((item) => ~item.name.indexOf(this.searchText))
        : allSearchList;
    },
    checkedOne(item, i) {
      this.$bus.$emit("cesium-3d-detail-pop-clear");
      if (this.searchChecked == i) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.searchChecked = undefined;
      } else {
        // 选中该checkbox
        this.searchChecked = i;
        const { x, y } = item.geometry;
        this.$bus.$emit("cesium-3d-pick-to-event", {
          ...item,
          position: new Cesium.Cartesian3.fromDegrees(x, y, 4),
        });
        // 移动到对应实例位置
        window.earth.camera.flyTo({
          // window.earth.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(x, y - 0.005, 450),
          orientation: {
            heading: 0.003336768850279448,
            pitch: -0.5808830390057418,
            roll: 0.0,
          },
          maximumHeight: 450,
        });
      }
    },
  },
};
</script>
