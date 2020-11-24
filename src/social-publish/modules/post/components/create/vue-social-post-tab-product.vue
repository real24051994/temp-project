<template>
	<div class="social-post-tab social-post-tab-product">
		<transition name="fade" mode="out-in">
			<div  v-if="product"  key="is-has-product">
				<div class="item-product" @click="onBrowse">
					<div class="item-product-image" :style="{ 'background-image': 'url(' + product.main_image + ')' }"></div>
					<div class="item-product-content">
						<span v-line-clamp:20="2">{{ product.title }}</span>
					</div>
					<div class="item-product-action">
						<a @click.stop.prevent="clear">
							<sh-icon :icon="['far','times']" />
						</a>
					</div>
				</div>
				<div class="item-product-type">
					<h4>{{ $t('post.modal.component.select_product.sub_title') }}</h4>
					<a-radio-group v-model="sub_type">
						<a-radio value="link">{{ $t('post.modal.component.select_product.sub_title_link') }}</a-radio>
						<a-radio :disabled="product.images.length == 0" value="image">{{ $t('post.modal.component.select_product.sub_title_image') }}</a-radio>
					</a-radio-group>
					<transition name="fade-in" mode="out-in">
						<div class="m-t-10" v-if="!product.images.length" key="is-warning-product-empty">
							<div class="text-danger">
								<i class="m-r-8"><sh-icon :icon="['far','exclamation-circle']" /></i>This product don’t have any image
							</div>
						</div>
						<div class="m-t-10"  v-else-if="sub_type == 'image'" key="is-sub-type-image">
							<div class="m-b-10 text-selected">
								Show <span>{{ selected.length }}</span> image(s)
								<transition name="fade-in" mode="out-in">
									<a-popover v-if="selected.length == 4" :title="false" placement="bottom" >
										<template slot="content">
											Limited 4 images
										</template>
										<i class="text-primary">
											<sh-icon :icon="['far','info-circle']" />
										</i>
									</a-popover>
								</transition>
							</div> 
							<div class="list-items-image">
								<template v-for="(item , index) in product.images">
									<div class="item-image" :class="{'is-active' : isActive(item) }"  :key="`index${index}`" @click="onChoseImage(item)">
										<div class="item-image-preview">
											<img :src="item" alt="">
										</div>
										<div class="item-image-checked">	
											<sh-icon :icon="['far','check']" />
										</div>
									</div>
								</template>
							</div>
						</div>
					</transition>
				</div>
			</div>
			<div v-else>
				<a-button  @click="onBrowse">
					Select product
				</a-button>
			</div>
			<!-- <span v-else key="is-empty-product" class="m-b-12 ant-input-affix-wrapper ant-input-search" @click="onBrowse">
				<span class="ant-input-prefix">
					<sh-icon :icon="['far','search']" />
				</span>
				<input placeholder="Search Product" :readonly="true"  type="text" class="ant-input">
			</span> -->
		</transition>
		<social-post-list-product ref="ModalProduct" @on-select="onSelectProduct" />
	</div>
