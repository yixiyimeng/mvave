<template>
 <div class="main-page" style="overflow: hidden;">
 	<transition :name="transitionName"><router-view class="Router"></router-view></transition>
 	<div class="exitappWin animated fadeIn" v-if="isexit">
 		<div class="confirm">
 			<div>
 				<div class="title">是否关闭程序？</div>
 				<div class="buttonGroup">
 					<a href="javascript:;" @click="isexit = !isexit">暂不</a>
 					<a href="javascript:;" class="comfirmBtn" @click="exitApp">关闭</a>
 				</div>
 			</div>
 		</div>
 	</div>
 	<img src="../assets/bg.png" alt="" class="bgimg animated fast" :class="[isShowbg ? 'slideInUp' : 'slideOutDown']" />
 </div>
</template>

<script>
import { urlPath } from '@/page/mainPage/utils/base';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			transitionName: 'slide-right',
			isexit: false
		};
	},
	computed: {
		...mapState(['isShowbg', 'isminimizeAppState', 'directBroadcastCode'])
	},
	methods: {
		exitApp: function() {
			const _this = this;
			this.$loading('正在退出软件...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/exit'
			});
			setTimeout(function() {
				_this.$loading.close();
				_this.$electron.ipcRenderer.send('exitApp');
			}, 100);
		},
		exitBtn: function() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$loading('正在退出直播间...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				/* 关闭webscoket */
				$me.$loading.close();
				/* 跳转到选择直播间页面 */
				$me.$router.go(-1); //返回上一层
			});
			setTimeout(function() {
				$me.$loading.close();
				$me.$router.go(-1); //返回上一层
			}, 5000);
		
			$me.$store.commit('SET_directBroadcastCode', '');
			/* 通知悬浮窗 退出直播间成功 */
			this.$electron.ipcRenderer.send('onlinedirebro',false);
		}
	},
	watch: {
		//使用watch 监听$router的变化
		$route(to, from) {
			//如果to索引大于from索引,判断为前进状态,反之则为后退状态
			if (to.meta.index > from.meta.index) {
				//设置动画名称
				this.transitionName = 'slide-left';
			} else {
				this.transitionName = 'slide-right';
			}
		}
	},
	created() {
		const _this = this;
		/* 主进程 通知是否关闭软件 */
		_this.$electron.ipcRenderer.on('isexitApp', event => {
			_this.isexit=true;
		});
		/* 主进程 通知是最小化 成功*/
		_this.$electron.ipcRenderer.on('isminimizeApp', (event, flag) => {
			_this.$store.commit('SET_isminimizeApp', flag);
		});
		/* 主进程 通知是否退出直播间 */
		_this.$electron.ipcRenderer.on('exitdirebro', (event, flag) => {
			_this.exitBtn();
		});
		/* 监听页面刷新的时候，存储store */
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('messageStore', JSON.stringify(this.$store.state));
		});
		//在页面加载时读取localStorage里的状态信息
		localStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('messageStore'))));
	}
};
</script>

<style lang="less" scoped>
.rightBtnlist {
}
.rightBtnlist .exitApp,
.rightBtnlist .minApp,
.rightBtnlist .exitBtn {
	opacity: 0;
	transition: all 0.3s;
}
.rightBtnlist:hover .exitApp,
.rightBtnlist:hover .minApp,
.rightBtnlist:hover .exitBtn {
	opacity: 1;
}
.rightBtnlist .kjbtn {
	opacity: 1;
	transition: all 0.3s;
}
.rightBtnlist:hover .kjbtn {
	opacity: 0;
}
.Router {
	position: absolute;
	width: 100%;
	transition: all 0.8s ease;
	z-index: 9999;
	
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
	will-change: transform;
	transition: all 500ms;
	position: absolute;
}
.slide-right-enter {
	opacity: 0;
	transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
	opacity: 0;
	transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
	opacity: 0;
	transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
	opacity: 0;
	transform: translate3d(-100%, 0, 0);
}
.bgimg {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}

</style>

