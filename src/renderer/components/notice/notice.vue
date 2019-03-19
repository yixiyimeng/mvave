<template>
	<div class="plan">
		<img src="../../assets/notice.png" />
		<div>
			<p class="bounceIn animated fast" v-if="titlename" >{{ titlename }}</p>
			<p v-if="trueAnswer"  class="bounceIn animated fast">
				正确答案
				<span class="warn">{{ trueAnswer }}</span>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'notice',
	data() {
		return {};
	},

	props: {
		titlename: String,
		trueAnswer: String
	}
};
</script>

<style lang="less" scoped>
p{font-size: 24px;
font-weight: 500}
</style>
