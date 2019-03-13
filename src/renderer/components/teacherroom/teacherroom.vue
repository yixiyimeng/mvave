<template>
	<div>
		<!-- 进度 -->
		<progressbox :isprogress="isprogress" :rate="rate"></progressbox>
		<!-- 显示答案 -->
		<notice
			:titlename="titlename"
			:trueAnswer="trueAnswer"
			class="slideInLeft animated fast"
		></notice>
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
			<div class="reftext" v-if="isreftext">
				<div>{{ reftext }}</div>
			</div>
			<div class="txtlist" v-show="isanalysis">
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
		<div class="resultbox " v-show="isResult">
			<div class="flex flex-v flex-align-center" style="height: 100%;">
				<div class="flex-1">
					<div class="rank" v-if="isRank" :class="{ top: isCorrectchart }">
						<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
							<p>{{ item.stuName }}</p>
							<p class="score">{{ item.score }}</p>
						</div>
					</div>
					<!-- 主观题统计 -->
					<div class="chart" style="height:80%" v-show="isChart">
						<div id="myChart" style="height:100%; min-height: 300px;"></div>
					</div>
					<!-- 正确率统计 -->
					<div class="Correctchart" style="height:80%" v-show="isCorrectchart">
						<div id="myCorrectChart" style="height:100%;"></div>
					</div>
				</div>
				<a class="sendtitle" href="javascript:;" @click="sendtitle" v-show="isSendtitle">
					下发题目
				</a>
			</div>
		</div>
		<!--选择题目-->
		<div class="subject flex flex-v flex-align-center modbox" v-if="isSubject">
			<div class="tab fromcontrol">
				<label style="width:6em" class="ant-radio-wrapper">
					<span class="ant-radio">
						<input
							type="radio"
							name="Type"
							value="0"
							v-model="subjectType"
							@change="chooSesubjectType"
						/>
						<span class="ant-radio-inner"></span>
					</span>
					<span>普通题</span>
				</label>
				<label style="width:6em; margin-left: 40px;" class="ant-radio-wrapper">
					<span class="ant-radio">
						<input
							type="radio"
							name="Type"
							value="1"
							v-model="subjectType"
							@change="chooSesubjectType"
						/>
						<span class="ant-radio-inner"></span>
					</span>
					<span>语音题</span>
				</label>
			</div>

			<div class="commonroom flex-1" v-if="subjectType == 0">
				<div class="fromcontrol flex">
					<label>题型</label>
					<select
						name="filter"
						id="subjectitle"
						class="flex-1"
						v-model="subjecttitle"
						@change="settrueanswer = ''"
					>
						<option value="1">单题单选</option>
						<option value="2">判断题</option>
						<option value="3">单题多选</option>
						<option value="4">主观题</option>
						<option value="5">抢红包</option>
					</select>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle != 4 && subjecttitle != 5">
					<label>答案</label>

					<input
						type="password"
						name=""
						id=""
						value=""
						autocomplete="off"
						class="trueanswer"
						v-model="settrueanswer"
						placeholder="请输入正确答案"
					/>
				</div>
				<p class="warn" v-if="subjecttitle != 4 && subjecttitle != 5">
					<template v-if="subjecttitle == 1">
						请输入A-D的单选
					</template>
					<template v-if="subjecttitle == 2">
						请输入E（正确）或者F（错误）
					</template>
					<template v-if="subjecttitle == 3">
						请输入A-D的多选
					</template>
				</p>
				<div class="fromcontrol flex" v-if="subjecttitle != 4 && subjecttitle != 5">
					<label>得分</label>
					<input
						type="text"
						name=""
						id="getScore"
						value=""
						class="txt"
						autocomplete="off"
						v-model="score"
					/>
				</div>
			</div>
			<!-- 語音 -->
			<div class="talkroom flex-1 mb20" v-if="subjectType == 1">
				<div class="fromcontrol flex">
					<label>语音类型</label>
					<div
						style="display:inline-block; width:380px; font-size:20px;vertical-align: top;"
					>
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									name="talkType"
									value="6"
									v-model="subjecttitle"
									@change="chooseSubjecttitle"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>语音识别</span>
						</label>
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									name="talkType"
									value="7"
									v-model="subjecttitle"
									@change="chooseSubjecttitle"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>语音测评</span>
						</label>
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									name="talkType"
									value="8"
									v-model="subjecttitle"
									@change="chooseSubjecttitle"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>麦克风</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 6">
					<label>题目类型</label>
					<div
						style="display:inline-block; width:380px; font-size:20px;vertical-align: top;"
					>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									name="talkquestionType"
									value="7"
									v-model="talkquestionType"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文语音识别</span>
						</label>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input
									type="radio"
									name="talkquestionType"
									value="8"
									v-model="talkquestionType"
								/>
								<span class="ant-radio-inner"></span>
							</span>
							<span>中文语音识别</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 7">
					<label>题目类型</label>
					<select
						name="filter"
						class="flex-1"
						v-model="reftitletype"
						@change="changeTitleType(reftitletype)"
					>
						<option value="1">英文单词</option>
						<option value="2">英文句子</option>
						<option value="4">中文句子</option>
					</select>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 7">
					<label>题目</label>
					<div class="flex-1">
						<input
							type="text"
							name=""
							value=""
							autocomplete="off"
							v-model.trim="talkName"
							style="width: 100%;"
						/>
						<dropmenu
							:reftitletypelist="reftitletypelist"
							@selTalkName="selTalkName"
						></dropmenu>
					</div>
				</div>
			</div>

			<a href="javascript:;" class="startBtn" @click="startRace">点击开始</a>
		</div>
		<a class="stop" href="javascript:;" @click="stopRace" v-if="isStop">点击结束</a>
		<a href="javascript:;" class="exitBtn" @click="exitBtn">退出直播间</a>
		<!-- 开始动画 -->
		<div class="particlesbox flex flex-align-center" v-if="isparticlesbox"><div class="particles-img">start</div></div>
	</div>
