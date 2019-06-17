import Vue from 'vue';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';
import './assets/css/animate.css';
import './assets/css/style.css';
import './assets/css/toast.css';
import Toast from 'vue2-toast';
Vue.use(Toast);
axios.defaults.timeout = 60000;
Vue.http = Vue.prototype.$http = axios;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

// 混入一些在全局使用的功能

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() { 
    
  }
});
var devInnerHeight = 1040.0 // 开发时的InnerHeight
var devInnerWidth = 1920.0 // 开发时的InnerHeight
var devDevicePixelRatio = 1.0 // 开发时的devicepixelratio
var devScaleFactor = 1.0 // 开发时的ScaleFactor
var scaleFactor = require('electron').screen.getPrimaryDisplay().scaleFactor
//var zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
var zoomFactor = (window.innerWidth / devInnerWidth) * (window.devicePixelRatio / devDevicePixelRatio) * (
	devScaleFactor / scaleFactor)