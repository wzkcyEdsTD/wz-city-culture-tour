<template>
  <div class="rtmp-video-grid">
    <header>监控实况</header>
    <ul>
      <li v-for="(item, i) in bayonetList_array" :key="i">
        <single-video :item="item" :index="i" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SingleVideo from "./SingleVideo";
export default {
  name: "rtmpVideoGrid",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("traffic", ["bayonetList"]),
    bayonetList_array() {
      return this.bayonetList
        ? Object.keys(window.featureMap["交通卡口"])
            .map((v) => window.featureMap["交通卡口"][v])
            .slice(0, 6)
        : [];
    },
  },
  components: { SingleVideo },
};
</script>

<style lang="less" scoped>
.rtmp-video-grid {
  position: fixed;
  top: 6vh;
  right: 2vh;
  width: 60vh;
  bottom: 0vh;
  z-index: 11;
  box-sizing: border-box;
  padding: 1vh;
  display: flex;
  flex-direction: column;
  > ul {
    flex: 1;
    margin-top: 2vh;
    > li {
      float: left;
      height: 33.3%;
      width: 49.9%;
      display: inline-block;
      box-sizing: border-box;
      padding: 0.6vh;
    }
  }
  > header {
    display: block;
    height: 4vh;
    line-height: 4vh;
    font-family: YouSheBiaoTiHei;
    font-size: 3.2vh;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    padding-left: 1.6vh;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0.6vh;
      width: 14vh;
      height: 1.6vh;
      z-index: -1;
      background-image: linear-gradient(90deg, #2acbfe 0%, transparent 100%);
      transform: skewX(-30deg);
    }
  }
}
</style>