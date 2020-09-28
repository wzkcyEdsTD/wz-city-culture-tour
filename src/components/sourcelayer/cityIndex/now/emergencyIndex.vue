<template>
  <div class="target-wrapper">
    <span class="header">应急体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市化工及危化品企业
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum
              :value="WzEmergencyData.全市化工及危化品企业种类以及个数"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市应急队伍
            <span class="small">(支)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum
              :value="WzEmergencyData.全市应急队伍种类以及个数"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市非煤矿山
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum
              :value="WzEmergencyData.全市非煤矿山种类以及个数"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            应急避难场所
            <span class="small">(座)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzEmergencyData.应急避难场所" decimals="0" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DynamicNum from "../dynamicNum";

export default {
  name: "emergencyIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzEmergencyData"]),
  },
  async created() {
    await this.fetchCultureData();
  },
  methods: {
    ...mapActions("map", ["SetWzEmergencyData"]),
    /**
     * 概览数据
     */
    async fetchCultureData() {
      await this.SetWzEmergencyData();
    },
  },
};
</script>
