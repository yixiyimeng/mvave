<template>
	<div id="loadingContainer" :class="{ active: isprogress }">
		<div class="loadingbar">
			<div class="marker_container">
				<div class="marker"></div>
				<div class="marker"></div>
				<div class="marker"></div>
				<div class="marker"></div>
			</div>
			<div class="filler_wrapper">
				<div class="filler" :style="{ width: rate + '%' }">
					<span class="value">{{ rate }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from '@/page/mainPage/assets/js/jquery-vendor';
export default {
	data() {
		return {
			blower: null
		};
	},
	props: {
		isprogress: Boolean,
		rate: Number
	},
	watch: {
		rate(newval, oldval) {
			if (newval != oldval) {
				if (newval > 0 && this.isprogress) {
					var degrees = (newval - oldval) * -30;
					$('.marker_container').css({
						'-webkit-transform': 'rotate(' + degrees + 'deg)',
						'-moz-transform': 'rotate(' + degrees + 'deg)',
						'-ms-transform': 'rotate(' + degrees + 'deg)',
						'-o-transform': 'rotate(' + degrees + 'deg)',
						transform: 'rotate(' + degrees + 'deg)',
						zoom: 1
					});
				}
			}
		}
	},
	mounted() {
		
	}
};
</script>

<style>
#loadingContainer {
	box-sizing: border-box;
	width: 500px;
	height: 100px;
	display: block;
	margin: 0 auto;
	position: absolute;
	top: -140px;
	left: 50%;
	margin-left: -250px;
	transition: all 0.2s;
	/*border: solid 2px #D5D6E2;*/
}

#loadingContainer.active {
	top: 20px;
}

#loadingContainer * {
	box-sizing: border-box;
}

#loadingContainer .loadingbar {
	position: relative;
	width: calc(100% - 20px);
	height: 50px;
	background-color: #fac833;
	border-radius: 999999px;
	/* margin: 50px 10px; */
	padding: 4px 37px 4px 4px;
}

#loadingContainer .loadingbar .filler_wrapper {
	border-radius: 999999px;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

#loadingContainer .loadingbar .filler_wrapper .filler {
	transition: ease-out width 0.9s;
	-webkit-transition: ease-out width 0.9s;
	background-color: darkorange;
	text-align: center;
	width: 0;
	height: 100%;
}

#loadingContainer .loadingbar .filler_wrapper .filler .value {
	color: white;
	text-shadow: 1px 1px 3px darkorange;
	font-size: 17px;
	position: absolute;
	top: 25%;
	left: 45%;
}

#loadingContainer .loadingbar .leaf {
	transition: linear all 2.5s;
	-webkit-transition: linear all 2.5s;
	width: 20px;
	height: 25px;
	background: url('https://y01.imgup.net/leafe61e.png') no-repeat;
	background-size: contain;
	position: absolute;
	right: 5%;
	top: 5px;
	z-index: 5;
}

#loadingContainer .loadingbar .marker_container {
	height: 60px;
	width: 60px;
	border-radius: 50%;
	border: solid 2px white;
	position: absolute;
	background-color: darkorange;
	right: 0;
	top: -5px;
	transition: all 2s ease-out;
	z-index: 10;
}

#loadingContainer .loadingbar .marker_container:before {
	content: ' ';
	display: inline-block;
	position: relative;
	width: 60px;
	height: 10px;
}

#loadingContainer .loadingbar .marker_container:after {
	content: ' ';
	width: 4px;
	height: 4px;
	border-radius: 100px;
	background-color: white;
	display: inline-block;
	position: absolute;
	left: calc(50% - 2px);
	top: calc(50% - 2px);
}

#loadingContainer .loadingbar .marker_container .marker {
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 100% 100% 100% 0;
	background-color: white;
}

#loadingContainer .loadingbar .marker_container .marker:nth-child(1) {
	left: 18px;
	top: 1px;
	-moz-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
	-webkit-transform: rotate(-45deg);
	transform: rotate(-45deg);
}

#loadingContainer .loadingbar .marker_container .marker:nth-child(2) {
	left: 1px;
	top: 18px;
	-moz-transform: rotate(-135deg);
	-ms-transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	transform: rotate(-135deg);
}

#loadingContainer .loadingbar .marker_container .marker:nth-child(3) {
	left: 18px;
	bottom: 1px;
	-moz-transform: rotate(-225deg);
	-ms-transform: rotate(-225deg);
	-webkit-transform: rotate(-225deg);
	transform: rotate(-225deg);
}

#loadingContainer .loadingbar .marker_container .marker:nth-child(4) {
	right: 1px;
	top: 18px;
	-moz-transform: rotate(-315deg);
	-ms-transform: rotate(-315deg);
	-webkit-transform: rotate(-315deg);
	transform: rotate(-315deg);
}

@keyframes wowrotate {
	from {
		transform: rotate(360deg);
	}

	to {
		transform: rotate(0deg);
	}
}

@keyframes wind {
	0% {
		top: 2px;
	}

	50% {
		top: 12px;
	}

	100% {
		top: 30px;
		right: 100%;
	}
}

@keyframes wind-up {
	0% {
		top: 1px;
	}

	60% {
		top: 20px;
	}

	100% {
		top: 7px;
		right: 100%;
	}
}

.rotateIt {
	animation: wowrotate 3s infinite ease-in-out;
}

/**[Demo]* */
#plus_ten {
	margin: auto;
	display: block;
}

/*body {
	  background: orange;
	}*/
</style>
