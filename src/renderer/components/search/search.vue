<template>
	<div class="selectFilter" ref="selectFilter">
		<input
			type="text"
			v-model="selectname"
			readonly="readonly"
			:placeholder="placeholdertxt"
			@click="searchFlag = !searchFlag"
			@change="changeInput"
		/>
		<a href="javascript:;" class="dropdownarrow" @click="searchFlag = !searchFlag">
			<i class="icon icon-filter-arrow" :class="{ 'filter-show': searchFlag }"></i>
		</a>
		<!-- {{reftitletypelist}} -->
		<div class="dropdownlist" v-if="searchFlag">
			<ul>
				<li v-for="(item, index) in searchList" :key="index" @click="choseValue(item)">
					<a href="JavaScript:;">{{ item.name }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchFlag: false,
			selectname: ''
		};
	},
	props: {
		searchList: Array,
		selectValue: Object,
		placeholdertxt: {
			type: String,
			default: '请选择'
		}
	},
	mounted() {
		document.addEventListener('click', e => {
			if (this.$refs.selectFilter) {
				if (!this.$refs.selectFilter.contains(e.target)) {
					this.searchFlag = false;
				}
			} else {
				console.log(2);
			}
			/* */
		});
		if(this.selectValue&&this.selectValue.name){
		this.selectname = this.selectValue.name;
		}
	},
	methods: {
		choseValue(item) {
			this.searchFlag = false;
			this.selectname = item.name;
			this.$emit('update:selectValue', item);
			this.$emit('selectFunc',item);
		},
		changeInput() {
			
		}
	},
	watch: {
		selectValue: function(newVal, oldVal) {
			if (newVal != oldVal) {
				//console.log(12);
				this.selectname = this.selectValue.name;
			}
		}
		
	}
};
</script>

<style scoped="scoped">
.selectFilter {
	position: relative;
}
.selectFilter input {
	display: block;
	width: 100%;
	height: 59px;
	cursor: pointer;
}
.dropdownlist {
	border-radius: 5px;
	box-sizing: border-box;
	top: 65px;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
