<!--
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-09-15 10:53:32
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\RtmpVideo\RtmpVideo.vue
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
          <header>
            周边{{radiusRange}}米监控
            <i>({{fixRtmpList.length}}个)</i>
            <span @click="videoOfPrivate=!videoOfPrivate" :class="{active:videoOfPrivate}">私有监控</span>
            <span @click="videoOfPublic=!videoOfPublic" :class="{active:videoOfPublic}">公有监控</span>
          </header>
          <div>
            <ul>
              <li
                v-for="(item,index) in fixRtmpList"
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
                <span>{{item.dist}} 米</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="rtmpVideoFrame">
          <header>
            <p>{{forceRtmpVideo}}</p>
            <span @click="videoSourceTop=false" :class="{active:!videoSourceTop}">信号源二</span>
            <span @click="videoSourceTop=true" :class="{active:videoSourceTop}">信号源一</span>
          </header>
          <div>
            <flv
              v-if="RtmpVideoURL"
              :url="RtmpVideoURL"
              :mode="RtmpVideoMode"
              :type="videoSourceTop"
            />
            <p v-if="!RtmpVideoURL">无视频内容</p>
          </div>
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
      radiusRange: 200, //  默认半径200米
      videoSourceTop: true,
      videoOfPrivate: true,
      videoOfPublic: true,
    };
  },
  components: {
    flv,
  },
  computed: {
    ...mapGetters("map", ["rtmpList"]),
    fixRtmpList() {
      const arr = [
        this.videoOfPrivate ? false : undefined,
        this.videoOfPublic ? true : undefined,
      ];
      return this.rtmpList.filter((v) => ~arr.indexOf(v.private));
    },
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
        const { data } = await getRtmpVideoList(
          item.geometry,
          this.radiusRange
        );
        this.SetRtmpList(data);
        data.length && this.openRtmpVideoFrame(data[0]);
        this.doRtmpListFrame = true;
      });
      // 视频监控点billboard点击事件通信
      this.$bus.$off("cesium-3d-videoPointClick");
      this.$bus.$on("cesium-3d-videoPointClick", (item) => {
        this.fixRtmpList.length &&
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
    width: 840px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
    background-image: url("/static/images/common/rtmp-frame.png");
    box-sizing: border-box;
    padding: 20px 34px 28px 34px;
    z-index: 10;
    color: white;
    > header {
      height: 40px;
      line-height: 40px;
      > span {
        &:first-child {
          font-size: 1.6em;
        }
        &:last-child {
          font-size: 20px;
        }
      }
      .close {
        position: absolute;
        right: 30px;
        top: 24px;
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        .bg-image("/static/images/icons/zoom-in");
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
        width: 330px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        > header {
          height: 24px;
          line-height: 22px;
          font-size: 1em;
          overflow: hidden;
          > i {
            font-size: 0.8em;
            color: #2acbfe;
            font-style: normal;
          }
          > span {
            float: right;
            cursor: pointer;
            font-size: 0.9em;
            line-height: 24px;
            padding: 0 6px;
            display: inline-block;
            background-image: linear-gradient(
              to bottom,
              #032648 0%,
              #053867 23%,
              #003a6b 81%,
              #00192e 100%
            );
            &:last-child {
              margin-right: 6px;
            }
            &.active {
              background-image: linear-gradient(
                to bottom,
                #4c97e3 0%,
                rgba(23, 83, 145, 0.75) 67%,
                rgba(5, 45, 88, 0.29) 100%
              );
            }
          }
        }
        > div {
          flex: 1;
          overflow: hidden;
          box-sizing: border-box;
          padding-top: 6px;
          > ul {
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            padding-right: 4px;
            .rtmp_active {
              background-image: linear-gradient(
                to right,
                #2acbfe 0%,
                #002a38 100%
              );
            }
            > li {
              cursor: pointer;
              line-height: 26px;
              height: 26px;
              background-color: rgba(1, 31, 43, 0.51);
              margin-bottom: 1px;
              display: flex;
              box-sizing: border-box;
              padding-right: 8px;
              &:hover {
                background-image: linear-gradient(
                  to right,
                  #2acbfe 0%,
                  #002a38 100%
                );
              }
              > span {
                display: inline-block;
                &:nth-child(2) {
                  flex: 1;
                  white-space: nowrap; /* 规定文本是否折行 */
                  overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
                  text-overflow: ellipsis;
                }
                &:last-child {
                  width: 60px;
                  text-align: right;
                  font-size: 0.8em;
                  letter-spacing: 0px;
                  color: #2acbfe;
                }
              }
            }
          }
        }
      }
      .rtmpVideoFrame {
        flex: 1;
        box-sizing: border-box;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        > header {
          height: 24px;
          line-height: 22px;
          font-size: 1em;
          overflow: hidden;
          > p {
            display: inline-block;
            max-width: 250px;
            line-height: 24px;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
          > span {
            float: right;
            cursor: pointer;
            font-size: 0.9em;
            line-height: 24px;
            padding: 0 6px;
            display: inline-block;
            background-image: linear-gradient(
              to bottom,
              #032648 0%,
              #053867 23%,
              #003a6b 81%,
              #00192e 100%
            );
            &:last-child {
              margin-right: 6px;
            }
            &.active {
              background-image: linear-gradient(
                to bottom,
                #4c97e3 0%,
                rgba(23, 83, 145, 0.75) 67%,
                rgba(5, 45, 88, 0.29) 100%
              );
            }
          }
        }
        > div {
          flex: 1;
          box-sizing: border-box;
          padding-top: 6px;
        }
      }
    }
  }
}
</style>
