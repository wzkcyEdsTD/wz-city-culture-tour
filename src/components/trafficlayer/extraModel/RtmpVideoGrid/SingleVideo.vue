<template>
  <div class="single-video">
    <el-select
      class="rtmp-video-select"
      v-model="forceBayonet"
      @change="refreshRtmpVideoList"
    >
      <el-option
        v-for="item in selectOption"
        :key="item.name"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
    <el-select class="rtmp-video-select" v-model="forceVideo" @change="resetRtmpVideo">
      <el-option
        v-for="item in forceVideoList"
        :key="item.mp_name"
        :label="item.mp_name"
        :value="item.mp_id"
      >
      </el-option>
    </el-select>
    <Video v-if="mp_id" :index="index" :mp_id="mp_id" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getRtmpVideoList, getRtmpVideoURL } from "api/cityBrainAPI";
import Video from "./Video";
export default {
  name: "singleVideo",
  props: ["item", "index"],
  data() {
    return {
      forceBayonet: this.item.name,
      forceVideoList: [],
      forceVideo: undefined,
      radiusRange: 100,
      mp_id: undefined,
    };
  },
  components: { Video },
  mounted() {
    this.refreshRtmpVideoList();
  },
  computed: {
    ...mapGetters("traffic", ["bayonetList"]),
    selectOption() {
      return Object.keys(window.featureMap["交通卡口"]).map(
        (v) => window.featureMap["交通卡口"][v]
      );
    },
  },
  methods: {
    /**
     * 刷新列表
     */
    async refreshRtmpVideoList() {
      const { x, y } = this.selectOption.filter(
        (v) => v.name == this.forceBayonet
      )[0].geometry;
      const { data } = await getRtmpVideoList({ lat: y, lng: x }, this.radiusRange);
      this.forceVideoList = data;
      this.forceVideo = data[0].mp_id;
      this.mp_id = undefined;
      this.$nextTick(() => {
        this.mp_id = this.forceVideo;
      });
    },
    async resetRtmpVideo() {
      this.mp_id = undefined;
      this.$nextTick(() => {
        this.mp_id = this.forceVideo;
      });
    },
  },
};
</script>

<style lang="less">
.single-video {
  display: flex;
  flex-direction: column;
  height: 100%;
  .rtmp-video-select {
    &:first-child {
      margin-bottom: 0.6vh;
    }
    > .el-input {
      > .el-input__inner {
        height: 2.6vh !important;
        line-height: 2.6vh !important;
        font-size: 1.4vh;
        color: white;
        background: url(/static/images/common/search-input.png) no-repeat center;
        background-size: 100% 100%;
        border: 0 !important;
        user-select: none;
      }
      > .el-input__suffix {
        right: 0vh;
        > .el-input__suffix-inner {
          > .el-input__icon {
            width: 3vh !important;
            line-height: unset !important;
          }
          > .el-select__caret {
            &::before {
              color: white;
              font-size: 1vh;
            }
          }
        }
      }
    }
  }
}
</style>
