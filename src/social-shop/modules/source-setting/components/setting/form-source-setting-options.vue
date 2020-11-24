<template>
	<div class="form-source-setting-item">
		<div class="form-source-setting-item-label" v-if="showLabel">
			<h4>
				Source Settings
			</h4>
			<p>
				Set your how your product source is synced to our system.
			</p>
		</div>
		<div class="form-source-setting-item-content">
			<div class="form-source-setting-item-card">
				<div class="form-source-setting-item-card-body p-0">
					<div class="list-source-setting-options">
						<div class="item-source-option">
							<div class="item-source-option-label">
								Product Title Preference
							</div>
							<div class="spacer"></div>
							<div class="item-source-option-value">
								<a-radio-group v-model="form.use_seo">
									<a-radio :value="false">
										Use default title
									</a-radio>
									<a-radio :value="true">
										Use from SEO
									</a-radio>
								</a-radio-group>
							</div>
						</div>
						<div class="item-source-option">
							<div class="item-source-option-label">
								Product Descriptions Preference
							</div>
							<div class="spacer"></div>
							<div class="item-source-option-value">
								<a-radio-group v-model="form.use_seo_description">
									<a-radio :value="false">
										Use default descriptions
									</a-radio>
									<a-radio :value="true">
										Use SEO descriptions
									</a-radio>
								</a-radio-group>
							</div>
						</div>
						<div class="item-source-option">
							<div class="item-source-option-label">
								Include variants
							</div>
							<div class="spacer"></div>
							<div class="item-source-option-value">
								<a-radio-group v-model="form.include_variant">
									<a-radio value="all_variant">
										All variants
									</a-radio>
									<a-radio value="first_variant">
										First variant
									</a-radio>
								</a-radio-group>
							</div>
						</div>
						<div class="item-source-option">
							<div class="item-source-option-label">
								Hidden Product
							</div>
							<div class="spacer"></div>
							<div class="item-source-option-value">
								<label for="item-source-option-import-unpublished" class="m-r-8">
									Import unpublish product
								</label>
								<a-switch id="item-source-option-import-unpublished" v-model="form.import_unpublished" />
							</div>
						</div>
						<div class="item-source-option">
							<div class="item-source-option-label">
								Price Setting
								<a-popover :title="false">
									<template slot="content">
										<div class="form-source-setting-popover">
											<p>
												<strong class="m-r-4">If you enable</strong> this setting, our app will sync both the Price and Compare At Price and upload them to Google Merchant Center/Facebook Catalog.
											</p>
											<p class="m-b-0">
												<strong class="m-r-4">If you disable</strong> this setting, our app will only sync the Price and upload it to Google Merchant Center/Facebook Catalog.
											</p>
										</div>
									</template>
									<span class="m-l-8 text-primary"><sh-icon :icon="['far','question-circle']" /></span>
								</a-popover>
							</div>
							<div class="spacer"></div>
							<div class="item-source-option-value">
								<label for="item-source-option-import-unpublished" class="m-r-8">
									Import Compare at price
								</label>
								<a-switch id="item-source-option-import-unpublished" v-model="form.compare_at_price" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name : 'SourceOptions',
	components : {

	},
	props :{
		value :{
			type : Object,
		},
		showLabel : {
			type : Boolean,
			default : true
		}
	},
	data(){
		return {
			visible : false,
		}
	},
	computed:{
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{

	}
}
</script>

<style lang="scss">
	.list-source-setting-options{
		.item-source-option{
			min-height: 60px;
			display: flex;
			align-items: center;
			padding: 0 24px;
			border-top: 1px solid $border-color;
			&:first-child{
				border-top: none;
			}
			&-label{
				font-weight: 500;
			}
			&-value{
				display: inline-flex;
				.ant-radio-wrapper{
					font-weight: 500;
					color: $dark-gray1;
				}
				label{
					color: $dark-gray3;
				}
			}
		}
	}
</style>