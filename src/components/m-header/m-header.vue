<template>
  <div class="wrapper no-print">
    <div class="title_first">{{ titleFirst }}</div>
    <div class="nav1" :class="{'nofull':ulWidth < boxWidth}">
      <div class="nav-box">
        <ul ref="ul" :style="{'width':ulWidth+'px'}">
          <li
            class="UNcomplete"
            v-for="(item, index) in menuList"
            @mouseenter="menuEnter(item.name)"
            @mouseleave="menuLeave"
            :key="index"
            :class="{'router-link-active': $route.path===`/` + (item.url === 'analysis'?'judge':item.url), 'close': item.isPermitted == 0}"
            @click="goRouter(item.url, item.name, item.isPermitted)"
          >
            {{item.name}}
            <div class="undeline">
              <img src="./images/undeline.png" alt />
            </div>
            <div class="list_line" v-show="index !== menuList.length - 1"></div>
            <div class="modal" v-if="item.name==='分析研判' && item.isPermitted !== 0">
              <div
                v-show="userInfo.district==3303"
                class="item"
                :class="{'active': judgeType&&judgeType==1}"
                @click="judge(1)"
                style="color:#efefef"
              >永嘉山洪灾害分析</div>
              <div
                v-show="userInfo.district==3303 || userInfo.district==330329"
                class="item"
                :class="{'active': judgeType&&judgeType==2}"
                @click="judge(2)"
                style="color:#efefef"
              >泰顺廊桥防火分析</div>
              <div v-show="userInfo.district==3303" class="item">瑞安安全生产分析</div>
              <div v-show="userInfo.district==3303" class="item">鹿城楼宇安全分析</div>
              <div v-show="userInfo.district==3303" class="item">洞头堤岸防台防潮分析</div>
            </div>
            <div class="modal" v-if="item.name==='智能预案' && item.isPermitted !== 0">
              <div
                class="item"
                :class="{'active': routerUrl==='/caseMap'}"
                @click="goRouter('caseMap')"
                style="color:#efefef"
              >案例一张图</div>
              <div class="item" style="color:#efefef" @click="jumpYuAn">预案管理</div>
            </div>
            <div class="modal" v-if="item.name==='防汛信息管理' && item.isPermitted !== 0">
              <div
                v-show="userInfo.districtName==='瓯海区'"
                class="item"
                @click="goRouter('http://115.223.34.22:8090/fxft2.0/index.html')"
                style="color:#efefef"
              >防汛标绘</div>
              <div
                v-show="userInfo.districtName==='瓯海区'"
                class="item"
                @click="goRouter('http://jcfx.zjdyit.com/Home/index')"
                style="color:#efefef"
              >防汛防台信息管理</div>
            </div>
          </li>
        </ul>
      </div>
      <img
        v-show="ulWidth>boxWidth"
        :class="{active:prev}"
        @click="move(0-movenum)"
        class="prev"
        src="./images/left.png"
        alt
      />
      <img
        v-show="ulWidth>boxWidth"
        :class="{active:next}"
        @click="move( movenum)"
        class="next"
        src="./images/right.png"
        alt
      />
    </div>
    <div class="right-content-first">
      <div class="title_second" @click="showOperate = !showOperate">
        <div class="tit_1">管理员</div>
      </div>
      <div class="modal" v-show="showOperate">
        <div class="item" @click="changePWD">修改密码</div>
      </div>
    </div>
    <div class="right-content1">
      <div class="quit1" @click="logout">
        <i></i>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" :modal="false">
      <el-form
        :model="formInfo"
        :rules="rules"
        ref="formInfo"
        label-width="100px"
        class="demo-formInfo"
      >
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input type="password" v-model="formInfo.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="formInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmpassword">
          <el-input type="password" v-model="formInfo.confirmpassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";
