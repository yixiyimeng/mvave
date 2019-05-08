<template>
	<div>
		<div class="modbox room">
			<div style="width: 100%;" class="flex flex-align-center flex-v">
				<div class="swiper" style="position: relative; margin-bottom:20px" v-show="false">
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="(room, index) in dirroomlist" :key="index" :style="{ width: dirroomlist.length > 3 ? 'auto' : '220px' }">
								{{ room.name }}
							</div>
						</div>
					</div>
					<!-- Add Arrows -->
					<div class="swiper-button-next"></div>
					<div class="swiper-button-prev"></div>
				</div>
				<div class="fromcontrol flex">
					<label>直播间</label>
					<v-select :options="dirroomlist" label="name" v-model="selectdirroom" placeholder="筛选直播间" class="flex-1" style="padding-right: 20px;">
						<template slot="no-options">
							没有筛选到直播间
						</template>
					</v-select>
				</div>
				<div class="fromcontrol flex flex-1">
					<label>主题</label>
					<div class="flex-1" style="margin-right: 60px;">
						<input type="text" name="" value="" autocomplete="off" v-model.trim="topicName" style="width: 100%;" @change="cleartopic()" placeholder="输入或者选择主题" />
						<dropmenu :reftitletypelist="reftitletypelist" @selTalkName="selTalkName">
							<template slot-scope="item">
								{{ item.data.topicName }}
								<span style="font-size: 22px; " class="reftitletypeitem">{{ item.data.startDatetime | filterTime }}</span>
							</template>
						</dropmenu>
					</div>
				</div>
				<!-- <div class="fromcontrol flex">
					<label>主题</label>
					<input type="text" name="" value="" autocomplete="off" v-model.trim="topicName" />
				</div> -->
				<div class="flex" style=" margin: 0 auto;">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="startService()">确定</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import { urlPath, htmlescpe } from '@/utils/base';
