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
        <span>{{ RtmpForcePoint.shortname }}</span>
        <i class="close" @click="closeRtmpVideoFrame"></i>
      </header>
      <div class="rtmpVideoContent">
        <div class="rtmpVideoList">
          <header>
            周边
            <el-select
              v-if="!isCircleVideo"
              class="rtmp-video-range"
              v-model="radiusRange"
              @change="refreshRtmpVideoList"
              placeholder="范围"
            >
              <el-option
                v-for="item in radiusOption"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <i v-if="isCircleVideo">{{ radiusRange }}</i>
            米
            <i>({{ fixRtmpList.length }})</i>
            <el-switch v-model="isHightVideo" name="高位" active-text="高位" />
            <span
              @click="videoOfPrivate = !videoOfPrivate"
              :class="{ active: videoOfPrivate }"
              >私有监控</span
            >
            <span
              @click="videoOfPublic = !videoOfPublic"
              :class="{ active: videoOfPublic }"
              >公有监控</span
            >
          </header>
          <div>
            <ul>
              <li
                v-for="(item, index) in fixRtmpList"
                :class="[forceRtmpVideo == item.mp_name ? 'rtmp_active' : '']"
                :key="index"
                @click="openRtmpVideoFrame(item)"
              >
                <span>
                  <input
                    id="custom-checkbox"
                    type="checkbox"
                    :checked="forceRtmpVideo === item.mp_name"
                    @click="checkUniqueVideo(item)"
                  />
                </span>
                <span :title="item.mp_name"
                  >{{ index + 1 }}.{{ item.mp_name }}</span
                >
                <span>{{ item.dist }} 米</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="rtmpVideoFrame">
          <header>
            <p>{{ forceRtmpVideo }}</p>
            <span
              @click="videoSourceTop = false"
              :class="{ active: !videoSourceTop }"
              >Flash模式</span
            >
            <span
              @click="videoSourceTop = true"
              :class="{ active: videoSourceTop }"
              >H5模式</span
            >
          </header>
          <div>
            <flv
              v-if="RtmpVideoURL"
              :url="RtmpVideoURL"
              :mode="RtmpVideoMode"
              :type="videoSourceTop"
            />
            <p v-if="!RtmpVideoURL">正在获取视频内容...</p>
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
      radiusOption: [100, 200, 500, 1000],
      videoSourceTop: true,
      videoOfPrivate: true,
      videoOfPublic: true,
      isCircleVideo: false,
      isHightVideo: false,
      //  激活列表
      entitiesID: [],
    };
  },
  components: {
    flv,
  },
  computed: {
    ...mapGetters("map", ["rtmpList", "rtmpListOther"]),
    fixRtmpList() {
      const arr = [
        this.videoOfPrivate ? false : undefined,
        this.videoOfPublic ? true : undefined,
      ];
      const isHightVideo = this.isHightVideo ? "高位" : "";
      return (this.isCircleVideo ? this.rtmpListOther : this.rtmpList).filter(
        (v) => ~arr.indexOf(v.private) && ~v.mp_name.indexOf(isHightVideo)
      );
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
        this.isCircleVideo = false;
        this.isHightVideo = false;
        this.RtmpForcePoint = item;
        const { data } = await getRtmpVideoList(
          item.geometry,
          this.radiusRange
        );
        this.SetRtmpList(data);
        data.length && this.openRtmpVideoFrame(data[0]);
        this.doRtmpListFrame = true;
        this.removeVideoCircle();
        this.drawVideoCircle(item.geometry, this.radiusRange);
      });
      this.$bus.$off("cesium-3d-rtmpFetch-cb");
      this.$bus.$on("cesium-3d-rtmpFetch-cb", () => {
        this.removeVideoCircle();
      });
      // 穿透事件监控视频点
      this.$bus.$off("cesium-3d-videoPointClick");
      this.$bus.$on("cesium-3d-videoPointClick", (item) => {
        this.isCircleVideo = true;
        this.fixRtmpList.length &&
          this.openRtmpVideoFrame({
            mp_name: item.mp_name,
            mp_id: item.mp_id.split("videopoint_")[1],
          });
        this.doRtmpListFrame = true;
      });
      // 图层监控视频点
      this.$bus.$off("cesium-3d-normalPointClick");
      this.$bus.$on("cesium-3d-normalPointClick", (item) => {
        this.isCircleVideo = false;
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
    async refreshRtmpVideoList() {
      const { data } = await getRtmpVideoList(
        this.RtmpForcePoint.geometry,
        this.radiusRange
      );
      this.SetRtmpList(data);
      this.removeVideoCircle();
      this.drawVideoCircle(this.RtmpForcePoint.geometry, this.radiusRange);
      // data.length && this.openRtmpVideoFrame(data[0]);
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {queryRadius!} 监控点查询半径
     */
    async drawVideoCircle({ lng, lat }, queryRadius = 200) {
      // 画圈
      console.log("[drawVideoCircle]", lng, lat, queryRadius);
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: queryRadius,
          semiMajorAxis: queryRadius,
          height: 12,
          material: Cesium.Color.WHITE.withAlpha(0.1),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE,
        },
        name: "videoCircle",
      });
      window.earth.entities.add(circleEntity);
      this.entitiesID.push(circleEntity.id);
      const circleLabelEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 200),
        label: {
          text: `周边${queryRadius}米内监控`,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "10px",
          scale: 1,
          outlineWidth: 4,
          showBackground: true,
          backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            10000
          ),
          eyeOffset: new Cesium.Cartesian3(0.0, -260.0, 0),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        name: "normalCircleLabel",
      });
      window.earth.entities.add(circleLabelEntity);
      this.entitiesID.push(circleLabelEntity.id);

      this.rtmpList.forEach((item) => {
        const videoPointEntity = new Cesium.Entity({
          id: `normalpoint_${item.mp_id}`,
          position: Cesium.Cartesian3.fromDegrees(
            Number(item.lng),
            Number(item.lat),
            30
          ),
          billboard: {
            image: "/static/images/map-ico/视频监控.png",
            width: 40,
            height: 40,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          name: item.mp_name,
        });
        window.earth.entities.add(videoPointEntity);
        this.entitiesID.push(videoPointEntity.id);
      });
    },
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removeVideoCircle(id) {
      this.entitiesID.forEach((item) => {
        window.earth.entities.removeById(item);
      });
      this.entitiesID = [];
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
      this.doRtmpListFrame = false;
      this.forceRtmpVideo = undefined;
      this.RtmpVideoURL = undefined;
      this.RtmpVideoMode = "flash";
      this.RtmpForcePoint = {};
    },
  },
};
</script>