</template>
<script>
import mixin from '../../mixins'
import { mapActions } from 'vuex'
import SocialPostListProduct from './vue-social-post-list-product'
export default {
	name : 'TabProduct',
	mixins: [mixin],
	props:{
		value : {
			required : true 
		},
		product :{
			required : true 
		},
		subType :{
			type : String,
			required : true
		},
		preview : {
			type : [Object],
			required : true 
		},
		disabled :{
			type : Boolean,
			default : false,
		}
	},
	components:{
		SocialPostListProduct
	},
	data(){
		return {
			visible : false,
			is_loading : false,
			max_file_selected : 4,
		}
	},
	computed : {
		selected: {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		sub_type :{
			get(){
				return this.subType
			},
			set(value){
				this.$emit('update:subType', value)
			}
		},
		product_preview:{
			get(){
				return this.preview
			},
			set(value){
				this.$emit('update:preview', value)
			}
		},
	},
	methods:{
		...mapActions({
			getMetaFromUrl : 'utils/getMetaFromUrl',
		}),
		onPaste(event){
			var content = ''
			event.preventDefault();
			if( event.clipboardData ){
				content = event.clipboardData.getData('text/plain');
			}
			else if( window.clipboardData ){
				content = window.clipboardData.getData('Text');
			}
			if( content ){
				this.showModalProduct(content)
			}
		},
		onKeydown(event){
			let { key = '' , ctrlKey = false} = event
			this.$refs.input.blur()
			if( ctrlKey == false){
				this.showModalProduct(key)
				event.preventDefault()
			}
		},
		async onChoseImage(url){
			if( this.is_loading ) return
			this.is_loading = true 
			var index = _.findIndex( this.selected , { src : url })
			if( index >= 0){
				this.selected.splice(index,1)
			}else if( this.selected.length  < this.max_file_selected ){
				let img = await this.$helper.loadingImage(url)
				this.selected.push({
					"id" : this.$helper.createId(),
					"src": url,
					'name': '',
					'size': 0,
					'type': 'url',
					'extension' : '',
					'width' : img.width,
					'height': img.height,
					'ratio' : img.width / img.height ,
					'is_complete':true,
					"is_error" : false,
					"is_loading" : false,
				})
			}
			this.is_loading = false
			
		},
		isActive(url){
			var index  = _.findIndex( this.selected , { src : url }) 
			return index >= 0
		},
		async onSelectProduct(item){
			if( item.images.length ){
				let url = item.images.first()
				let img = await this.$helper.loadingImage(url)
				let selected = [{
					"id" : this.$helper.createId(),
					"src": url,
					'name': '',
					'size': 0,
					'type': 'url',
					'extension' : '',
					'width' : img.width,
					'height': img.height,
					'ratio' : img.width / img.height ,
					'is_complete':true,
					"is_error" : false,
					"is_loading" : false,
				}]
				this.selected = selected 
			}
			this.$emit('on-select', item)
		},
		showModalProduct(keyword){
			this.$refs.ModalProduct.showModal(keyword)
		},
		onBrowse(){
			this.showModalProduct('')
		},
		
		clear(){
			this.$emit('clear')
		},
	},
}
</script>
<style lang="scss" scoped>
	.social-post-tab-product{
		padding-bottom: 40px;
		.item-product{
			display: flex;
			border-radius: 4px;
			overflow: hidden;
			background: $light-gray5;
			border: 1px solid $light-gray5;
			margin-bottom: 16px;
			height: 64px;
			cursor: pointer;
			&-image{
				@include flex(64px);
				background-size: cover;
				background-position: center center;
				background-repeat: no-repeat;
			}
			&-content{
				@include col;
				padding: 8px 16px;
				display: flex;
				align-items: center;
				font-size: 13px;
				line-height: 17px;
			}
			&-action{
				@include flex(100px);
				display: flex;
				align-items: center;
				justify-content: center;
				a{
					height: 32px;
					width: 32px;
					display: inline-flex;
					align-items: center;
					justify-content: flex-end;
					color: $dark-gray1;
				}
			}
		}
		.item-product-type{
			user-select: none;
			h4{
				display: inline-block;
				font-weight: 600;
				margin: 0;
			}
			.ant-radio-group{
				margin-left: 15px;
				
				.ant-radio-wrapper{
					color: $text;
				}
			}
		}
		.text-selected{
			color: #4F4F4F;
			span{
				font-weight: 600;
			}
		}
		.list-items-image{
			.item-image{
				width: 64px;
				height: 64px;
				margin: 0 8px 8px 0;
				float: left;
				border-radius: 4px;
				border: 2px solid $border-color;
				overflow: hidden;
				position: relative;
				background-color: #fafafa;
				display: block;
				&.is-active{
					border-color: $primary-color;
					.item-image-checked{
						opacity: 1;
						visibility: visible;
					}
				}
				&-checked{
					position: absolute;
					top: 0;
					left: 0;
					width: 16px;
					height: 16px;
					background: $primary-color;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom-right-radius: 2px;
					opacity: 0;
					visibility: hidden;
				}
				&-preview{
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					background-image: url('~@publish/assets/icons/default.png');
					background-position: center center;
					background-size: cover;
					background-repeat: no-repeat;
				}
				img{
					max-height: 100%;
					max-width: 100%;
				}
				
			}
			&:after{
				@include clear;
			}
		}
		
	}
</style>