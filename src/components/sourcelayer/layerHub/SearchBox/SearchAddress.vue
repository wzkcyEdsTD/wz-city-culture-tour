<template>
  <div class="search-main search-address">
    <div class="searchHeader">
      <el-input
        v-model="searchText"
        class="searchFilterInput"
        placeholder="地名地址查询关键字"
        size="small"
        @keyup.enter.native="doSearchAddress"
      />
      <div class="button-container">
        <div class="button-item">
          <i class="icon-common icon-clear" @click="searchClear"></i>
        </div>
        <div class="button-item">
          <i class="icon-common icon-search" @click="doSearchAddress"></i>
        </div>
      </div>
    </div>
    <div class="search-count">共找到 {{ searchList.length }} 个结果</div>
    <div class="result-wrapper">
      <ul class="result-list">
        <li
          class="result-item"
          :class="{
            checked: searchChecked == i,
          }"
          v-for="(item, i) in searchList"
          :key="`sitem-${i}`"
          @click="checkedOne(item, i)"
        >
          <p class="name" :title="item.result">
            {{ i + 1 }}. {{ item.result }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const iconId = "address-location";
import { getAddressList } from "api/addressAPI";
export default {
  name: "SearchAddress",
  data() {
    return {
      searchText: "",
      searchList: [],
      searchTotal: 0,
      searchChecked: undefined,
    };
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-searchAddress-clear");
      this.$bus.$on("cesium-3d-searchAddress-clear", () => {
        this.searchChecked = undefined;
        window.earth.entities.removeById(iconId);
      });
    },
    async doSearchAddress() {
      this.searchChecked = undefined;
      const { records, total } = await getAddressList(this.searchText);
      this.searchTotal = total > 50 ? 50 : total;
      this.searchList = records;
    },
    searchClear() {
      this.searchTotal = 0;
      this.searchList = [];
      this.searchChecked = undefined;
      this.searchText = "";
      window.earth.entities.removeById(iconId);
    },
    checkedOne({ lng, lat, result }, i) {
      this.searchChecked = i;
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 2000),
        orientation: {
          heading: 0,
          pitch: -1.547577341226372,
          roll: 0.0,
        },
        duration: 1,
      });
      window.earth.entities.removeById(iconId);
      const addressLocationEntity = new Cesium.Entity({
        id: iconId,
        position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), 4),
        geometry: { lng, lat },
        billboard: {
          image: "/static/images/common/address-location.png",
          width: 36,
          height: 45,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: result,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLUE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "11px",
          scale: 1,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -40),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      window.earth.entities.add(addressLocationEntity);
    },
  },
};
</script>
