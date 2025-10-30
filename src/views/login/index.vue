<template>
  <div
    class="bg"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(256, 256, 256, 0.8)"
  >
    <div class="login-container">
      <div class="logo">
        <div class="login-header">
          <img src="@/assets/favicon.svg" alt="" />
          <div>Kotori</div>
        </div>
        <div class="login-desc">kams 是一个专为Kotori打造的后台管理界面</div>
      </div>

      <div class="tab">
        <div @click="changeTab('login')" :class="{ current: whichTab }" class="btn tab-login">
          登录
        </div>
        <div
          @click="changeTab('register')"
          :class="{ current: !whichTab }"
          class="btn tab-register"
        >
          配置
        </div>
        <div :class="{ 'line-right': !whichTab }" class="bottom-line"></div>
      </div>

      <transition-group name="pps-e" mode="out-in" class="pps-e">
        <div class="border" v-if="whichTab" key="login">
          <pps-form @submit="loginFn()">
            <pps-input
              clearable
              :content.sync="loginForm.username"
              icon="pps-icon-admin"
              placeholder="用户名"
            ></pps-input>
            <pps-input
              clearable
              viewPassword
              :content.sync="loginForm.password"
              icon="pps-icon-lock"
              type="password"
              placeholder="密码"
            ></pps-input>
            <div><a @click="showDialog('forget')" class="forget">忘记密码？</a></div>
            <pps-button theme="confirm" class="login">登录</pps-button>
          </pps-form>
        </div>

        <div class="border config" v-else key="config">
          <pps-form @submit="submitConfigFn()" @reset="resetConfigFn()">
            <pps-input
              clearable
              :content.sync="configForm.host"
              icon="pps-icon-host"
              placeholder="无前缀后端IP地址"
              style="position: relative"
            >
              <template v-slot:prepend>
                <dp
                  @select="selectSslFn"
                  :current="configForm.protocol"
                  :menu="['https', 'http']"
                ></dp>
              </template>
            </pps-input>
            <pps-input
              clearable
              :content.sync="configForm.port"
              icon="pps-icon-port"
              placeholder="后端端口号"
            ></pps-input>
            <div><p>警告！若无需分离前后端请谨慎修改！</p></div>
            <div class="submit">
              <pps-button theme="confirm">提交</pps-button>
              <pps-button theme="" type="reset">重置</pps-button>
            </div>
          </pps-form>
        </div>
      </transition-group>
    </div>

    <div class="foot">
      <div class="list"></div>
      <div class="copylist">
        <copy-icon></copy-icon>
        Powered by kotori
      </div>
    </div>

    <pps-dialog
      :content="dialogData.message"
      :title="dialogData.title"
      :show.sync="isShowDialog"
      @confirmed="loading = false"
      @canceled="loading = false"
    ></pps-dialog>
  </div>
</template>

<script>
import copyIcon from './copyIcon.vue';
import { loginAPI } from '@/api';
import { mapMutations, mapState } from 'vuex';
// import { configureAxiosInstance } from '@/utils/request';
import dp from '@/components/dropdown';
// eslint-disable-next-line no-unused-vars
import { submitBackendConfig } from '@/utils/backendConfig';

