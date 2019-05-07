<style scoped="scoped">
.v-select {
	position: relative;
	font-family: inherit;
}

.v-select,
.v-select * {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}

@-webkit-keyframes vSelectSpinner {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	to {
		-webkit-transform: rotate(1turn);
		transform: rotate(1turn);
	}
}

@keyframes vSelectSpinner {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	to {
		-webkit-transform: rotate(1turn);
		transform: rotate(1turn);
	}
}

.vs__fade-enter-active,
.vs__fade-leave-active {
	-webkit-transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
	transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.vs__fade-enter,
.vs__fade-leave-to {
	opacity: 0;
}

.vs--disabled .vs__clear,
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__open-indicator,
.vs--disabled .vs__search,
.vs--disabled .vs__selected {
	cursor: not-allowed;
	background-color: #f8f8f8;
}

.v-select[dir='rtl'] .vs__actions {
	padding: 0 3px 0 6px;
}

.v-select[dir='rtl'] .vs__clear {
	margin-left: 6px;
	margin-right: 0;
}

.v-select[dir='rtl'] .vs__deselect {
	margin-left: 0;
	margin-right: 2px;
}

.v-select[dir='rtl'] .vs__dropdown-menu {
	text-align: right;
}

.vs__dropdown-toggle {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	padding: 0 ;
	background: none;
	/* border: 1px solid rgba(60, 60, 60, 0.26); */
	border-radius: 4px;
	white-space: normal;
	height: 60px;
}

.vs__dropdown-toggle,
.vs__selected-options {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
}

.vs__selected-options {
	-ms-flex-preferred-size: 100%;
	flex-basis: 100%;
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	padding: 0 2px;
	position: relative;
}

.vs__actions {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	padding: 4px 0 0 3px;
}

.vs--searchable .vs__dropdown-toggle {
	cursor: text;
}

.vs--unsearchable .vs__dropdown-toggle {
	cursor: pointer;
}

.vs--open .vs__dropdown-toggle {
	border-bottom-color: transparent;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}

.vs__open-indicator {
	cursor: pointer;
	fill: rgba(60, 60, 60, 0.5);
	-webkit-transform: scale(1);
	transform: scale(1);
	-webkit-transition: -webkit-transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855);
	transition: -webkit-transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855);
	transition: transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855);
	transition: transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855), -webkit-transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855);
	-webkit-transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
	transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
}

.vs--open .vs__open-indicator {
	-webkit-transform: rotate(180deg) scale(1);
	transform: rotate(180deg) scale(1);
}

.vs--loading .vs__open-indicator {
	opacity: 0;
}

.vs__clear {
	fill: rgba(60, 60, 60, 0.5);
	padding: 0;
	border: 0;
	background-color: transparent;
	cursor: pointer;
	margin-right: 8px;
}

.vs__dropdown-menu {
	display: block;
	position: absolute;
	top: calc(100% + 5px);
	left: 0;
	z-index: 1000;
	/* padding: 5px 0; */
	margin: 0;
	width: 100%;
	max-height: 350px;
	min-width: 160px;
	overflow-y: auto;
	/* -webkit-box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
	box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
	border: 1px solid rgba(60, 60, 60, 0.26);
	border-top-style: none;
	border-radius: 0 0 4px 4px; */
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	border: 2px solid #72cb53;
	text-align: left;
	list-style: none;
	background: #fff;border-radius: 5px;
}

.vs__no-options {
	text-align: center;
}

.vs__dropdown-option {
	line-height: 1.42857143;
	display: block;
	padding: 3px 20px;
	clear: both;
	color: #333;
	white-space: nowrap;
}

.vs__dropdown-option:hover {
	cursor: pointer;
}

.vs__dropdown-option--highlight {
	background: #5FB878;
	color: #fff;
}

.vs__selected {
/* 	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	background-color: #f0f0f0;
	border: 1px solid rgba(60, 60, 60, 0.26); */
	border-radius: 4px;
	color: #333;
	line-height: 60px;
	margin:  0;
	height: 100%;
	overflow: hidden;
	white-space: nowrap;
	width: 100%;
	text-overflow: ellipsis;
	border: 1px solid #f00;
	position: absolute;
	text-align: left;
	/* padding: 0 0.25em; */
}

