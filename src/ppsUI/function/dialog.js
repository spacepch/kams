// DialogManager.js
import Vue from 'vue';
import DialogComponent from '../components/dialog/src/main';

let instance, currentMsg;
// eslint-disable-next-line prefer-const
let messageBox = [];

const DialogConstructor = Vue.extend(DialogComponent);

function initInstance() {
  instance = new DialogConstructor({
    el: document.createElement('div')
  });
  instance.callback = defaultCallback;
}

const defaultCallback = (action) => {
  if (currentMsg.resolve) {
    if (action === 'confirm') {
      if (instance.showInput) {
        currentMsg.resolve({ value: instance.inputValue, action });
      } else {
        currentMsg.resolve(action);
      }
    } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
      currentMsg.reject(action);
    }
  }
};

const show = () => {
  if (!instance) {
    initInstance();
  }

  currentMsg = messageBox.shift();
  const options = currentMsg.options;
  Object.assign(instance, {
    title: '',
    message: '',
    ...options
  });

  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.showMessageFn();
  });
};

const Dialog = function (options, callback) {
  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      messageBox.push({
        options,
        callback,
        resolve,
        reject
      });
      show();
    });
  } else {
    messageBox.push({
      options,
      callback
    });
    show();
  }
};

export default Dialog;
export { Dialog };