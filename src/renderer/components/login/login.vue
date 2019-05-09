<template>
	<div>
	<div class="modbox">
			<div>
				<form @keyup.enter="login">
					<!-- <div class=" fromcontrol flex" >
						<label>直播间</label>
						<label class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" value="classroom" name="role" v-model="clientType" @change="changeApiurl" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>学生端</span>
						</label>
						<label class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" value="directBroadcast" name="role" v-model="clientType" @change="changeApiurl" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>教师端</span>
						</label>
					</div> -->
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
import { htmlescpe, stupath, teacherpath,urlPath } from '@/utils/base';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
	data() {
		return {
			username: '',
			password: '',
			sendInfo: '',
			clientType: 'classroom',
			tips: '',
			downloadPercent: 0,
			version: '0.0.4',
			isShowversion: false,
			remark: '',
			path: stupath
		};
	},
	computed: {
		// ...mapState(['webpath']),
		...mapState(['platformpath']),
		...mapGetters(['GET_PLATFORMPATH']),
		platformpath() {
			return this.GET_PLATFORMPATH;
		}
	},
	// created() {this.$loading.close();},
	created() {
		const _this = this;
		this.getApiPath(urlPath).then(da => {
			/* 先判断上线更新时间 */
			var uploadTime = localStorage.getItem('uploadTime');
			if (uploadTime) {
				if (uploadTime - 0 + 7 * 86400000 < new Date().getTime()) {
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
		});

		_this.$electron.ipcRenderer.on('message', (event, text) => {
			console.log(text);
			_this.tips = text;
			// alert(text);
		});
		_this.$electron.ipcRenderer.on('downloadProgress', (event, progressObj) => {
			console.log(progressObj);
			_this.downloadPercent = progressObj.percent || 0;
			if (progressObj.percent == 100) {
				localStorage.setItem('uploadTime', new Date().getTime());
			}
		});
		_this.$electron.ipcRenderer.on('isUpdateNow', () => {
			_this.$electron.ipcRenderer.send('isUpdateNow');
		});
		_this.$store.commit('SET_directBroadcastCode', '');
	},
	methods: {
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
				var param = 'username=' + this.username + '&password=' + this.password + '&clientType=' + this.clientType;
				const $me = this;

				this.$loading('正在登陆...');
				this.$http({
					url: $me.platformpath + '/teacher-platform/login',
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
							$me.setProjectType();
						} else {
							this.$toast.center(da.data.msg);
						}
					})
					.catch(function(err) {
						$me.$toast.center('登录失败');
						$me.$loading.close();
					});
			} else {
				this.$toast.center('请输入正确的用户名和密码');
			}
		},
		...mapActions(['getApiPath']),
		getVersion(param) {
			const _this = this;
			this.$http({
				method: 'post',
				url: _this.platformpath + '/teacher-platform/common/versionManage/get_latest_version',
				headers: { 'Content-Type': 'application/json; charset=UTF-8' },
				data: JSON.stringify(param)
			}).then(da => {
				if (da.data.data) {
					const isForceUpdate = da.data.data.isForceUpdate;
					if (isForceUpdate == 1) {
						_this.$electron.ipcRenderer.send(' checkForUpdate');
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
		cancelUpload() {
			localStorage.setItem('uploadTime', new Date().getTime());
			this.isShowversion = false;
		},
		changeApiurl() {
			this.path = this.clientType == 'classroom' ? stupath : teacherpath;
			const _this = this;
			this.getApiPath(urlPath).then(da => {
				/* 先判断上线更新时间 */
// 				var uploadTime = localStorage.getItem('uploadTime');
// 				if (uploadTime) {
// 					if (uploadTime - 0 + 7 * 86400000 < new Date().getTime()) {
// 						_this.getVersion({
// 							currentVersion: _this.version,
// 							fileType: 'teacher_side'
// 						});
// 					}
// 				} else {
// 					_this.getVersion({
// 						currentVersion: _this.version,
// 						fileType: 'teacher_side'
// 					});
// 				}
			});
		},
		setProjectType() {
			const projectType = this.clientType == 'classroom' ? 'student' : 'teacher';
			const _this = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/setProjectType',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify({
					projectType: projectType
				})
			}).then(da => {
				
			});
		}
	}
};
</script>

<style></style>
