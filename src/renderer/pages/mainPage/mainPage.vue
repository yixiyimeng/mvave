<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page"><router-view /></div>
</template>

<script>
/* import {musicProgress, musicName, musicInfo, musicControl, musicAudio, musicCanvas} from '@/components';

    export default {
        name: 'mainPage',
        components: {
            musicProgress, musicName, musicInfo, musicControl, musicAudio, musicCanvas
        }
    } */
</script>

<style lang="less" scoped>
.main-page {
	width: 100vw;
	height: 100vh;
	/*background: gray;*/
	-webkit-app-region: drag;
	-webkit-app-region: no-drag;
	background: url(../../assets/bg3.png) no-repeat center bottom;
	
	/deep/ .modbox {
		margin: 0 auto;
		text-align: center;
		padding-top: 20%;
		width: 300px;
		.fromcontrol {
			border-radius: 50px;
			background: rgba(255, 255, 255, 0.8);
			border: 2px solid #72cb53;
			height: 40px;
			line-height: 40px;
			margin-top: 20px;

			label {
				display: inline-block;
				width: 5rem;
			}
			input {
				line-height: 38px;
				border: none;
				background: none;
				outline: none;
			}
			select {
				appearance: none;
				-moz-appearance: none;
				-webkit-appearance: none;
				line-height: 38px;
				margin-right: 10px;
				border: none;
			}
		}
		.loginBtn {
			background: #72cb53;
			display: block;
			height: 40px;
			border-radius: 50px;
			color: #005a2e;
			line-height: 40px;
		}
	}
	/deep/ .modbox.room{
		width: 690px
	}
	}
</style>
