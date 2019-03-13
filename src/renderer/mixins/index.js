import {
	stupath
} from '@/utils/base'
export const IndexMixin = {
	data() {
		return {
			namelist:[],
			win: 100
		}
	},
	computed: {

	},
	created() {
		
	},
	mounted() {
		this.win = parseInt($('.couten').css('width')) - 60;
		$('#danmu').danmu({
			left: 0,
			top: '10%',
			height: '80%',
			width: '100%',
			speed: 5000,
			opacity: 1
		});
		$('#danmu').data('danmuList', {});
		this.getAnswer();
	},
	destroyed() {
		if (this.ws) {
			this.ws.close(); //离开路由之后断开websocket连接
		}
	},
	methods: {
		/* 获取学生名单 */
		getNamelist(url) {
			const $me = this;
			this.$http({
				method: 'post',
				url: stupath + 'teacher-client/' + url
			}).then(da => {
				$me.namelist = da.data.data;
			});
		},
		/* 获取答题排名 */
		getspeedlist() {
			const $me = this;
			this.$http({
				method: 'post',
				url: $me.path + 'teacher-client/common/getSpeedKingList'
			}).then(da => {
				var list = da.data.data;
				var str = '';
				var len = list.length > 5 ? 5 : list.length;
				$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;
				$me.isRank = true;
				$me.Answerstop();
			});
		},
		/*获取答题进度*/
		getprogress() {
			const $me = this;
			this.$http({
				method: 'post',
				url:$me.path + 'teacher-client/common/getAnswerProgress'
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
				url: stupath + 'teacher-client/common/getQuestionInfo'
			}).then(da => {
				if (da.data.ret == 'success') {
					var trueAnswer = da.data.data.trueAnswer;
					if (type == 4) {
						trueAnswer = trueAnswer == 'E' ? '√' : '×';
					}
					$me.trueAnswer = trueAnswer;
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
				url: $me.path + 'teacher-client/redWars/getScores'
			}).then(da => {
				var list = da.data.data;
				var str = '';
				var len = list.length > 5 ? 5 : list.length;
				$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;
				$me.isRank = true;
				$me.Answerstop();
			});
		},
		/* 添加红包 */
		addredenvelope(info) {
			var hb = parseInt(Math.random() * (3 - 1) + 1);
			var Wh = parseInt(Math.random() * (70 - 30) + 20);
			var Left = parseInt(Math.random() * (this.win / 50 - 0) + 0);
			var rot = parseInt(Math.random() * (45 - -45) - 45) + 'deg';
			var time = new Date().getTime();
			$('.couten').append(
				"<li class='li" +
					time +
					"' ><a href='javascript:;'><p class='num'>+" +
					info.score +
					"</p><img src='static/img/avatar.png'><p>" +
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
		}
	}
};
