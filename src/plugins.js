import store from '@/store';

let wsInstance = null;

export default {
  install(Vue) {
    const wsBus = new Vue();

    Vue.prototype.$ws = {};

    Vue.prototype.$ws.init = (options, task) => {
      const { host, port, protocol } = options;
      const final_host = host || store.state.layoutOption.host;
      const final_port = port || store.state.layoutOption.port;
      const final_protocol = protocol || store.state.layoutOption.protocol;
      const token = store.state.layoutOption.token;
      const url = `${
        final_protocol === 'https://' ? 'wss:' : 'ws:'
      }//${final_host}:${final_port}/webui/${token}`;
      if (wsInstance) return console.warn('WebSocket已经开启，不能重复初始化。');
      wsInstance = new WebSocket(url);
      Vue.prototype.$message.success('WebSocket初始化成功');
      task && task();
      Vue.prototype.$ws.instance = wsInstance;
      wsInstance.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        wsBus.$emit('wsMessage', data);
      };
      wsInstance.onopen = () => {
        Vue.prototype.$message.success('WebSocket 服务器连接成功');
      };
      wsInstance.onclose = (code) => {
        Vue.prototype.$message.warning(`WebSocket 服务器已断开，Code:${code.code}`);
        if (wsInstance) wsInstance = null;
        store.commit('webSocketOption/updateCpu');
        store.commit('webSocketOption/updateRam');
      };
      wsInstance.onerror = (error) => {
        console.log(error);
        Vue.prototype.$message.error(`WebSocket 发生错误：${String(error)}`);
      };
    };

    Vue.prototype.$ws.close = () => {
      console.log('wsclose');
      if (wsInstance) {
        wsInstance.close();
        wsInstance = null;
      }
    };
    Vue.prototype.$ws.bus = wsBus;
  }
};
