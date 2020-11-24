<template>
<transition name="fade-in" mode="out-in">
	<div class="create-new-feed" v-if="is_loading_page" key="is-loading-page">
		<div class="create-new-feed-body">
			<div class="create-new-feed-body-container">
				<div class="list-create-new-feed-blocks">
					<div class="item-feed-block">
						<div class="item-feed-block-content">
							<div class="item-feed-block-wrap p-t-15 p-r-15 p-l-15">
								<a-skeleton   active :avatar="false" :title="false" :paragraph="{ rows: 5 , width : '100%' }"></a-skeleton>
							</div>
						</div>
					</div>
					<div class="item-feed-block">
						<div class="item-feed-block-content">
							<div class="item-feed-block-wrap p-t-15 p-r-15 p-l-15">
								<a-skeleton   active :avatar="false" :title="false" :paragraph="{ rows: 5 , width : '100%' }"></a-skeleton>
							</div>
						</div>
					</div>
					<div class="item-feed-block">
						<div class="item-feed-block-content">
							<div class="item-feed-block-wrap p-t-15 p-r-15 p-l-15">
								<a-skeleton   active :avatar="false" :title="false" :paragraph="{ rows: 5 , width : '100%' }"></a-skeleton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="create-new-feed" v-else key="loaded-page">
		<template v-if="is_loading_error">
			<div class="create-new-few-error">
				<vue-error type="500"></vue-error>
			</div>
		</template>
		<template v-else>
			<div class="create-new-feed-header">
				<div class="create-new-feed-header-container">
					<h1>Create feed</h1>
				</div>
			</div>
			<div class="create-new-feed-body">
				<div class="create-new-feed-body-container">
					<h4>Follow the steps below to create your feed.</h4>
					<div class="list-create-new-feed-blocks">
						<div class="item-feed-block">
							<div class="item-feed-block-aside">
								<template v-if="!this.$v.form.channel.$invalid">
									<div class="item-feed-block-aside-icon is-success">
										<sh-icon :icon="['far','check']" />
									</div>
								</template>
								<template v-else>
									<div class="item-feed-block-aside-icon">
										<sh-icon :icon="['far','pen']" />
									</div>
								</template>
							</div>
							<div class="item-feed-block-content">
								<div class="item-feed-block-wrap">
									<vue-create-feed-channel v-model="form.channel"   @on-change-channel="onChangeChannel"/>
								</div>
							</div>
						</div>
						<div class="item-feed-block">
							<div class="item-feed-block-aside">
								<template v-if="!this.$v.form.info.$invalid">
									<div class="item-feed-block-aside-icon is-success">
										<sh-icon :icon="['far','check']" />
									</div>
								</template>
								<template v-else>
									<div class="item-feed-block-aside-icon">
										<sh-icon :icon="['far','pen']" />
									</div>
								</template>
							</div>
							<div class="item-feed-block-content">
								<div class="item-feed-block-wrap">
									<vue-create-feed-info v-model="form.info" :validate="$v.form.info" :social-type="form.channel.social_type" :businesses="businesses" :merchants="merchants" :formstate="formstate" />
								</div>
							</div>
						</div>
						<div class="item-feed-block">
							<div class="item-feed-block-aside">
								<template v-if="!this.$v.form.shop_ids.$invalid && !this.$v.form.includes.$invalid ">
									<div class="item-feed-block-aside-icon is-success">
										<sh-icon :icon="['far','check']" />
									</div>
								</template>
								<template v-else>
									<div class="item-feed-block-aside-icon">
										<sh-icon :icon="['far','pen']" />
									</div>
								</template>
							</div>
							<div class="item-feed-block-content">
								<div class="item-feed-block-wrap">
									<vue-create-feed-source :validate="$v.form.shop_ids" :formstate="formstate" :sources="product_sources" v-model="form.shop_ids" />
									<hr>
									<vue-create-feed-rule  :validate="$v.form.includes" :formstate="formstate" :status.sync="form.includes_status" :product-filters="products_filter" :mapping-rules="mapping_rule" v-model="form.includes" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="create-new-feed-footer">
				<div class="create-new-feed-header-container">
					<div class="spacer"></div>
					<a-button class="m-r-16" @click="discard" :disabled="is_loading">
						Cancel
					</a-button>
					<a-button type="primary" @click="onSubmit" :disabled="is_loading" :loading="is_loading">
						Create Feed
					</a-button>
				</div>
			</div>
		</template>
	</div>
