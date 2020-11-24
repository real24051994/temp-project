<template>
	<ul :class="containerClass" v-if="total > 1">
		<template v-if="routerLink">
			<li :class="[pageClass, firstPageSelected() ? disabledClass : '']" v-if="firstLastButton">
				<router-link :class="pageLinkClass" :tabindex="firstPageSelected() ? -1 : 0" :to="setRouterLink(1)" @click="selectFirstPage()" @keyup.enter="selectFirstPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path class="nav-svg-icon" d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
						<path d="M24 24H0V0h24v24z" fill="none" />
					</svg>
				</router-link>
			</li>

			<li :class="[prevClass, firstPageSelected() ? disabledClass : '']" v-if="!(firstPageSelected() && hidePrevNext)">
				<router-link :class="prevLinkClass" :tabindex="firstPageSelected() ? -1 : 0" :to="setRouterLink(selected - 1)" @click="prevPage()" @keyup.enter="prevPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path  d="M0 0h24v24H0z" fill="none" />
						<path class="nav-svg-icon" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
					</svg>
				</router-link>
			</li>

			<li :class="[pageClass, page.selected ? activeClass : '', page.disabled ? disabledClass : '', page.breakView ? breakViewClass: '']" :key="`page_index_${index}`" v-for="(page, index) in pages">
				<a :class="[pageLinkClass, breakViewLinkClass]" tabindex="0" v-if="page.breakView">
					<slot name="breakViewContent">{{ breakViewText }}</slot>
				</a>
				<a :class="pageLinkClass" tabindex="0" v-else-if="page.disabled">{{ page.content }}</a>
				<router-link :class="pageLinkClass" :to="setRouterLink(page.index + 1)" @click="handlePageSelected(page.index + 1)" @keyup.enter="handlePageSelected(page.index + 1)" tabindex="0" v-else>{{ page.content }}</router-link>
			</li>

			<li :class="[nextClass, lastPageSelected() ? disabledClass : '']" v-if="!(lastPageSelected() && hidePrevNext)">
				<router-link :class="nextLinkClass" :tabindex="lastPageSelected() ? -1 : 0" :to="setRouterLink(selected + 1)" @click="nextPage()" @keyup.enter="nextPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none" />
						<path class="nav-svg-icon" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
					</svg>
				</router-link>
			</li>

			<li :class="[pageClass, lastPageSelected() ? disabledClass : '']" v-if="firstLastButton">
				<router-link :class="pageLinkClass" :tabindex="lastPageSelected() ? -1 : 0" :to="setRouterLink(total)" @click="selectLastPage()" @keyup.enter="selectLastPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path class="nav-svg-icon" d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
					</svg>
				</router-link>
			</li>
		</template>
		<template v-else>
			<li :class="[pageClass, firstPageSelected() ? disabledClass : '']" v-if="firstLastButton">
				<a :class="pageLinkClass" :tabindex="firstPageSelected() ? -1 : 0" @click="selectFirstPage()" @keyup.enter="selectFirstPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path class="nav-svg-icon" d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
						<path d="M24 24H0V0h24v24z" fill="none" />
					</svg>
				</a>
			</li>

			<li :class="[prevClass, firstPageSelected() ? disabledClass : '']" v-if="!(firstPageSelected() && hidePrevNext)">
				<a :class="prevLinkClass" :tabindex="firstPageSelected() ? -1 : 0" @click="prevPage()" @keyup.enter="prevPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none" />
						<path class="nav-svg-icon" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
					</svg>
				</a>
			</li>

			<li :class="[pageClass, page.selected ? activeClass : '', page.disabled ? disabledClass : '', page.breakView ? breakViewClass: '']" :key="`page_index_${index}`" v-for="(page, index) in pages">
				<a :class="[pageLinkClass, breakViewLinkClass]" tabindex="0" v-if="page.breakView">
					<slot name="breakViewContent">{{ breakViewText }}</slot>
				</a>
				<a :class="pageLinkClass" tabindex="0" v-else-if="page.disabled">{{ page.content }}</a>
				<a :class="pageLinkClass" @click="handlePageSelected(page.index + 1)" @keyup.enter="handlePageSelected(page.index + 1)" tabindex="0" v-else>{{ page.content }}</a>
			</li>

			<li :class="[nextClass, lastPageSelected() ? disabledClass : '']" v-if="!(lastPageSelected() && hidePrevNext)">
				<a :class="nextLinkClass" :tabindex="lastPageSelected() ? -1 : 0" @click="nextPage()" @keyup.enter="nextPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none" />
						<path class="nav-svg-icon" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
					</svg>
				</a>
			</li>

			<li :class="[pageClass, lastPageSelected() ? disabledClass : '']" v-if="firstLastButton">
				<a :class="pageLinkClass" :tabindex="lastPageSelected() ? -1 : 0" @click="selectLastPage()" @keyup.enter="selectLastPage()">
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path class="nav-svg-icon" d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
					</svg>
				</a>
			</li>
		</template>
	</ul>
</template>

