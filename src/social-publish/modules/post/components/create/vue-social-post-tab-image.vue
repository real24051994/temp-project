<template>
	<div class="social-post-tab social-post-tab-image">
		<div class="list-items-image">
			<template v-for="(item , index) in images">
				<vue-social-post-item-image v-model="images[index]" :validate="errors[index]" @on-remove="()=>removeImage(index)" :key="`index_${index}`" />
			</template>
			<label key="upload-item" v-if="images.length < config.max_file" class="item-image item-image-upload" @dragover.prevent @drop="dragDrop($event)">
				<input type="file" accept="image/*"  multiple="multiple" style="display: none;" @change="onFileChange"  >
				<div class="item-image-plus">
					<sh-icon :icon="['fal','plus']" />
				</div>
			</label>
		</div>
	</div>
</template>
<script>
import config from '../../config.js'
import { mapActions } from 'vuex'
import VueSocialPostItemImage from './vue-social-post-item-image'
export default {
	name : 'TabImages',
	components:{
		VueSocialPostItemImage
	},
	props:{
		value :{
			type : Array,
			required : true,
		},
		validate:{
			required :true,
		}
	},
	data: ()=>({
		config : config 
	}),
	computed:{
		images :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		errors(){
			return Object.values(this.validate.$each.$iter)
		},
	},
	methods:{
		onFileChange($event){
            var files = $event.target.files || $event.dataTransfer.files;
            this.getBase64(files).then((res)=>{
                if( res ){
					for (let i = 0; i < res.length; i++) {
						if( this.images.length < this.config.max_file){
							this.images.push(res[i])
                        }else{
							this.$message.error(this.$t('error.max_file_upload' , { max_file : 4}));
							break;
						}
					}
				}
				$($event.target).val('');
			})
			.catch(()=>{
				$($event.target).val('');
			})
			
        },
        dragDrop ($event) {
            event.stopPropagation();
            event.preventDefault();
            var files = $event.dataTransfer.files;
            this.getBase64(files).then((res)=>{
               if( res ){
					for (let i = 0; i < res.length; i++) {
						if( this.images.length < this.config.max_file){
							this.images.push(res[i])
                        }else{
							this.$message.error(this.$t('error.max_file_upload' , { max_file : 4}));
							break;
						}
					}
                }
            })
		},
		readFileData (file) {
			var vm = this;
			return new Promise((resolve , reject )=>{
				var reader = new FileReader();
				reader.onload = async  (e)=>{
					var file_extension =  file.name.replace(/^.*\./, '').toUpperCase()
					if( vm.config.file_extensions.indexOf(file_extension) == -1){
						this.toastError({
							title : this.$t('error.file_extension.title'),
							message : this.$t('error.file_extension.content' , { file_name : file.name }),
						})
						resolve(false)
					}
					if( file.size <= (config.max_size * 1024 * 1024) ){
						resolve({
							id : '',
							src : e.target.result,
							name: file.name,
							size: null,
							file : file,
							type : "file",
							extension : file.name.replace(/^.*\./, '') ,
							ratio: null,
							width : null,
							height: null,
							is_error : false,
							is_complete : false
						})
					}else{
						this.toastError({
							title : this.$t('error.file_size.title'),
							message : this.$t('error.file_size.content' , { file_name : file.name , max_size : config.max_size  }),
						})
						resolve(false)
					}
				};
				reader.onerror = (err)=>{
					reject()
				};
				reader.readAsDataURL(file);
			})
		},
		getBase64(files ){
			return new Promise( async(resolve)=>{
				var arr = [] 
				var max =  this.config.max_file - this.images.length 
				if (files.length) {
					for (let i = 0; i < files.length; i++) {
						if( arr.length < max ){
							var img = await this.readFileData(files[i])
							if( img ){
								arr.push(img)
							}
						}else{
							this.toastError({
								title : this.$t('error.max_file_upload.title'),
								message : this.$t('error.max_file_upload.content' , { max_file : 4 }),
							})
							break;
						}
					}
				};
				resolve(arr)
			})
		},
		removeImage(index){
			this.images.splice(index,1)
		}  
	},
	mounted(){

	}
}
</script>
<style lang="scss" >
	.social-post-tab-image{
		.list-items-image{
			.item-image{
				width: 96px;
				height: 96px;
				margin: 0 8px 8px 0;
				float: left;
				border-radius: 4px;
				border: 2px solid $border-color;
				overflow: hidden;
				position: relative;
				background-color: #fafafa;
				display: block;
				&-preview{
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #000;
				}
				img{
					max-height: 100%;
					max-width: 100%;
				}
				&-loading{
					position: absolute;
					height: 100%;
					width: 100%;
					left: 0;
					top: 0;
					background-color: rgba(0,0,0, 0.5);
					z-index: 4;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-action{
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: rgba(0, 0, 0, 0.5);
					opacity: 0;
					visibility: hidden;
					transition:  opacity 0.2s ease;
					z-index: 1;
					text-align: right;
					padding: 5px 10px;
					a{
						font-size: 20px;
						line-height: 20px;
						color: #fff;
						opacity: 0.5;
						&:hover{
							opacity: 1;
						}
					}
				}
				&-plus{
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32px;
					color: #7D7D7D;
				}
				&:hover:not(.is-loading){
					.item-image-action{
						opacity: 1;
						visibility: visible;
					}
				}
				&.item-image-upload{
					border: 1px dashed #CECECE;
					transition: all 0.2s ease;
					cursor: pointer;
					&:hover{
						border-color: $primary-color;
					}
					.item-image-error-icon{
						color: #fff;
						opacity: 0.5;
					}
				}
				.item-image-error-icon{
					position: absolute;
					top: 5px;
					left: 5px;
					z-index: 10;
					color: $danger;
					font-size: 20px;
					line-height: 20px;
				}
				&.item-image-invalid{
					border-color: $danger;
				}
			}
			&:after{
				@include clear;
			}
		}
		.ant-progress.ant-progress-circle {
			.ant-progress-text{
				color: #fff;
			}
		}
	}
</style>