<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page">
		<a href="javascript:;" class="exitApp" @click="isexit=!isexit" ><img src="../../assets/exit.png" alt="" /></a>
		<transition :name="transitionName"><router-view class="Router"></router-view></transition>
		<div class="exitappWin animated fadeIn" v-if="isexit">
			<div class="confirm">
				<div>
					<div class="title">是否关闭程序？</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="isexit=!isexit">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="exitApp">关闭</a>
					</div>
				</div>
			</div>
		</div>
		<img src="../../assets/bg.png" alt="" class="bgimg animated fast" :class="[isShowbg ? 'slideInUp' : 'slideOutDown']">
	</div>
</template>

<script>
import { urlPath } from '@/utils/base';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			transitionName: 'slide-right',
			isexit:false,
			// isShowbg:true
		};
	},
	computed: {
		...mapState(['isShowbg'])
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
				//_this.$electron.ipcRenderer.send('exitApp');
			}, 100);
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
	}
};
</script>

<style lang="less" scoped>
.exitApp {
	background: rgba(255, 0, 0, 0.6);
	color: #fff;
	display: inline-block;
	position: fixed;
	right: 20px;
	top: 20px;
	/* height: 40px;
	width: 40px;
	line-height: 40px; */
	padding: 10px;
	border-radius: 50px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	text-align: center;
	z-index: 99999;
}
.exitApp img {
	width: 25px;
	display: inline-block;
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
}.bgimg{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%
}
</style>
