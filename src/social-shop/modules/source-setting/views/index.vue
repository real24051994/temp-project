<template>
	<transition name="fade-in" mode="out-in">
		<div class="source-setting-page" v-if="is_loading_page" key="is_loading_page">
			<div class="source-setting-page-header d-flex align-items-center">
				<a-skeleton   active :avatar="false" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>
			<div class="source-setting-page-body">
				<div class="source-setting-page-body-loading">
					<a-skeleton class="m-b-10" v-for="item in 5" :key="`item_${item}`" active :avatar="false" :title="false" :paragraph="{ rows: 3 , width : '100%' }"></a-skeleton>
				</div>
			</div>
		</div>
		<div class="source-setting-page" v-else key="loaded-page">
			<template v-if="is_loading_error">
				<vue-error type="500"></vue-error>
			</template>
			<template v-else>
				<div class="source-setting-page-header">
					<div class="source-setting-page-title">
						<h1>{{ form.account.domain}}</h1>
					</div>
					<div class="source-setting-page-tab">
						<div class="vue-list-tabs">
							<router-link class="item-tab" v-for="(item,index) in tabs" :key="`tab_${index}`" :to="{ name : item.route }"
								:class="{ 'is-actived' : activeRouterLinkTab(item.route)}">
								{{ item.text }}
							</router-link>
						</div>
					</div>
				</div>
				<div class="source-setting-page-body">
					<transition name="fade-in" mode="out-in">
						<router-view v-model="form"  :source-id="shop.id" :loading.sync="sync_status" @set-reload-timeout="setSyncStatus" />
					</transition>
				</div>
			</template>
		</div>
	</transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name : 'SourceSetting',
	metaInfo(){
		return {
			title : 'Sources Management'
		}
	},
	data(){
		return {
			is_loading_page : true,
			is_loading_error : false,
			timeout : null,
			tabs :  [
				{
					route : 'SourceSetting',
					text : 'Sync Setting'
				},
				{
					route : 'SourceMapping',
					text : 'Mapping'
				}
			],
			form : {
				"account": {},
				"source_filter" : {},
				"schedules" : {},
				"source_setting" : {},
				"sync" : {}
			},
			sync_status : {
				is_sync_metafields : false, 
				is_sync_products : false,
			}
		}
	},
	computed : {
		...mapGetters({
			shop : 'auth/getShop'
		})
	},
	methods :{
		...mapActions({
			getSourceSetting : 'source-setting/getSourceSetting'
		}),
		activeRouterLinkTab(value) {
			return  this.$route.name == value
		},
		mergeDefaultData(data){
			let { account , schedules , source_filter , source_setting  , sync } = data
			let {  use_seo = true , use_seo_description = true , include_variant = 'all_variant' , import_unpublished , compare_at_price  } = source_setting
			let { auto_refresh_at , auto_refresh_period , schedule , timezone = null } = schedules
			let { collections ,  exclude_product_ids , exclude_product_ids_status ,  exclude_rules , exclude_rules_status , type_get_product , mapping_operator , mapping_rule , products_filter } = source_filter
			let { is_sync_metafields = false , is_sync_products = false} = sync
			var time = moment(auto_refresh_at , 'HH:mm')
			if ( time.isValid() ){
				auto_refresh_at = time.format('HH:mm')
			}else{
				auto_refresh_at = '00:00'
			}
			let auto_refresh_period_hourly = undefined 
			let auto_refresh_period_weekly = undefined 
			if( schedule == 'hourly' ){
				auto_refresh_period_hourly = auto_refresh_period
			}else if( schedule == 'weekly' ){
				auto_refresh_period_weekly = auto_refresh_period
			}
			this.form.account = account 
			this.form.schedules = {
				schedule ,
				auto_refresh_at , 
				auto_refresh_period_hourly , 
				auto_refresh_period_weekly,
				timezone :  timezone  == null ? undefined : timezone,
			} 
			this.sync_status = {
				is_sync_metafields,
				is_sync_products
			}
			
			var compute_rules  = {}
			for (const key in mapping_rule) {
				if (mapping_rule.hasOwnProperty(key)) {
					const element = mapping_rule[key];
					compute_rules[key] = mapping_rule[key].map(item=>{
						return {
							id : item ,
							name : mapping_operator.hasOwnProperty(item) ? mapping_operator[item] : item 
						}
					})
				}
			}
			this.form.source_filter = {
				collections ,  exclude_product_ids , exclude_product_ids_status ,  exclude_rules , exclude_rules_status , type_get_product , products_filter,
				mapping_rule : compute_rules
			}
			this.form.source_setting = {
				use_seo , use_seo_description  , include_variant , import_unpublished , compare_at_price
			}
			if( is_sync_metafields == true || is_sync_products == true ){
				this.setSyncStatus()
			}
		},
		setSyncStatus(){
			if( this.timeout ){
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(() => {
				this.getSourceSetting({ shop_id : this.shop.id }).then((res)=>{
					var sync_success =  false
					let { status = false , data } = res.data 
					if( status && data ){
						let { sync } = data
						if( sync && sync.hasOwnProperty('is_sync_metafields') && sync.hasOwnProperty('is_sync_products')){
							this.sync_status.is_sync_metafields = sync.is_sync_metafields
							this.sync_status.is_sync_products = sync.is_sync_products
							if( sync.is_sync_metafields == false && sync.is_sync_products == false){
								sync_success = true 
							}
						}
					}
					if( !sync_success  ){
						this.setSyncStatus()
					}
				})	
				.catch((err)=>{
					console.log(err);
					this.setSyncStatus()
				})
			}, 10000);
		}
	},
	created(){
		this.getSourceSetting({ shop_id : this.shop.id }).then((res)=>{
			console.log(res);
			let { status = false , data } = res.data 
			if( status && data ){
				this.mergeDefaultData(data)
			}else{
				this.is_loading_error = true
			}
			this.is_loading_page = false 
		})	
		.catch((err)=>{
			console.log(err);
			this.is_loading_page = false 
			this.is_loading_error = true
		})
	},
	beforeDestroy(){
		if( this.timeout ){
			clearTimeout(this.timeout)
		}
	}
	
}
</script>

<style lang="scss">
	.source-setting-page{
		&-header{
			height: 86px;
			background: #ffffff;
			border-bottom: 1px solid  $light-gray2;
			padding: 0 24px;
		}
		&-title{
			height: 46px;
			display: flex;
			align-items: flex-end;
			h1{
				margin: 0;
				font-style: normal;
				font-weight: 600;
				font-size: 20px;
			}
		}
		&-tab{
			height: 40px;
		}
		&-body{
			&-loading{
				width: 1100px;
				margin: 0 auto;
				padding: 30px 0;
			}
		}
	}
</style>