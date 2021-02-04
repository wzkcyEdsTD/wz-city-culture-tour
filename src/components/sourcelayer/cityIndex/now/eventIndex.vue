<template>
  <div class="target-wrapper">
    <span class="header">旅游体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            消防火灾事件数
            <span class="small">(起)</span>
          </div>
          <div class="number">
            昨日事件数
            <DynamicNum :value="1" decimals="0" />
          </div>
          <div class="number">
            本月事件总数
            <DynamicNum :value="1" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            水位超警事件数
            <span class="small">(起)</span>
          </div>
          <div class="number">
            昨日事件数
            <DynamicNum :value="1" decimals="0" />
          </div>
          <div class="number">
            本月事件总数
            <DynamicNum :value="1" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            突发公共卫生事件数
            <span class="small">(起)</span>
          </div>
          <div class="number">
            昨日事件数
            <DynamicNum :value="1" decimals="0" />
          </div>
          <div class="number">
            本月事件总数
            <DynamicNum :value="1" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            矛盾调节事件数
            <span class="small">(起)</span>
          </div>
          <div class="number">
            昨日事件数
            <DynamicNum :value="1" decimals="0" />
          </div>
          <div class="number">
            本月事件总数
            <DynamicNum :value="1" decimals="0" />
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
  name: "eventIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzEventData"]),
  },
  async created() {
    await this.fetchEventData();
  },
  methods: {
    ...mapActions("map", ["SetWzEventData"]),
    /**
     * 概览数据
     */
    async fetchEventData() {
      await this.SetWzEventData();
    },
  },
};
</script>
