import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
	urlPath
} from '@/page/mainPage/utils/base';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		webpath: '', //服务器地址
		platformpath: '', //平台地址
		foundationpath: '', //信息管理地址
		interactiopath: '', //数据管理地址
		isShowbg: true,
		isminimizeAppState: false,//最小化
		directBroadcastCode:''//直播间code
	},
	getters: {
		GET_WEBPATH: (state) => {
			return state.webpath
		},
		GET_PLATFORMPATH: (state) => {
			return state.platformpath
		},
		getisminimizeApp: (state) => {
			return state.isminimizeAppState
		},
	},
	mutations: {
		SET_WEBPATH: (state, webpath) => {
			state.webpath = webpath;
			state.platformpath = webpath.teacher_platform;
			state.foundationpath = webpath.foundation;
			state.interactiopath = webpath.inte;
		},
		SET_isShowbg: (state, isShowbg) => {
			state.isShowbg = isShowbg
		},
		SET_isminimizeApp: (state, isminimize) => {
			state.isminimizeAppState = isminimize
		},
		SET_directBroadcastCode: (state, directBroadcastCode) => {
			//console.log(directBroadcastCode);
			state.directBroadcastCode = directBroadcastCode
		},
	},
	actions: {
		getApiPath({
			commit
		}, url) {
			return new Promise((resolve, reject) => {

				axios({
					url: url + 'teacher-client/common/getIp',
					method: 'post',
				}).then(da => {
					if (da.data.ret == 'success') {
						commit('SET_WEBPATH', da.data.data);
						resolve(da.data.data);
					} else {

						reject()
					}
				}).catch(() => {
					reject()
				})
			})
		},

	}
});