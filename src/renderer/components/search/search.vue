<template>
	<div ref="dropdown">
		<input type="text" v-model="selectname" readonly="readonly" />
		<!-- {{reftitletypelist}} -->
		 <div>
			<ul>
				<li v-for="(item, index) in reftitletypelist" :key="index" @click="choseValue(item)" style="cursor: pointer;">
					{{ item.name }}
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
		reftitletypelist: Array,
		selectValue: String
	},
	mounted() {
		document.addEventListener('click', e => {
			if (!this.$refs.dropdown.contains(e.target)) {
				this.searchFlag = false;
			}
		});
	},
	methods: {
		choseValue(item) {
			this.searchFlag = false;
			this.selectname = item.name;
			this.$emit('update:selectValue', item);
		}
	}
};
/* export default {
data() {
	return {
		searchFlag:false,
		selectname:''
	}
},

props: {
	searchList: Array,
	selectValue:String
},
mounted(){
	document.addEventListener('click', (e) => {
		if (!this.$refs.dropdown.contains(e.target))
		{
			this.searchFlag = false;
			}
	})
},
methods:{
	choseValue(item){
		this.searchFlag=false;
		this.selectname=item.name;
		this.$emit('update:selectValue', item.value);
	}
} */
</script>

<style></style>
