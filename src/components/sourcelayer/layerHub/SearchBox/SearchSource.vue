<template>
  <div class="search-main search-source">
    <div class="searchHeader">
      <el-input
        v-model="searchText"
        class="searchFilterInput"
        :placeholder="`附近的${forceTrueTopicLabelId}有哪些？`"
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
          <p class="name" :title="item.name">{{ i + 1 }}. {{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CESIUM_TREE_EXTRA_DATA } from "config/server/sourceTreeOption";

export default {
  name: "SearchSource",
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
      "forceTrueTopicLabelId",
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
      this.$bus.$off("cesium-3d-switch-searchBox-source");
      this.$bus.$on("cesium-3d-switch-searchBox-source", ({ shall, node }) => {
        this.SetSearchBoxVisible(shall);
        this.forceNode = node || {};
        this.searchClear();
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
      const allSearchList = [];
      for (let key in featureMap) {
        const item = window.featureMap[this.forceNode.id][key];
        allSearchList.push(item);
      }
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
        this.searchChecked.push(i);
        // 移动到对应实例位置
        const { x, y } = item.geometry;
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
