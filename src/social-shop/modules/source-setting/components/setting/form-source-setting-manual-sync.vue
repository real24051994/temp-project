<template>
	<div class="form-source-setting-item">
		<div class="form-source-setting-item-label">
			<h4>
				Manually Sync Meta Fields
			</h4>
			<p class="m-b-0">
				By clicking this button, system will manual sync meta fields.
			</p>
		</div>
		<div class="form-source-setting-item-content">
			<div class="form-source-setting-item-card">
				<div class="form-source-setting-item-card-body">
					<div class="item-source-setting-manual-sync">
						<div class="item-source-setting-manual-sync-content">
							<p>
								Whenever you update meta fields values (like SEO Title, SEO Description, Custom Labels, Age Group and others), Shopify does not notify us of the change. But you can sync them from here by pressing this button.
							</p>
						</div>
						<div class="spacer"></div>
						<div class="item-source-setting-manual-sync-btn">
							<a-button v-if="is_loading_status" block type="link" :disabled="true" :loading="true">
								Syncing...
							</a-button>
							<a-button v-else type="link" block :disabled="is_loading" :loading="is_loading" @click="reSync()">
								<span class="m-r-8">
									<sh-icon :icon="['far','sync-alt']" />
								</span>
								Resycn Metafields
							</a-button>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name : 'SourceSyncManual',
	components : {

	},
	props :{
		loading :{
			type : Boolean,
		},
		sourceId :{
			type : [String, Number]
		}
	},
	data(){
		return {
			is_loading : false
		}
	},
	computed:{
		is_loading_status :{
			get(){
				return this.loading 
			},
			set(value){
				this.$emit('update:loading', value)
			}
		}
	},
	methods :{
		...mapActions({
			'reSyncMetafields' : 'source-setting/reSyncMetafields'
		}),
		reSync(){
			if( this.is_loading ) return 
			this.reSyncMetafields({ shop_id : this.sourceId }).then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.is_loading = false 
					this.is_loading_status = true
					this.$emit('set-reload-timeout')
				}
			})
			.catch(err=>{
				this.is_loading = false 
			})
		}
	}
}
</script>

<style lang="scss">
	.item-source-setting-manual-sync{
		display: flex;
		align-items: center;
		&-content{
			padding-right: 30px;
		}
		&-btn{
			@include flex(180px);
		}
		.ant-btn-link{
			border-color: $primary-color;
		}
	}
</style>