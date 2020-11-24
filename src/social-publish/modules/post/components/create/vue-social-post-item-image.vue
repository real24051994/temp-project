<template>
	<div class="item-image"  :class="{ 'item-image-invalid' : (validate.$invalid  || image.is_error) && !is_loading , 'is-loading' : is_loading }">
		<div class="item-image-preview">
			<img :src="image.src" alt="">
		</div>
		<template v-if="is_loading">
			<div class="item-image-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
		</template>
		<template v-else>
			<template v-if="image.is_error">
				<div class="item-image-action">
					<a @click="removeImage()">
						<sh-icon :icon="['fal','times']" />
					</a>
				</div>
				<div class="item-image-error-icon" >
					<sh-icon :icon="['far','exclamation-circle']" />
				</div>
			</template>
			<template v-else>
				<div class="item-image-action">
					<a @click="removeImage()">
						<sh-icon :icon="['fal','times']" />
					</a>
				</div>
				<div class="item-image-error-icon" v-if="validate.$invalid">
					<sh-icon :icon="['far','exclamation-circle']" />
				</div>
			</template>
		</template>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'VueSocialPostItemImage',
	props:{
		value : {
			type : Object,
			required : true,
		},
		validate :{
			type : Object,
			required : true,
		}
	},
	data(){
		return {
			is_loading : true ,
		}
	},
	computed:{
		image :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		...mapActions({
			upload : 'image/create'
		}),
		handleUpload(){
			var formdata = new FormData
			formdata.append('media_binaries', this.image.file)
			this.is_loading = true 
			this.upload({ 
				data : formdata 
			}).then((res)=>{
				let { status = false  , data } = res.data 
				if( status ){
					let { id, width , height, ratio, extension , url} = data
					this.image.id = id
					this.image.width = width
					this.image.height = height
					this.image.ratio = ratio
					this.image.extension = extension
					this.image.type = 'id'
					this.image.src = url
					this.image.is_error = false
					this.image.is_complete = true
				}else{
					this.image.is_error = true
					this.image.is_complete = false
				}
				this.is_loading = false
			})
			.catch((err)=>{
				this.image.is_error = true
				this.is_loading = false
			})
		},
		removeImage(){
			this.$emit('on-remove')
		}
	},
	created(){
		if( this.image.type == 'file' ){
			this.handleUpload()
		}else{
			this.is_loading = false
		}
	}
}
</script>