.vs__deselect {
	display: -webkit-inline-box;
	display: -ms-inline-flexbox;
	display: inline-flex;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	/* margin-left: 4px; */
	padding: 0;
	border: 0;
	cursor: pointer;
	background: none;
	fill: rgba(60, 60, 60, 0.5);
	text-shadow: 0 1px 0 #fff;
}

.vs--single .vs__selected {
	background-color: transparent;
	border-color: transparent;
}

.vs--single.vs--open .vs__selected {
	position: absolute;
	opacity: 0.4;
}

.vs--single.vs--searching .vs__selected {
	display: none;
}

.vs__search::-ms-clear,
.vs__search::-webkit-search-cancel-button,
.vs__search::-webkit-search-decoration,
.vs__search::-webkit-search-results-button,
.vs__search::-webkit-search-results-decoration {
	display: none;
}

.vs__search,
.vs__search:focus {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	line-height: 1.4;
	font-size: 1em;
	border: 1px solid transparent;
	border-left: none;
	outline: none;
	margin: 4px 0 0;
	padding: 0 7px;
	background: none;
	-webkit-box-shadow: none;
	box-shadow: none;
	width: 0;
	max-width: 100%;
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
}

.vs__search::-webkit-input-placeholder {
	color: inherit;
}

.vs__search::-moz-placeholder {
	color: inherit;
}

.vs__search::-ms-input-placeholder {
	color: inherit;
}

.vs__search::placeholder {
	color: inherit;
}

.vs--unsearchable .vs__search {
	opacity: 1;
}

.vs--unsearchable .vs__search:hover {
	cursor: pointer;
}

.vs--single.vs--searching:not(.vs--open):not(.vs--loading) .vs__search {
	opacity: 0.2;
}

.vs__spinner {
	-ms-flex-item-align: center;
	align-self: center;
	opacity: 0;
	font-size: 5px;
	text-indent: -9999em;
	overflow: hidden;
	border: 0.9em solid hsla(0, 0%, 39.2%, 0.1);
	border-left-color: rgba(60, 60, 60, 0.45);
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
	-webkit-animation: vSelectSpinner 1.1s linear infinite;
	animation: vSelectSpinner 1.1s linear infinite;
	-webkit-transition: opacity 0.1s;
	transition: opacity 0.1s;
}

.vs__spinner,
.vs__spinner:after {
	border-radius: 50%;
	width: 5em;
	height: 5em;
}

.vs--loading .vs__spinner {
	opacity: 1;
}

</style>

<template>
	<div :dir="dir" class="v-select" :class="stateClasses">
		<div ref="toggle" @mousedown.prevent="toggleDropdown" class="vs__dropdown-toggle">
			<div class="vs__selected-options" ref="selectedOptions">
				<slot
					v-for="option in selectedValue"
					name="selected-option-container"
					:option="normalizeOptionForSlot(option)"
					:deselect="deselect"
					:multiple="multiple"
					:disabled="disabled"
				>
					<span class="vs__selected" v-bind:key="option.index">
						<slot name="selected-option" v-bind="normalizeOptionForSlot(option)">{{ getOptionLabel(option) }}</slot>
						<button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="vs__deselect" aria-label="Deselect option">
							<component :is="childComponents.Deselect" />
						</button>
					</span>
				</slot>

				<slot name="search" v-bind="scope.search"><input class="vs__search" v-bind="scope.search.attributes" v-on="scope.search.events" /></slot>
			</div>

			<div class="vs__actions">
				<button v-show="showClearButton" :disabled="disabled" @click="clearSelection" type="button" class="vs__clear" title="Clear selection">
					<component :is="childComponents.Deselect" />
				</button>

				<slot name="open-indicator" v-bind="scope.openIndicator">
					<component :is="childComponents.OpenIndicator" v-if="!noDrop" v-bind="scope.openIndicator.attributes" />
				</slot>

				<slot name="spinner" v-bind="scope.spinner"><div class="vs__spinner" v-show="mutableLoading">Loading...</div></slot>
			</div>
		</div>

		<!-- <transition :name="transition"> -->
			<ul ref="dropdownMenu" v-show="dropdownOpen" class="vs__dropdown-menu" role="listbox" @mousedown="onMousedown" @mouseup="onMouseUp">
				<li
					role="option"
					v-for="(option, index) in filteredOptions"
					:key="index"
					class="vs__dropdown-option"
					:class="{ 'vs__dropdown-option--selected': isOptionSelected(option), 'vs__dropdown-option--highlight': index === typeAheadPointer }"
					@mouseover="typeAheadPointer = index"
					@mousedown.prevent.stop="select(option)"
				>
					<slot name="option" v-bind="normalizeOptionForSlot(option)">{{ getOptionLabel(option) }}</slot>
				</li>
				<li v-if="!filteredOptions.length" class="vs__no-options" @mousedown.stop=""><slot name="no-options">Sorry, no matching options.</slot></li>
			</ul>
		<!-- </transition> -->
	</div>
