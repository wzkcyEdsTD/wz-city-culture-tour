<template>
  <div class="target-wrapper">
    <span class="header">事件体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/event/消防火灾事件.png" />
        <div>
          <div class="title">
            消防火灾事件数
            <span class="small">(起)</span>
          </div>
          <div class="event-number">
            <span>24小时事件数</span>
            <div class="number day-number">
              <DynamicNum :value="WzEventData.day" decimals="0" />
            </div>
          </div>
          <div class="event-number">
            <span>本月事件总数</span>
            <div class="number month-number">
              <DynamicNum :value="WzEventData.week" decimals="0" />
            </div>
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/event/水位超警事件.png" />
        <div>
          <div class="title">
            水位超警事件数
            <span class="small">(起)</span>
          </div>
          <div class="event-number">
            <span>24小时事件数</span>
            <div class="number day-number">
              <DynamicNum :value="13" decimals="0" />
            </div>
          </div>
          <div class="event-number">
            <span>本月事件总数</span>
            <div class="number month-number">
              <DynamicNum :value="190" decimals="0" />
            </div>
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/event/突发公共卫生事件.png" />
        <div>
          <div class="title">
            突发公共卫生事件数
            <span class="small">(起)</span>
          </div>
          <div class="event-number">
            <span>24小时事件数</span>
            <div class="number day-number">
              <DynamicNum :value="31" decimals="0" />
            </div>
          </div>
          <div class="event-number">
            <span>本月事件总数</span>
            <div class="number month-number">
              <DynamicNum :value="165" decimals="0" />
            </div>
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/event/矛盾调解事件.png" />
        <div>
          <div class="title">
            矛盾调解事件数
            <span class="small">(起)</span>
          </div>
          <div class="event-number">
            <span>24小时事件数</span>
            <div class="number day-number">
              <DynamicNum :value="22" decimals="0" />
            </div>
          </div>
          <div class="event-number">
            <span>本月事件总数</span>
            <div class="number month-number">
              <DynamicNum :value="98" decimals="0" />
            </div>
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
