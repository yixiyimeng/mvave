import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
	urlPath
} from '@/utils/base';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		duration: 0, // 当前歌曲总长度秒数
		currentTime: 0, // 当前歌曲播放秒数
		currentPoint: 0, // 当前歌曲进度条百分比 0-1
		playStatus: false, // 当前歌曲播放状态 false-暂停 true-播放中
		analyser: null, // 当前歌曲分析器
		musicList: [], // 音乐播放列表
		musicIndex: 0, // 当前播放序号
		webpath: '', //服务器地址
		isShowbg:true
	},
	getters: {
		 GET_WEBPATH: (state) => {
			return state.webpath
		}, 

	},
	mutations: {
		SET_WEBPATH: (state, webpath) => {
			state.webpath = webpath
		},
		SET_isShowbg: (state, isShowbg) => {
			state.isShowbg = isShowbg
		},
	},
	actions: {
		getApiPath({
			commit
		},url) {
		return new Promise((resolve, reject) => {
			
				axios({
					url: url+'teacher-client/common/getIp',
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
