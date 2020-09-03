<!--
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-08-31 17:16:32
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\extraModel\RtmpVideo\RtmpVideo.vue
-->
<template>
  <div class="rtmpVideo">
    <div class="rtmpListFrame" v-if="doRtmpListFrame">
      <header>
        <span>现场视频</span> /
        <span>{{RtmpForcePoint.shortname}}</span>
        <i class="close" @click="closeRtmpVideoFrame"></i>
      </header>
      <div class="rtmpVideoContent">
        <div class="rtmpVideoList">
          <header>周边200米监控({{rtmpList.length}})</header>
          <ul>
            <li
              v-for="(item,index) in rtmpList"
              :class="[forceRtmpVideo == item.mp_name ? 'rtmp_active' : '']"
              :key="index"
              @click="openRtmpVideoFrame(item)"
            >
              <span>
                <input
                  id="custom-checkbox"
                  type="checkbox"
                  :checked="forceRtmpVideo===item.mp_name"
                  @click="checkUniqueVideo(item)"
                />
              </span>
              <span :title="item.mp_name">{{index+1}}.{{item.mp_name}}</span>
            </li>
          </ul>
        </div>
        <div class="rtmpVideoFrame">
          <flv v-if="RtmpVideoURL" :url="RtmpVideoURL" :mode="RtmpVideoMode" />
          <p v-if="!RtmpVideoURL">无视频内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
import { getRtmpVideoList, getRtmpVideoURL } from "api/cityBrainAPI";
import flv from "./Flv";

export default {
  data() {
    return {
      doRtmpListFrame: false,
      RtmpVideoURL: undefined, //  视频地址
      RtmpVideoMode: "flash", // 视频模式
      forceRtmpVideo: undefined, //  正在看的视频名
      RtmpForcePoint: {}, //  保存点击的entity属性
    };
  },
  components: {
    flv,
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
        const { data } = await getRtmpVideoList(item.geometry, 200);
        this.SetRtmpList(data);
        data.length && this.openRtmpVideoFrame(data[0]);
        this.doRtmpListFrame = true;
      });

      // 视频监控点billboard点击事件通信
      this.$bus.$off("cesium-3d-videoPointClick");
      this.$bus.$on("cesium-3d-videoPointClick", (item) => {
        this.rtmpList.length &&
          this.openRtmpVideoFrame({
            mp_name: item.mp_name,
            mp_id: item.mp_id.split("videopoint_")[1],
          });
        this.doRtmpListFrame = true;
      });
    },
    /**
     * 赋值 开视频
     * @param {object} item
     */
    async openRtmpVideoFrame({ mp_name, mp_id }) {
      this.forceRtmpVideo = mp_name;
      const { data } = await getRtmpVideoURL(mp_id);
      this.RtmpVideoURL = undefined;
      this.RtmpVideoMode = "flash";
      data &&
        this.$nextTick(() => {
          this.RtmpVideoURL = data.flv;
          this.RtmpVideoMode = data.play_mode;
        });
    },
    /**
     * 保持单一选中
     * @param {object} item 视频单例
     */
    checkUniqueVideo({ mp_name }) {
      this.forceRtmpVideo = mp_name;
    },
    /**
     * 关frame 清状态
     */
    closeRtmpVideoFrame() {
      this.SetRtmpList([]);
      this.doRtmpListFrame = false;
      this.forceRtmpVideo = undefined;
      this.RtmpVideoURL = undefined;
      this.RtmpVideoMode = "flash";
      this.RtmpForcePoint = {};
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
      height: 40px;
      line-height: 40px;
      > span:first-child {
        font-size: 22px;
      }
      .close {
        position: absolute;
        right: 20px;
        top: 30px;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image("../../../../page/map/images/zoom-in");
        transform: rotate(-45deg);
        transition: all 0.1s linear;
        cursor: pointer;
        z-index: 10;

        &:hover {
          transform: rotate(45deg);
        }
      }
    }
    .rtmpVideoContent {
      height: 310px;
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
          .rtmp_active {
            background-color: rgb(23, 121, 151, 0.8);
          }
          > li:hover {
            background-color: rgb(23, 121, 151, 0.4);
          }
          > li {
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
            cursor: pointer;
            line-height: 26px;
          }
        }
      }
      .rtmpVideoFrame {
        flex: 1;
        box-sizing: border-box;
        padding: 30px 24px 20px 12px;
      }
    }
  }
}
</style>
