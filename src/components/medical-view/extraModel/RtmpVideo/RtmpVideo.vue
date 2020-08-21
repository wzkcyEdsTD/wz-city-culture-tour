<!--
 * @Author: eds
 * @Date: 2020-08-12 15:17:46
 * @LastEditTime: 2020-08-21 11:47:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\extraModel\RtmpVideo\RtmpVideo.vue
-->
<template>
  <div class="rtmpVideo">
    <div class="rtmpListFrame" v-if="doRtmpListFrame">
      <header>
        <span>现场视频</span> /
        <span>{{RtmpForcePoint.name}}</span>
      </header>
      <div class="rtmpVideoContent">
        <div class="rtmpVideoList">
          <header>周边监控</header>
          <ul>
            <li v-for="(item,index) in rtmpList" :key="index" @click="openRtmpVideoFrame(item)">
              <span></span>
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="rtmpVideoFrame">
          <iframe v-if="RtmpVideoURL" :src="RtmpVideoURL" />
          <p v-if="!RtmpVideoURL">无视频内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
import { getAccessToken, getRtmpVideoList } from "api/fetch";

export default {
  data() {
    return {
      doRtmpListFrame: false,
      RtmpVideoURL: undefined,
      RtmpForcePoint: {},
    };
  },
  computed: {
    ...mapGetters("map", ["rtmpList"]),
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetRtmpList"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-rtmpFetch");
      this.$bus.$on("cesium-3d-rtmpFetch", async (item) => {
        //  code fetch rtmpURLs
        this.RtmpForcePoint = item;
        const accessToken = await getAccessToken();
        const result = await getRtmpVideoList(
          item.geometry,
          accessToken.data.access_token
        );
        this.SetRtmpList(result);
        this.doRtmpListFrame = true;
      });
    },
    /**
     * 赋值 开视频
     * @param {object} item
     */
    openRtmpVideoFrame(item) {},
    /**
     * 关frame 清状态
     */
    closeRtmpVideoFrame() {
      this.SetRtmpList([]);
      this.doRtmpListFrame = false;
      this.RtmpVideoURL = undefined;
    },
  },
};
</script>

<style lang="less" scoped>
.rtmpVideo {
  .rtmpListFrame {
    height: 400px;
    width: 800px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
    background-image: url("./frame.png");
    box-sizing: border-box;
    padding: 30px 10px 20px 24px;
    z-index: 1000000;
    color: white;
    > header {
      height: 50px;
      line-height: 50px;
      > span:first-child {
        font-size: 22px;
      }
    }
    .rtmpVideoContent {
      height: 300px;
      display: flex;
      > div {
        height: 100%;
        display: inline-block;
      }
      .rtmpVideoList {
        width: 270px;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        > header {
          height: 36px;
          line-height: 36px;
          font-size: 18px;
        }
        > ul {
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
        }
      }
      .rtmpVideoFrame {
        flex: 1;
        box-sizing: border-box;
        padding: 30px 24px 30px 12px;
        > iframe {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