</transition>

</template>

<script>
import VueCreateFeedChannel from '../components/create-feed/vue-create-feed-channel'
import VueCreateFeedInfo from '../components/create-feed/vue-create-feed-info'
import VueCreateFeedSource from '../components/create-feed/vue-create-feed-source'
import VueCreateFeedRule from '../components/create-feed/vue-create-feed-rule'

import cookie from 'js-cookie'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
	export default {
		name: "CreateFeed",
		metaInfo: {
			title: "Create Feed"
		},
		props :{
			channel  : {
				
			}
		},
		components:{
			VueCreateFeedChannel,
			VueCreateFeedInfo,
			VueCreateFeedSource,
			VueCreateFeedRule
		},
		data() {
			return {
				is_loading_page : true,
				is_loading_error : false,
				is_loading : false,
				is_modify : false, 
				businesses : [],
				merchants : [],
				product_sources: [],
				products_filter : null,
				mapping_rule : null,
				form : {
					"channel" : null,
					"info" : {
						"name" : "",
						"target_market" : undefined,
						"content_language" : undefined,
						"account_center_id" : undefined,
						"account_center_name" :"",
						"center_id": undefined,
						"center_name": "",
					},
					"shop_ids" : [],
					"includes_status": false,
					"includes" :  [
						[
							{
								"key": undefined ,
								"operator": undefined,
								"value":""
							}
						]
					]
				},
				formstate : false,
				data : null ,
				disabled_operators: ['is_empty' ,'is_not_empty']
			};
		},
		computed :{
			...mapGetters({
				countries: 'auth/getCountry',
				shop: 'auth/getShop',
				user: 'auth/getUser',
				is_logged : 'auth/getLogged',
			}),
		},
		methods : {
			...mapActions({
				getProductSources : 'feed/getProductSources',
				createFeed : 'feed/addFeedTemplate'
			}),
			loadDefault(){
				return new Promise((resolve, reject) => {
					this.getProductSources({
						user_id : this.user.id
					})
					.then((res)=>{
						let { status = false , data  } = res.data 
						if( status ){
							let { products_count = [] , products_filter = null , mapping_rule = null  , mapping_operator = null} = data 
							this.product_sources = products_count
							this.products_filter = products_filter
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
							this.mapping_rule = compute_rules
						}
						resolve()
					})
					.catch((err)=>{
						reject(err)
					})
				});
			},
			setCookieUser(payload){
				cookie.set('ssh_create_feed_channel' , JSON.stringify(payload) , {
					expires: 1/24 ,
				})
			},
			getCookieUser(){
				var channel = cookie.get('ssh_create_feed_channel') 
				return channel ? JSON.parse(channel) : undefined
			},
			removeCookieUser(){
				cookie.remove('ssh_create_feed_channel') 
			},
			onChangeChannel(payload){
				this.is_loading_page = true 
				this.setChannel(payload)
				this.is_loading_page = false
			},
			setCountryDefault(){
				var checkCountry = this.countries.map((item) => item.code)
				if (checkCountry.indexOf(this.shop.country_code) > -1) {
					return this.shop.country_code
				}
				return undefined
			},
			setChannel(payload){
				let { accountInfo , merchantIds = [] , businesses = [] } = payload 
				let { avatar , email , name , social_type , internal_id  , status  ,  fbe_ids = null  } = accountInfo
				var form  = {
					avatar , email , name , social_type , internal_id  , status 
				}
				if( social_type == 'google'){
					this.merchants = merchantIds
					this.form.info.target_market = this.setCountryDefault()
				}else if( social_type == 'facebook'){
					this.businesses = businesses
				}else if( social_type == 'facebook_fbe'){
					form['fbe_ids'] = fbe_ids
				}
				this.form.channel = form
			},
			getFormdata(){
				let { social_type , internal_id } = this.form.channel
				var form = {
					internal_id : internal_id,
					social_type : social_type,
					shop_ids  : this.form.shop_ids,
					name : this.form.info.name,
					includes_status : this.form.includes_status,
					includes : this.form.includes_status ?  this.form.includes  : [],
				}
				if( social_type == 'facebook'){
					form['account_center_id'] = this.form.info.account_center_id
					form['account_center_name'] = this.form.info.account_center_name
					form['center_id'] = this.form.info.center_id
					form['center_name'] = this.form.info.center_name
					form['target_market'] = 'fb'
					form['content_language'] =  'fb'
				}else if( social_type == 'facebook_fbe'){
					let { business , catalog } = this.form.channel.fbe_ids
					form['account_center_id'] = business.id 
					form['account_center_name'] = business.name
					form['center_id'] = catalog.id
					form['center_name'] = catalog.name
					form['target_market'] = 'fb'
					form['content_language'] =  'fb'
				}else if( social_type == 'google'){
					form['center_id'] = this.form.info.center_id
					form['target_market'] = this.form.info.target_market
					form['content_language'] =  this.form.info.content_language
				}
				return form 
			},
			onSubmit(){
				this.formstate = true 
				if( this.$v.form.$invalid || this.is_loading ) return  
				var formdata = this.getFormdata()
				this.is_loading = true 
				this.createFeed(formdata).then((res)=>{
					let { status = false , message = '' , data } = res.data 
					if( status  && data ){
						this.is_modify = false 
						this.removeCookieUser()
						this.toastSuccess({
							title : "Success",
							message: "Feed was created successfully!",
						})
						let { is_created , ss_feed } = data 
						let { id , social_type  } = ss_feed
						let { facebook = false  , facebook_fbe = false  , google  = false } = is_created
						let  createStatus = {
							modal_success : true ,
							modal_suggest_facebook : false,
						}
						if( social_type == 'google'){
							createStatus['modal_suggest_facebook'] = !facebook 
						}
						this.redirect({
							name : 'FeedDetail',
							params : {
								id , createStatus
							}
						})
					}else{
						this.toastError({
							title : 'Error',
							message: message,
						})
					}
					this.is_loading = false 
				})
				.catch((err)=>{
					this.toastError({
						title : 'Error',
						message: err,
					})
					this.is_loading = false 
				})
				
			},
			discard(){
				this.$confirm({
					title: "Discard Changes",
					content: "These changes won't be saved. Are you sure you want to leave this page?",
					okText: "Discard",
					cancelText: "Cancel",
					okType:'danger',
					zIndex : 10002,
					onOk : ()=>{
						this.is_modify = false 
						this.redirect({
							name : 'FeedCenter'
						})
					},
					onCancel :()=>{
						
					}
				})
			}
		},
		beforeRouteLeave (to, from, next) {
			if( this.is_modify  && this.is_logged  ){
				this.$confirm({
					title: "Discard Changes",
					content: "These changes won't be saved. Are you sure you want to leave this page?",
					okText: "Discard",
					cancelText: "Cancel",
					okType:'danger',
					zIndex : 10002,
					onOk : ()=>{
						this.removeCookieUser()
						next()
					},
					onCancel :()=>{
						
					}
				})
			}else{
				this.removeCookieUser()
				next()
			}
		},
		async created(){
			var channel =  undefined
			if( this.channel ){
				channel = this.channel 
				this.setCookieUser(this.channel)
			}else{
				channel = this.getCookieUser()
			}
			
			if( channel ){
				this.setChannel(channel)
			}else{
				this.redirect({
					name : 'FeedCenter'
				})
			}
			try {
				await this.loadDefault()
			} catch (error) {
				this.is_loading_error = true
			}
			this.is_modify = true
			this.is_loading_page = false 
		},
		validations(){
			var vm  = this 
			return {
				"form" : {
					"channel" : {
						required
					},
					"info" : {
						"name" : {
							required
						},
						"target_market" : {
							required : requiredIf( ()=> this.form.channel.social_type == 'google')
						},
						"content_language" : {
							required : requiredIf( ()=> this.form.channel.social_type == 'google')
						},
						"account_center_id" : {
							required : requiredIf( ()=> this.form.channel.social_type == 'facebook')
						},
						"account_center_name" : {

						},
						"center_id": {
							required : requiredIf( ()=> this.form.channel.social_type == 'facebook' || this.form.channel.social_type == 'google')
						},
						"center_name": {

						},
					},
					"shop_ids": {
						required
					},
					"includes" : {
						required : requiredIf( ()=> this.form.includes_status == true),
						$each: {
							required : requiredIf( ()=> this.form.includes_status == true),
							$each: {
								"key": {
									required : requiredIf( ()=> this.form.includes_status == true),
								},
								"operator": {
									required : requiredIf( ()=> this.form.includes_status == true),
								},
								"value": {
									required : requiredIf( (nested)=> this.form.includes_status == true && this.disabled_operators.indexOf(nested.operator) == -1 ),
								}
							}
						}
					}
				}
			}	
		}
	};
