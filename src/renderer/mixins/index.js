import {
	urlPath,
	stupath
} from '@/utils/base'
export const IndexMixin = {
	data() {
		return {
			namelist: [],
			win: 100,
			list: [],
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
			speed: 8000,
			opacity: 1
		});
		$('#danmu').data('danmuList', {});
		/* $('#danmu').danmu('danmuStart');
		 var i=0;
		 setInterval(function() {
                var time = $('#danmu').data('nowTime') + 1;
				i++;
               $('#danmu').danmu('addDanmu', [
               	{
               		text:"哈哈哈哈"+i,
               		color: 'white',
               		size: 0,
               		position: 0,
               		time: time
               	}
               ]);
			   console.log(i);
            },  100);
		setInterval((n)=>{
			 $('#danmu').data('danmuList', {});
		 },5000) */
		this.getAnswer();
	},
	destroyed() {
		if (this.ws) {
			this.ws.close(); //离开路由之后断开websocket连接
			this.ws = null;
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
		getspeedlist(url) {
			const $me = this;
			this.$http({
				method: 'post',
				url: url + 'teacher-client/common/getSpeedKingList'
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
		getprogress(url) {
			const $me = this;
			this.$http({
				method: 'post',
				url: url + 'teacher-client/common/getAnswerProgress'
			}).then(da => {
				var list = da.data.data;
				if (list.totalNumber && parseInt(list.totalNumber) > 0) {
					$me.rate = parseInt((list.answerNumber / list.totalNumber) * 100);
				}
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
		redWarslist(url) {
			const $me = this;
			this.$http({
				method: 'post',
				url: url + 'teacher-client/redWars/getScores'
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
			// const win = parseInt($('.couten').css('width')) - 200;
			const win = parseInt($('.couten').css('width'));
			$(".couten").css({
				'opacity': 1
			});
			var hb = parseInt(Math.random() * (3 - 1) + 1);
			var Wh = parseInt(Math.random() * (70 - 30) + 20);
			var Left = parseInt(Math.random() * (win / 200 - 0) + 0);
			var rot = (parseInt(Math.random() * (45 - (-45)) - 45)) + "deg";
			//				console.log(rot)
			this.num++;
			var time = new Date().getTime();
			var rate = 1;
			var deybottom = 0;
			if (this.list[Left] && $('.li' + this.list[Left]).length > 0) {
				//console.log("bottom" + $('.li' + this.list[Left]).css('bottom'))
				// if (parseInt($('.li' + this.list[Left]).css('bottom')) < 140) {
				/* deybottom = parseInt($('.li' + this.list[Left]).css('bottom')) - parseInt($('.li' + this.list[Left]).css(
					'height')); */
				if (parseInt($('.li' + this.list[Left]).css('bottom')) < 140) {
					var oldflytypehight = parseInt($('.li' + this.list[Left]).css('height')) < 140 ? 140 : parseInt($('.li' + this.list[
						Left]).css('height'));
					deybottom = parseInt($('.li' + this.list[Left]).css('bottom')) - oldflytypehight;

				}


			}
			this.list[Left] = time;
			$(".couten").append("<li class='li" + time + "' ><a href='javascript:;'><p class='num'>+" + info.score +
				"</p><img src='static/img/normal.png' style='width:100px'><p>" + info.stuName + "</p></a></li>");
			$(".li" + time).css({
				"left": Left * 200,
				"bottom": deybottom
			});
			rate = (parseInt($(".couten").css("height")) - deybottom) / parseInt($(".couten").css("height"));

			$(".li" + time).animate({
				'bottom': $(window).height() + $(".li" + time).height() + 20
			}, 5000 * rate, function() {
				//删掉已经显示的红包
				$(this).remove()
			});
		},
		delredenvelope: function() {
			$(".couten").animate({
				'opacity': 0
			}, 500, function() {
				$(this).html('');
			})
		},
		getDpr() {
			var windowWidth = $(window).width();
			console.log(windowWidth)
			if (windowWidth < 920) {
				return 14
			}
			if (windowWidth >= 920 && windowWidth <= 1200) {
				return 20
			}
			if (windowWidth > 1200 && windowWidth <= 1920) {
				return 25
			}

		}
	}
};
