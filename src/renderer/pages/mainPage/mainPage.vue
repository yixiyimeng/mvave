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
	box-sizing: border-box;
	/deep/ .modbox {
		margin: 0 auto;
		text-align: center;
		padding-top: 15%;
		width: 300px;
		.fromcontrol {
			border-radius: 50px;
			background: rgba(255, 255, 255, 1);
			border: 2px solid #72cb53;
			height: 40px;
			line-height: 40px;
			margin-top: 20px;
			position: relative;
			label {
				display: inline-block;
				width: 5rem;
			}
			input[type=text],input[type=password] {
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
		
	}
	/deep/ .loginBtn,/deep/ .returnback,/deep/ .stop ,/deep/ .startBtn,/deep/ .sendtitle {
		background: #72cb53;
		display: block;
		height: 40px;
		border-radius: 50px;
		color: #005a2e;
		line-height: 40px;
		text-align: center;
		color: #fff;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, .2);
	}
	/deep/ .modbox.room{
		width: 690px
	}
	/deep/ .returnback {
		background: #eb5c7a;
		color: #fff;
		width: 80px;
		margin-right: 10px;
	}
	/deep/ .exitBtn {
		position: fixed;
		right: 20px;
		bottom: 50px;
		background: #ff0000;
		color: #fff;
		border-radius: 6px;
		width: 100px;
		height: 40px;
		text-align: center;
		font-size: 16px;
		line-height: 40px;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
		z-index: 9999;
		-webkit-app-region: no-drag;
	}
	/deep/ .startBtn{
		background: #fdde50;
		width: 100%;
		color: #4c311e;
	}
	/deep/ .stop{
		background: #ec6d64;
		width: 300px;
		position:fixed;
		bottom: 20%;
		left: 50%;
		margin-left: -150px;
		z-index: 999
		
	}
	/deep/ .sendtitle{
		width: 300px
	}
	}
</style>
