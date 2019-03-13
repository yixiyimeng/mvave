<template>
	<div class="plan">
		<img src="../../assets/notice.png" />
		<div>
			<p>{{ titlename }}</p>
			<p v-if="trueAnswer">
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

</style>
