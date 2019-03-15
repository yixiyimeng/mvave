<template>
	<div class="dropdown" ref="dropdown">
		<a href="javascript:;" class="dropdownarrow" @click="searchFlag = !searchFlag">
			<i class="icon icon-filter-arrow"></i>
		</a>
		<div class="dropdownlist slideDown animated" v-if="searchFlag">
			<ul>
				<li
					v-for="(item, index) in reftitletypelist"
					:key="index"
					@click="choseValue(item)"
				>
					<a href="javascript:;">{{ item }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'dropmenu',
	data() {
		return {
			searchFlag: false
		};
	},

	props: {
		reftitletypelist: Array
	},
	mounted() {
		document.addEventListener('click', e => {
			if (this.$refs.dropdown) {
				if (!this.$refs.dropdown.contains(e.target)) {
					this.searchFlag = false;
				}
			}
		});
	},
	methods: {
		choseValue(talkname) {
			this.searchFlag = false;
			this.$emit('selTalkName', talkname);
		}
	}
};
</script>

<style scoped="scoped">
@-webkit-keyframes slideDown {
	from {
		height: 0;
		overflow: hidden;
	}

	to {
		height: auto;
		overflow: auto;
	}
}

@keyframes slideDown {
	from {
		/* transform: scale(1,0); */
		height: 0;
	}

	100% {
		height: auto;
		/* transform: scale(1,1); */
	}
}

.slideDown {
	-webkit-animation-name: slideDown;
	animation-name: slideDown;
	-webkit-transform-origin: center top;
	transform-origin: center top;
	-webkit-animation-duration: 0.3s;
	animation-duration: 0.3s;
}
.dropdownlist {
	border-radius: 5px;
	box-sizing: border-box;
}
</style>
