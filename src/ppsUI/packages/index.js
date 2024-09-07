import Dialog from '../component/function/dialog.js';
const components = require.context('../component/', false, /\.vue$/);
const install = (Vue) => {
  components.keys().forEach((key) => {
    const component = components(key).default;
    Vue.component(component.name, component);
  });
};

// import { Dialog } from '../component/function/dialog.js';
// const components = import.meta.glob('../component/*.vue', { eager: true });
// const install = (Vue) => {
//   Object.keys(components).forEach((key) => {
//     const component = components[key].default;
//     Vue.component(component.name, component);
//   });
// };

export {
  install,
  Dialog
};