<style lang="less">
.rtmp-video-range {
  width: unset !important;
  > .el-input {
    > .el-input__inner {
      padding: 1vh 0.6vh !important;
      height: 2vh !important;
      line-height: 2vh !important;
      width: 5.8vh;
      font-size: 1.4vh;
    }
    > .el-input__suffix {
      right: 0vh;
      > .el-input__suffix-inner {
        > .el-input__icon {
          height: unset !important;
          width: 2vh !important;
          line-height: unset !important;
        }
        > .el-select__caret {
          &::before {
            color: black;
            font-size: 1vh;
          }
        }
      }
    }
  }
}
.rtmpVideo {
  .rtmpListFrame {
    height: 55vh;
    width: 128vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    background-size: 100% 100%;
    background-image: url("/static/images/common/rtmp-frame.png");
    box-sizing: border-box;
    padding: 2.6vh 4.4vh 2vh 4.4vh;
    z-index: 12;
    color: white;
    > header {
      height: 4vh;
      line-height: 4vh;
      > span {
        font-size: 1.8vh;
      }
      .close {
        position: absolute;
        right: 46px;
        top: 24px;
        width: 2.6vh;
        height: 2.6vh;
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
      height: 46vh;
      display: flex;
      > div {
        height: 100%;
        display: inline-block;
      }
      .rtmpVideoList {
        width: 44vh;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        // 选择栏
        > header {
          height: 2.4vh;
          line-height: 2.2vh;
          font-size: 1.7vh;
          overflow: hidden;
          > i {
            font-size: 0.8em;
            color: #2acbfe;
            font-style: normal;
          }
          > span {
            float: right;
            cursor: pointer;
            font-size: 1.6vh;
            line-height: 2.4vh;
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
              line-height: 2.6vh;
              height: 2.6vh;
              font-size: 1.6vh;
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
                  width: 7vh;
                  text-align: right;
                  font-size: 1.3vh;
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
          height: 2.4vh;
          line-height: 2.4vh;
          font-size: 1.6vh;
          overflow: hidden;
          > p {
            display: inline-block;
            max-width: 50vh;
            line-height: 2.4vh;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
          > span {
            float: right;
            cursor: pointer;
            font-size: 1.6vh;
            line-height: 2.4vh;
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
