<template>
	<div>
	<div class="modbox">
		<div>
			<form @keyup.enter="sendClass">
				<!-- <div class="fromcontrol flex">
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
				</div> -->
				<div class="fromcontrol flex">
					<label>教室</label>
					<search
						:searchList="classroomsearchList"
						:selectValue.sync="selectclassroom"
						placeholdertxt="请选择教室"
						class="flex-1"
					></search>
				</div>
				<!-- <div class="fromcontrol flex">
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
				</div> -->
				<div class="fromcontrol flex">
					<label>班级</label>
					<search
						:searchList="classsearchList"
						:selectValue.sync="selectclass"
						placeholdertxt="请选择班级"
						class="flex-1"
					></search>
				</div>
			</form>
			<div class="flex">
				<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
				<a href="javascript:;" class="loginBtn mt20 flex-1" @click="sendClass()">确定</a>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { webpath } from '@/utils/base';
import { search } from '@/components';
export default {
	components: {},
	data() {
		return {
			classroomlist: [],
			classroomsearchList: [],
			selectclassroom: {},
			classlist: [],
			classsearchList:[],
			selectclass:{},
			schoolCode: '',
			sendInfo: {}
		};
	},
	components: {
		search
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.schoolCode = this.sendInfo.schoolCode;
		console.log(this.$route.query.sendInfo);
		this.getClassroomlist();
		this.getClasslist();
	},
	methods: {
		/* 查询教室 */
		getClassroomlist() {
			var param = 'schoolCode=' + this.schoolCode;
			const $me = this;
			this.$http({
				url: webpath + ':5555/teacher-platform/foun/classroom/getClassrooms',
				method: 'post',
				data: param
			}).then(da => {
				if (da.data.code == 0) {
					var list = da.data.data;
					$me.classroomlist = list;
					if (list.length > 0) {
						$me.classroomsearchList = list.map(item => {
							return {
								name: item.name,
								code: item.code
							};
						});
					}
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
				url: webpath + ':5555/teacher-platform/foun/class/getClasses',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				if (da.data.code == 0) {
					var list = da.data.data;
					$me.classlist = list;
					if(list.length>0){
						$me.classsearchList=list.map(item=>{
							return{
								name:item.name,
								code:item.code
							}
						});
					}
					//console.log(da);
				} else {
					// this.$toast.center('查询失败');
				}
			});
		},
		/* 提交班级信息 */
		sendClass() {
			const $me = this;
			if ($me.selectclassroom && $me.selectclassroom.code) {
				$me.sendInfo.classroomCode = $me.selectclassroom.code;
			} else {
				this.$toast.center('请选择教室');
				return false;
			}
			if ($me.selectclass && $me.selectclass.code) {
				$me.sendInfo.classCode = $me.selectclass.code;
			} else {
				this.$toast.center('请选择教室');
				return false;
			}
			
			if ($me.sendInfo.classCode && $me.sendInfo.classroomCode) {
				var index = $me.classroomlist.findIndex(
					item => item.code == $me.sendInfo.classroomCode
				);
				$me.sendInfo.classroomName = $me.classroomlist[index].name;
				var index2 = $me.classlist.findIndex(item => item.code == $me.sendInfo.classCode);
				$me.sendInfo.className = $me.classlist[index2].name;
				$me.$router.push({
					path: 'onlinedirebro',
					query: { sendInfo: JSON.stringify($me.sendInfo) }
				});
			} else {
				this.$toast.center('请选择班级和教室');
			}
		},
		returnback() {
			this.$router.go(-1);
		}
	}
};
</script>

<style></style>
