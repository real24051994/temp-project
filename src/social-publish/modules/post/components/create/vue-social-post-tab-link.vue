<template>
	<div class="social-post-tab social-post-tab-link">
		<textarea @keydown.enter="onEnter($event)"  placeholder="Paste URL" type="text" resize="none" :disabled="loading" v-model.trim.lazy="url" class="ant-input" ></textarea>
		<div class="social-post-tab-link-loading" v-if="loading">
			<a-spin>
				<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
			</a-spin>
		</div>
		<template v-if="!loading && url">
			<div class="m-t-10">
				<div class="text-danger" v-if="!success">
					<i class="m-r-5"><sh-icon :icon="['far','exclamation-circle']" /></i>{{ $t('post.modal.component.link.not_found') }}
				</div>
				<div class="text-success" v-else>
					<i class="m-r-5"><sh-icon :icon="['far','check']"/></i>{{ $t('post.modal.component.link.get_success') }}
				</div>
			</div>
		</template>
	</div>
</template>
<script>
export default {
	name : 'TabLink',
	props:{
		value :{
			type : String,
			required : true,
		},
		preview : {
			type : Object,
			required: true,
		},
		loading:{
			type : Boolean,
			default : false,
		},
		success : {
			type : Boolean,
			default : false,
		}
	},
	data : ()=>({

	}),
	computed:{
		url : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		preview_link :{
			get(){
				return this.preview 
			},
			set(value){
				this.$emit('update:preview', value)
			}
		}
	},
	methods:{
		onEnter(event){
			event.preventDefault()
			event.target.blur()
		},
	}
}
</script>
<style lang="scss" scoped>
	
	.social-post-tab-link{
		position: relative;
		&-loading{
			background: rgba(255,255,255, 0.5);
			z-index: 1;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		textarea {
			height: 70px;
			resize: none;
		}
	}
</style>