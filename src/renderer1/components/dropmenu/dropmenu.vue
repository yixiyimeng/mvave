<template>
	<div class="dropdown">
	<!-- 	<a href="javascript:;" class="dropdownarrow" @click="searchFlag=!searchFlag"><i class="icon icon-filter-arrow"></i></a>
		<div class="dropdownlist" v-if="searchFlag">
			<ul>
				<li
					v-for="(item, index) in reftitletypelist"
					:key="index"
					@click="choseValue(item)"
				>
					<a href="javascript:;">{{ item }}</a>
				</li>
			</ul>
		</div> -->
	</div>
</template>

<script>
	/* export default {
		name: 'dropmenu',
		data() {
			return {
				searchFlag:false
			};
		},
	
		props: {
			reftitletypelist: Array
		},
		methods:{
			choseValue(talkname){
				this.searchFlag=false;
				this.$emit('selTalkName', talkname);
				
			}
		}
	}; */
	export default {
		name: 'dropmenu',
		data() {
			return {};
		},
	
		props: {
			titlename: String,
			trueAnswer: String
		}
	};
	</script>
</script>

<style></style>