import { dropmenu } from '@/components';
import vSelect from '@/components/vue-select';
import { mapState } from 'vuex';
export default {
	components: {
		vSelect,
		dropmenu
	},
	data() {
		return {
			sendInfo: {},
			dirroomlist: [],
			topicName: '',
			topicCode: '',
			questionId: '',
			selectdirroom: {},
			reftitletypelist: []
		};
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.getDirectBroadcasts();
	},
	computed: {
		...mapState(['foundationpath', 'interactiopath'])
	},
	watch: {
		selectdirroom: function(newName, oldName) {
			//console.log(newName)
			const $me = this;
			if (newName != oldName) {
				$me.reftitletypelist = [];
				$me.topicCode='';
				$me.questionId='';
				$me.topicName='';
				if (newName) {
					$me.$http({
						method: 'post',
						url: $me.interactiopath + '/teacher-platform/inte/topicRec/getTopicAndSubject',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: JSON.stringify({
							directBroadcastCode: newName.code,
							teacherCode: $me.sendInfo.teacAssistantCode
						})
					}).then(da => {
						if (da.data.code == 0) {
							$me.reftitletypelist = da.data.data;
						} else {
							this.$toast.center('查询失败');
						}
					});
				}
			}
		},
		deep: true
	},
	filters: {
		filterTime: function(value) {
			if (value) {
				value = value.slice(10, value.length);
			}
			return value;
		}
	},
	methods: {
		getDirectBroadcasts() {
			const $me = this;
			$me.$http({
				method: 'post',
				url: $me.foundationpath + '/teacher-platform/foun/directBroadcast/getDirectBroadcasts'
			}).then(da => {
				if (da.data.code == 0) {
					var list = da.data.data;
					$me.dirroomlist = list;
					var str = '';
					$me.$nextTick(function() {
						$me.roomswiper = new Swiper('.room .swiper-container', {
							slidesPerView: list.length >= 3 ? 3 : 'auto',
							spaceBetween: 10,
							centeredSlides: true,
							loop: list.length > 3 ? true : false,
							slideToClickedSlide: true,
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev'
							},
							on: {
								click: function(event) {
									//console.log(this.activeIndex);
									$me.sendInfo.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								},
								slideChangeTransitionEnd: function() {
									$me.sendInfo.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								}
							}
						});
						if (list.length > 0) {
							$me.sendInfo.directBroadcastCode = $me.dirroomlist[0].code;
							$me.directBroadcastCode = $me.dirroomlist[0].code;
							$me.selectdirroom = $me.dirroomlist[0];
						}
					});
				} else {
					this.$toast.center('查询失败');
				}
			});
		},
		returnback() {
			this.$router.go(-1);
		},
		startService() {
			const $me = this;
			var topicName = $me.topicName;
			/* 设置code */
			if ($me.dirroomlist.length <= 0) {
				this.$toast.center('当前没有直播间');
				return false;
			}
			if ($me.selectdirroom && $me.selectdirroom.code) {
				$me.sendInfo.directBroadcastCode = $me.selectdirroom.code;
				$me.directBroadcastCode = $me.selectdirroom.code;
			} else {
				this.$toast.center('请选择直播间');
				return false;
			}
			if ($me.sendInfo.directBroadcastCode && topicName) {
				if (htmlescpe.test(topicName)) {
					this.$toast.center('主题包含特殊字符' + topicName.match(htmlescpe) + '，请重新输入！');
					return false;
				}
				var index = $me.dirroomlist.findIndex(item => item.code == $me.sendInfo.directBroadcastCode);
				$me.sendInfo.directBroadcastName = $me.dirroomlist[index].name;
				/* 链接直播间 */
				$me.startDirectBroadcasts({
					code: $me.sendInfo.directBroadcastCode,
					name: $me.sendInfo.directBroadcastName,
					teacherCode: $me.sendInfo.teacAssistantCode,
					teacherName: $me.sendInfo.teacAssistantName,
					topicName: $me.topicName,
					topicCode: $me.topicCode,
					questionId: $me.questionId
				});
			} else {
				this.$toast.center('请选择一个直播间并输入主题');
			}
		},
		/*连接直播间*/
		startDirectBroadcasts(param) {
			const $me = this;
			this.$loading('正在连接...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/startDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			})
				.then(da => {
					$me.$loading.close();
					if (da.data.ret == 'success') {
						$me.$router.push({
							path: 'teacherroom',
							query: { sendInfo: JSON.stringify($me.sendInfo) }
						});
					} else {
						$me.$toast.center('直播间占用');
					}
					/* $me.$http
						.all([$me.createConsumerQueue(), $me.createProducerQueue()])
						.then(
							$me.$http.spread(function(createConsumerQueue, createProducerQueue) {
								$me.$loading.close();
								if(createConsumerQueue.data.ret != 'success'){
									$me.$toast.center(createConsumerQueue.data.message);
									return false;
								}
								if(createProducerQueue.data.ret != 'success'){
									$me.$toast.center(createProducerQueue.data.message);
									return false;
								}
								if (createConsumerQueue.data.ret == 'success' &&createProducerQueue.data.ret == 'success') {
									$me.$router.push({
										path: 'teacherroom',
										query: { sendInfo: JSON.stringify($me.sendInfo) }
									});
								} 
							})
						)
						.catch(function(err) {
							$me.$loading.close();
						}); */
				})
				.catch(function(err) {
					$me.$loading.close();
				});
		},
		/*创建消费者队列*/
		createConsumerQueue() {
			var param = {
				exchangeType: 'topic',
				queueName: 'broadcastroom01.receive',
				exchangeName: 'teacher.zhuoyue',
				routeKey: 'broadcastroom01.receive'
			};
			return this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/rabbit/createConsumerQueue',
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
				queueName: 'broadcastroom01.send',
				exchangeName: 'teacher.zhuoyue',
				routeKey: 'broadcastroom01.send'
			};
			return this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/rabbit/createProducerQueue',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			});
		},
		cleartopic() {
			$me.topicCode = '';
			$me.questionId = '';
		},
		selTalkName(topic) {
			const $me = this;
			$me.topicName = topic.topicName;
			$me.topicCode = topic.topicCode;
			$me.questionId = topic.questionId;
		}
	}
};
</script>

<style>
.room > div > div.flex {
	width: 500px;
	margin: 0 auto;
}
.swiper .swiper-button-next,
.swiper .swiper-button-prev {
	background: none;
	border: 4px solid transparent;
	height: 25px;
	width: 25px;
}
.swiper .swiper-button-next {
	border-top-color: #5bac67;
	border-right-color: #5bac67;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
}
.swiper .swiper-button-prev {
	border-top-color: #5bac67;
	border-left-color: #5bac67;
	-webkit-transform: rotate(-45deg);
}
</style>
