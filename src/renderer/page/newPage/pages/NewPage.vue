<template>
	<div>
		<h1>我是第二个界面</h1>	
	</div>
</template>

<script>

</script>
<template>
	<div id="suspension">
		<div class="apptitle">老师端</div>
		<div class="rightBtnlist">
			<a href="javascript:;" class="kjbtn">
				<div class="la-ball-scale-multiple">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</a>
			<a href="javascript:;" class="minApp" @click="minApp" title="最小化" v-if="!isminimizeAppStatesub"><img src="../assets/min.png" alt="" /></a>
			<a href="javascript:;" class="minApp" @click="maxApp" title="最大化" v-if="isminimizeAppStatesub"><img src="../assets/max.png" alt="" /></a>
			<a href="javascript:;" class="exitBtn mt10" @click="exitBtn" title="退出直播间" v-if="onlinedirebro"></a>
			<a href="javascript:;" class="exitApp mt10" @click="exitBtnApp" title="退出"><img src="../assets/exit.png" alt="" /></a>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'suspension',
	data() {
		return {
			isminimizeAppStatesub: false, //是否最小化
			onlinedirebro: false //是否连接直播间
		};
	},
	computed: {
		...mapState(['isminimizeAppState', 'directBroadcastCode'])
	},
	mounted() {
		let win = this.$electron.remote.getCurrentWindow();
		let biasX = 0;
		let biasY = 0;
		let that = this;
		document.addEventListener('mousedown', function(e) {
			switch (e.button) {
				case 0:
					biasX = e.x;
					biasY = e.y;
					document.addEventListener('mousemove', moveEvent);
					break;
				case 2:
					that.$electron.ipcRenderer.send('createSuspensionMenu');
					break;
			}
		});

		document.addEventListener('mouseup', function() {
			biasX = 0;
			biasY = 0;
			document.removeEventListener('mousemove', moveEvent);
		});

		function moveEvent(e) {
			win.setPosition(e.screenX - biasX, e.screenY - biasY);
		}
	},
	created() {
		const _this = this;
		_this.$electron.ipcRenderer.on('isminimizeAppsub', (event, flag) => {
			_this.isminimizeAppStatesub = flag;
		});
		_this.$electron.ipcRenderer.on('onlinedirebro', (event, flag) => {
			_this.onlinedirebro = flag;
		});
	},
	methods: {
		minApp: function() {
			this.$electron.ipcRenderer.send('minApp');
		},
		maxApp: function() {
			this.$electron.ipcRenderer.send('maxApp');
		},
		exitBtn: function() {
			/* 退出直播间 */
			this.$electron.ipcRenderer.send('isexitdirebro');
		},
		exitBtnApp() {
			/* 退出程序 */
			this.$electron.ipcRenderer.send('isexitApp');
		}
	}
};
</script>

<style>
* {
	padding: 0;
	margin: 0;
	-webkit-app-region: no-drag;
}
#suspension .apptitle {
	background: rgba(255, 0, 0, 0.6);
	width: 110px;
	height: 40px;
	line-height: 40px;
	border-radius: 20px;
	color: #fff;
	font-size: 20px;
	text-align: center;
}
.rightBtnlist {
	margin: 10px auto;
	width: 45px;
	position: relative;
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
	position: relative;
	z-index: 999;
}
.rightBtnlist .kjbtn {
	opacity: 1;
	transition: all 0.3s;
	background: rgba(0, 0, 0, 0.4);
	border-radius: 20%;
	display: block;
	padding: 5px;
	position: absolute;
	top: 0;
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
	padding: 10px;
	border-radius: 50px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	text-align: center;
	z-index: 99999;
}
.minApp {
	margin-bottom: 10px;
	background: rgba(24, 114, 255, 0.9);
}
.exitApp img,
.minApp img {
	width: 25px;
	display: inline-block;
}
</style>
