<template>
	<div class="fixed " :class="{'active':trueAnswer}">
		<div class="board">
			<span>正确答案:</span>
			<span class="warn">{{ trueAnswer }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'board',
	data() {
		return {};
	},

	props: {
		trueAnswer: String
	}
};
</script>

<style scoped="scoped">
@-webkit-keyframes floaty {
	0%,
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	50% {
		-webkit-transform: translateY(1rem);
		transform: translateY(1rem);
	}
}

@keyframes floaty {
	0%,
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	50% {
		-webkit-transform: translateY(1rem);
		transform: translateY(1rem);
	}
}
.fixed {
	position: fixed;
	bottom: 40%;
	left: -200px;
	transition: all 5s;
}
.fixed.active {
	bottom: 70%;
	left: 40px;
	padding-left: 30px;
}
.board {
	width: 200px;
	height: 245px;
	background: url(../../assets/board2.png) no-repeat top center;
	background-size: contain;
	text-align: left;

	padding-top: 90px;
	box-sizing: border-box;
	font-size: 30px;
	/* display: none; */
}
.board {
	-webkit-animation-name: floaty;
	animation-name: floaty;
	-webkit-animation-duration: 5s;
	animation-duration: 5s;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: infinite;
	animation-iteration-count: infinite;
}

.board span {
	display: block;
	vertical-align: middle;
	transform: rotate(15deg);
	text-align: center;
	margin-left: -10px;
}

.board span.warn {
	font-size: 40px;
	color: #f00;
	font-weight: bold;
	margin-left: -30px;
}
</style>
