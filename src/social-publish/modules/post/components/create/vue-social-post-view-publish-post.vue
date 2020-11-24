<template>
	<div class="modal-post-body modal-post-publish">
		<div class="modal-post-body-mask" v-if="loading.is_disabled"></div>
		<div class="modal-post-publish-left">
			<div class="modal-post-content-preview">
				<social-post-preview :default-tab="defaultTabView" :show-header="false" :data="form" :meta="meta" :accounts="socials" :preview-socials="previewSocial" :socials="selectedSocial"  mode="published" :validate="validate"/>
			</div>
		</div>
		<div class="modal-post-publish-right">
			<div class="modal-post-publish-header">
				<div class="modal-post-header-title">
					{{ $t('post.modal.title.detail_post') }}
				</div>
			</div>
			<div class="modal-post-publish-body">
				<social-post-static v-model="value.id" :time-on="form.time_on" :social-type="defaultTabView" />
			</div>
			<div class="modal-post-publish-footer">
				<a-button class="modal-post-btn-delete" data-type="published"  type="outline-danger" @click="onDelete()">
					{{ $t('post.modal.btn.delete') }}
				</a-button>
				<div class="spacer"></div>
				<a-button class="modal-post-btn-duplicate" data-type="published" @click="onDuplicate()" :loading="loading.is_loading_duplicate">
					{{ $t('post.modal.btn.duplicate') }}
				</a-button>
				<a-button class="modal-post-btn-view m-l-16" data-type="published" :href="postLink" target="_blank"  >
					{{ $t('post.modal.btn.view_post') }}
				</a-button> 
			</div>
		</div>
	</div>
</template>
<script>
import SocialPostPreview from './vue-social-post-preview'
import SocialPostStatic from './vue-social-post-static'
export default {
	name : 'SocialPostViewPublish',
	components:{
		SocialPostPreview,
		SocialPostStatic
	},
	props:{
		value : {
			type : Object,
			required : true,
		},
		postId : {
			required : true
		},
		postLink :{
			type : String,
			required : true
		},
		defaultTabView :{
			type : String,
			default : 'facebok'
		},
		meta :{
			type : Object,
			required : true,
		},
		socials:{
			type : Array,
			required : true,
		},
		selectedSocial:{
			type : Array,
			required : true,
		},
		previewSocial:{
			type : Array,
			required : true,
		},
		validate :{
			type : Object,
			required : true,
		},
		loading:{
			type : Object,
			required : true,
		},
	},
	data(){
		return {

		}
	},
	computed:{
		form :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input',value)
			}
		}
	},
	methods :{
		onDelete(){
			this.$emit('on-delete')
		},
		onDuplicate(){
			this.$emit('on-duplicate')
		}
	}
}
</script>