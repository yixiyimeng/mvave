<template>
	<div>
		<div class="modbox room">
			<div style="width: 100%;" class="flex flex-align-center flex-v">
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
import { urlPath} from '@/page/mainPage/utils/base';
import { mapState } from 'vuex';
import vSelect from '@/page/mainPage/components/vue-select';
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
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.getDirectBroadcasts(); 
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
		
		},
		/*连接直播间*/
		startDirectBroadcasts() {
			const $me = this;
			this.$loading('正在连接...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/saveConnRec',
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
		}
		
	}
};
</script>
