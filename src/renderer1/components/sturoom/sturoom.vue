<template>
	<div>
		<!-- <audio id="music" src="/static/1.mp3"></audio> -->
		<audio id="music" :src="platformpath + '/teacher-platform/files/test.mp3'" crossOrigin="anonymous" preload></audio>
		<!-- <load :isprogress="isprogress" :rate="rate"></load> -->
		<!-- 进度 -->
		<progressbox :isprogress="isprogress" :rate="rate"></progressbox>
		<!-- 显示答案 -->
		<notice :titlename="titlename" class=" animated fast" :class="[titlename ? 'slideInDown' : 'slideOutUp']"></notice>
		<div class="namelist" :class="{ active: isshowNamelist }">
			<div class="setting-drawer-index-handle" @click="isshowNamelist = !isshowNamelist">名单</div>
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
		<!-- 显示 -->
		<div class="activing">
			<div id="danmu"></div>
			<!--红包-->
			<div class="couten"></div>
			<div id="audio" v-if="ismicrophone">
				<div class="audiobox">
					<div id="one"></div>
					<div id="two"></div>
					<div id="three"></div>
					<div id="four"></div>
					<div id="five"></div>
				</div>
				<div class="stuname">
					<img src="../../assets/icon2.png" />
					<p>{{ stuName }}</p>
				</div>
				<img src="../../assets/audio.png" />
			</div>
			<!-- 语音文本显示 -->
			<div class=" bounceInDown animated" v-if="isreftext">
				<div class="reftext ">
					<div>{{ reftext }}</div>
				</div>
			</div>
			<div class="txtlist" v-show="isanalysis">
				<div class="item flex " v-for="(item, index) in txtlist" :key="index">
					<div class="imgbox"><img src="../../assets/normal.png" /></div>
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
			<div class="rank" v-if="isRank">
				<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
					<p>{{ item.stuName }}</p>
					<p class="score">{{ item.score }}分</p>
				</div>
			</div>
			<!-- <div id="myChart" style="height: 300px; width: 600px;" v-show="isChart"></div> -->
			<div id="myChart" style="height: 90%; width: 100%;" v-show="isChart"></div>
		</div>

		<!-- 开始动画 -->
		<div class="particlesbox flex flex-align-center" v-if="isparticlesbox"><div class="particles-img">start</div></div>
		<!-- <div class="board"><span>正确答案:</span> <span class="warn">ABCD</span></div> -->
		<board :trueAnswer="trueAnswer"></board>
		<a href="javascript:;" class="exitBtn" @click="exitBtn">退出直播间</a>
	</div>
</template>