</template>

<script type="text/babel">
import pointerScroll from '../mixins/pointerScroll';
import typeAheadPointer from '../mixins/typeAheadPointer';
import ajax from '../mixins/ajax';
import childComponents from './childComponents';

export default {
	components: { ...childComponents },

	mixins: [pointerScroll, typeAheadPointer, ajax],

	props: {
		/**
		 * Contains the currently selected value. Very similar to a
		 * `value` attribute on an <input>. You can listen for changes
		 * using 'change' event using v-on
		 * @type {Object||String||null}
		 */
		value: {},

		/**
		 * An object with any custom components that you'd like to overwrite
		 * the default implementation of in your app. The keys in this object
		 * will be merged with the defaults.
		 * @see https://vue-select.org/guide/components.html
		 * @type {Function}
		 */
		components: {
			type: Object,
			default: () => ({})
		},

		/**
		 * An array of strings or objects to be used as dropdown choices.
		 * If you are using an array of objects, vue-select will look for
		 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
		 * custom label key can be set with the `label` prop.
		 * @type {Array}
		 */
		options: {
			type: Array,
			default() {
				return [];
			}
		},

		/**
		 * Disable the entire component.
		 * @type {Boolean}
		 */
		disabled: {
			type: Boolean,
			default: false
		},

		/**
		 * Can the user clear the selected property.
		 * @type {Boolean}
		 */
		clearable: {
			type: Boolean,
			default: true
		},

		/**
		 * Enable/disable filtering the options.
		 * @type {Boolean}
		 */
		searchable: {
			type: Boolean,
			default: true
		},

		/**
		 * Equivalent to the `multiple` attribute on a `<select>` input.
		 * @type {Boolean}
		 */
		multiple: {
			type: Boolean,
			default: false
		},

		/**
		 * Equivalent to the `placeholder` attribute on an `<input>`.
		 * @type {String}
		 */
		placeholder: {
			type: String,
			default: ''
		},

		/**
		 * Sets a Vue transition property on the `.vs__dropdown-menu`.
		 * @type {String}
		 */
		transition: {
			type: String,
			default: 'vs__fade'
		},

		/**
		 * Enables/disables clearing the search text when an option is selected.
		 * @type {Boolean}
		 */
		clearSearchOnSelect: {
			type: Boolean,
			default: true
		},

		/**
		 * Close a dropdown when an option is chosen. Set to false to keep the dropdown
		 * open (useful when combined with multi-select, for example)
		 * @type {Boolean}
		 */
		closeOnSelect: {
			type: Boolean,
			default: true
		},

		/**
		 * Tells vue-select what key to use when generating option
		 * labels when each `option` is an object.
		 * @type {String}
		 */
		label: {
			type: String,
			default: 'label'
		},

		/**
		 * Value of the 'autocomplete' field of the input
		 * element.
		 * @type {String}
		 */
		autocomplete: {
			type: String,
			default: 'off'
		},

		/**
		 * When working with objects, the reduce
		 * prop allows you to transform a given
		 * object to only the information you
		 * want passed to a v-model binding
		 * or @input event.
		 */
		reduce: {
			type: Function,
			default: option => option
		},

		/**
		 * Callback to generate the label text. If {option}
		 * is an object, returns option[this.label] by default.
		 *
		 * Label text is used for filtering comparison and
		 * displaying. If you only need to adjust the
		 * display, you should use the `option` and
		 * `selected-option` slots.
		 *
		 * @type {Function}
		 * @param  {Object || String} option
		 * @return {String}
		 */
		getOptionLabel: {
			type: Function,
			default(option) {
				if (typeof option === 'object') {
					if (!option.hasOwnProperty(this.label)) {
						return console.warn(
							`[vue-select warn]: Label key "option.${this.label}" does not` +
								` exist in options object ${JSON.stringify(option)}.\n` +
								'http://sagalbot.github.io/vue-select/#ex-labels'
						);
					}
					return option[this.label];
				}
				return option;
			}
		},

		/**
		 * Select the current value if selectOnTab is enabled
		 */
		onTab: {
			type: Function,
			default: function() {
				if (this.selectOnTab) {
					this.typeAheadSelect();
				}
			}
		},

		/**
		 * Enable/disable creating options from searchEl.
		 * @type {Boolean}
		 */
		taggable: {
			type: Boolean,
			default: false
		},

		/**
		 * Set the tabindex for the input field.
		 * @type {Number}
		 */
		tabindex: {
			type: Number,
			default: null
		},

		/**
		 * When true, newly created tags will be added to
		 * the options list.
		 * @type {Boolean}
		 */
		pushTags: {
			type: Boolean,
			default: false
		},

		/**
		 * When true, existing options will be filtered
		 * by the search text. Should not be used in conjunction
		 * with taggable.
		 * @type {Boolean}
		 */
		filterable: {
			type: Boolean,
			default: true
		},

		/**
		 * Callback to determine if the provided option should
		 * match the current search text. Used to determine
		 * if the option should be displayed.
		 * @type   {Function}
		 * @param  {Object || String} option
		 * @param  {String} label
		 * @param  {String} search
		 * @return {Boolean}
		 */
		filterBy: {
			type: Function,
			default(option, label, search) {
				return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1;
			}
		},

		/**
		 * Callback to filter results when search text
		 * is provided. Default implementation loops
		 * each option, and returns the result of
		 * this.filterBy.
		 * @type   {Function}
		 * @param  {Array} list of options
		 * @param  {String} search text
		 * @param  {Object} vSelect instance
		 * @return {Boolean}
		 */
		filter: {
			type: Function,
			default(options, search) {
				return options.filter(option => {
					let label = this.getOptionLabel(option);
					if (typeof label === 'number') {
						label = label.toString();
					}
					return this.filterBy(option, label, search);
				});
			}
		},

		/**
		 * User defined function for adding Options
		 * @type {Function}
		 */
		createOption: {
			type: Function,
			default(newOption) {
				if (typeof this.optionList[0] === 'object') {
					newOption = { [this.label]: newOption };
				}

				this.$emit('option:created', newOption);
				return newOption;
			}
		},

		/**
		 * When false, updating the options will not reset the select value
		 * @type {Boolean}
		 */
		resetOnOptionsChange: {
			type: Boolean,
			default: false
		},

		/**
		 * Disable the dropdown entirely.
		 * @type {Boolean}
		 */
		noDrop: {
			type: Boolean,
			default: false
		},

		/**
		 * Sets the id of the input element.
		 * @type {String}
		 * @default {null}
		 */
		inputId: {
			type: String
		},

		/**
		 * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
		 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
		 * @type {String}
		 * @default 'auto'
		 */
		dir: {
			type: String,
			default: 'auto'
		},

		/**
		 * When true, hitting the 'tab' key will select the current select value
		 * @type {Boolean}
		 */
		selectOnTab: {
			type: Boolean,
			default: false
		},

		/**
		 * Query Selector used to find the search input
		 * when the 'search' scoped slot is used.
		 *
		 * Must be a valid CSS selector string.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
		 * @type {String}
		 */
		searchInputQuerySelector: {
			type: String,
			default: '[type=search]'
		}
	},

	data() {
		return {
			search: '',
			open: false,
			pushedTags: [],
			_value: [] // Internal value managed by Vue Select if no `value` prop is passed
		};
	},

	watch: {
		/**
		 * Maybe reset the value
		 * when options change.
		 * @return {[type]} [description]
		 */
		options(val) {
			if (!this.taggable && this.resetOnOptionsChange) {
				this.clearSelection();
			}
		},

		/**
		 * Always reset the value when
		 * the multiple prop changes.
		 * @param  {Boolean} isMultiple
		 * @return {void}
		 */
		multiple() {
			this.clearSelection();
		}
	},

	created() {
		this.mutableLoading = this.loading;

		if (this.$options.propsData.hasOwnProperty('reduce') && this.value) {
			if (Array.isArray(this.value)) {
				this.$data._value = this.value.map(value => this.findOptionFromReducedValue(value));
			} else {
				this.$data._value = this.findOptionFromReducedValue(this.value);
			}
		}

		this.$on('option:created', this.maybePushTag);
	},

	methods: {
		/**
		 * Select a given option.
		 * @param  {Object|String} option
		 * @return {void}
		 */
		select(option) {
			if (!this.isOptionSelected(option)) {
				if (this.taggable && !this.optionExists(option)) {
					option = this.createOption(option);
				}
				if (this.multiple) {
					option = this.selectedValue.concat(option);
				}
				this.updateValue(option);
			}

			this.onAfterSelect(option);
		},

		/**
		 * De-select a given option.
		 * @param  {Object|String} option
		 * @return {void}
		 */
		deselect(option) {
			this.updateValue(
				this.selectedValue.filter(val => {
					return !this.optionComparator(val, option);
				})
			);
		},

		/**
		 * Clears the currently selected value(s)
		 * @return {void}
		 */
		clearSelection() {
			this.updateValue(this.multiple ? [] : null);
		},

		/**
		 * Called from this.select after each selection.
		 * @param  {Object|String} option
		 * @return {void}
		 */
		onAfterSelect(option) {
			if (this.closeOnSelect) {
				this.open = !this.open;
				this.searchEl.blur();
			}

			if (this.clearSearchOnSelect) {
				this.search = '';
			}
		},

		/**
		 * Accepts a selected value, updates local
		 * state when required, and triggers the
		 * input event.
		 *
		 * @emits input
		 * @param value
		 */
		updateValue(value) {
			if (this.isTrackingValues) {
				// Vue select has to manage value
				this.$data._value = value;
			}

			if (value !== null) {
				if (Array.isArray(value)) {
					value = value.map(val => this.reduce(val));
				} else {
					value = this.reduce(value);
				}
			}

			this.$emit('input', value);
		},

		/**
		 * Toggle the visibility of the dropdown menu.
		 * @param  {Event} e
		 * @return {void}
		 */
		toggleDropdown(e) {
			const target = e.target;
			const toggleTargets = [this.$el, this.searchEl, this.$refs.toggle.$el];

			if (typeof this.$refs.openIndicator !== 'undefined') {
				toggleTargets.push(
					this.$refs.openIndicator.$el,
					// the line below is a bit gross, but required to support IE11 without adding polyfills
					...Array.prototype.slice.call(this.$refs.openIndicator.$el.childNodes)
				);
			}

			if (toggleTargets.indexOf(target) > -1 || target.classList.contains('vs__selected')) {
				if (this.open) {
					this.searchEl.blur(); // dropdown will close on blur
				} else {
					if (!this.disabled) {
						this.open = true;
						this.searchEl.focus();
					}
				}
			}
		},

		/**
		 * Check if the given option is currently selected.
		 * @param  {Object|String}  option
		 * @return {Boolean}        True when selected | False otherwise
		 */
		isOptionSelected(option) {
			return this.selectedValue.some(value => {
				return this.optionComparator(value, option);
			});
		},

		/**
		 * Determine if two option objects are matching.
		 *
		 * @param value {Object}
		 * @param option {Object}
		 * @returns {boolean}
		 */
		optionComparator(value, option) {
			if (typeof value !== 'object' && typeof option !== 'object') {
				// Comparing primitives
				if (value === option) {
					return true;
				}
			} else {
				// Comparing objects
				if (value === this.reduce(option)) {
					return true;
				}
				if (this.getOptionLabel(value) === this.getOptionLabel(option) || this.getOptionLabel(value) === option) {
					return true;
				}
				if (this.reduce(value) === this.reduce(option)) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Finds an option from this.options
		 * where a reduced value matches
		 * the passed in value.
		 *
		 * @param value {Object}
		 * @returns {*}
		 */
		findOptionFromReducedValue(value) {
			return this.options.find(option => JSON.stringify(this.reduce(option)) === JSON.stringify(value)) || value;
		},

		/**
		 * 'Private' function to close the search options
		 * @emits  {search:blur}
		 * @returns {void}
		 */
		closeSearchOptions() {
			this.open = false;
			this.$emit('search:blur');
		},

		/**
		 * Delete the value on Delete keypress when there is no
		 * text in the search input, & there's tags to delete
		 * @return {this.value}
		 */
		maybeDeleteValue() {
			if (!this.searchEl.value.length && this.selectedValue && this.clearable) {
				let value = null;
				if (this.multiple) {
					value = [...this.selectedValue.slice(0, this.selectedValue.length - 1)];
				}
				this.updateValue(value);
			}
		},

		/**
		 * Determine if an option exists
		 * within this.optionList array.
		 *
		 * @param  {Object || String} option
		 * @return {boolean}
		 */
		optionExists(option) {
			return this.optionList.some(opt => {
				if (typeof opt === 'object' && this.getOptionLabel(opt) === option) {
					return true;
				} else if (opt === option) {
					return true;
				}
				return false;
			});
		},

		/**
		 * Ensures that options are always
		 * passed as objects to scoped slots.
		 * @param option
		 * @return {*}
		 */
		normalizeOptionForSlot(option) {
			return typeof option === 'object' ? option : { [this.label]: option };
		},

		/**
		 * If push-tags is true, push the
		 * given option to `this.pushedTags`.
		 *
		 * @param  {Object || String} option
		 * @return {void}
		 */
		maybePushTag(option) {
			if (this.pushTags) {
				this.pushedTags.push(option);
			}
		},

		/**
		 * If there is any text in the search input, remove it.
		 * Otherwise, blur the search input to close the dropdown.
		 * @return {void}
		 */
		onEscape() {
			if (!this.search.length) {
				this.searchEl.blur();
			} else {
				this.search = '';
			}
		},

		/**
		 * Close the dropdown on blur.
		 * @emits  {search:blur}
		 * @return {void}
		 */
		onSearchBlur() {
			if (this.mousedown && !this.searching) {
				this.mousedown = false;
			} else {
				if (this.clearSearchOnBlur) {
					this.search = '';
				}
				this.closeSearchOptions();
				return;
			}
			// Fixed bug where no-options message could not be closed
			if (this.search.length === 0 && this.options.length === 0) {
				this.closeSearchOptions();
				return;
			}
		},

		/**
		 * Open the dropdown on focus.
		 * @emits  {search:focus}
		 * @return {void}
		 */
		onSearchFocus() {
			this.open = true;
			this.$emit('search:focus');
		},

		/**
		 * Event-Handler to help workaround IE11 (probably fixes 10 as well)
		 * firing a `blur` event when clicking
		 * the dropdown's scrollbar, causing it
		 * to collapse abruptly.
		 * @see https://github.com/sagalbot/vue-select/issues/106
		 * @return {void}
		 */
		onMousedown() {
			this.mousedown = true;
		},

		/**
		 * Event-Handler to help workaround IE11 (probably fixes 10 as well)
		 * @see https://github.com/sagalbot/vue-select/issues/106
		 * @return {void}
		 */
		onMouseUp() {
			this.mousedown = false;
		},

		/**
		 * Search 'input' KeyBoardEvent handler.
		 * @param e {KeyboardEvent}
		 * @return {Function}
		 */
		onSearchKeyDown(e) {
			switch (e.keyCode) {
				case 8:
					//  delete
					return this.maybeDeleteValue();
				case 9:
					//  tab
					return this.onTab();
			}
		},

		/**
		 * Search 'input' KeyBoardEvent handler.
		 * @param e {KeyboardEvent}
		 * @return {Function}
		 */
		onSearchKeyUp(e) {
			switch (e.keyCode) {
				case 27:
					//  esc
					return this.onEscape();
				case 38:
					//  up.prevent
					e.preventDefault();
					return this.typeAheadUp();
				case 40:
					//  down.prevent
					e.preventDefault();
					return this.typeAheadDown();
				case 13:
					//  enter.prevent
					e.preventDefault();
					return this.typeAheadSelect();
			}
		}
	},

	computed: {
		/**
		 * Determine if the component needs to
		 * track the state of values internally.
		 * @return {boolean}
		 */
		isTrackingValues() {
			return typeof this.value === 'undefined' || this.$options.propsData.hasOwnProperty('reduce');
		},

		/**
		 * The options that are currently selected.
		 * @return {Array}
		 */
		selectedValue() {
			let value = this.value;

			if (this.isTrackingValues) {
				// Vue select has to manage value internally
				value = this.$data._value;
			}

			if (value) {
				return [].concat(value);
			}

			return [];
		},

		/**
		 * The options available to be chosen
		 * from the dropdown, including any
		 * tags that have been pushed.
		 *
		 * @return {Array}
		 */
		optionList() {
			return this.options.concat(this.pushedTags);
		},

		/**
		 * Find the search input DOM element.
		 * @returns {HTMLInputElement}
		 */
		searchEl() {
			return !!this.$scopedSlots['search'] ? this.$refs.selectedOptions.querySelector(this.searchInputQuerySelector) : this.$refs.search;
		},

		/**
		 * The object to be bound to the $slots.search scoped slot.
		 * @returns {Object}
		 */
		scope() {
			return {
				search: {
					attributes: {
						disabled: this.disabled,
						placeholder: this.searchPlaceholder,
						tabindex: this.tabindex,
						readonly: !this.searchable,
						id: this.inputId,
						'aria-expanded': this.dropdownOpen,
						'aria-label': 'Search for option',
						ref: 'search',
						role: 'combobox',
						type: 'search',
						autocomplete: 'off',
						value: this.search
					},
					events: {
						keydown: this.onSearchKeyDown,
						keyup: this.onSearchKeyUp,
						blur: this.onSearchBlur,
						focus: this.onSearchFocus,
						input: e => (this.search = e.target.value)
					}
				},
				spinner: {
					loading: this.mutableLoading
				},
				openIndicator: {
					attributes: {
						ref: 'openIndicator',
						role: 'presentation',
						class: 'vs__open-indicator'
					}
				}
			};
		},

		/**
		 * Returns an object containing the child components
		 * that will be used throughout the component. The
		 * `component` prop can be used to overwrite the defaults.
		 *
		 * @return {Object}
		 */
		childComponents() {
			return {
				...childComponents,
				...this.components
			};
		},

		/**
		 * Holds the current state of the component.
		 * @return {Object}
		 */
		stateClasses() {
			return {
				'vs--open': this.dropdownOpen,
				'vs--single': !this.multiple,
				'vs--searching': this.searching && !this.noDrop,
				'vs--searchable': this.searchable && !this.noDrop,
				'vs--unsearchable': !this.searchable,
				'vs--loading': this.mutableLoading,
				'vs--disabled': this.disabled
			};
		},

		/**
		 * If search text should clear on blur
		 * @return {Boolean} True when single and clearSearchOnSelect
		 */
		clearSearchOnBlur() {
			return this.clearSearchOnSelect && !this.multiple;
		},

		/**
		 * Return the current state of the
		 * search input
		 * @return {Boolean} True if non empty value
		 */
		searching() {
			return !!this.search;
		},

		/**
		 * Return the current state of the
		 * dropdown menu.
		 * @return {Boolean} True if open
		 */
		dropdownOpen() {
			return this.noDrop ? false : this.open && !this.mutableLoading;
		},

		/**
		 * Return the placeholder string if it's set
		 * & there is no value selected.
		 * @return {String} Placeholder text
		 */
		searchPlaceholder() {
			if (this.isValueEmpty && this.placeholder) {
				return this.placeholder;
			}
		},

		/**
		 * The currently displayed options, filtered
		 * by the search elements value. If tagging
		 * true, the search text will be prepended
		 * if it doesn't already exist.
		 *
		 * @return {array}
		 */
		filteredOptions() {
			const optionList = [].concat(this.optionList);

			if (!this.filterable && !this.taggable) {
				return optionList;
			}

			let options = this.search.length ? this.filter(optionList, this.search, this) : optionList;
			if (this.taggable && this.search.length && !this.optionExists(this.search)) {
				options.unshift(this.search);
			}
			return options;
		},

		/**
		 * Check if there aren't any options selected.
		 * @return {Boolean}
		 */
		isValueEmpty() {
			return this.selectedValue.length === 0;
		},

		/**
		 * Determines if the clear button should be displayed.
		 * @return {Boolean}
		 */
		showClearButton() {
			return !this.multiple && this.clearable && !this.open && !this.isValueEmpty;
		}
	}
};
</script>