export default {
  name: 'myLogin',
  components: { copyIcon, dp },
  data() {
    return {
      t: '',
      tabsFlag: 'login',
      isShowDialog: false,
      loading: false,
      isShowSelect: false,
      dialogData: {},
      loginForm: {
        username: '',
        password: ''
      },
      configForm: {
        protocol: 'https',
        host: '',
        port: ''
      }
    };
  },
  methods: {
    ...mapMutations('layoutOption', [
      'updateToken',
      'updateHost',
      'updatePort',
      'updateProtocol',
      'updateUsername',
      'updatePassword'
    ]),
    changeTab(flag) {
      this.tabsFlag = flag;
    },
    selectSslFn(ssl) {
      // this.isShowSelect = false;
      this.configForm.protocol = ssl;
    },
    submitConfigFn() {
      const configData = {
        host: this.configForm.host,
        port: this.configForm.port,
        protocol: this.configForm.protocol,
        username: this.loginForm.username,
        password: this.loginForm.password
      };
      submitBackendConfig({ configData });
    },
    resetConfigFn() {
      this.configForm.host = this.host;
      this.configForm.port = this.port;
      this.configForm.protocol = this.protocol;
      this.$message.info('已重置！');
    },
    async loginFn() {
      this.loading = true;
      try {
        const { data: res } = await loginAPI(this.loginForm);
        if (res.token) {
          this.updateToken(res.token);
          this.updateUsername(this.loginForm.username);
          this.updatePassword(this.loginForm.password);
          this.loading = false;
          this.$router.push('/');
        }
      } catch (error) {
        this.loading = false;
        if (error.response.status === 404) return this.showDialog('404');
        if (error.response.status === 401) return this.showDialog('401');
        console.log(error);
        this.$dialog({ title: '错误', content: error.message }).catch((action) => {});
      }
    },
    showDialog(name, msg) {
      if (name && name === 'forget') {
        this.dialogData = {
          title: '提示',
          message: '暂未开放！'
        };
      } else if (name && name === '401') {
        this.dialogData = {
          title: '警告',
          message: '账号或密码不正确！'
        };
      } else if (name && name === '404') {
        this.dialogData = {
          title: '警告',
          message: '请求资源不存在！检查后端服务是否正常！'
        };
      } else {
        this.dialogData = {
          title: '警告',
          message: msg
        };
      }
      this.isShowDialog = true;
    }
  },
  computed: {
    ...mapState('layoutOption', [
      'host',
      'port',
      'protocol',
      'username',
      'password',
      'sandBoxPort'
    ]),
    whichTab() {
      return this.tabsFlag === 'login';
    }
  },
  watch: {
    host: {
      handler(newVal, oldVal) {
        this.configForm.host = newVal;
      },
      immediate: true
    },
    port: {
      handler(newVal, oldVal) {
        this.configForm.port = newVal;
      },
      immediate: true
    },
    protocol: {
      handler(newVal, oldVal) {
        this.configForm.protocol = newVal;
      },
      immediate: true
    },
    username: {
      handler(newVal, oldVal) {
        this.loginForm.username = newVal;
      },
      immediate: true
    },
    password: {
      handler(newVal, oldVal) {
        this.loginForm.password = newVal;
      },
      immediate: true
    }
  },
  mounted() {},
  created() {
    this.configForm.protocol = this.protocol || 'https://';
  }
};
</script>

<style lang="scss" scoped>
.cmd-search-select {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  width: auto;
  border-radius: inherit;
  background: #f5f7fa;
  cursor: pointer;

  .select-label {
    width: 3.8rem;
    text-align: center;
    // padding: 0 10px;
    background: transparent;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
  }

  .icon {
    margin-left: -5px;
  }
}

.select-dropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  padding: 10px 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;

  .select-item {
    min-width: fit-content;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
}

.bg {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
  background-image: url('../../assets/bg-login.png');
  background-size: 100% 100%;

  .login-container {
    position: relative;
    flex: 1 1 0%;
  }
  .border {
    padding: 15px;
    margin-top: 10px;
    text-align: center;
    position: absolute;

    .pps-button {
      margin: 20px auto 0;
      font-weight: 400;
      font-size: 14px;
      height: 40px;
    }
    .login {
      width: 100%;
    }

    & ::v-deep .pps-input-wrapper {
      width: 360px;
      height: 38px;
      margin: 0 auto 20px;
      // background: #fff;
    }

    a {
      float: right;
      color: #00aeed;
      cursor: pointer;

      &:hover {
        color: #46c6f0;
      }
    }
  }
  .config {
    .submit {
      display: flex;
      gap: 10px;

      .pps-button {
        flex-grow: 1;
      }
    }
  }
  .tab {
    position: relative;
    display: flex;
    width: 150px;
    height: 35px;
    margin: 0 auto;

    .btn {
      width: 50%;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #00aeed;
      }
    }
    .current {
      color: #00aeed;
    }
    .bottom-line {
      position: absolute;
      bottom: 0;
      background: #00aeed;
      width: 50%;
      height: 3px;
      transition: all 0.6s ease;
    }
    .line-right {
      right: 0;
    }
  }
  .logo {
    display: flex;
    width: 100%;
    margin-bottom: 60px;
    margin-top: 50px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .login-header {
      display: flex;
      align-items: center;
      font-size: 30px;
      font-weight: 600;

      img {
        height: 50px;
        margin-right: 20px;
      }
    }

    .login-desc {
      margin-top: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .foot {
    margin-block-start: 48px;
    margin-block-end: 24px;
    font-size: 14px;
    color: #000000b5;
  }
}

.pps-e-enter {
  transform: translateX(20px);
}
// .pps-e-enter-to {
//   transform: translateX(0px);
// }

.pps-e {
  display: block;
  width: 390px;
}

.pps-e-enter-active {
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
