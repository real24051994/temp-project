<template>
	<div class="vue-create-feed-info">
		<h5>
			Feed Name
		</h5>
		<p>
			Labelling your feeds enables you to distinguish between the multiple feeds you have submitted to a particular Channel.
		</p>
		<div class="feed-form-group" :class="{'feed-form-group-error' : validate.name.$invalid && formstate }"> 
			<a-input placeholder="Enter your feed name" v-model="form.name"  :maxLength="150"/>
			<div class="feed-form-group-info">
				<transition name="fade-in" mode="out-in">
					<div class="text-danger" v-if="validate.name.$invalid && formstate">
						This field is required 
					</div>
				</transition>
				<div class="spacer"></div>
				<small>{{form.name.length}}/150</small>
			</div>
		</div>
		<template v-if="socialType == 'google'">
			<div class="feed-form-group m-t-5" :class="{'feed-form-group-error' : validate.center_id.$invalid && formstate }">
				<label>Google Merchant ID</label>
				<a-select v-model="form.center_id" placeholder="Choose your Google Merchant ID">
					<a-select-option v-for="(item,index) in merchants" :key="`index_${index}`"  :value="item">
						{{ item }}
					</a-select-option>
				</a-select>
				<transition name="fade-in" mode="out-in">
					<div class="feed-form-group-info text-danger" v-if="validate.center_id.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
			<div class="feed-form-group m-t-15" :class="{'feed-form-group-error' : validate.target_market.$invalid && formstate }">
				<label>Target Market</label>
				<a-select v-model="form.target_market" @change="onChangeMarket" placeholder="Choose your Target Market" showSearch optionFilterProp="children" :filterOption="filterOptions" >
					<a-select-option v-for="(item,index) in countries" :key="`index_${index}`"  :value="item.code">
						{{ item.name  }}
					</a-select-option>
				</a-select>
				<transition name="fade-in" mode="out-in">
					<div class="feed-form-group-info text-danger" v-if="validate.target_market.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
			<div class="feed-form-group m-t-15" :class="{'feed-form-group-error' : validate.content_language.$invalid && formstate }">
				<label>Language</label>
				<a-select v-model="form.content_language" placeholder="Choose your Language" >
					<a-select-option :value="item.code" v-for="item in getLanguages" :key="item.code">{{ item.name }}</a-select-option>
				</a-select>
				<transition name="fade-in" mode="out-in">
					<div class="feed-form-group-info text-danger" v-if="validate.content_language.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
		</template>
		<template v-if="socialType == 'facebook'">
			<div class="feed-form-group m-t-5" :class="{'feed-form-group-error' : validate.account_center_id.$invalid && formstate }">
				<label>Facebook Business Account</label>
				<a-select v-model="form.account_center_id" @change="onChangeBusinessAccount" placeholder="Choose your Business Account">
					<a-select-option v-for="(item,index) in businesses" :key="`index_${index}`"  :value="item.id">
						{{ item.name }}
					</a-select-option>
				</a-select>
				<transition name="fade-in" mode="out-in">
					<div class="feed-form-group-info text-danger" v-if="validate.account_center_id.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
			<div class="feed-form-group m-t-15" :class="{'feed-form-group-error' : validate.center_id.$invalid && formstate }">
				<label>Catalog ID</label>
				<a-select v-model="form.center_id" @change="onChangeCatalog" placeholder="Choose your Business Account">
					<a-select-option v-for="(item,index) in categories" :key="`index_${index}`"  :value="item.id">
						{{ item.name }}
					</a-select-option>
				</a-select>
				<transition name="fade-in" mode="out-in">
					<div class="feed-form-group-info text-danger" v-if="validate.center_id.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
		</template>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'CreateFeedInfo',
	props :{
		value :{
			type : Object,
			required: true,
		},
		socialType : {
			type : String,
			default : 'google',
		},
		merchants  : {
			type : Array,
			default : ()=>[]
		},
		businesses :{
			type : Array,
			default : ()=>[]
		},
		validate : {
			type : Object,
			required: true,
		},
		formstate :{
			type : Boolean,
		}
	},
	data(){
		return {

		}
	},
	computed:{
		...mapGetters({
			countries: 'auth/getCountry',
      		languages: 'auth/getLanguages',
		}),
		form : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		getLanguages() {
			let rs = this.languages.filter((item) => item.code === this.form.target_market)
			if (rs && rs.length > 0) {
				return rs[0].languages
			}
			return []
		},
		categories() {
			if (this.businesses.length > 0) {
				let business = this.businesses.find((item) => item.id === this.form.account_center_id)
				if (business && business.catalogs && business.catalogs.length > 0) {
					return business.catalogs
				}
			}
			return []
		},
	},
	methods : {
		filterOptions(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
		},
		onChangeMarket(value){
			let rs = this.languages.filter((item) => item.code === value).map((item)=>item.code)
			if( rs.indexOf(this.form.content_language) == -1 ){
				this.form.content_language = undefined
			}
		},
		onChangeBusinessAccount(value){
			let business = this.businesses.find((item) => item.id == value)
			if (business && business.catalogs && business.catalogs.length > 0) {
				this.form.account_center_name = business.name
				var ids = business.catalogs.map((item)=>item.id)
				if( ids.indexOf(this.form.center_id) == -1  ){
					this.form.center_id = undefined
					this.form.center_name = ''
				}
			}else{
				this.form.center_id = undefined
				this.form.center_name = ''
			}
		},
		onChangeCatalog(value){
			var item = this.categories.find((item)=>item.id == value )
			if( item ){
				this.form.center_name = item.name
			}else{
				this.form.center_name = ''
			}
		}
	},
}
</script>
<style lang="scss">
	.vue-create-feed-info{
		padding: 16px 24px;
	}
</style>