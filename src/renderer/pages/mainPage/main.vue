<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
	<div class="main-page">
		<div class="plan slideInLeft animated fast" v-if="isStart">
			<img src="../../assets/notice.png" />
			<div>
				<p>{{ titlename }}</p>
				<p v-if="istrueAnswer">
					正确答案
					<span class="warn">{{ trueAnswer }}</span>
				</p>
			</div>
		</div>
		<div class="namelist" :class="{ active: isshowNamelist }">
			<div class="setting-drawer-index-handle" @click="isshowNamelist = !isshowNamelist">
				名单
			</div>
			<div class="swiper-container" style="height: 100%; overflow: auto;">
				<ul>
					<!-- {{namelist}} -->
					<li v-for="(item, index) in namelist">
						<i :class="item.state == 0 ? 'warn' : 'success'"></i>
						<span>{{ item.stuName }}</span>
					</li>
				</ul>
			</div>
		</div>
		<!-- 进度 -->
		<div class="progressbox" :class="{ active: isprogress }">
			<div class="progress">
				<div>
					<div class="progress-bar" :style="{ height: rate }">
						<span>{{ rate }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 显示 -->
		<div class="activing">
			<div id="danmu"></div>
			<!--红包-->
			<div class="couten"></div>
			<div id="audio" v-if="ismicrophone">
				<div>
					<div id="one"></div>
					<div id="two"></div>
					<div id="three"></div>
					<div id="four"></div>
					<div id="five"></div>
				</div>

				<img src="../../assets/audio.png" />
			</div>
			<!-- 语音文本显示 -->
			<div class="reftext" v-if="isreftext">
				<div>{{ reftext }}</div>
			</div>
			<div class="txtlist" v-if="isanalysis">
				<div class="item flex " v-for="(item, index) in txtlist" :key="index">
					<div class="imgbox"><img src="../../assets/avatar.png" /></div>
					<div class="flex-1">
						<div class="flex flex-pack-justify">
							<span>{{ item.name }}</span>
							<span><img src="../../assets/icon.png" /></span>
						</div>
						<p>{{ item.txt }}</p>
					</div>
				</div>
			</div>
		</div>
		<!-- 结果 -->
		<div class="resultbox flex flex-align-center flex-pack-center">
			<!-- <div class="flex-1"> -->
			<div class="rank" v-if="isRank">
				<div class="rankitem" v-for="(item, index) in ranklist">
					<p>{{ item.stuName }}</p>
					<p class="score">{{ item.score }}</p>
				</div>
				<!-- <div class="rankitem"></div>
				<div class="rankitem"></div> -->
			</div>
			<div class="chart" >
				<!-- <div id="myChart" style="height: 300px;"></div> -->
				<chart ref="chart1" :options="orgOptions" :auto-resize="true"  style="height: 300px;"></chart>
			</div>
			<!-- </div> -->
		</div>
		<!-- 登录 -->
		<div class="modbox" v-if="isLogin">
			<div>
				<div class="fromcontrol flex">
					<label>用户名</label>
					<input
						type="text"
						name=""
						id=""
						value=""
						placeholder="请输入用户名"
						v-model="username"
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
						v-model="password"
						class="flex-1"
					/>
				</div>
				<a href="javascript:;" class="loginBtn mt20" @click="login()">登录</a>
			</div>
		</div>
		<!-- 选择教室和班级 -->
		<div class="modbox" v-if="isClass">
			<div>
				<div class="fromcontrol flex">
					<label>教室</label>
					<select name="" id="" v-model="sendInfo.classroomCode" class="flex-1">
						<option
							:value="room.code"
							v-for="(room, index) in classroomlist"
							:key="index"
						>
							{{ room.name }}
						</option>
					</select>
				</div>
				<div class="fromcontrol flex">
					<label>班级</label>
					<select name="" id="" v-model="sendInfo.classCode" class="flex-1">
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
		<div class="modbox room" v-show="isDirRoom">
			<div style="width: 100%;" class="flex flex-align-center flex-v">
				<div class="swiper" style="position: relative; margin-bottom:20px">
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div
								class="swiper-slide"
								v-for="(room, index) in dirroomlist"
								:key="index"
								:style="{ width: dirroomlist.length > 3 ? 'auto' : '220px' }"
							>
								{{ room.name }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex" style="width: 300px; margin: 0 auto;">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="startService()">
						确定
					</a>
				</div>
			</div>
		</div>
		<a href="javascript:;" class="exitBtn" v-if="isStart" @click="exitBtn">退出直播间</a>
	</div>
</template>

<script>
import $ from '@/assets/js/jquery-vendor';
import '@/assets/js/jquery.danmu';
import Swiper from 'swiper';
var redenvelope = {
	num: 0,
	win: parseInt($('.couten').css('width')) - 60,
	add: function(info) {
		var hb = parseInt(Math.random() * (3 - 1) + 1);
		var Wh = parseInt(Math.random() * (70 - 30) + 20);
		var Left = parseInt(Math.random() * (this.win / 50 - 0) + 0);
		var rot = parseInt(Math.random() * (45 - -45) - 45) + 'deg';
		//				console.log(rot)
		this.num++;
		var time = new Date().getTime();
		$('.couten').append(
			"<li class='li" +
				time +
				"' ><a href='javascript:;'><p class='num'>+" +
				info.score +
				"</p><img src='../../assets/avatar.png'><p>" +
				info.stuName +
				'</p></a></li>'
		);
		$('.li' + time).css({
			left: Left * 50
		});

		$('.li' + time).animate(
			{
				bottom: $(window).height() + 20
			},
			5000,
			function() {
				//删掉已经显示的红包
				$(this).remove();
			}
		);
	},
	del: function() {
		/*this.nums++;
		$(".li" + nums).remove();
		setTimeout(del, 200)*/
	}
};
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
			isStart: false, //开启了服务，可以退出直播间按钮
			schoolCode: '',
			classroomlist: [],
			classlist: [],
			dirroomlist: [],
			sendInfo: {},
			path: 'http://192.168.10.110:8899/',
			wspath: 'ws://192.168.10.110:8899/',
			ws: null,
			titlename: '',
			isshowNamelist: false, //显示名单
			namelist: [],
			isprogress: false, //显示进度条
			rate: 0, //作答进度
			directBroadcastCode: '', //选择直播间id
			isRank: false, //显示排行榜
			ranklist: [],
			roomswiper: null,
			trueAnswer: '', //正确答案
			istrueAnswer: false, //是否显示正确答案
			isreftext: false, //显示语言文本
			reftext: '', //语言文本
			ismicrophone: false, //显示麦克风
			isanalysis: false, //显示语音解析
			txtlist: [],
			myChart:null,
			orgOptions:{}
		};
	},
	mounted() {
		//初始化
		$('#danmu').danmu({
			left: 0,
			top: '10%',
			height: '80%',
			width: '100%',
			speed: 5000,
			opacity: 1
		});
		$('#danmu').data('danmuList', {});
       /* this.myChart = echarts.init(document.getElementById('myChart'));
		let option = [
			{
				value: 10,
				name: '懂'
			},
			{
				value: 20,
				name: '不懂'
			}
		];
		$me.getChartData(option); */
		this.orgOptions = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
        }]
    }
		// $('#danmu').danmu('danmuStart');
	},
	destroyed() {
		if (this.ws) {
			this.ws.close(); //离开路由之后断开websocket连接
		}
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
		/* 查询直播间 */
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
						var str = '';

						$me.$nextTick(function() {
							$me.roomswiper = new Swiper('.room .swiper-container', {
								slidesPerView: list.length >= 3 ? 3 : 'auto',
								spaceBetween: 10,
								centeredSlides: true,
								loop: list.length > 3 ? true : false,
								slideToClickedSlide: true
								/* navigation: {
									nextEl: '.swiper-button-next',
									prevEl: '.swiper-button-prev'
								} */
							});
							if (list.length > 0) {
								$me.sendInfo.code = $me.dirroomlist[0].code;
								$me.directBroadcastCode = $me.dirroomlist[0].code;
							}
						});
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
								// $me.isexitBtn = true;
								$me.isStart = true; //是否开启了服务
							} else {
								$me.$toast.center('启动直播间失败');
							}
						})
					);
				/*获取学生名单*/
				$me.getNamelist('bingingCard/getAllBingdCardInfo');
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
		Answerstar(type) {
			const $me = this;
			/* 开始答题 */
			if (type != 'yuyin') {
				$me.isprogress = true; //显示进度条
			}
			$me.isRank = false; //隐藏排序
			$me.istrueAnswer = false; //隐藏正确答案
			$me.isanalysis = false; //隐藏语言解析
			$me.txtlist = [];
			$me.ismicrophone = false; //隐藏语言文本
			$me.isreftext = false; //隐藏语言文本
			$('.chart').hide();
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			$('#danmu').danmu('danmuResume');
		},
		Answerstop() {
			const $me = this;
			$me.rate = 0;
			$me.isprogress = false; //隐藏进度条
		},
		/* 初始化答题 */
		getAnswer() {
			if ('WebSocket' in window) {
				// 打开一个 web socket
				const $me = this;
				this.ws = new WebSocket(this.wspath + 'teacher-client/websocket');
				this.ws.onmessage = function(evt) {
					var received_msg = evt.data;
					console.log(received_msg);

					if (received_msg != '连接成功') {
						var msg = JSON.parse(received_msg);

						if (msg.reqType == 0) {
							var obj = msg.data;
							var time = $('#danmu').data('nowTime') + 1;
							var answer = '';

							if (
								msg.businessType == 1 ||
								msg.businessType == 2 ||
								msg.businessType == 3
							) {
								answer = obj.answer;
							} else if (msg.businessType == 4) {
								answer = obj.answer == 'E' ? '✔' : '✖';
							} else if (msg.businessType == 5) {
								answer = obj.answer == 'E' ? '懂' : '不懂';
							}
							if (msg.businessType == 6) {
								/*抢红包*/
								redenvelope.add(msg.data);
							} else {
								//console.log(time);
								$('#danmu').danmu('addDanmu', [
									{
										text: obj.stuName,
										color: 'white',
										size: 0,
										position: 0,
										time: time
									}
								]);
							}
						} else if (msg.reqType == 1) {
							/*刷新名单*/
							for (var i = 0; i < msg.urlPaths.length; i++) {
								if (msg.urlPaths[i].method == 'getNamelist') {
									$me.getNamelist(msg.urlPaths[i].url);
								} else if (msg.urlPaths[i].method == 'getprogress') {
									$me.getprogress();
								}
							}
						} else if (msg.reqType == 2 || msg.reqType == 3) {
							/*弹出提示语*/
							// showMessage(msg.data);
							$me.$toast.center(msg.data);
						} else if (msg.reqType == 4) {
							//接受指令的时候，初始化方法

							var state = msg.order;
							switch (state) {
								case 'START_BUSINESS_TYPE_1': {
									$me.Answerstar();
									$me.titlename = '单题单选';
									/*开始单题单选*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_1': {
									/*获取题目信息*/
									$me.getQuestionInfo(1);
									$me.getspeedlist();
									/*停止单题单选*/
									$me.titlename = '';
									break;
								}
								case 'START_BUSINESS_TYPE_2': {
									$me.titlename = '单题多选';
									$me.Answerstar();

									/** 开始单题多选*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_2': {
									/*获取题目信息*/
									$me.getQuestionInfo(2);
									$me.getspeedlist();
									/**停止单题多选*/
									$me.titlename = '';
									break;
								}
								case 'START_BUSINESS_TYPE_3': {
									$me.titlename = '多题单选';
									$me.Answerstar();
									/**开始多题单选*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_3': {
									/*获取题目信息*/
									$me.getQuestionInfo(3);
									$me.getspeedlist();
									/**停止多题单选*/
									titlename = '';
									break;
								}
								case 'START_BUSINESS_TYPE_4': {
									$me.titlename = '判断题';
									$me.Answerstar();
									/**开始判断题*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_4': {
									/*获取题目信息*/
									$me.getQuestionInfo(4);
									$me.getspeedlist();
									/**结束判断题*/
									$me.titlename = '';
									break;
								}
								case 'START_BUSINESS_TYPE_5': {
									$me.titlename = '主观题';
									$me.Answerstar();
									/**开始主观题*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_5': {
									$me.getStatistics();
									$me.titlename = '';
									/**停止主观题*/
									break;
								}
								case 'START_BUSINESS_TYPE_6': {
									$me.titlename = '抢红包';
									$me.Answerstar();
									/**开始抢红包*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_6': {
									$me.redWarslist();
									$me.titlename = '';
									/**停止抢红包*/
									break;
								}
								case 'START_BUSINESS_TYPE_7': {
									$me.titlename = '语音测评';
									$me.Answerstar('yuyin');
									$me.isreftext = true;
									$me.reftext = msg.data.refText;
									/* $('.reftext')
										.show()
										.find('div')
										.text); */
									/*开始单题单选*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_7': {
									$me.Answerstop();
									$me.titlename = '';
									/**停止语音测评*/
									// $('.reftext').hide();
									$me.isreftext = false;
									break;
								}
								case 'START_BUSINESS_TYPE_8': {
									$me.titlename = '语音识别';
									$me.Answerstar('yuyin');
									// $('.txtlist').show();
									$me.isanalysis = true;
									/*开始单题单选*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_8': {
									$me.Answerstop();
									titlename = '';
									$me.isanalysis = false;
									/**停止语音识别*/
									break;
								}
								case 'START_BUSINESS_TYPE_9': {
									$me.titlename = '麦克风';
									// $('#audio').show();
									$me.ismicrophone = true;
									$me.Answerstar('yuyin');
									/**开始抢红包*/
									break;
								}
								case 'STOP_BUSINESS_TYPE_9': {
									// $('#audio').hide();
									$me.ismicrophone = false;
									$me.Answerstop();
									$me.titlename = '';
									/**停止麦克风*/
									break;
								}
							}
							// $('.plan p').text(titlename);
						} else if (msg.reqType == 7) {
							/* 语音测评 */
							var obj = msg.data;
							var time = $('#danmu').data('nowTime') + 1;
							var answer = obj.score;
							$('#danmu').danmu('addDanmu', [
								{
									text: obj.name + '(' + answer + ')',
									color: 'white',
									size: 0,
									position: 0,
									time: time
								}
							]);
						} else if (msg.reqType == 8) {
							/* 语言解析 */

							var obj = msg.data;
							if (obj.ret == 'success') {
								$me.txtlist.push(obj.data);
								$me.$nextTick(function() {
									$('.txtlist').animate(
										{ scrollTop: $('.txtlist')[0].scrollHeight },
										400
									);
								});
							}
						}
					}

					//alert("数据已接收...");
				};
				/* } */
			} else {
				// 浏览器不支持 WebSocket
				alert('您的浏览器不支持 WebSocket!');
			}
		},
		/* 退出直播间 */
		exitBtn() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				$me.isDirRoom = true; //显示直播间
				$me.isStart = false; //隐藏推出按钮，公告栏
				$me.isprogress = false; //隐藏进度条
				$me.$nextTick(function() {
					$me.roomswiper = new Swiper('.room .swiper-container', {
						slidesPerView: $me.dirroomlist.length >= 3 ? 3 : 'auto',
						spaceBetween: 10,
						centeredSlides: true,
						loop: $me.dirroomlist.length > 3 ? true : false,
						slideToClickedSlide: true
					});
					if ($me.dirroomlist.length > 0) {
						$me.sendInfo.code = $me.dirroomlist[0].code;
						$me.directBroadcastCode = $me.dirroomlist[0].code;
					}
				});

				/* 关闭webscoket */
				if (this.ws) {
					this.ws.close(); //离开路由之后断开websocket连接
				}
			});
		},
		returnback() {
			this.isClass = true;
			this.isDirRoom = false;
		},
		getspeedlist() {
			/* 获取答题排名 */
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/getSpeedKingList'
			}).then(da => {
				var list = da.data.data;
				var str = '';
				var len = list.length > 5 ? 5 : list.length;
				$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;

				/* 判断是否显示了答题正确率 */
				/* if ($(".Correctchart").length>0&&!$(".Correctchart").is(":hidden")) {
					$('.rank').addClass('top')
				} else {
					$('.rank.top').removeClass('top')
				}
				$('.rank').html(str).show(); */
				$me.isRank = true;
				$me.Answerstop();
			});
		},
		/* 获取学生名单 */
		getNamelist(url) {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/' + url
			}).then(da => {
				$me.namelist = da.data.data;
			});
		},
		/*获取答题进度*/
		getprogress() {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/getAnswerProgress'
			}).then(da => {
				var list = da.data.data;
				$me.rate = ((list.answerNumber / list.totalNumber) * 100).toFixed(0) + '%';
			});
		},
		/* 获取正确答案 */
		getQuestionInfo(type) {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/common/getQuestionInfo'
			}).then(da => {
				if (da.data.ret == 'success') {
					var trueAnswer = da.data.data.trueAnswer;
					if (type == 4) {
						trueAnswer = trueAnswer == 'E' ? '√' : '×';
					}
					$me.trueAnswer = trueAnswer;
					$me.istrueAnswer = true;
				} else {
					$me.$toast.center('获取题目信息失败');
				}
			});
		},
		/* 抢红包排名 */
		redWarslist() {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/redWars/getScores'
			}).then(da => {
				var list = da.data.data;
				var str = '';
				var len = list.length > 5 ? 5 : list.length;
				$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;
				$me.isRank = true;
				$me.Answerstop();
			});
		},
		/*查询主观题统计*/
		getStatistics() {
			const $me = this;
			this.$http({
				method: 'post',
				url: this.path + 'teacher-client/judgeAnswer/getStatistics'
			}).then(da => {
				var list = da.data.data;
				var agreeNumber = list.agreeNumber;
				var disagreeNumber = list.disagreeNumber;
				var answerNumber = list.answerNumber;
				var option = [
					{
						value: agreeNumber,
						name: '懂'
					},
					{
						value: disagreeNumber,
						name: '不懂'
					}
				];
				$me.getChartData(option);
				$me.Answerstop(); 
			});
			
		} /*获取chart*/,
		getChartData(myoption) {
			// $('.chart').show();
			let option = {
				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff'
					},
					data: ['懂', '不懂']
				},

				color: ['#86d560', '#ff999a', '#ffcc67', '#af89d6'],
				series: [
					{
						name: '访问来源',
						type: 'pie',
						radius: ['30%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									console.log(params);
									return (
										params.name + params.value + '人\n(' + params.percent + '%)'
									);
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					
					}
				]
			};
		 option.series[0].data = myoption;
			this.myChart.setOption(option);
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
	-webkit-app-region: no-drag;
	background: url(../../assets/bg3.png) no-repeat center bottom;
	// background-size: contain;
	.modbox {
		// background: url(../../assets/login.png) no-repeat center center;
		// background-size: 700px auto;
		width: 100vw;
		height: 100vh;
		-webkit-app-region: no-drag;
		z-index: 999;
		position: relative;
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
	.returnback {
		background: #eb5c7a;
		color: #fff;
		border-radius: 50px;
		height: 40px;
		width: 80px;
		text-align: center;
		line-height: 40px;
		margin-right: 10px;
	}
}
</style>
