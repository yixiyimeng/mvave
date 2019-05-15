import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

import {ipcRenderer} from 'electron';
import IPC from '#/IPC.js';
import './assets/css/animate.css';
import './assets/css/style.css';
import 'vue2-toast/lib/toast.css';
import 'swiper/dist/css/swiper.css';
import Toast from 'vue2-toast';
Vue.use(Toast);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
axios.defaults.timeout =  60000;
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
/* import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
Vue.component('chart', ECharts) */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');

ipcRenderer.send(IPC.RENDER_READY);

var devInnerHeight = 1040.0 // 开发时的InnerHeight
var devInnerWidth = 1920.0 // 开发时的InnerHeight
var devDevicePixelRatio = 1.0// 开发时的devicepixelratio
var devScaleFactor = 1.0  // 开发时的ScaleFactor
var scaleFactor = require('electron').screen.getPrimaryDisplay().scaleFactor
//var zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
var zoomFactor = (window.innerWidth / devInnerWidth) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)
//require('electron').webFrame.setZoomFactor(zoomFactor);