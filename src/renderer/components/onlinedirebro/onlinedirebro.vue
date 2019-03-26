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
			<div class="flex" style="width: 300px; margin: 0 auto;">
				<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
				<a href="javascript:;" class="loginBtn mt20 flex-1" @click="startService()">确定</a>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import { stupath, webpath } from '@/utils/base';
export default {
	data() {
		return {
			sendInfo: {},
			dirroomlist: []
		};
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		//console.log(this.sendInfo)
		this.getDirectBroadcasts(); //this.$loading.close();
	},
	methods: {
		getDirectBroadcasts() {
			const $me = this;
			$me.$http({
				method: 'post',
				url: webpath + ':5556/teacher-platform/inte/get_online_dire_bro'
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
									$me.sendInfo.code = $me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								},
								slideChangeTransitionEnd: function() {
									$me.sendInfo.code = $me.dirroomlist[this.realIndex].code;
									$me.directBroadcastCode = $me.dirroomlist[this.realIndex].code;
								}
							}
						});
						if (list.length > 0) {
							$me.sendInfo.code = $me.dirroomlist[0].code;
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
			this.$loading('正在连接...');
			this.$http({
				method: 'post',
				url: stupath + 'teacher-client/common/saveConnRec',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(this.sendInfo)
			})
				.then(da => {
					$me.$router.push({
						path: 'sturoom',
						query: { sendInfo: JSON.stringify($me.sendInfo) }
					});
					$me.$http
						.all([
							$me.createConsumerQueue(),
							 $me.startServer(),
							$me.createProducerQueue()
						])
						.then(
							$me.$http.spread(function(
								createConsumerQueue,
								startServer,
								createProducerQueue
							) {
								//console.log(createConsumerQueue.data.ret);
								//console.log(startServer.data);
								$me.$loading.close();
								if (
									createConsumerQueue.data.ret == 'success' &&
									startServer.data.ret == 'success' &&
									createProducerQueue.data.ret == 'success'
								) {
									$me.$router.push({
										path: 'sturoom',
										query: { sendInfo: JSON.stringify($me.sendInfo) }
									});
								} else {
									$me.$toast.center('启动直播间失败');
								}
							})
						)
						.catch(function(err) {
							$me.$toast.center('启动直播间失败');
							$me.$loading.close();
						});
				})
				.catch(function(err) {
					$me.$toast.center('启动直播间失败');
					$me.$loading.close();
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
				url: stupath + 'teacher-client/rabbit/createConsumerQueue',
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
				url: stupath + 'teacher-client/rabbit/createProducerQueue',
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
				url: stupath + 'teacher-client/common/startServer'
			});
		}
	}
};
</script>

<style></style>