<script>
export default {
	props: {
		value: {
			type: [Number, String]
		},
		total: {
			type: Number,
			required: true
		},
		routerLink: {
			default: true
		},
		forcePage: {
			type: Number
		},
		change: {
			type: Function,
			default: () => {}
		},
		pageRange: {
			type: Number,
			default: 5
		},
		marginPages: {
			type: Number,
			default: 1
		},
		breakViewText: {
			type: String,
			default: "…"
		},
		containerClass: {
			type: String,
			default: "pagination"
		},
		pageClass: {
			type: String
		},
		pageLinkClass: {
			type: String
		},
		prevClass: {
			type: String
		},
		prevLinkClass: {
			type: String
		},
		nextClass: {
			type: String
		},
		nextLinkClass: {
			type: String
		},
		breakViewClass: {
			type: String
		},
		breakViewLinkClass: {
			type: String
		},
		activeClass: {
			type: String,
			default: "active"
		},
		disabledClass: {
			type: String,
			default: "disabled"
		},
		noLiSurround: {
			type: Boolean,
			default: false
		},
		firstLastButton: {
			type: Boolean,
			default: true
		},
		hidePrevNext: {
			type: Boolean,
			default: false
		}
	},
	beforeUpdate() {
		if (this.forcePage === undefined) return;
		if (this.forcePage !== this.selected) {
			this.selected = this.forcePage;
		}
	},
	computed: {
		selected: {
			get: function() {
				return parseInt(this.value) || this.innerValue;
			},
			set: function(newValue) {
				this.innerValue = newValue;
			}
		},
		pages: function() {
			let items = {};
			if (this.total <= this.pageRange) {
				for (let index = 0; index < this.total; index++) {
					let page = {
						index: index,
						content: index + 1,
						selected: index === this.selected - 1
					};
					items[index] = page;
				}
			} else {
				const halfPageRange = Math.floor(this.pageRange / 2);

				let setPageItem = index => {
					let page = {
						index: index,
						content: index + 1,
						selected: index === this.selected - 1
					};

					items[index] = page;
				};

				let setBreakView = index => {
					let breakView = {
						disabled: true,
						breakView: true
					};

					items[index] = breakView;
				};

				for (let i = 0; i < this.marginPages; i++) {
					setPageItem(i);
				}

				let selectedRangeLow = 0;
				if (this.selected - halfPageRange > 0) {
					selectedRangeLow = this.selected - 1 - halfPageRange;
				}

				let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
				if (selectedRangeHigh >= this.total) {
					selectedRangeHigh = this.total - 1;
					selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
				}

				for (
					let i = selectedRangeLow;
					i <= selectedRangeHigh && i <= this.total - 1;
					i++
				) {
					setPageItem(i);
				}

				if (selectedRangeLow > this.marginPages) {
					setBreakView(selectedRangeLow - 1);
				}

				if (selectedRangeHigh + 1 < this.total - this.marginPages) {
					setBreakView(selectedRangeHigh + 1);
				}

				for (
					let i = this.total - 1;
					i >= this.total - this.marginPages;
					i--
				) {
					setPageItem(i);
				}
			}
			return items;
		}
	},
	data() {
		return {
			innerValue: 1
		};
	},
	methods: {
		setRouterLink(page) {
			var route = {
				name: this.$route.name,
				query: JSON.parse(JSON.stringify(this.$route.query)),
				params: JSON.parse(JSON.stringify(this.$route.params))
			};
			route.query["page"] = page;
			return this.setRouterLinkHandler(route);
		},
		setRouterLinkHandler({ name, params, query }) {
			let current = {
				name: this.$route.name,
				params: this.$route.params,
				query: this.$route.query
			};
			if (name) {
				current.name = name;
			}
			if (params) {
				current.params = params;
			}
			if (query) {
				current.query = query;
			}
			return current;
		},
		handlePageSelected(selected) {
			if (this.selected === selected) return;

			this.innerValue = selected;
			this.$emit("input", selected);
			this.change(selected);
		},
		prevPage() {
			if (this.selected <= 1) return;

			this.handlePageSelected(this.selected - 1);
		},
		nextPage() {
			if (this.selected >= this.total) return;

			this.handlePageSelected(this.selected + 1);
		},
		firstPageSelected() {
			return this.selected === 1;
		},
		lastPageSelected() {
			return this.selected === this.total || this.total === 0;
		},
		selectFirstPage() {
			if (this.selected <= 1) return;

			this.handlePageSelected(1);
		},
		selectLastPage() {
			if (this.selected >= this.total) return;

			this.handlePageSelected(this.total);
		}
	}
};
</script>

<style lang="scss" scoped>
.pagination {
	display: flex;
	justify-content: center;
	flex-direction: row;
	flex-wrap: nowrap;
	padding: 0;
	li {
		display: inline-flex;
		padding: 0 3px;
		a {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 32px;
			min-width: 32px;
			padding: 0;
			text-decoration: none;
			color: $text;
			border: 1px solid #ddd;
			font-size: 14px;
			font-weight: 500;
			background: #fff;
			user-select: none;
			border-radius: 5px;
			transition: all 0.2s ease;
			cursor: pointer;
			svg {
				.nav-svg-icon {
					fill: $text;
				}
			}
			&:hover {
				background: $primary-color;
				color: #fff;
				border-color: $primary-color;
				svg {
					.nav-svg-icon {
						fill: #fff;
					}
				}
			}
		}
		&.disabled {
			opacity: 0.7;
			cursor: not-allowed;
			a {
				pointer-events: none;
				&:hover {
					background: #fff;
					color: #fff;
					svg {
						.nav-svg-icon {
							fill: #fff;
						}
					}
				}
			}
		}
		&.active {
			a {
				background: $primary-color;
				color: #fff;
				svg {
					.nav-svg-icon {
						fill: #fff;
					}
				}
			}
		}
	}
}
</style>