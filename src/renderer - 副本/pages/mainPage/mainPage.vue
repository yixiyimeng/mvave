<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page">
		<!-- <div class="rightBtnlist" style="z-index: 999999; position: fixed;top:60px;right: 10px;">
			<a href="javascript:;" class="minApp" @click="minApp" title="最小化"><img src="../../assets/min.png" alt="" /></a> 
			<a href="javascript:;" style="background: rgba(0,0,0,.4); border-radius: 20%; display:block;padding:5px; position: absolute; top: 0; z-index: -1; " class="kjbtn">
				<div class="la-ball-scale-multiple">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</a>
			<a href="javascript:;" class="exitBtn mt10" @click="exitBtn" title="退出直播间" v-if="directBroadcastCode"></a>
			<a href="javascript:;" class="exitApp mt10" @click="isexit = !isexit" title="退出"><img src="../../assets/exit.png" alt="" /></a>
		</div>
		<div class="apptitle">学生端</div> -->
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
		<img src="../../assets/bg.png" alt="" class="bgimg animated fast" :class="[isShowbg ? 'slideInUp' : 'slideOutDown']" />
	</div>
</template>

<script>
import { urlPath, stupath } from '@/utils/base';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			transitionName: 'slide-right',
			isexit: false

			// isShowbg:true
		};
	},
	computed: {
		...mapState(['isShowbg', 'isminimizeAppState', 'directBroadcastCode'])
	},
	methods: {
		exitApp: function() {
			const _this = this;
			this.$loading('正在退出...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/exit'
			});
			setTimeout(function() {
				_this.$loading.close();
				_this.$electron.ipcRenderer.send('exitApp');
			}, 100);
		},
// 		minApp: function() {
// 			this.$electron.ipcRenderer.send('minApp');
// 		},
		exitBtn: function() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$loading('正在退出...');
			this.$http({
				method: 'post',
				url: stupath + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				$me.$loading.close();
				/* 关闭webscoket */
				$me.$loading.close();
				if (this.ws) {
					this.ws.close(); //离开路由之后断开websocket连接
				}

				/* 跳转到选择直播间页面 */
				$me.$router.go(-1); //返回上一层
			});
			setTimeout(function() {
				$me.$loading.close();
			}, 5000);
			$me.$store.commit('SET_isShowbg', true);
			$me.$store.commit('SET_directBroadcastCode', '');
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
		_this.$electron.ipcRenderer.on('isexitApp', event => {
			// _this.exitApp();
			_this.isexit=true;
			// alert(text);
		});
		_this.$electron.ipcRenderer.on('isminimizeApp', (event, flag) => {
			_this.$store.commit('SET_isminimizeApp', flag);
		});
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
.exitApp,
.minApp {
	background: rgba(255, 0, 0, 0.6);
	color: #fff;
	display: block;
	width: 45px;
	height: 45px;
	box-sizing: border-box;
	// 	position: fixed;
	// 	right: 20px;
	// 	top: 160px;
	/* height: 40px;
	width: 40px;
	line-height: 40px; */
	padding: 10px;
	border-radius: 50px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	text-align: center;
	z-index: 99999;
}
.minApp {
	// top: 240px;
	margin-bottom: 10px;
	background: rgba(24, 114, 255, 0.9);
}
.exitApp img,
.minApp img {
	width: 25px;
	display: inline-block;
}
.Router {
	position: absolute;
	width: 100%;
	transition: all 0.8s ease;
	z-index: 9999;
	/* top: 40px; */
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
.apptitle {
	background: rgba(255, 0, 0, 0.6);
	padding: 10px 20px;
	border-radius: 20px;
	color: #fff;
	font-size: 20px;
	position: fixed;
	top: 5px;
	right: 5px;
}
</style>
