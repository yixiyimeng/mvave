import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/page/mainPage/pages/Main';
Vue.use(Router);

export default new Router({
	// mode: 'hash',
	// base: __dirname,
	name: 'mainPage',
	routes: [{
			path: '/',
			name: 'mainPage',
			component: Main,
			redirect: '/login',
			children: [{
				path: '/login',
				name: 'login',
				component: require('@/page/mainPage/components/login/login').default
			}]
		},
		{
			path: '/mainPage',
			name: 'mainPage',
			component: Main
		}
	]
});
