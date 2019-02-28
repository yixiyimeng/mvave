<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page">
		<div class="login">
			<div>
				<div class="fromcontrol">
					<label>用户名</label>
					<input type="text" name="" id="" value="" placeholder="请输入用户名"/>
				</div>
				<div class="fromcontrol">
					<label>密码</label>
					<input type="password" name="" id="" value="" placeholder="请输入密码" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'main',
		components: {}
	}
</script>

<style lang="less" scoped>
	.main-page {
		width: 100vw;
		height: 100vh;
		/*background: gray;*/
		-webkit-app-region: drag;
		background: url(../../assets/bg.png) no-repeat center bottom;
		background-size: contain;
		.login {
			background: url(../../assets/login.png) no-repeat center center;
			background-size: 700px auto;
			width: 100vw;
			height: 100vh;
			-webkit-app-region: no-drag;
			>div {
				margin: 0 auto;
				text-align: center;
				padding-top: 300px;
				width: 300px;
				.fromcontrol{
					border-radius:50px ;
					background: rgba(255,255,255,.8);
					height: 40px;
					line-height: 40px;
					margin-top: 20px;
				
					label{
						display: inline-block;
						width: 3.5rem;
					}
					input{
						line-height: 38px;
						border: none;
						background: none;
						outline: none;
					}
				}
			}
		}
	}
</style>