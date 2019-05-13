<template>
	<div>
		<audio id="music" :src="platformpath + '/teacher-platform/files/test.mp3'" crossOrigin="anonymous" preload></audio>
		<!-- <audio id="music2" src="/static/1.mp3" controls="controls"   style="position: fixed; bottom: 20px; z-index: 9999; right: 0;" preload></audio> -->
		<!-- 进度 -->
		<progressbox :isprogress="isprogress" :rate="rate"></progressbox>
		<!-- <load :isprogress="isprogress" :rate="rate"></load> -->
		<!-- 显示答案 -->
		<notice :titlename="titlename" class=" animated fast" :class="[titlename ? 'slideInDown' : 'slideOutUp']"></notice>
		<div class="namelist" :class="{ active: isshowNamelist }">
			<div class="setting-drawer-index-handle" @click="isshowNamelist = !isshowNamelist">班级</div>
			<div class="swiper-container" style="height: 100%; overflow: auto;">
				<ul>
					<li v-for="(item, index) in onlineclasslist">
						<i class="success"></i>
						<span>{{ item }}</span>
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
		<div class="resultbox " v-show="isResult">
			<div class="flex flex-v flex-align-center" style="height: 100%;">
				<div class="rank" v-if="isRank" :class="{ top: isCorrectchart }">
					<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
						<p>{{ item.stuName }}</p>
						<p class="score">第{{ index + 1 }}名</p>
					</div>
				</div>
				<div class="flex-1">
					<!-- 主观题统计 -->
					<div class="chart" style="height:90%;max-width: 70%; margin:2% auto;" v-show="isChart"><div id="myChart" style="height:100%; min-height: 100px;"></div></div>
					<!-- 正确率统计 -->
					<div class="Correctchart" style="height:90%; max-width: 70%; margin: 2% auto;" v-show="isCorrectchart">
						<div id="myCorrectChart" style="height:100%; min-height:100px;"></div>
					</div>
				</div>
				<a class="sendtitle" href="javascript:;" @click="sendtitle" v-show="isSendtitle">下发题目</a>
			</div>
		</div>
		<!--选择题目-->
		<div class="subject flex flex-v flex-align-center modbox" v-show="isSubject">
			<div class="tab">
				<div class="tab-item" :class="{ active: subjectType == '0' }">
					<div @click="chooSesubjectType('0')">
						<img :src="'static/img/' + (subjectType == '0' ? 'sel' : '') + 'icon3.png'" alt="" style="width: 30px; vertical-align: middle;" />
						<span>普通题</span>
					</div>
				</div>
				<div class="tab-item" :class="{ active: subjectType == '1' }">
					<div @click="chooSesubjectType('1')">
						<img :src="'static/img/' + (subjectType == '1' ? 'sel' : '') + 'icon4.png'" alt="" style="width: 30px;vertical-align: middle;" />
						<span>语音题</span>
					</div>
				</div>
			</div>

			<div class="commonroom flex-1" v-if="subjectType == 0">
				<div class="fromcontrol flex">
					<label>题型</label>
					<search :searchList="subjectitleList" placeholdertxt="请选择题型" @selectFunc="selSubjecttitle" class="flex-1"></search>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle != 4 && subjecttitle != 5">
					<label>答案</label>

					<input type="password" name="" id="" value="" autocomplete="off" class="trueanswer" v-model="settrueanswer" placeholder="请输入正确答案" />
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
					<input type="text" name="" id="getScore" value="" class="txt" autocomplete="off" v-model="score" />
				</div>
			</div>
			<!-- 語音 -->
			<div class="talkroom flex-1 mb20" v-if="subjectType == 1">
				<div class="fromcontrol flex">
					<label>语音类型</label>
					<div style="display:inline-block; width:480px; font-size:20px;vertical-align: top;">
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkType" value="6" v-model="subjecttitle" @change="chooseSubjecttitle" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>语音识别</span>
						</label>
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkType" value="7" v-model="subjecttitle" @change="chooseSubjecttitle" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>语音测评</span>
						</label>
						<label style="width:6em; text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkType" value="8" v-model="subjecttitle" @change="chooseSubjecttitle" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>麦克风</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 6">
					<label>题目类型</label>
					<div style="display:inline-block; width:460px; font-size:20px;vertical-align: top;">
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" value="7" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文语音识别</span>
						</label>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" value="8" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>中文语音识别</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 7">
					<label>题目类型</label>

					<search :searchList="titletypeList" placeholdertxt="请选择题型" @selectFunc="changeTitleType" class="flex-1" :selectValue="onetitletype"></search>
				</div>
				<div class="flex flex-align-center" v-if="subjecttitle == 7">
					<div class="fromcontrol flex flex-1">
						<label>题目</label>
						<div class="flex-1" style="margin-right: 60px;">
							<input type="text" name="" value="" autocomplete="off" v-model.trim="talkName" style="width: 100%;" />
							<dropmenu :reftitletypelist="reftitletypelist" @selTalkName="selTalkName"></dropmenu>
						</div>
					</div>
					<div class="uploadbox">
						<input type="file" name="" value="" id="upload" @change="uploadfile" />
						<span>上传题目</span>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 8">
					<label>题目类型</label>
					<div style="display:inline-block; width:460px; font-size:20px;vertical-align: top;">
						<label style="width:5em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" value="0" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>抢麦</span>
						</label>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" value="1" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>群发麦克风</span>
						</label>
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
import { notice, progressbox, dropmenu, search, load } from '@/components';
import { IndexMixin } from '@/mixins/index';
import { mapState } from 'vuex';
import { urlPath, urlwsPath, htmlescpe, allenglish, allchinese } from '@/utils/base';
import $ from '@/assets/js/jquery-vendor';
import '@/assets/js/jquery.danmu';
export default {
	mixins: [IndexMixin],
	components: {
		notice,
		progressbox,
		dropmenu,
		search,
		load
	},
	data() {
		return {
			isshowNamelist: false,
			onlineclasslist: [], //在线班级
			titlename: '',
			trueAnswer: '',
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
			titletypeList: [
				{
					name: '英文单词',
					value: '1'
				},
				{
					name: '英文句子',
					value: '2'
				},
				{
					name: '中文句子',
					value: '4'
				}
			], //语言测评数组类型
			onetitletype: {
				name: '英文单词',
				value: '1'
			},
			reftitletypelist: [], //语言测评数组
			talkName: '', //语言测评题目
			talkquestionType: '', //语言识别
			isparticlesbox: false, //是否显示开始动画
			isSendtitle: false, //是否显示下发题目
			chartDate: {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			},
			subjectitleList: [
				{ name: '单题单选', value: '1' },
				{ name: '判断题', value: '2' },
				{ name: '单题多选', value: '3' },
				{ name: '主观题', value: '4' },
				{ name: '抢红包', value: '5' }
			],
			CorrectchartDate: {
				title: [],
				data: []
			},
			timer: null,
			uuid: '',
			alltxtlist: {},
			iPhoneType: 0, //麦克风类型
			isprogress: false, //是否显示进度条，
			rate: 0
		};
	},
	computed: {
		...mapState(['platformpath','interactiopath','foundationpath'])
		
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.directBroadcastCode = this.sendInfo.directBroadcastCode;
		this.getjson();
	},
	mounted() {
		this.myChart = echarts.init($('#myChart')[0]);
		this.myCorrectChart = echarts.init($('#myCorrectChart')[0]); //初始化echart
		const $me = this;
		$me.timer = setInterval(function() {
			if ($me.directBroadcastCode && $me.isshowNamelist) {
				$me.getOnlinelist({
					code: $me.directBroadcastCode
				});
			}
		}, 5000);
	},
	destroyed() {
		clearInterval(this.timer);
	},
	watch: {
		isshowNamelist: function(newval, oldval) {
			const $me = this;
			if (newval) {
				if ($me.directBroadcastCode && $me.isshowNamelist) {
					$me.getOnlinelist({
						code: $me.directBroadcastCode
					});
				}
			}
		},
		talkName(newValue, oldValue) {
			if (newValue != oldValue) {
				var maxnum=this.reftitletype==4?50:100;
				console.log('this.reftitletype'+this.reftitletype);
				if(this.talkName.length>maxnum){
					this.talkName=this.talkName.slice(0,maxnum);
					this.$toast.center(`题目长度不能大于${maxnum}`)
				}
			}
		}
	},

	methods: {
		exitBtn() {
			const $me = this;
			var param = {
				code: this.directBroadcastCode
			};
			this.$loading('正在退出...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/stopDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				/* 关闭webscoket */
				$me.$loading.close();
				if (this.ws) {
					this.ws.close(); //离开路由之后断开websocket连接
				}
				/* 跳转到选择直播间页面 */
				this.$router.go(-1); //返回上一层
			});
			setTimeout(function(){
				$me.$loading.close();
			},5000)
		},
		getAnswer() {
			const $me = this;
			if ('WebSocket' in window) {
				if (!$me.ws) {
					// 打开一个 web socket
					$me.ws = new WebSocket(urlwsPath + 'teacher-client/websocket');

					$me.ws.onopen = function() {};

					$me.ws.onmessage = function(evt) {
						var received_msg = evt.data;
						if (received_msg != '连接成功') {
							var msg = JSON.parse(received_msg);
							if (msg.reqType == 0) {
								var obj = msg.data;

								if ($me.uuid != msg.uuid) {
									//console.log(msg.uuid)
									return;
								}
								var time = $('#danmu').data('nowTime') + 1;
								/*当渲染弹幕过多的时候,延迟处理弹幕*/
								if ($('#danmu .danmaku').length > 500) {
									time += 200; //4000毫秒。
								}
								var answer = '';
								/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
								if (msg.businessType == 1 || msg.businessType == 2 || msg.businessType == 3) {
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
										//$me.getNamelist(msg.urlPaths[i].url);
									} else if (msg.urlPaths[i].method == 'getprogress') {
										$me.getprogress(urlPath);
									}
								}
							} else if (msg.reqType == 2 || msg.reqType == 3) {
								/*弹出提示语*/
								$me.$toast.center(msg.data);
							} else if (msg.reqType == 5) {
								/*正确率*/
								$me.CorrectchartDate.title.push(msg.data.className);
								$me.CorrectchartDate.data.push(((msg.data.trueNum / msg.data.totalNum) * 100).toFixed(2));
								$me.getCorrectChartData($me.CorrectchartDate);
							} else if (msg.reqType == 6) {
								$me.chartDate.title.push(msg.data.className);
								$me.chartDate.agreeNumber.push(msg.data.agreeNumber);
								$me.chartDate.disagreeNumber.push(msg.data.disagreeNumber);
								var option = [
									{
										name: '懂',
										type: 'bar',
										stack: '主观题',
										barWidth: 60,
										data: $me.chartDate.agreeNumber,
										label: {
											normal: {
												show: true,
												position: 'inside',
												color: '#fff',
												formatter: function(param) {
													return param.value > 0 ? param.value + '人' : '';
												},
												textStyle: {
													fontSize: 24
												}
											}
										}
									},
									{
										name: '不懂',
										type: 'bar',
										stack: '主观题',
										barWidth: 60,
										data: $me.chartDate.disagreeNumber,
										label: {
											normal: {
												show: true,
												position: 'inside',
												color: '#fff',
												formatter: function(param) {
													return param.value > 0 ? param.value + '人' : '';
												},
												textStyle: {
													fontSize: 24
												}
											}
										}
									}
								];
								$me.getChartData(option, $me.chartDate.title);
							} else if (msg.reqType == 7) {
								/* 语音测评 */
								var obj = msg.data;
								if ($me.uuid != msg.uuid) {
									return;
								}
								var time = $('#danmu').data('nowTime') + 1;
								/*当渲染弹幕过多的时候,延迟处理弹幕*/
								if ($('#danmu .danmaku').length > 500) {
									time += 200; //4000毫秒。
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
										$('.txtlist').animate({ scrollTop: $('.txtlist')[0].scrollHeight }, 400);
									});
								}
							} else if (msg.reqType == 9) {
								var obj = msg.data;
								var stuName = obj.stuName;
								$me.stuName = obj.stuName;
								$me.isparticlesbox = false;
								$me.ismicrophone = true;
							}else if (msg.reqType == 12) {
								/* 网络连接断开 */
								$me.$toast('网络连接断开');
							} else if (msg.reqType == 13) {
								/* 网络连接连接 */
								$me.$toast('网络连接成功');
							}else if (msg.reqType == 14) {
								/* 网络连接断开 */
								$me.$toast(msg.data);
							} else if (msg.reqType == 15) {
								/* 网络连接连接 */
								$me.$toast(msg.data);
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
				$me.uuid = $me.randomWord(false, 32);
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
					if (!integer.test(score)||score >= 100000000) {
						$me.score = '';
						$me.$toast.center('请输入不超过100000000整数');
						return false;
					}

					param = {
						trueAnswer: answer,
						score: score,
						uuid: $me.uuid
					};
				} else {
					param = {
						uuid: $me.uuid
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
					if ($me.reftitletype == 3 || $me.reftitletype == 4) {
						if (!allchinese.test($me.talkName)) {
							$me.$toast.center('请输入中文!');
							return;
						}
					} else {
						if (!allenglish.test($me.talkName)) {
							$me.$toast.center('请输入英文!');
							return;
						}
					}
					$me.uuid = $me.randomWord(false, 32);
					param = {
						type: $me.reftitletype,
						refText: $me.talkName,
						uuid: $me.uuid
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
			//const uuid = $me.randomWord(false, 32);
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
					$me.titlename = '主观题';
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
					if ($me.iPhoneType == 0) {
						url = 'microphone/start';
						$me.titlename = '抢麦';
					} else {
						url = 'microphone/start2';
						$me.titlename = '群发麦克风';
					}

					break;
				}
			}
			if (judgetype) {
				param.questionType = judgetype;
			}
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/' + url,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			})
				.then(da => {
					$me.clear();
					/*开始答题*/
					if ($me.subjecttitle != 6 && $me.subjecttitle != 7 && $me.subjecttitle != 8) {
						$me.isprogress = true; //显示进度条
					}
					if ($me.subjecttitle != 5 && $me.subjecttitle != 8 && $me.subjecttitle != 6) {
						/*不是抢红包,语音识别，麦克风 开始弹幕*/
						$('#danmu').danmu('danmuStart');
						$('#danmu').data('danmuList', {});
					}
					if ($me.subjecttitle == 5) {
						if (document.getElementById('music')) {
							document.getElementById('music').play();
						}
					}

					$me.isSubject = false;
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
				})
				.catch(function(err) {
					// $me.$loading.close();
				});
			//$me.$store.commit("SET_isShowbg", true);
		},
		stopRace() {
			/* 点击结束答题 */

			const $me = this;
			$me.clear();
			/* 先不隐藏停止按钮，以免停止事件挥着查询排名接口报错，无法显示下发题目按钮 */
			$me.isStop = true;
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			/* 清空红包 */
			$me.delredenvelope();
			document.getElementById('music').pause();
			if ($me.subjecttitle == 4 || $me.subjecttitle == 6 || $me.subjecttitle == 7 || $me.subjecttitle == 8) {
				//查询主观题统计----从webscoket返回
				$me.Answerstop();
			} else if ($me.subjecttitle == 5) {
				$me.redWarslist(urlPath);
			} else {
				$me.getspeedlist(urlPath);
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
				url: urlPath + 'teacher-client/' + url
			})
				.then(da => {
					/*结束答题*/
					$me.isResult = true; //显示作答结果
					$me.isSendtitle = true; //显示下发题目按钮
					$me.isStop = false; //隐藏停止按钮
					$me.uuid = ''; //清空uuid
				})
				.catch(function(err) {
					$me.$loading.close();
				});
		},
		/* 查询正确率 */
		getAnswerAccuracy() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/getAnswerAccuracy'
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
		/*获取答题正确率 柱状图chart*/
		getCorrectChartData(myoption) {
			const $me = this;
			var fontSize = $me.getDpr();
			$me.isCorrectchart = true;
			var title = myoption.title;
			var mydata = myoption.data;
			console.log(mydata);
			let option = {
				color: ['#ff999a', '#61a0a8', '#ffcc67', '#af89d6'],
				grid: {
					x: 70,
					y: 25,
					x2: 25,
					y2: 35
				},
				xAxis: {
					type: 'category',
					data: title,
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
					axisLabel: {
						fontSize: fontSize > 24 ? 20 : fontSize
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
					max: 100,
					axisLabel: {
						formatter: '{value} %',
						fontSize: fontSize > 24 ? 20 : fontSize
					}
				},
				series: [
					{
						data: mydata,
						type: 'bar',
						barWidth: 60,
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#fff',
								formatter: function(param) {
									return param.value + '%';
								},
								textStyle: { fontSize: 16}
							}
						}
					}
				]
			};

			$me.myCorrectChart.setOption(option);
			setTimeout(function() {
				$me.myCorrectChart.resize();
			}, 50);
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

				color: ['#61a0a8', '#ff999a', '#ffcc67', '#af89d6'],
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
									return params.name + params.value + '人\n(' + params.percent + '%)';
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
			$me.isprogress = false; //隐藏进度条
			$me.rate = 0;
			$me.settrueanswer='';
			$me.chartDate = {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			};
			$me.CorrectchartDate = {
				title: [],
				data: []
			};
		},
		/* 切换语言测评类型 */
		changeTitleType(obj) {
			const $me = this;
			const type = ($me.reftitletype = obj.value);
			$me.talkName = '';
			if (type == 1) {
				$me.reftitletypelist = $me.alltxtlist['enWord'];
			} else if (type == 2) {
				$me.reftitletypelist = $me.alltxtlist['enSentence'];
			} else {
				$me.reftitletypelist = $me.alltxtlist['cnSentence'];
			}
			$me.talkName = '';
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

			$me.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/nextQuestion'
			}).then(da => {
				// if (da.data.ret == 'success') {}
			});
		},
		/* 切换题型 */
		chooSesubjectType(type) {
			const $me = this;
			$me.subjectType = type;
			if ($me.subjectType == 0) {
				$me.subjecttitle = '1';
			} else {
				$me.subjecttitle = '6';
				$me.talkquestionType = '7';
			}
		},
		/* 切换普通题型 */
		selSubjecttitle(obj) {
			//console.log(obj)
			this.subjecttitle = obj.value;
			this.settrueanswer = '';
		},
		/* 切换语音题型 */
		chooseSubjecttitle() {
			const $me = this;
			if ($me.subjecttitle == 6) {
				$me.talkquestionType = '7';
			} else if ($me.subjecttitle == 7) {
				$me.reftitletype = '1';
				$me.onetitletype = $me.titletypeList[0];
				$me.talkName = '';
				$me.reftitletypelist = $me.alltxtlist['enWord'];
			} else if ($me.subjecttitle == 8) {
				$me.iPhoneType = 0;
			}
		},
		/* 主观题统计 */
		getChartData(myoption, title) {
			this.isChart = true;
			const $me = this;
			var fontSize = $me.getDpr();
			var option = {
				grid: {
					x: 70,
					y: 55,
					x2: 25,
					y2: 35
				},
				legend: {
					x: 'center',
					y: 'top',
					textStyle: {
						color: '#fff',
						fontSize: fontSize * 1.4
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
					},
					axisLabel: {
						fontSize: fontSize > 24 ? 20 : fontSize
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
						formatter: '{value} 人',
						fontSize: fontSize > 24 ? 20 : fontSize
					}
				},
				color: ['#61a0a8', '#ff999a', '#ffcc67', '#af89d6']
			};
			option.series = myoption;
			this.myChart.setOption(option);
			setTimeout(function() {
				$me.myChart.resize();
			}, 50);
		},
		getOnlinelist(param) {
			const $me = this;
			this.$http({
				method: 'post',
				url: $me.interactiopath + '/teacher-platform/inte/get_online_class',
				data: JSON.stringify(param),
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(da => {
				var list = da.data.data;
				if (list) {
					$me.onlineclasslist = list;
				}
			});
		},
		randomWord(randomFlag, min, max) {
			/* 生成随机码 */
			var str = '',
				range = min,
				pos,
				arr = [
					'0',
					'1',
					'2',
					'3',
					'4',
					'5',
					'6',
					'7',
					'8',
					'9',
					'a',
					'b',
					'c',
					'd',
					'e',
					'f',
					'g',
					'h',
					'i',
					'j',
					'k',
					'l',
					'm',
					'n',
					'o',
					'p',
					'q',
					'r',
					's',
					't',
					'u',
					'v',
					'w',
					'x',
					'y',
					'z',
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z'
				];

			// 随机产生
			if (randomFlag) {
				range = Math.round(Math.random() * (max - min)) + min;
			}
			for (var i = 0; i < range; i++) {
				pos = Math.round(Math.random() * (arr.length - 1));
				str += arr[pos];
			}
			return str;
		},
		uploadfile() {
			const $me = this;
			var file = $('#upload')[0];
			if (file.files[0]) {
				var formData = new FormData();
				formData.append('file', file.files[0]);
				formData.append('teacAssistantCode', $me.sendInfo.teacAssistantCode);
				formData.append('teacAssistantName', $me.sendInfo.teacAssistantName);
				this.$http({
					method: 'post',
					url: $me.foundationpath + '/teacher-platform/foun/questions/uploadQuestion',
					data: formData,
					processData: false, // jQuery不要去处理发送的数据
					contentType: false
				}).then(da => {
					if (da.data.code == 0) {
						//showMessage('上传成功')
						$me.$toast.center('上传成功');
						$me.getjson();
					} else {
						$me.$toast.center('上传失败');
					}
				});

				file.value = '';
			}
		},
		getjson() {
			const $me = this;
			this.$http({
				method: 'post',
				url: $me.foundationpath + '/teacher-platform/foun/questions/getQuestions',
				data: JSON.stringify({
					teacAssistantCode: $me.sendInfo.teacAssistantCode,
					teacAssistantName: $me.sendInfo.teacAssistantName
				}),
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(da => {
				$me.alltxtlist = da.data.data;
				const type = $me.reftitletype;
				if (type == 1) {
					$me.reftitletypelist = $me.alltxtlist['enWord'];
				} else if (type == 2) {
					$me.reftitletypelist = $me.alltxtlist['enSentence'];
				} else {
					$me.reftitletypelist = $me.alltxtlist['cnSentence'];
				}
			});
			/* $.ajax({
				url: webpath + ':5555/teacher-platform/foun/questions/getQuestions',
				type: 'post',
				data: JSON.stringify({
					teacAssistantCode: sendInfo.teacAssistantCode,
					teacAssistantName: sendInfo.teacAssistantName
				}),
				contentType: 'application/json',
				dataType: 'json',
				success: function(da) {
					jsontxt = da.data;
					var val = $('#titletype').val();
					var list = [];
					if (val == 1) {
						list = jsontxt['enWord'];
					} else if (val == 2) {
						list = jsontxt['enSentence'];
					} else if (val == 3) {
						list = jsontxt['cnSentence'];
					}
					var str = '';
					for (var i = 0; i < list.length; i++) {
						str += '<li><a href="javascript:;">' + list[i] + '</a></li>';
					}
					$('.dropdown ul').html(str);
					$('#talkName').val('');
				}
			}); */
		}
	}
};
</script>

<style scoped="scoped">
.commonroom {
	width: 500px;
	margin-bottom: 20px;
}
.mb20 {
	margin-bottom: 20px;
}
.modbox.subject {
	position: absolute;
	top: 0;
	left: 50%;
	width: 600px;
	margin-left: -300px;
	z-index: 999;
}
.modbox.subject .startBtn {
	width: 500px;
}
.warn {
	color: #f00;
	font-size: 26px;
	text-align: center;
	margin-top: 10px;
	/* margin-bottom: -10px; */
}
.tab .tab-item {
	background: rgba(255, 255, 255, 0.9);
	line-height: 30px;
	padding: 5px;
	border-radius: 15px;
	border: 2px solid #999;
	display: inline-block;
	margin: 0 10px;
	cursor: pointer;
}
.tab .tab-item.active {
	border-color: #72cb53;
}
.tab-item > div {
	color: #999;
	border-color: #999;
}
.tab-item.active > div {
	color: #72cb53;
	border-color: #72cb53;
}
.tab-item img,
.tab-item > div span {
	display: inline-block;
	vertical-align: middle;
}
</style>
