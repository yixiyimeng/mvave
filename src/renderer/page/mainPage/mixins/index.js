import {
	urlPath
} from '@/page/mainPage/utils/base'
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
				url: urlPath + 'teacher-client/' + url
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
				url: urlPath + 'teacher-client/common/getQuestionInfo'
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
				try {
					var reg = /matrix.((.+([, ]+)?){6})./g;

					var str = $('.li' + this.list[Left]).css("transform");
					console.log(str);
					var arr = reg.exec(str);
					var newarr = arr[1].split(/[, ]+/g);
					console.log(newarr[5]);
					var leftbottom = parseFloat(newarr[5]);
					if (leftbottom > 0) {
						var oldflytypehight = parseInt($('.li' + this.list[Left]).css('height')) < 160 ? 160 : parseInt($('.li' + this.list[
							Left]).css('height'));
						// deybottom = leftbottom - oldflytypehight;
						deybottom = leftbottom;
					}
				} catch (e) {
					//TODO handle the exception
				}



			}
			console.log('deybottom' + deybottom);
			this.list[Left] = time;
			$(".couten").append("<li class='li" + time + "' ><a href='javascript:;'><p class='num'>+" + info.score +
				"</p><div class='imgbox'></div><p>" + info.stuName + "</p></a></li>");
			var h = $(".li" + time).height() + deybottom + 40;
			$(".li" + time).css({
				"left": Left * 200,
				"-webkit-transform": 'translateY(' + h + 'px)',
				"transform": 'translateY(' + h + 'px)',
			});
			rate = ($(".couten").height() + 20 + h) / ($(".couten").height() + $(".li" +
				time).height() + 20);
			console.log("rate" + rate);
			var hhh = ($(".couten").height() + 20) * -1;
			$(".li" + time).css({
				"-webkit-transform": 'translateY(' + hhh + 'px)',
				"transform": 'translateY(' + hhh + 'px)',
				'-webkit-transition-duration': rate * 5 + 's',
				'transition-duration': rate * 5 + 's',
				'transition-timing-function': 'linear',
				'-webkit-transition-timing-function': 'linear'
			});
			$(".li" + time).on('transitionend webkitTransitionEnd', function() {
				$(this).remove();
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
