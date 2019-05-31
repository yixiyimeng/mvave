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
					<div class="swiper-button-next"></div>
					<div class="swiper-button-prev"></div>
				</div>
				<div class="fromcontrol flex" style="width: 500px;">
					<label>直播间</label>
					<v-select :options="dirroomlist" label="name" v-model="selectdirroom" class="flex-1" style="margin-right: 20px;" placeholder="筛选直播间">
						<template slot="no-options">
							没有筛选到直播间
						</template>
					</v-select>
				</div>
				<div class="flex" style="width: 300px; margin: 0 auto;">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="startService()">确定</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import { stupath ,urlPath} from '@/utils/base';
import { mapState } from 'vuex';
import vSelect from '@/components/vue-select';
export default {
	components: {
		vSelect
	},
	data() {
		return {
			sendInfo: {},
			dirroomlist: [],
			selectdirroom: {}
		};
	},
	computed: {
		...mapState(['interactiopath', 'foundationpath'])
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.getDirectBroadcasts(); //this.$loading.close();
	},
	methods: {
		getDirectBroadcasts() {
			const $me = this;
			$me.$http({
				method: 'post',
				url: urlPath + 'teacher-client/platform/getOnlineDireBro'
			}).then(da => {
				if (da.data.ret == 'success') {
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
			if ($me.dirroomlist.length <= 0) {
				this.$toast.center('当前没有直播间');
				return false;
			}
			if ($me.selectdirroom && $me.selectdirroom.code) {
				$me.sendInfo.code = $me.selectdirroom.code;
				$me.directBroadcastCode = $me.selectdirroom.code;
				$me.sendInfo.name = $me.selectdirroom.name;
				$me.sendInfo.topicCode = $me.selectdirroom.topicCode;
				$me.sendInfo.topicName = $me.selectdirroom.topicName;
				$me.sendInfo.teacherCode = $me.selectdirroom.teacherCode;
				$me.sendInfo.teacherName = $me.selectdirroom.teacherName;
				$me.sendInfo.topicStartTime= $me.selectdirroom.startDatetime;
				/* 链接直播间 */
				$me.startDirectBroadcasts();
			} else {
				this.$toast.center('请选择一个直播间');
			}
			// 			if ($me.sendInfo.code) {
			// 				var index = $me.dirroomlist.findIndex(item => item.code == $me.sendInfo.code);
			// 				$me.sendInfo.name = $me.dirroomlist[index].name;
			// 				$me.sendInfo.topicCode = $me.dirroomlist[index].topicCode;
			// 				$me.sendInfo.topicName = $me.dirroomlist[index].topicName;
			// 				$me.sendInfo.teacherCode = $me.dirroomlist[index].teacherCode;
			// 				$me.sendInfo.teacherName = $me.dirroomlist[index].teacherName;
			//
			// 			} else {
			// 				this.$toast.center('请选择一个直播间');
			// 			}
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
					if (da.data.ret == 'success') {
						$me.$loading.close();
						$me.$router.push({
							path: 'sturoom',
							query: { sendInfo: JSON.stringify($me.sendInfo) }
						});
					} else {
						$me.$loading.close();
						$me.$toast.center(da.data.message?da.data.message:'启动直播间失败');
					}
				})
				.catch(function(err) {
					console.log(err+'');
					  var str = err + '';
					if (str.indexOf('timeout') !== -1) {
						$me.$toast.center('连接超时，请稍后重试');
					} else {
						$me.$toast.center('启动直播间失败');
					}
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

<style>
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
