<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page">
		<!-- 登录 -->
		<div class="modbox" v-if="isLogin">
			<div>
				<div class="fromcontrol">
					<label>用户名</label>
					<input
						type="text"
						name=""
						id=""
						value=""
						placeholder="请输入用户名"
						v-model="username"
					/>
				</div>
				<div class="fromcontrol">
					<label>密码</label>
					<input
						type="password"
						name=""
						id=""
						value=""
						placeholder="请输入密码"
						v-model="password"
					/>
				</div>
				<a href="javascript:;" class="loginBtn mt20" @click="login()">登录</a>
			</div>
		</div>
		<!-- 选择教室和班级 -->
		<div class="modbox" v-if="isClass">
			<div>
				<div class="fromcontrol">
					<label>教室</label>
					<select name="" id="" v-model="sendInfo.classroomCode">
						<option
							:value="room.code"
							v-for="(room, index) in classroomlist"
							:key="index"
						>
							{{ room.name }}
						</option>
					</select>
				</div>
				<div class="fromcontrol">
					<label>班级</label>
					<select name="" id="" v-model="sendInfo.classCode">
						<option
							:value="classitem.code"
							v-for="(classitem, index) in classlist"
							:key="index"
						>
							{{ classitem.name }}
						</option>
					</select>
				</div>
				<a href="javascript:;" class="loginBtn mt20" @click="getDirectBroadcasts()">确定</a>
			</div>
		</div>
		<!-- 选择直播间 -->
		<div class="modbox" v-if="isDirRoom">
			<div>
				<div class="fromcontrol">
					<label>直播间</label>
					<select name="" id="" v-model="sendInfo.code">
						<option
							:value="room.code"
							v-for="(room, index) in dirroomlist"
							:key="index"
						>
							{{ room.name }}
						</option>
					</select>
				</div>

				<a href="javascript:;" class="loginBtn mt20" @click="startService()">确定</a>
			</div>
		</div>
		<a href="javascript:;" class="exitBtn" v-if="isexitBtn">退出直播间</a>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			username: '',
			password: '',
			clientType: 'classroom',
			isLogin: true, //是否显示登录页面
			isClass: false,
			isDirRoom: false,
			schoolCode: '',
			classroomlist: [],
			classlist: [],
			dirroomlist: [],
			sendInfo: {},
			isexitBtn: false, //退出直播间按钮
			path: 'http://192.168.10.108:8899/'
		};
	},
	methods: {
		login() {
			if (this.username && this.password) {
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
					url: 'http://113.57.172.27:8899/teacher-platform/login',
					method: 'post',
					data: param
				}).then(da => {
					//console.log(da);
					$me.$loading.close();
					if (da.data.code == 0) {
						/* 登录成功 */
						this.$toast.center('登录成功');
						$me.isLogin = false;
						$me.isClass = true;
						$me.schoolCode = da.data.data.schoolCode;
						$me.sendInfo = {
							schoolCode: da.data.data.schoolCode,
							/**校区编号*/
							schoolName: da.data.data.schoolName,
							teacAssistantCode: da.data.data.userId,
							teacAssistantName: da.data.data.name
						};
						$me.getClassroomlist();
						$me.getClasslist();
					} else {
						this.$toast.center('登录失败');
					}
				});
				setTimeout(function() {
					$me.$loading.close();
				}, 2000);
			} else {
				this.$toast.center('请输入正确的用户名和密码');
			}
		},
		/* 查询教室 */
		getClassroomlist() {
			var param = 'schoolCode=' + this.schoolCode;
			const $me = this;
			this.$http({
				url: 'http://113.57.172.27:5555/teacher-platform/foun/classroom/getClassrooms',
				method: 'post',
				data: param
			}).then(da => {
				if (da.data.code == 0) {
					var list = da.data.data;
					$me.classroomlist = list;
					//console.log(da);
				} else {
					// this.$toast.center('查询失败');
				}
			});
		},
		/* 查询班级 */
		getClasslist() {
			var param = {
				schoolCode: this.schoolCode
			};
			const $me = this;
			this.$http({
				method: 'post',
				url: 'http://113.57.172.27:5555/teacher-platform/foun/class/getClasses',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				if (da.data.code == 0) {
					var list = da.data.data;
					$me.classlist = list;
					//console.log(da);
				} else {
					// this.$toast.center('查询失败');
				}
			});
		},
		getDirectBroadcasts() {
			const $me = this;
			if ($me.sendInfo.classCode && $me.sendInfo.classroomCode) {
				var index = $me.classroomlist.findIndex(
					item => item.code == $me.sendInfo.classroomCode
				);
				$me.sendInfo.classroomName = $me.classroomlist[index].name;
				var index2 = $me.classlist.findIndex(item => item.code == $me.sendInfo.classCode);
				$me.sendInfo.className = $me.classlist[index].name;

				$me.$http({
					method: 'post',
					url: 'http://113.57.172.27:5556/teacher-platform/inte/get_online_dire_bro'
				}).then(da => {
					if (da.data.code == 0) {
						var list = da.data.data;
						$me.dirroomlist = list;
						$me.isClass = false;
						$me.isDirRoom = true;
					} else {
						// this.$toast.center('查询失败');
					}
				});
			} else {
				this.$toast.center('请选择班级和教室');
			}
		},
		/* 开始创建 */
		startService() {
			const $me = this;
			if ($me.sendInfo.code) {
				var index = $me.dirroomlist.findIndex(item => item.code == $me.sendInfo.code);
				$me.sendInfo.name = $me.dirroomlist[index].name;
				$me.sendInfo.topicCode = $me.dirroomlist[index].topicCode;
				$me.sendInfo.topicName = $me.dirroomlist[index].topicName;
				$me.sendInfo.teacherCode = $me.dirroomlist[index].teacherCode;
				$me.sendInfo.teacherName = $me.dirroomlist[index].teacherName;
				/* 链接直播间 */
				$me.startDirectBroadcasts();
			} else {
				this.$toast.center('请选择一个直播间');
			}
		},
		/*连接直播间*/
		startDirectBroadcasts() {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/saveConnRec',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(this.sendInfo)
			}).then(da => {
				$me.$http
					.all([$me.createConsumerQueue(), $me.startServer(), $me.createProducerQueue()])
					.then(
						$me.$http.spread(function(
							createConsumerQueue,
							startServer,
							createProducerQueue
						) {
							console.log(createConsumerQueue.data.ret);
							console.log(startServer.data);
							if (
								createConsumerQueue.data.ret == 'success' &&
								startServer.data.ret == 'success' &&
								createProducerQueue.data.ret == 'success'
							) {
								$me.getAnswer();
								$me.isDirRoom = false;
								$me.isexitBtn = true;
							} else {
								$me.$toast.center('启动直播间失败');
							}
						})
					);
			});
		},
		/*创建消费者队列*/
		createConsumerQueue() {
			var param = {
				exchangeType: 'topic',
				queueName: 'class02.receive',
				exchangeName: 'teacher.zhuoyue',
				routeKey: 'broadcastroom01.send'
			};
			return this.$http({
				method: 'post',
				url: this.path + 'teacher-client/rabbit/createConsumerQueue',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			});
		},
		/*创建生产者队列*/
		createProducerQueue() {
			var param = {
				exchangeType: 'topic',
				queueName: 'class02.send',
				exchangeName: 'teacher.zhuoyue',
				routeKey: 'broadcastroom01.receive'
			};
			return this.$http({
				method: 'post',
				url: this.path + 'teacher-client/rabbit/createProducerQueue',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			});
		},
		/*启动服务*/
		startServer() {
			return this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/startServer'
			});
		},
		/* 初始化答题 */
		getAnswer() {},
		/* 退出直播间 */
		exitBtn(){
			
			}
	}
};
</script>

<style lang="less" scoped>
.main-page {
	width: 100vw;
	height: 100vh;
	/*background: gray;*/
	-webkit-app-region: drag;
	background: url(../../assets/bg3.png) no-repeat center bottom;
	// background-size: contain;
	.modbox {
		// background: url(../../assets/login.png) no-repeat center center;
		// background-size: 700px auto;
		width: 100vw;
		height: 100vh;
		-webkit-app-region: no-drag;
		> div {
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
					width: 3.5rem;
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
					background: url();
				}
			}
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
	.exitBtn {
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
}
</style>
