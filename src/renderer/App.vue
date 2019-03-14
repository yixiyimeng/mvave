<template>
	<div id="app">
		<router-view></router-view>
		<!-- <transition :name="transitionName"><router-view class="Router"></router-view></transition> -->
	</div>
</template>

<script>
export default {
	name: 'mwave',
	data() {
		return {
			transitionName: 'slide-right'
		};
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
</style>
