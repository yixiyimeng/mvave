// import Vue from 'vue';
// import Router from 'vue-router';

// Vue.use(Router);

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'landing-page',
//       component: require('@/components/LandingPage').default,
//     },
//     {
//       path: '*',
//       redirect: '/',
//     },
//   ],
// });


import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/page/mainPage/pages/Main';

Vue.use(Router);

export default new Router({
  // mode: 'hash',
  // base: __dirname,
  name: 'mainPage',
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: Main
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: Main
    }
  ]
});

