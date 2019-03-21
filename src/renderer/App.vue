<template>
	<div id="app">
		<!-- <router-view></router-view> -->
		<transition :name="transitionName"><router-view class="Router"></router-view></transition>
		<div class="download animated fadeIn" v-if="isShowversion">
			<div class="confirm">
				<img src="/static/img/upload.png" alt="" />
				<div>
					<div class="title">V 1.0.0</div>
					<div class="txt">{{ remark }}</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="cancelUpload">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="upload">立即更新</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { webpath } from '@/utils/base';
export default {
	name: 'mwave',
	data() {
		return {
			transitionName: 'slide-right',
			tips: '',
			downloadPercent: 0,
			version: '0.0.4',
			isShowversion: false,
			remark: ''
		};
	},
	created() {
		const _this = this;
		/* 先判断上线更新时间 */
		var uploadTime = localStorage.getItem('uploadTime');
		if (uploadTime) {
			if (uploadTime-0 + 7 * 86400000 < new Date().getTime()) {
				_this.getVersion({
					currentVersion: _this.version,
					fileType: 'teacher_side'
				});
			}
		} else {
			_this.getVersion({
				currentVersion: _this.version,
				fileType: 'teacher_side'
			});
		}

		_this.$electron.ipcRenderer.on('message', (event, text) => {
			console.log(text);
			_this.tips = text;
			// alert(text);
		});
		_this.$electron.ipcRenderer.on('downloadProgress', (event, progressObj) => {
			console.log(progressObj);
			_this.downloadPercent = progressObj.percent || 0;
			if(progressObj.percent==100){
				localStorage.setItem('uploadTime',new Date().getTime());
			}
		});
		_this.$electron.ipcRenderer.on('isUpdateNow', () => {
			_this.$electron.ipcRenderer.send('isUpdateNow');
		});
	
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
	methods: {
		getVersion(param) {
			const _this = this;
			this.$http({
				method: 'post',
				url: webpath + ':8899/hx5/common/versionManage/get_latest_version',
				headers: { 'Content-Type': 'application/json; charset=UTF-8' },
				data: JSON.stringify(param)
			}).then(da => {
				if (da.data.data) {
					const isForceUpdate = da.data.data.isForceUpdate;
					if (isForceUpdate == 1) {
						_this.$electron.ipcRenderer.send('checkForUpdate');
						
					} else {
						_this.isShowversion = true;
						_this.remark = da.data.data.remark;
					}
				}
			});
		},
		upload() {
			this.$electron.ipcRenderer.send('checkForUpdate');
			this.isShowversion = false;
		},
		cancelUpload(){
			localStorage.setItem('uploadTime',new Date().getTime());
			this.isShowversion = false;
		}
	}
};
</script>

<style>
@import 'assets/css/reset.css';

body {
	font-family: 'Microsoft YaHei';
}
.Router {
	position: absolute;
	width: 100%;
	transition: all 0.8s ease;
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
.download {
	position: absolute;
	background: rgba(0, 0, 0, 0.4);
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
}
.download .confirm {
	width: 360px;
	box-sizing: border-box;
	background: #fff;
	border-radius: 14px;
	position: absolute;
	top: 40%;
	left: 50%;
	padding-top: 60px;
	-webkit-transform: translate(-50%, -50%);
	padding-bottom: 20px;
}
.download .confirm > div {
	position: relative;
	z-index: 999;
}
.download .confirm img {
	position: absolute;
	top: -100px;
	width: 100%;
	left: 0;
	z-index: 0;
}
.download .confirm .title {
	line-height: 40px;
	font-size: 20px;
	margin-bottom: 10px;
	padding: 100px 50px 0;
}
.download .confirm .txt {
	color: #999;
	padding: 0 50px;
}
.download .confirm .buttonGroup {
	margin-top: 40px;
	height: 40px;
	overflow: hidden;
	line-height: 40px;
	text-align: center;
}
.download .confirm .buttonGroup a {
	display: inline-block;
	width: 40%;
	color: #000;
	border-radius: 20px;
	margin: 0 5px;
	background: #eee;
}
.download .confirm .buttonGroup a.comfirmBtn {
	background: #ffe400;
}
</style>