</script>

<style lang="scss">
	$create-feed-container-width : 900px;
	.create-new-feed{
		&-error{
			padding: 100px 0;
		}
		&-container{
			width: $create-feed-container-width;
			margin-left: auto;
			margin-right: auto;
		}
		&-header{
			border-bottom: 1px solid $border-color;
			background: #ffffff;
		}
		&-header,&-footer{
			&-container{
				display: flex;
				align-items: center;
				width: $create-feed-container-width;
				margin-left: auto;
				margin-right: auto;
				height: 64px;
				h1{
					margin: 0;
					font-size: 24px;
					font-weight: 600;
				}
				button{
					min-width: 140px;
				}
			}
		}
		&-body{
			padding: 24px 0;
			&-container{
				width: $create-feed-container-width;
				margin-left: auto;
				margin-right: auto;
				h4{
					font-style: normal;
					font-weight: 600;
					font-size: 16px;
					margin-bottom: 8px;
				}
				h5{
					font-style: normal;
					font-weight: 600;
					font-size: 16px;
					margin-bottom: 8px;
				}
				p{
					color : #828282;
					margin-bottom: 8px;
				}
				small {
					font-style: normal;
					font-weight: normal;
					font-size: 12px;
					color : #828282;
				}
			}
			.list-create-new-feed-blocks{
				overflow: hidden;
				position: relative;
				margin-top: 30px;
				.item-feed-block{
					position: relative;
					display: flex;
					&:last-child{
						margin-bottom: 0;
						.item-feed-block-content{
							padding-bottom: 0;
						}
					}
					&-aside{
						@include flex(48px);
						position: relative;
						&-icon{
							width: 26px;
							height: 26px;
							border-radius: 50%;
							border: 1px solid #828282;
							background: #ffffff;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-top: 12px;
							position: relative;
							z-index: 2;
							&.is-success{
								border-color: $primary-color;
								background: $primary-color;
								color: #fff;
							}
						}
						&:before{
							content: '';
							height: 100%;
							top: 38px;
							left: 13px;
							background: #CECECE;
							width: 1px;
							position: absolute;
							z-index: 1;
						}
					}
					&-content{
						@include col;
						padding-bottom: 30px;
					}
					&-wrap{
						min-height: 150px;
						background: #FFFFFF;
						border: 0.5px solid #E2E2E2;
						box-sizing: border-box;
						box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.03);
						border-radius: 3px;
						
					}
				}
			}
			.feed-form-group{
				max-width: 340px;
				label{
					font-style: normal;
					font-weight: 600;
					font-size: 14px;
					margin-bottom: 5px;
					display: inline-block;
				}
				&-info{
					display: flex;
					align-items:center;
					width: 100%;
					margin-top: 5px;
				}
				.ant-select{
					width: 100%;
				}
				small{
					min-width: 60px;
					display: block;
					text-align: right;
				}
				&-error{
					.ant-input{
						border-color: $danger-color;
					}
					.ant-select{
						.ant-select-selection{
							border-color: $danger-color;
						}
					}
				}
			}
		}
	}
</style>
