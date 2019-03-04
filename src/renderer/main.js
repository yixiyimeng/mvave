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
import 'swiper/dist/css/swiper.css'
import Toast from 'vue2-toast';
Vue.use(Toast);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');

ipcRenderer.send(IPC.RENDER_READY);
