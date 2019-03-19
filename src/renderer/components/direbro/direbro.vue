<template>
	<div class="modbox room">
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
			<div class="fromcontrol flex">
				<label>主题</label>
				<input type="text" name="" value="" autocomplete="off" v-model.trim="topicName" />
			</div>
			<div class="flex" style=" margin: 0 auto;">
				<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
				<a href="javascript:;" class="loginBtn mt20 flex-1" @click="startService()">确定</a>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import { teacherpath, htmlescpe,webpath } from '@/utils/base';
export default {
	data() {
		return {
			sendInfo: {},
			dirroomlist: [],
			topicName: ''
		};
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		//console.log(this.sendInfo)
		this.getDirectBroadcasts();
	},
	methods: {
		getDirectBroadcasts() {
			const $me = this;
			$me.$http({
				method: 'post',
				url:webpath+':5555/teacher-platform/foun/directBroadcast/getDirectBroadcasts'
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
							on: {
								click: function(event) {
									//console.log(this.activeIndex);
									$me.sendInfo.directBroadcastCode =$me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								},
								slideChangeTransitionEnd: function() {
									$me.sendInfo.directBroadcastCode =$me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								}
							}
						});
						if (list.length > 0) {
							$me.sendInfo.directBroadcastCode = $me.dirroomlist[0].code;
							$me.directBroadcastCode = $me.dirroomlist[0].code;
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

			if ($me.sendInfo.directBroadcastCode) {
				var topicName = $me.topicName;
				if (htmlescpe.test(topicName)) {
					this.$toast.center(
						'主题包含特殊字符' + topicName.match(htmlescpe) + '，请重新输入！'
					);
					return false;
				}
				var index = $me.dirroomlist.findIndex(
					item => item.code == $me.sendInfo.directBroadcastCode
				);
				$me.sendInfo.directBroadcastName = $me.dirroomlist[index].name;
				/* 链接直播间 */
				$me.startDirectBroadcasts({
					code: $me.sendInfo.directBroadcastCode,
					name: $me.sendInfo.directBroadcastName,
					teacherCode: $me.sendInfo.teacAssistantCode,
					teacherName: $me.sendInfo.teacAssistantName,
					topicName: $me.topicName
				});
			} else {
				this.$toast.center('请选择一个直播间');
			}
		},
		/*连接直播间*/
		startDirectBroadcasts(param) {
			const $me = this;
			this.$loading('正在连接...');
			this.$http({
				method: 'post',
				url: teacherpath + 'teacher-client/common/startDireBro',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			})
				.then(da => {
					$me.$http.all([$me.createConsumerQueue(), $me.createProducerQueue()]).then(
						$me.$http.spread(function(createConsumerQueue, createProducerQueue) {
							$me.$loading.close();
							if (
								createConsumerQueue.data.ret == 'success' &&
								createProducerQueue.data.ret == 'success'
							) {
								$me.$router.push({
									path: 'teacherroom',
									query: { sendInfo: JSON.stringify($me.sendInfo) }
								});
							} else {
								$me.$toast.center('启动直播间失败');
							}
						})
					).catch(function(err) {
					$me.$loading.close();
				});
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
				url: teacherpath + 'teacher-client/rabbit/createConsumerQueue',
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
				url: teacherpath + 'teacher-client/rabbit/createProducerQueue',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			});
		}
	}
};
</script>

<style>
.room > div > div.flex {
	width: 300px;
	margin: 0 auto;
}
</style>
