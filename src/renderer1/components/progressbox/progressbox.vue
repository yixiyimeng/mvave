<template>
	<div class="progressbox" :class="{ active: isprogress }">
		<div class="progress">
			<div>
				<div class="progress-bar" :style="{ height: rate+'%' }">
					<span>{{ rate }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'progressbox',
		data() {
			return {};
		},
		
		props: {
			isprogress: Boolean,
			rate: Number
		}
	};
</script>

<style>
</style>