<script>
import { IndexMixin } from '@/mixins/index';
import { notice, progressbox, board, load } from '@/components';
import { stupath, stuwspath } from '@/utils/base';
import $ from '@/assets/js/jquery-vendor';
import '@/assets/js/jquery.danmu';
import { mapState, mapGetters } from 'vuex';
export default {
	mixins: [IndexMixin],
	components: {
		notice,
		progressbox,
		board,
		load
	},
	data() {
		return {
			isshowNamelist: false,
			titlename: '',
			trueAnswer: '',
			isprogress: false, //是否显示进度条
			rate: 0, //作答进度
			directBroadcastCode: '',
			ws: null,
			sendInfo: {},
			ismicrophone: false, //麦克风
			isreftext: false, //语音测评
			isanalysis: false, //语音解析
			txtlist: [], //语音解析文本
			isRank: false, //是否显示排序
			ranklist: [],
			isChart: false,
			myChart: null,
			stuName: '', //麦克风抢答学生名称
			isparticlesbox: false,
			uuid: '',
			isAnswering: false //是否正在答题
		};
	},
	computed: {
		...mapState(['platformpath', 'interactiopath', 'foundationpath', 'isminimizeAppState']),
		...mapGetters(['getisminimizeApp'])
	},
	watch: {
		// 		isAnswering(newValue, oldValue) {
		// 			if (newValue != oldValue) {
		// 				if (!this.isminimizeAppState&&this.isAnswering) {
		// 					if ($('#danmu').data('paused')==1) {
		// 						$('#danmu').danmu('danmuResume');
		// 					}else{
		//
		// 					}
		// 				} else {
		// 					$('#danmu').danmu('danmuPause');
		// 				}
		// 			}
		// 		},
		getisminimizeApp(newValue, oldValue) {
			if (newValue != oldValue) {
				if (!this.isminimizeAppState && this.isAnswering) {
					if ($('#danmu').data('paused') == 1) {
						$('#danmu').danmu('danmuResume');
					}
				} else {
					$('#danmu').danmu('danmuPause');
				}
			}
		}
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		console.log(this.$route.query.sendInfo);
		this.directBroadcastCode = this.sendInfo.code;
		this.getNamelist('bingingCard/getAllBingdCardInfo');
	},
	mounted() {
		//var myChart = echarts.init($('#myChart')[0]);
		this.myChart = echarts.init($('#myChart')[0]);
		/* let option = {
			legend: {
				x: 'center',
				y: 'bottom',
				textStyle: {
					color: '#fff',
					fontSize: 20 * 1.2
				},
				data: ['懂', '不懂']
			},

			color: ['#86d560', '#ff999a', '#ffcc67', '#af89d6'],
			series: [
				{
					name: '主观题',
					type: 'pie',
					radius: ['30%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: true,
							position: 'inner',
							formatter: function(params) {
								console.log(params);
								return params.name + params.value + '人\n(' + params.percent + '%)';
							},
							fontSize: 20
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
		myChart.setOption(option);
		setTimeout(function() {
			myChart.resize();
		}, 50); */
		const w= parseInt($('.couten').width()/200)*200;
		console.log(($('.couten').width()-w)/2);
		const l=($('.couten').width()-w)/2+$('.couten')[0].offsetLeft;
	},
	methods: {
		/* 退出直播间 */
		exitBtn() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$loading('正在退出...');
			this.$http({
				method: 'post',
				url: stupath + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				$me.$loading.close();
				/* 关闭webscoket */
				$me.$loading.close();
				if (this.ws) {
					this.ws.close(); //离开路由之后断开websocket连接
				}

				/* 跳转到选择直播间页面 */
				this.$router.go(-1); //返回上一层
			});
			$me.$store.commit('SET_isShowbg', true);
		},
		/* 初始化答题 */
		getAnswer() {
			if ('WebSocket' in window) {
				// 打开一个 web socket
				if (!this.ws) {
					const $me = this;
					this.ws = new WebSocket(stuwspath + 'teacher-client/websocket');
					this.ws.onmessage = function(evt) {
						var received_msg = evt.data;
						console.log(received_msg);

						if (received_msg != '连接成功') {
							var msg = JSON.parse(received_msg);
							console.log('businessType' + msg.businessType);
							if (msg.reqType == 0) {
								var obj = msg.data;
								if ($me.uuid != msg.uuid) {
									return;
								}
								var time = $('#danmu').data('nowTime') ? $('#danmu').data('nowTime') + 1 : 1;
								/*当渲染弹幕过多的时候,延迟处理弹幕*/
								if ($('#danmu .danmaku').length > 500) {
									time += 200; //4000毫秒。
								}

								var answer = '';

								if (msg.businessType == 1 || msg.businessType == 2 || msg.businessType == 3) {
									answer = obj.answer;
								} else if (msg.businessType == 4) {
									answer = obj.answer == 'E' ? '✔' : '✖';
								} else if (msg.businessType == 5) {
									answer = obj.answer == 'E' ? '懂' : '不懂';
								}
								if (msg.businessType == 6) {
									/*抢红包*/

									//console.log('抢红包');
									$me.addredenvelope(msg.data);
								} else {
									console.log('主观题' + time);

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
										$me.getprogress(stupath);
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
										$me.uuid = msg.uuid;
										/*开始单题单选*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_1': {
										/*获取题目信息*/
										$me.getQuestionInfo(1);
										$me.getspeedlist(stupath);
										/*停止单题单选*/
										$me.titlename = '';
										$me.uuid = '';
										break;
									}
									case 'START_BUSINESS_TYPE_2': {
										$me.Answerstar();
										$me.titlename = '单题多选';
										$me.uuid = msg.uuid;
										/** 开始单题多选*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_2': {
										/*获取题目信息*/
										$me.getQuestionInfo(2);
										$me.getspeedlist(stupath);
										/**停止单题多选*/
										$me.titlename = '';
										$me.uuid = '';
										break;
									}
									case 'START_BUSINESS_TYPE_3': {
										$me.Answerstar();
										$me.titlename = '多题单选';
										$me.uuid = msg.uuid;
										/**开始多题单选*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_3': {
										/*获取题目信息*/
										$me.getQuestionInfo(3);
										$me.getspeedlist(stupath);
										/**停止多题单选*/
										$me.titlename = '';
										$me.uuid = '';
										break;
									}
									case 'START_BUSINESS_TYPE_4': {
										$me.Answerstar();
										$me.titlename = '判断题';
										$me.uuid = msg.uuid;
										/**开始判断题*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_4': {
										/*获取题目信息*/
										$me.getQuestionInfo(4);
										$me.getspeedlist(stupath);
										$me.uuid = '';
										/**结束判断题*/
										$me.titlename = '';
										$me.uuid = '';
										break;
									}
									case 'START_BUSINESS_TYPE_5': {
										$me.Answerstar();
										$me.titlename = '主观题';
										$me.uuid = msg.uuid;
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
										$me.Answerstar();
										$me.titlename = '抢红包';
										$me.uuid = msg.uuid;
										if (document.getElementById('music')) {
											document.getElementById('music').play();
										}
										/**开始抢红包*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_6': {
										$me.redWarslist(stupath);
										$me.titlename = '';
										document.getElementById('music').pause();
										/**停止抢红包*/

										break;
									}
									case 'START_BUSINESS_TYPE_7': {
										$me.Answerstar('yuyin');
										$me.titlename = '语音测评';
										$me.isreftext = true;
										$me.reftext = msg.data.refText;
										$me.uuid = msg.uuid;
										/*开始单题单选*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_7': {
										$me.Answerstop();
										$me.titlename = '';
										/**停止语音测评*/
										$me.isreftext = false;
										break;
									}
									case 'START_BUSINESS_TYPE_8': {
										$me.Answerstar('yuyin');
										$me.titlename = '语音识别';
										$me.uuid = msg.uuid;
										$me.isanalysis = true;
										/*开始单题单选*/
										break;
									}
									case 'STOP_BUSINESS_TYPE_8': {
										$me.Answerstop();
										$me.titlename = '';
										$me.isanalysis = false;
										/**停止语音识别*/
										break;
									}

									case 'START_BUSINESS_TYPE_9': {
										//$('#audio').show();
										$me.Answerstar('yuyin');
										/**开始抢麦克风*/
										$me.titlename = '麦克风';
										break;
									}
									case 'STOP_BUSINESS_TYPE_9': {
										/**停止抢麦克风*/

										break;
									}
									case 'START_BUSINESS_TYPE_10': {
										var obj = msg.data;
										$me.stuName = obj.stuName;
										$me.ismicrophone = true;
										break;
									}
									case 'STOP_BUSINESS_TYPE_10': {
										$me.ismicrophone = false;
										$me.titlename = '';
										break;
									}
									case 'START_BUSINESS_TYPE_11': {
										$me.Answerstar('yuyin');
										$me.titlename = '群发麦克风';
										break;
									}
									case 'STOP_BUSINESS_TYPE_11': {
										$me.ismicrophone = false;
										$me.titlename = '';
										break;
									}
									case 'START_NEXT_QUESTION': {
										/* 开始下一题 */
										$me.clear();
										$me.$store.commit('SET_isShowbg', false);
										break;
									}
								}
								// $('.plan p').text(titlename);
							} else if (msg.reqType == 7) {
								/* 语音测评 */
								var obj = msg.data;
								if ($me.uuid != msg.uuid) {
									return;
								}
								var time = $('#danmu').data('nowTime') + 1;
								/*当渲染弹幕过多的时候,延迟处理弹幕*/
								if ($('#danmu .danmaku').length > 500) {
									time += 200; //2000毫秒。
								}
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
										//console.log($('.txtlist')[0].scrollHeight)
										$('.txtlist').animate({ scrollTop: $('.txtlist')[0].scrollHeight }, 400);
									});
								}
							} else if (msg.reqType == 11) {
								/* 群发麦克风 */
								var obj = msg.data;
								$me.stuName = obj.stuName;
								$me.ismicrophone = true;
							}
						}
					};
					this.ws.onclose = function() {
						this.ws = null;
					};
				}
			} else {
				// 浏览器不支持 WebSocket
				alert('您的浏览器不支持 WebSocket!');
			}
		},
		/*查询主观题统计*/
		getStatistics() {
			const $me = this;
			this.$http({
				method: 'post',
				url: stupath + 'teacher-client/judgeAnswer/getStatistics'
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
		},
		/*获取chart*/
		getChartData(myoption) {
			this.isChart = true;
			const $me = this;
			let option = {
				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff',
						fontSize: 20 * 1.2
					},
					data: ['懂', '不懂']
				},

				color: ['#61a0a8', '#ff999a', '#ffcc67', '#af89d6'],
				series: [
					{
						name: '主观题',
						type: 'pie',
						radius: ['30%', '70%'],
						avoidLabelOverlap: true, //是否启用防止标签重叠策略
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									console.log(params);
									return params.name + params.value + '人\n(' + params.percent + '%)';
								},
								fontSize: 20
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
			//console.log(option);
			this.myChart.setOption(option);
			setTimeout(function() {
				$me.myChart.resize();
			}, 50);
		},
		Answerstar(type) {
			const $me = this;
			/* 开始答题 */
			$me.clear();
			if (type != 'yuyin') {
				$me.isprogress = true; //显示进度条
			}
			$me.$store.commit('SET_isShowbg', true);
			$me.isAnswering = true;
		},
		Answerstop() {
			const $me = this;
			$me.rate = 0;
			$me.isprogress = false; //隐藏进度条
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			document.getElementById('music').pause();
			/* 清空抢红包 */
			$me.delredenvelope();
			$me.isAnswering = false;
		},
		/* 清空页面显示内容 */
		clear() {
			const $me = this;
			$me.isprogress = false; //隱藏进度条
			$me.titlename = ''; //清空标题
			$me.isRank = false; //隐藏排序
			$me.trueAnswer = ''; //隐藏正确答案
			$me.isanalysis = false; //隐藏语言解析
			$me.txtlist = [];
			$me.ismicrophone = false; //隐藏麦克风
			$me.isreftext = false; //隐藏语言文本
			$me.isChart = false;
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStart');
			/* 判断页面是否最小化，如果最小化，暂停弹幕滚动 */
			if ($me.isminimizeAppState) {
				$('#danmu').danmu('danmuPause');
			}
			document.getElementById('music').pause();
			/* 清空抢红包 */
			$me.delredenvelope();
		}
	}
};
</script>

<style scoped="scoped"></style>