import { WWW } from "api/config";
import { getMenu, getUserInfo, updatePassword } from "api/public/public";
import MENUS from "mock/menus";
export default {
  name: "MHeader",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      titleFirst: "城市大脑·文化旅游",
      ulWidth: 999999,
      boxWidth: 999999,
      movenum: 100,
      prev: false,
      next: true,
      date: "",
      dialogVisible: false,
      type: 0,
      routerUrl: "",
      // menuList: [...MENUS],
      menuList: [],
      formInfo: {
        username: "",
        oldpassword: "",
        password: "",
        confirmpassword: ""
      },
      showOperate: false,
      rules: {
        oldpassword: [
          // { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        confirmpassword: [
          { required: true, message: "请输入确认新密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // Promise.all([getUserInfo()]).then(res => {
    //   let districtName = res[0].districtName
    //   // this.menuList = res[1].map(val => {
    //   //   val.district = val.district.split(',')
    //   //   return val
    //   // }).filter(val => {
    //   //   return val.isHided !== 1
    //   // })
    // })
  },
  computed: {
    ...mapGetters(["userInfo"]),
    titleName() {
      if (!this.userInfo.districtName) {
        return "";
      } else {
        return this.userInfo.districtName;
      }
    },
    judgeType: {
      get() {
        if (this.$route.path === "/judge") {
          if (Number(this.$route.query.type) === 2) return 2;
          return 1;
        } else {
          return false;
        }
      },
      set() {}
    }
  },
  methods: {
    // 鼠标移入菜单时
    menuEnter(name) {
      if (
        name === "分析研判" ||
        name === "智能预案" ||
        name === "防汛信息管理"
      ) {
        console.log(document.getElementsByClassName("nav-box")[0]);
        document.getElementsByClassName("nav-box")[0].style.height = "250px";
      }
    },
    // 鼠标移出菜单时
    menuLeave() {
      document.getElementsByClassName("nav-box")[0].style.height = "0.53rem";
    },
    // 修改密码
    changePWD() {
      this.showOperate = false;
      this.dialogVisible = true;
    },
    // 确认修改
    confirmChange() {
      this.$refs.formInfo.validate(valid => {
        if (valid) {
          this.formInfo.username = this.userInfo.username;
          console.log(this.formInfo);
          updatePassword(this.formInfo).then(res => {
            console.log(res);
            if (res && res.code === 500) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
            if (!res) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.dialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    move(num) {
      const ul = this.$refs.ul;
      const el = ul.parentNode;
      let value = el.scrollLeft;
      el.scrollLeft = value + num;
      if (el.scrollLeft > 0) {
        this.prev = true;
      } else {
        this.prev = false;
      }
      if (el.offsetWidth + el.scrollLeft >= ul.offsetWidth) {
        this.next = false;
      } else {
        this.next = true;
      }
    },
    logout() {
      window.location.href = "http://" + window.location.host + "/logout";
    },
    fire() {
      window.open("http://10.36.234.91:8090/SYGD3D/examples/index2.html");
    },
    judge(type) {
      if (Number(this.$route.query.type) === type) {
        return;
      } else {
        if (this.$route.path === "/judge") {
          this.$store.dispatch("changeLoad", true);
        }
        this.$router.push({ path: "/judge", query: { type: type } });
      }
    },
    refrash(path) {
      if (this.$route.path === path) {
        this.$router.go(0);
      } else {
        this.$router.push({ path: path });
      }
    },
    flood() {
      window.open(
        "http://115.223.34.22:8090/fxft2.0/index.html#/login",
        "_blank"
      );
    },
    tai() {
      window.open("http://10.36.234.86:8080/fxft", "_blank");
    },
    duty() {
      if (
        WWW === "http://pshyz.f3322.net:9000" ||
        WWW.indexOf("http://localhost") === 0
      ) {
        window.open("http://pshyz.f3322.net:9002");
      } else {
        window.open("http://10.36.234.84:9002");
      }
    },
    goRouter(router, name, type) {
      if (
        name === "分析研判" ||
        name === "智能预案" ||
        name === "防汛信息管理" ||
        type == 0
      )
        return;
      if (router.indexOf("http") > -1) {
        window.open(router);
      } else if (router === "warning") {
        this.SetCurrentWaterState("水利");
        this.$router.push({ path: `/${router}` });
      } else {
        this.$router.push({ path: `/${router}` });
      }
    },
    jump() {
      if (
        WWW === "http://pshyz.f3322.net:9000" ||
        WWW.indexOf("http://localhost") === 0
      ) {
        window.open("http://pshyz.f3322.net:9001");
      } else {
        window.open("http://10.36.234.84:9001");
      }
    },
    navIsActive(to) {
      if (this.routerUrl.indexOf(to) === 0) {
        return true;
      } else {
        return false;
      }
    },
    jumpYuAn() {
      window.open("http://10.36.234.84:9003");
    },
    ...mapActions("warning", ["SetCurrentWaterState"])
  },
  watch: {
    $route(to, from) {
      /**
       * 2020/8/18
       * 根据路由修改标题
       */
      if(to.meta.title){
        this.titleFirst = to.meta.title
      }
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    },
    menuList() {
      this.$nextTick(() => {
        const childrenEl = this.$refs.ul.children;
        let allWidth = 0;
        for (let i = 0; i < childrenEl.length; i++) {
          allWidth += childrenEl[i].offsetWidth;
        }
        this.ulWidth = allWidth;
        this.boxWidth = this.$refs.ul.parentNode.offsetWidth;
      });
    }
  }
};
</script>

<style scoped lang="less">
.wrapper {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 0.53rem;
  top: -0.06rem;
  background-color: #1c1f24;
  .title_first {
    height: 100%;
    font-size: 0.3rem;
    color: white;
    line-height: 0.6rem;
    text-align: left;
    position: absolute;
    left: 0.22rem;
    cursor: pointer;
  }
  .title_first img {
    vertical-align: middle;
    height: 0.2rem;
    width: 0.35rem;
    margin-right: 0.1rem;
  }
  .title_second {
    cursor: pointer;
    height: 0.15rem;
    border-left: 0.02rem solid #fff;
    margin-top: 0.24rem;
    // background: #ccc
    left: 2.9rem;
    line-height: 0.13rem;
  }
  .tit_1,
  .tit_2 {
    margin-left: 0.07rem;
    width: 1.4rem;
    font-size: 0.16rem;
    margin-top: 0.03rem;
    -webkit-background-clip: text;
    color: #fff;
  }
  .tit_1 {
    margin-top: 0;
    color: #ffffff;
    letter-spacing: 0.015rem;
  }
  .nav1 {
    position: absolute;
    height: 0.56rem;
    float: left;
    left: 3.5rem;
  }
  li {
    float: left;
    font-size: 0.2rem;
    height: 0.32rem;
    color: #d6d6d6;
    line-height: 0.19rem;
    text-align: center;
    margin-top: 0.21rem;
    cursor: pointer;
    padding-left: 0.5em;
    padding-right: 0.5em;
    position: relative;
    &:first-child {
      padding-left: 0;
    }
  }
  .undeline {
    display: none;
    width: 0.4rem;
    height: 0.03rem;
    margin: 0 auto;
    position: relative;
  }
  .undeline img {
    width: 1rem;
    height: 0.1rem;
    position: absolute;
    left: -0.32rem;
    top: 0.03rem;
  }
  li:hover,
  li.router-link-active {
    color: #29b5e8;
    font-weight: 600;
    .undeline {
      display: block;
    }
  }
  li.close {
    color: #a3a3a3;
    position: relative;
  }
  li.close:hover {
    color: #a3a3a3;
    font-weight: normal;
    .undeline {
      display: none;
    }
  }
  li.UNcomplete {
    position: relative;
    .modal {
      display: none;
      position: absolute;
      background: #1c1f24;
      text-align: center;
      color: #a3a3a3;
      width: 200%;
      font-size: 0.16rem;
      box-shadow: rgb(86, 170, 255) 0px 0px 30px inset;
      border-radius: 4px;
      left: -0.5rem;
      top: 0.26rem;
      .item {
        line-height: 0.3rem;
        height: 0.3rem;
      }
      .item.active {
        color: #29b5e8 !important;
        font-weight: 600;
      }
      .item:hover {
        color: #29b5e8 !important;
        font-weight: 600;
      }
      padding: 0.1rem;
    }
  }
  li.UNcomplete:hover {
    .modal {
      display: block;
    }
    .undeline {
      display: none;
    }
  }
  .right-content1 {
    width: 0.4rem;
    height: 0.72rem;
    right: 0;
    position: absolute;
  }
  .right-content-first {
    height: 0.72rem;
    right: 0.4rem;
    position: absolute;
    .modal {
      position: absolute;
      background: #1c1f24;
      text-align: center;
      color: #a3a3a3;
      width: 100%;
      font-size: 0.14rem;
      box-shadow: rgb(86, 170, 255) 0px 0px 30px inset;
      border-radius: 4px;
      right: 0;
      top: 0.5rem;
      .bg-image("images/code");
      background-size: 14px 14px;
      background-position: 20px;
      .item {
        line-height: 0.2rem;
        height: 0.2rem;
        color: #fff;
        cursor: pointer;
      }
      .item.active {
        color: #29b5e8 !important;
        font-weight: 600;
      }
      .item:hover {
        color: #29b5e8 !important;
        font-weight: 600;
      }
      padding: 0.1rem;
    }
  }
  .list_line {
    width: 0.01rem;
    height: 0.16rem;
    .bg-image("images/square");
    top: 0.02rem;
    right: 0rem;
    position: absolute;
  }
  .close:last-child .list_line {
    display: none;
  }
  .quit1 {
    width: 0.65rem;
    height: 0.3rem;
    margin-top: 0.26rem;
    cursor: pointer;
    position: absolute;
    i {
      width: @font-size-small;
      height: @font-size-small;
      float: left;
      .bg-image("images/quit");
      margin-right: 0.02rem;
      margin-left: 0.1rem;
    }
    span {
      font-size: 0.1rem;
      float: left;
      line-height: @font-size-small;
      color: @color-text-hover;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #00ffff;
      text-align: center;
    }
  }
}
.nav1 {
  left: 5.6rem !important;
  right: 2rem;
  // overflow: hidden;
  padding: 0 0.36rem;
  position: relative;
  &.nofull {
    padding: 0 0.2rem;
  }
  .nav-box {
    // overflow: hidden;
    overflow-x: hidden;
    > ul {
      // overflow: hidden;
    }
  }
  > img {
    display: block;
    position: absolute;
    width: 0.32rem;
    height: 0.32rem;
    top: 50%;
    margin-top: 0.02rem;
    transform: translate(0, -50%);
    opacity: 0.2;
    cursor: default;
    &.active {
      opacity: 1;
      cursor: pointer;
    }
    &.prev {
      left: 0;
    }
    &.next {
      right: 0;
    }
  }
}
/deep/ .el-dialog__title {
  .bg-image("images/green");
  background-size: 1% 80%;
  text-indent: 1em;
  display: block;
  background-position: 0px;
}
/deep/ .el-dialog__wrapper .el-dialog {
  background-color: rgba(0, 51, 83, 0.9);
  color: #ffffff;
  width: 32%;
  font-size: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 20vh !important;
}
/deep/ .el-form {
  width: 80%;
  margin: auto;
}
/deep/ .el-dialog__header {
  background: linear-gradient(
    left,
    rgba(255, 255, 255, 0.4),
    rgba(5, 56, 87, 0)
  );
  padding: 10px 20px 10px;
}
/deep/ .el-dialog__title {
  color: #ffffff;
  font-size: 16px;
}
/deep/ .el-form-item__label {
  color: #ffffff;
}
/deep/ .el-dialog__headerbtn {
  top: 10px;
}
/deep/ .el-dialog__footer {
  padding: 0px 20px 20px;
  text-align: center;
}
/deep/ .el-input__inner {
  height: 0.35rem;
  line-height: 0.35rem;
}
/deep/ .el-button {
  height: 0.32rem;
  line-height: 0.05rem;
  width: 90px;
  background: #29426a;
  border: 1px #345891 solid;
  color: #ffffff;
}
/deep/ .el-button:hover {
  background: #3b619c;
}
/deep/ .el-button--primary:hover {
  background: #0b8cdd;
  border: 1px #0574b9 solid;
}
/deep/ .el-button--primary {
  background: #0574b9;
  border: 1px #0574b9 solid;
}
/deep/ .el-input__inner {
  color: #ffffff;
  background: rgba(5, 56, 87, 0.3);
  box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 10px inset;
  border: none;
}
// 屏幕适配1620
@media screen and (min-width: 5000px) {
  .wrapper .nav1 {
    left: 9.5rem;
  }
}
.input {
  height: 0.4rem;
  line-height: 0.4rem;
}
.input-item {
  display: inline-block;
  width: 65%;
  float: right;
}
/deep/ .el-dialog {
  width: 45%;
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
