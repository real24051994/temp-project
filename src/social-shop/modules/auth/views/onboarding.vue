<template>
	<transition name="fade-in" mode="out-in">
		<div class="shop-boarding-page" v-if="is_loading_page" key="is-loading">
			loading
		</div>
		<div class="shop-boarding-page" v-else key="loaded">
			<template v-if="is_loading_error">
				<vue-error type="500"></vue-error>
			</template>
			<template v-else>
				<form-onboard  v-model="form" :source-id="shop.id" />
			</template>
		</div>
	</transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FormOnboard from '../components/form-onboard'
export default {
	name : 'Onboarding',
	components:{
		FormOnboard
	},
	data(){
		return {
			is_loading_page : true,
			is_loading_error : false,
			form : {
				"account": {},
				"source_filter" : {},
				"schedules" : {},
				"source_setting" : {},
			},
			sync_status : {
				is_sync_metafields : false, 
				is_sync_products : false,
			}
		}
	},
	computed :{
		...mapGetters({
			shop : 'auth/getShop'
		})
	},
	methods :{
		...mapActions({
			getSourceSetting : 'source-setting/getSourceSetting'
		}),
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
}
</script>

<style lang="scss">
	.shop-boarding-page{
		.form-onboard{
			&-header{
				height: 80px;
				&-tabs{
					display: flex;
					border: 1px solid $border-color;
					.item-tab{
						display: inline-flex;
						width: 33.33%;
						height: 40px;
						align-items: center;
						justify-content: center;
						background: #F1F4FC;
						cursor: pointer;
						color: $dark-gray2;
						font-weight: 500;
						strong{
							width: 18px;
							height: 18px;
							display: inline-flex;
							align-items: center;
							justify-content: center;
							border-radius: 50%;
							border: 1px solid $dark-gray2;
							font-weight: 600;
							font-size: 12px;
							margin-right: 8px;
						}
						&.is-active, &:hover{
							background: #ffffff;
						}
						&.is-active{
							color: $primary-color;
						}
					}
					.item-tab + .item-tab{
						border-left: 1px solid $border-color;
					}
				}
			}
			&-body{
				min-height: calc(100vh - 80px - 150px);
			}
			&-footer{
				height: 70px;
				display: flex;
				align-items: center;
				button{
					min-width: 140px;
				}
			}
			&-item{

			}
			&-card{

			}
			.form-source-setting-item{
				margin-left: -15px;
				margin-right: -15px;
				display: block;
				p{
					font-style: normal;
					font-weight: normal;
					font-size: 14px;
					color: #828282;
				}
				&-label{
					@include col;
					min-width: 0;
					padding: 0 15px;
					
				}
				&-content{
					padding: 0 15px;
				}
				&-card{
					background: #FFFFFF;
					border: 1px solid $border-color;
					box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.03);
					border-radius: 3px;
					overflow: hidden;
					h5{
						font-size: 14px;
						font-style: normal;
						font-weight: 600;
						margin: 0;
					}
					&-header{
						border-bottom: 1px solid $border-color;
						padding: 12px 24px;
					}
					&-body{
						padding:24px;
					}
				}
			}
		}
	}
</style>