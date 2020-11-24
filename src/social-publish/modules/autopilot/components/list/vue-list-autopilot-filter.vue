<template>
	<div class="vue-list-autopilot-filter">
		<a-dropdown transitionName="fade"  :getPopupContainer="trigger => trigger.parentNode" :trigger="['click']"  v-model="visible"  @visibleChange="visibleChange">
			<a-button class="btn-trigger" >
				<sh-icon :icon="['far','filter']" class=" m-r-8" /> Filter
			</a-button>
			<a-menu slot="overlay" class="vue-list-autopilot-filter-menu" >
				<a-menu-item key="1" class="vue-list-autopilot-filter-menu-item" >
					<transition name="fade-in" mode="out-in">
						<div v-if="is_loading" key="is-loading" class="item-filter-loading">
							<a-spin>
								<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
							</a-spin>
						</div>
						<div v-else key="is-loading-success">
							<div class="item-filter">
								<label class="item-filter-label">Filter by day</label>
								<a-select v-model="filter.day">
									<a-select-option :value="1">1 Day</a-select-option>
									<a-select-option :value="3">3 Days</a-select-option>
									<a-select-option :value="5">5 Days</a-select-option>
									<a-select-option :value="7">7 Days</a-select-option>
									<a-select-option :value="10">10 Days</a-select-option>
								</a-select>
							</div>
							<div class="item-filter">
								<label class="item-filter-label">Filter by Autopilot</label>
								<div class="ant-select ant-select-autopilot  ant-select-enabled" :class="{'ant-select-open' : dropdown}">
									<div class="ant-select-selection ant-select-selection--single" @click="showDropdown()">
										<div class="ant-select-selection__rendered">
											<template v-if="!autopilots.length">
												No autopilots selected
											</template>
											<template v-else>
												<template v-if="filter.autopilot.length">
													<template v-if="filter.autopilot.length == autopilots.length">
														All autopilot
													</template>
													<template v-else>
														{{filter.autopilot.length}} autopilots selected
													</template>
												</template>
												<template v-else>
													No autopilots selected
												</template>
											</template>
										</div>
										<span  class="ant-select-arrow" style="user-select: none;">
											<i aria-label="icon: down" class="ant-select-arrow-icon anticon anticon-down">
												<svg viewBox="64 64 896 896" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
													<path
														d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
													</path>
												</svg>
											</i>
										</span>
									</div>
									<transition name="fade-in" mode="out-in">
										<div v-if="dropdown" class="ant-select-autopilot-dropdown" v-clickaway="hideDropdown">
											<a-checkbox-group class="ant-select-autopilot-dropdown-checkbox" v-model="filter.autopilot">
												<ul class="ant-select-dropdown-menu">
													<li v-for="(item,index) in autopilots" :key="`index_${index}`" class="ant-select-dropdown-menu-item">
														<a-checkbox :value="item.id">{{ item.title }}</a-checkbox>
													</li>
												</ul>
											</a-checkbox-group>
										</div>
									</transition>
								</div>
							</div>
							<div class="item-filter">
								<a-button type="primary" block @click="handleApply" :disabled="!filter.autopilot.length">
									Apply Filter
								</a-button>
							</div>
						</div>
					</transition>
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'ListAutopilotFilter',
	props:{
		socialAccounts: {
			type : Array,
		},
		value :{
			required: true
		}
	},
	data(){
		return {
			visible : false,
			filter :{
				day : 3,
				autopilot : []
			},
			is_loading : true,
			dropdown : false,
			autopilots: []
		}
	},
	computed:{
		social_id : function(){
			return this.$route.query && this.$route.query.hasOwnProperty('social_id') ? this.$route.query.social_id : this.socialAccounts.first().id 
		},
		all_autopilot :function(){
			return this.filter.autopilot.length == this.autopilots.length
		}
	},
	methods:{
		...mapActions({
			getAutopilot : 'autopilot/getAutopilotBySocialAccount'
		}),
		showDropdown(){
			this.dropdown = true 
		},
		hideDropdown(){
			this.dropdown = false
		},
		handleApply(){
			if( this.filter.autopilot.length ){
				this.$emit('input' , {
					day : this.filter.day,
					autopilot : this.filter.autopilot,
					all_autopilot : this.all_autopilot
				})
				this.visible = false
				this.$emit('on-apply')
			}
		},
		visibleChange(payload){
			this.filter = JSON.parse(JSON.stringify(this.value))
			if( this.is_loading ){
				this.getAutopilot({ id : this.social_id }).then((res)=>{
					let { status = false , data = []} = res.data 
					if( status ){
						this.autopilots = data 
						this.filter.autopilot = data.map((item)=>item.id)
						this.filter.day = 3
						this.$emit('input' , {
							day : this.filter.day,
							autopilot : this.filter.autopilot,
							all_autopilot : this.all_autopilot
						})
					}else{
						this.autopilots = []
					}
					this.is_loading = false
				})
				.catch(()=>{
					this.is_loading = false
				})
			}
		}
	},
	beforeDestroy(){
		this.$emit('input' , {
			day : 3,
			autopilot : [],
			all_autopilot : true,
		})
	}
}
</script>
<style lang="scss">
	.vue-list-autopilot-filter{
		.btn-trigger{
			&.ant-dropdown-open{
				color: $primary-color;
				border-color: $primary-color;
			}
		}
		&-menu{
			width: 315px;
			border-radius: 4px;
			padding: 0;
			padding: 24px;
			box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
			&-item{
				padding: 0;
				background: #fff;
				&:hover,&:focus{
					background: #fff;
				}
				.item-filter{
					display: block;
					margin-top: 16px;
					&-loading{
						height: 180px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					&:first-child{
						margin-top: 0;
					}
					&-label{
						display: block;
						font-weight: 600;
						margin-bottom: 5px;
					}
					.ant-select{
						width: 100%;
					}
					.ant-select-autopilot{
						&-dropdown{
							position: absolute;
							top: 100%;
							left: 0;
							right: 0;
							background: #fff;
							max-height: 250px;
							margin-bottom: 0;
							padding-left: 0;
							overflow: auto;
							list-style: none;
							outline: none;
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
							z-index: 1050;
							user-select: none;
							&-checkbox{
								display: block;
								width: 100%;
								.ant-checkbox-wrapper{
									display: block;
								}
							}
						}
					}
				}
			}
		}
	}
</style>