</template>

<script>
import { notice, progressbox, dropmenu } from '@/components';
console.log(dropmenu);
import { IndexMixin } from '@/mixins/index';
import { teacherpath, teacherwspath, htmlescpe, alltxtlist } from '@/utils/base';
import $ from '@/assets/js/jquery-vendor';
import '@/assets/js/jquery.danmu';
export default {
	mixins: [IndexMixin],
	components: {
		notice,
		progressbox,
		dropmenu
	},
	data() {
		return {
			titlename: '',
			trueAnswer: '',
			isprogress: false, //是否显示进度条
			rate: '0',
			path: '',
			ws: null,
			stuName: '',
			ranklist: [],
			isRank: false,
			isChart: false,
			isCorrectchart: false,
			ismicrophone: false, //麦克风
			isreftext: false, //语音测评
			isanalysis: false, //语音解析
			txtlist: [], //语音解析文本
			directBroadcastCode: '',
			isResult: true, //是否显示统计结果
			subjecttitle: '', //题型
			subjectType: 0, //0 普通 1 语音
			settrueanswer: '', //正确答案
			score: 5, //分数
			isSubject: true, //是否显示题目
			isStop: false, //是否显示结束按钮
			myChart: null,
			myCorrectChart: null,
			reftitletype: 1, //语言测评类型
			reftitletypelist: [], //语言测评数组
			talkName: '', //语言测评题目
			talkquestionType: '', //语言识别
			isparticlesbox: false, //是否显示开始动画
			isSendtitle: false, //是否显示下发题目
			chartDate: {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			}
		};
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.directBroadcastCode = this.sendInfo.directBroadcastCode;
		this.path = teacherpath;
		/* 获取所有的语言测评预设题目 */
		// alert(alltxtlist)
	},
	mounted() {
		this.myChart = echarts.init($('#myChart')[0]);
		this.myCorrectChart = echarts.init($('#myCorrectChart')[0]); //初始化echart
	},
	methods: {
		exitBtn() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$http({
				method: 'post',
				url: teacherpath + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				/* 关闭webscoket */
				if (this.ws) {
					this.ws.close(); //离开路由之后断开websocket连接
				}
				/* 跳转到选择直播间页面 */
				this.$router.go(-1); //返回上一层
			});
		},
		getAnswer() {
			const $me = this;
			if ('WebSocket' in window) {
				if (!$me.ws) {
					// 打开一个 web socket
					$me.ws = new WebSocket(teacherwspath + 'teacher-client/websocket');

					$me.ws.onopen = function() {};

					$me.ws.onmessage = function(evt) {
						var received_msg = evt.data;
						if (received_msg != '连接成功') {
							var msg = JSON.parse(received_msg);
							if (msg.reqType == 0) {
								var obj = msg.data;
								var time = $('#danmu').data('nowTime') + 1;
								var answer = '';
								/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
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
									$me.addredenvelope(msg.data);
								} else {
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
										getNamelist(msg.urlPaths[i].url);
									} else if (msg.urlPaths[i].method == 'getprogress') {
										getprogress();
									}
								}
							} else if (msg.reqType == 2 || msg.reqType == 3) {
								/*弹出提示语*/
								// showMessage(msg.data);
							} else if (msg.reqType == 5) {
								/*正确率*/
							} else if (msg.reqType == 6) {
								$me.chartDate.title.push(msg.data.classroomName);
								$me.chartDate.agreeNumber.push(msg.data.agreeNumber);
								$me.chartDate.disagreeNumber.push(msg.data.disagreeNumber);
								var option = [
									{
										name: '懂',
										type: 'bar',
										stack: '主观题',
										barWidth: 30,
										data: $me.chartDate.agreeNumber,
										label: {
											normal: {
												show: true,
												position: 'inner',
												color: '#fff'
											}
										}
									},
									{
										name: '不懂',
										type: 'bar',
										stack: '主观题',
										barWidth: 30,
										data: $me.chartDate.disagreeNumber,
										label: {
											normal: {
												show: true,
												position: 'inner',
												color: '#fff'
											}
										}
									}
								];
								$me.getChartData(option, $me.chartDate.title);
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
							} else if (msg.reqType == 9) {
								var obj = msg.data;
								var stuName = obj.stuName;
								$me.stuName = obj.stuName;
								$me.isparticlesbox = false;
								$me.ismicrophone = true;
							}

							/*获取作答进度*/
						} else {
							$('#danmu').data('danmuList', {});
							$('#danmu').danmu('danmuStop');
							$('#danmu').danmu('danmuStart');
						}

						//alert("数据已接收...");
					};

					$me.ws.onclose = function() {
						// 关闭 websocket
						//	alert("连接已关闭...");
						$me.ws = null;
					};
				}
			} else {
				// 浏览器不支持 WebSocket
				alert('您的浏览器不支持 WebSocket!');
			}
		},
		/* 切换答题类型，显示答题标题 */
		selectsubject(type) {
			const $me = this;
			switch (type) {
				case '1': {
					$me.titlename = '单题单选';
					break;
				}
				case '2': {
					$me.titlename = '判断题';
					break;
				}
				case '3': {
					$me.titlename = '单题多选';
					break;
				}
				case '4': {
					$me.titlename = '主观题';
					break;
				}
				case '5': {
					$me.titlename = '抢红包';
					break;
				}
			}
		},
		/* 开始下发题目 */
		startRace() {
			const $me = this;
			var param = {};
			if ($me.subjectType == 0) {
				var answer = $me.settrueanswer.toLocaleUpperCase();
				let answerreg = '';
				if (!$me.subjecttitle) {
					$me.$toast.center('请选择一个题型');
					return false;
				}
				if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3) {
					if ($me.subjecttitle == 1) {
						answerreg = /^[A-D]{1}$/;
					} else if ($me.subjecttitle == 2) {
						answerreg = /^[E-F]{1}$/;
					} else if ($me.subjecttitle == 3) {
						answerreg = /^(?!.*([A-D]).*\1)[A-D]{1,4}$/;
					}
					if (!answerreg.test(answer)) {
						$me.$toast.center('请输入正确答案');
						return false;
					}
					let score = $me.score;
					let integer = /^[0-9]\d*$/; //正整数
					if (!integer.test(score)) {
						$me.score = '';
						$me.$toast.center('请输入整数');
						return false;
					}
					param = {
						trueAnswer: answer,
						score: score
					};
				}
			} else {
				if ($me.subjecttitle == 6) {
					if (!$me.talkquestionType) {
						$me.$toast.center('请选择题目类型');
						return false;
					}
					param = {
						type: $me.talkquestionType
					};
				} else if ($me.subjecttitle == 7) {
					if (!$me.reftitletype) {
						$me.$toast.center('请选择题目类型');
						return false;
					}
					if (!$me.talkName) {
						$me.$toast.center('请选择或输入题目');
						return false;
					}
					param = {
						type: $me.reftitletype,
						refText: $me.talkName
					};
				}
			}
			$me.Answerstar(param);
		},
		Answerstar(param) {
			/* 普通题目调用接口 */
			const $me = this;
			var url = '',
				judgetype = '';
			// param = {};
			switch ($me.subjecttitle) {
				case '1': {
					judgetype = 1;
					url = 'singleAnswer/start';
					$me.titlename = '单题单选';
					break;
				}
				case '2': {
					judgetype = 4;
					url = 'judgeAnswer/start';
					$me.titlename = '判断题';
					break;
				}
				case '3': {
					judgetype = 2;

					url = 'sMultiAnswer/start';
					$me.titlename = '单题多选';
					break;
				}
				case '4': {
					judgetype = 5;
					url = 'judgeAnswer/start';
					$me.titlename = '多题单选';
					break;
				}
				case '5': {
					judgetype = 6;
					url = 'redWars/start';
					$me.titlename = '抢红包';
					break;
				}
				case '6': {
					url = 'voiceAnswer/startDiscern';
					$me.titlename = '语言识别';
					break;
				}
				case '7': {
					url = 'voiceAnswer/startAppraisal';
					$me.titlename = '语言测评';
					break;
				}
				case '8': {
					url = 'microphone/start';
					$me.titlename = '麦克风';
					break;
				}
			}
			if (judgetype) {
				param.questionType = judgetype;
			}
			this.$http({
				method: 'post',
				url: teacherpath + 'teacher-client/' + url,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				/*开始答题*/

				if ($me.subjectitle != 5||$me.subjectitle != 8||$me.subjectitle != 6) {
					/*不是抢红包,语音识别，麦克风 开始弹幕*/
					$('#danmu').danmu('danmuStart');
				}
				$me.clear();
				$me.isSubject = false;
				$me.isprogress = true; //显示进度条
				$me.isStop = true;

				if ($me.subjecttitle == 6) {
					/* 语音识别 */
					$me.isanalysis = true;
				} else {
					if ($me.subjecttitle == 7) {
						$me.isreftext = true;
						$me.reftext = $me.talkName;
					}
					$me.isparticlesbox = true;
				}
			});
		},
		stopRace() {
			/* 点击结束答题 */
			
			const $me = this;
		    $me.clear();
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			if (
				$me.subjecttitle == 4 ||
				$me.subjecttitle == 6 ||
				$me.subjecttitle == 7 ||
				$me.subjecttitle == 8
			) {
				//查询主观题统计----从webscoket返回
				$me.Answerstop();
			} else if ($me.subjectitle == 5) {
				$me.redWarslist();
			} else {
				$me.getspeedlist();
			}
		},
		Answerstop() {
			/* 结束答题 */
			var url = '';
			const $me = this;
			switch ($me.subjecttitle) {
				case '1': {
					url = 'singleAnswer/stop';
					break;
				}

				case '3': {
					url = 'sMultiAnswer/stop';
					break;
				}
				case '5': {
					url = 'redWars/stop';
					break;
				}
				case '6': {
					/*停止语音 */
					url = 'voiceAnswer/stop';
					break;
				}
				case '7': {
					/*停止语音 */
					url = 'voiceAnswer/stop';
					break;
				}
				case '8': {
					/*停止麦克风 */
					url = 'microphone/stop';
					break;
				}
				default: {
					/*2或者4*/
					url = 'judgeAnswer/stop';
					break;
				}
			}
			this.$http({
				method: 'post',
				url: teacherpath + 'teacher-client/' + url
			}).then(da => {
				/*结束答题*/
				$me.isResult = true; //显示作答结果
				$me.isSendtitle = true; //显示下发题目按钮
				if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3) {
					$me.getAnswerAccuracy();
				}
			});
		},
		/* 查询正确率 */
		getAnswerAccuracy() {
			const $me = this;
			this.$http({
				method: 'post',
				url: teacherpath + 'teacher-client/common/getAnswerAccuracy'
			}).then(da => {
				var list = da.data.data;
				var option = [
					{
						value: list.trueNum,
						name: '正确'
					},
					{
						value: list.totalNum - list.trueNum,
						name: '错误'
					}
				];
				$me.getCorrectChartpieData(option);
			});
		},
		/* 正确率显示 */
		getCorrectChartpieData(myoption) {
			const $me = this;
			$me.isCorrectchart = true;
			let option = {
				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff'
					},
					data: ['正确', '错误']
				},

				color: ['#86d560', '#ff999a', '#ffcc67', '#af89d6'],
				series: [
					{
						name: '正确率',
						type: 'pie',
						radius: ['30%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									//console.log(params);
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

			$me.myCorrectChart.setOption(option);
			setTimeout(function() {
				$me.myCorrectChart.resize();
			}, 50);
		},
		/* 清空页面显示内容 */
		clear() {
			const $me = this;
			$me.isprogress = false; //是否显示进度条
			$me.rate = '0';
			$me.stuName = ''; //麦克风学生名称
			$me.isResult = false; //是否显示统计结果
			$me.ranklist = []; //排序列表
			$me.isRank = false; //是否显示排序
			$me.isChart = false; //显示主观题统计
			$me.isCorrectchart = false; //正确率统计
			$me.ismicrophone = false; //麦克风
			$me.isreftext = false; //语音测评
			$me.isanalysis = false; //语音解析
			$me.txtlist = []; //语音解析文本
			 $me.isSubject = false; //是否显示题目
			$me.isStop = false; //是否显示结束按钮
			$me.isSendtitle = false;
			$me.isparticlesbox = false;
			$me.chartDate = {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			};
		},
		/* 切换语言测评类型 */
		changeTitleType(type) {
			const $me = this;
			if (type == 1) {
				$me.reftitletypelist = alltxtlist['word'];
			} else if (type == 2) {
				$me.reftitletypelist = alltxtlist['english'];
			} else {
				$me.reftitletypelist = alltxtlist['chinese'];
			}
		},
		/* 选择语言测评题目 */
		selTalkName(talk) {
			const $me = this;
			$me.talkName = talk;
		},
		/* 下发题目 隐藏统计结果 显示题目 */
		sendtitle() {
			const $me = this;
			$me.clear();
			$me.isSubject = true;
			$me.titlename = '';
			$me.trueAnswer = '';
		},
		/* 切换题型 */
		chooSesubjectType() {
			const $me = this;
			if ($me.subjectType == 0) {
				$me.subjecttitle = '1';
			} else {
				$me.subjecttitle = '6';
				$me.talkquestionType = '7';
			}
		},
		/* 切换语音题型 */
		chooseSubjecttitle() {
			const $me = this;
			if ($me.subjecttitle == 6) {
				$me.talkquestionType = '7';
			} else if ($me.subjecttitle == 7) {
				$me.reftitletype = '1';
				$me.reftitletypelist = alltxtlist['word'];
			}
		},
		getChartData(myoption, title) {
			this.isChart = true;
			var option = {
				grid: {
					x: 45,
					y: 25,
					x2: 25,
					y2: 55
				},

				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff'
					},
					data: ['懂', '不懂']
				},
				xAxis: {
					type: 'category',
					data: title,
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
					axisLabel: {
						formatter: '{value} 人'
					}
				},
				color: ['#86d560', '#ff999a', '#ffcc67', '#af89d6']
			};
			option.series = myoption;
			myChart.setOption(option);
			setTimeout(function() {
				myChart.resize();
			}, 50);
		}
	}
};
</script>

<style scoped="scoped">
.commonroom {
	width: 300px;
	margin-bottom: 20px;
}
.mb20 {
	margin-bottom: 20px;
}
.modbox.subject {
	position: absolute;
	top: 0;
	left: 50%;
	width: 500px;
	margin-left: -250px;
	z-index: 999;
}
.modbox.subject .startBtn {
	width: 300px;
}
.warn {
	color: #f00;
	font-size: 20px;
	text-align: center;
	margin-top: 10px;
	/* margin-bottom: -10px; */
}
</style>
