<template>
	<div>
		<div class="modbox">
			<div>
				<form @keyup.enter="login">
					<div class=" fromcontrol flex">
						<label>直播间</label>
						<label class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									value="classroom"
									name="role"
									v-model="clientType"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>学生端</span>
						</label>
						<label class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									value="directBroadcast"
									name="role"
									v-model="clientType"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>教师端</span>
						</label>
					</div>
					<div class="fromcontrol flex">
						<label>用户名</label>
						<input
							type="text"
							name=""
							id=""
							value=""
							placeholder="请输入用户名"
							v-model.trim="username"
							class="flex-1"
						/>
					</div>
					<div class="fromcontrol flex">
						<label>密码</label>
						<input
							type="password"
							name=""
							id=""
							value=""
							placeholder="请输入密码"
							v-model.trim="password"
							class="flex-1"
						/>
					</div>
					<!-- <div><search :reftitletypelist="searchList" :selectValue.sync="selectValue"></search></div> -->
					<a href="javascript:;" class="loginBtn mt20" @click="login()">登录</a>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { htmlescpe, webpath } from '@/utils/base';
import { search } from '@/components';
export default {
	data() {
		return {
			username: '',
			password: '',
			sendInfo: '',
			clientType: 'classroom',
			selectValue:{},
			searchList: [
				{ name: 'h1', value: '23' },
				{ name: 'h2', value: '233' },
				{ name: 'h3', value: '243' }
			]
		};
	},
	components: {
		search
	},
	methods: {
		login() {
			if (this.username && this.password) {
				if (htmlescpe.test(this.username)) {
					alertWarn('账户中包含特殊字符!');
					return;
				}
				if (htmlescpe.test(this.password)) {
					alertWarn('密码中包含特殊字符!');
					return;
				}
				var param =
					'username=' +
					this.username +
					'&password=' +
					this.password +
					'&clientType=' +
					this.clientType;
				const $me = this;
				this.$loading('loading...');
				this.$http({
					url: webpath + ':8899/teacher-platform/login',
					method: 'post',
					data: param
				})
					.then(da => {
						//console.log(da);
						$me.$loading.close();
						if (da.data.code == 0) {
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
						} else {
							this.$toast.center('登录失败');
						}
					})
					.catch(function(err) {
						$me.$toast.center('登录失败');
						$me.$loading.close();
					});
				/* 	setTimeout(function() {
					$me.$loading.close();
				}, 2000); */
			} else {
				this.$toast.center('请输入正确的用户名和密码');
			}
		}
	}
};
</script>

<style></style>
