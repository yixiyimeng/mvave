<template>
	<div>
		<div class="modbox">
			<div>
				<form @keyup.enter="login">
					<div class="fromcontrol flex">
						<label>用户名</label>
						<input type="text" name="" id="" value="" placeholder="请输入用户名" v-model.trim="username" class="flex-1" />
					</div>
					<div class="fromcontrol flex">
						<label>密码</label>
						<input type="password" name="" id="" value="" placeholder="请输入密码" v-model.trim="password" class="flex-1" />
					</div>

					<a href="javascript:;" class="loginBtn mt20" @click="login()">登录</a>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { htmlescpe, urlPath } from '@/page/mainPage/utils/base';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
	data() {
		return {
			username: '',
			password: '',
			sendInfo: '',
			clientType: 'directBroadcast',
			tips: '',
			downloadPercent: 0,
			version: '0.0.4',
			isShowversion: false,
			remark: '',
		};
	},
	created() {
		const _this = this;
		this.getApiPath(urlPath);
	},
	methods: {
		...mapActions(['getApiPath']),
		login() {
			if (this.username && this.password) {
				if (htmlescpe.test(this.username)) {
					this.$toast.center('账户中包含特殊字符!');
					return;
				}
				if (htmlescpe.test(this.password)) {
					this.$toast.center('密码中包含特殊字符!');
					return;
				}
				var param = {
					username: this.username,
					password: this.password,
					clientType: this.clientType
				};
				const $me = this;

				this.$loading('正在登陆...');
				this.$http({
					url: urlPath + '/teacher-client/platform/login',
					method: 'post',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: JSON.stringify(param)
				})
					.then(da => {
						$me.$loading.close();
						if (da.data.ret == 'success') {
							$me.sendInfo = {
								schoolCode: da.data.data.schoolCode,
								schoolName: da.data.data.schoolName,
								teacAssistantCode: da.data.data.userId,
								teacAssistantName: da.data.data.name
							};
							if (this.clientType == 'classroom') {
								$me.$router.push({
									path: 'classroom',
									query: { sendInfo: JSON.stringify($me.sendInfo) }
								});
							} else {
								$me.$router.push({
									path: 'direbro',
									query: { sendInfo: JSON.stringify($me.sendInfo) }
								});
							}
							$me.setProjectType();
						} else {
							this.$toast.center(da.data.message);
						}
					})
					.catch(function(err) {
						$me.$toast.center('登录失败');
						$me.$loading.close();
					});
			} else {
				this.$toast.center('请输入正确的用户名和密码');
			}
		}
	
	}
};
</script>

<style></style>
