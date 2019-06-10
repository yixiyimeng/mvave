import Vue from 'vue';

import App from './App';
import router from './router';
import './assets/css/style.css';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

/* eslint-disable no-new */
// new Vue({
//   components: { App },
//   router,
//   store,
//   template: '<App/>',
// }).$mount('#app');


// The Vue build version to load with the `import` command


Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created() {
    
  }
});
