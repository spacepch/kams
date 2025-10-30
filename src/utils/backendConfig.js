import { configureAxiosInstance } from '@/utils/request';
import { Dialog } from '@/ppsUI/function/dialog';
import { Message } from 'element-ui';
import store from '@/store';

export const validateAndProcessConfig = (configData) => {
  const { host, port, protocol, username, password } = configData;

  // 空值检查
  // if (!host || !protocol) {
  //   throw new ConfigValidationError('保存空配置提醒', '协议类型或IP地址为空，是否继续提交？');
  // }

  // if (!username || !password) {
  //   throw new ConfigValidationError('配置验证提醒', '用户名和密码为空！');
  // }

  // 处理端口逻辑
  let finalPort = port;
  if (host && finalPort === null) {
    // 补全端口
    const ssl = protocol === 'https';
    finalPort = ssl ? 443 : 80;
  }

  return {
    host: host,
    port: finalPort,
    protocol: protocol,
    username: username,
    password: password
  };
};

const update = (configData) => {
  const processedConfig = validateAndProcessConfig(configData);

  // 定义字段映射关系
  const fieldMapping = [
    { field: 'host', mutation: 'layoutOption/updateHost' },
    { field: 'port', mutation: 'layoutOption/updatePort' },
    { field: 'protocol', mutation: 'layoutOption/updateProtocol' },
    { field: 'username', mutation: 'layoutOption/updateUsername' },
    { field: 'password', mutation: 'layoutOption/updatePassword' }
  ];

  // 更新 store
  fieldMapping.forEach(({ field, mutation }) => {
    if (processedConfig[field] != null) {
      store.commit(mutation, processedConfig[field]);
    } else {
      console.log(`字段 ${field} 为空`);
    }
  });

  // 创建 axios 实例
  configureAxiosInstance();

  Message.success('配置更新成功');
};

export const updateBackendConfig = async (configData) => {
  try {
    update(configData);
  } catch (error) {
    Dialog({
      title: '错误',
      content: error.message
    })
      .then(() => {
        update(configData);
      })
      .catch(() => {});
  }
};

export function extractConfigFromURL(query) {
  return {
    host: query.host || null,
    port: query.port ? parseInt(query.port) : null,
    protocol: query.protocol || 'http',
    username: query.username || null,
    password: query.password || null
  };
}

const validateProtocol = (configData) => {
  const { protocol, host, port } = configData;

  if (!host && !port) {
    return true;
  }

  const currentProtocol = window.location.protocol.slice(0, -1);

  const HTTPS_PROTOCOL = 'https';

  if (currentProtocol !== HTTPS_PROTOCOL) {
    return true;
  }

  return protocol === HTTPS_PROTOCOL;
};

export const submitBackendConfig = ({ configData, callback }) => {
  const isValid = validateProtocol(configData);

  if (!isValid) {
    Dialog({
      title: '提示',
      content: '配置与当前页面协议不一致, 是否继续?'
    })
      .then(() => {
        updateBackendConfig(configData);
      })
      .catch(() => {
        callback && callback();
        Message.warning('取消提交!');
      });
  } else {
    updateBackendConfig(configData);
  }
};
