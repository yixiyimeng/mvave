import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/landing',
            name: 'landing-page',
            component: require('@/pages/mainPage/mainPage').default
        },
         {
            path: '/',
            name: 'main',
			redirect: '/login',
            component: require('@/pages/mainPage/mainPage').default,
			children:[{
				 path: '/login',
				name: 'login',
				component: require('@/components/login/login').default,
			},
			{
				path: '/classroom',
				name: 'classroom',
				component: require('@/components/classroom/classroom').default,
			},{
				path: '/onlinedirebro',
				name: 'onlinedirebro',
				component: require('@/components/onlinedirebro/onlinedirebro').default,
			},{
				path: '/sturoom',
				name: 'sturoom',
				component: require('@/components/sturoom/sturoom').default,
			},{
				path: '/direbro',
				name: 'direbro',
				component: require('@/components/direbro/direbro').default,
			},
			{
				path: '/teacherroom',
				name: 'teacherroom',
				component: require('@/components/teacherroom/teacherroom').default,
			}
			]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
