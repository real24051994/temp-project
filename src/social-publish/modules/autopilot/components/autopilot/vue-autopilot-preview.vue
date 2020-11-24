<template>
	<div class="social-post-preview">
		<div class="social-post-preview-header">
			<div class="list-tabs">
				<div class="item-tab">
					<div :class="`item-social social-${social.social_type}`"></div>
				</div>
			</div>
		</div>
		<div v-if="is_loading" class="social-post-preview-body" key="loading">
			<div class="tab-pane">
				<div class="box-preview box-preview-facebook">
					<div class="box-preview-header">
						<div class="item-social-account m-t-16">
							<a-skeleton active :avatar="{ size : 38 , shape : 'circle'}"   :paragraph="false" />
						</div>
					</div>
					<div class="box-preview-body">
						<div class="box-preview-content m-t-16">
							<a-skeleton active :avatar="false"  :title="false" :paragraph="{ rows: 5 , width : '100%' }" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else key="is-loaded" class="social-post-preview-body">
			<vue-simple class="social-post-preview-scrollbar">
				<div >
					<div class="tab-pane" v-if="social && product">
						<transition name="fade-in" mode="out-in">
							<div v-if="social.social_type == 'facebook'" key="is-tab-facebook">
								<vue-autopilot-preview-facebook :account="social" :meta="meta.facebook" :sub-type="type" :images="selected" :message="content" />
							</div>
							<div v-else-if="social.social_type == 'twitter'" key="is-tab-twitter">
								<vue-autopilot-preview-twitter :account="social" :meta="meta.twitter" :sub-type="type" :images="selected" :message="content" />
							</div>
							<div v-else-if="social.social_type == 'instagram'" key="is-tab-twitter">
								<vue-autopilot-preview-instagram :account="social" :meta="meta.twitter" :sub-type="type" :images="selected" :message="content" />
							</div>
						</transition>
						<div class="box-preview-actions">
							{{ $t('autopilot.form.label.preview_product')}}
							<div class="spacer"></div>
							<a-button @click="handleChangeProduct()" id="btn-view-other-product-in-autopilot">
								<sh-icon :icon="['far','sync']" class="m-r-8" />{{ $t('autopilot.form.btn.view_other_product')}}
							</a-button>
						</div>
					</div>
					<div class="tab-pane" v-else key="tab-empty">
						<div class="empty-state">
							<h3>{{ $t('error.empty_preview.title') }}</h3>
							<template v-if="!social">
								<p>{{ $t('error.empty_preview.content') }}</p>
							</template>
							<template v-if="!product">
								<p>{{ $t('autopilot.form.state.empty_product_preview')}}</p>
							</template>
						</div>
					</div>
				</div>
			</vue-simple>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import VueAutopilotPreviewFacebook from "./vue-autopilot-preview-facebook";
import VueAutopilotPreviewTwitter from "./vue-autopilot-preview-twitter";
import VueAutopilotPreviewInstagram from "./vue-autopilot-preview-instagram";
import MergeImage from "../../utils/merege-image";
export default {
	name: "AutopilotPreview",
	components: {
		VueAutopilotPreviewFacebook,
		VueAutopilotPreviewTwitter,
		VueAutopilotPreviewInstagram
	},
	props: {
		autopilotType :{
			type : String,
			default : 'random'
		},
		social: {
			type : Object,
			required: true
		},
		message: {
			required: true
		},
		data: {
			type: Object,
			required: true
		},
		type: {
			type: String,
			default: "image"
		},
		collection: {
			type: Array,
			default: []
		},
		productType: {
			type: String,
			default: "all_product"
		},
		discount: {
			type: Object
		},
		logo: {
			type: Object
		},
	},
	data() {
		return {
			is_loading: true,
			is_loading_preview: false,
			is_change_image: false,
			is_change_image_timeout: null,
			product: null,
			selected: [],
			meta: null,
			main_image: null,
			discount_tag: [
				"DISCOUNT_CODE",
				"VALID_TIME",
				"DISCOUNT_PERCENTAGE"
			],
			rate_tag : {
				'REVIEW_RATING' : 5,
				'REVIEWER_NAME' : 'Peak Spirit',
				'REVIEW_BODY' : 'Helped loads sort out some issues and very patient. Really appreciate it, thank you so much. Cheers guys as they responded till the issue was resolved.',
				'REVIEW_RATING_ICON' : '⭐⭐⭐⭐⭐',
				'COUNTRY_REVIEWER' : 'US',
			},
			discount_code: this.generateDiscountCode(),
			timeout: null
		};
	},
	computed: {
		...mapGetters({
			shop: "auth/getShop"
		}),
		tab() {
			return this.social.social_type;
		},
		content() {
			return this.handleConvertProductTag(this.message);
		},
	},
	methods: {
		...mapActions({
			getMetaFromUrl: "utils/getMetaFromUrl",
			getRandomProduct: "utils/getRandomProduct"
		}),
		handleGetPreviewProduct(url) {
			return new Promise((resolve, reject) => {
				this.is_loading_preview = true
				this.handleGetWebsiteMeta(url)
					.then(res => {
						this.is_loading_preview = false
						resolve(res);
					})
					.catch(err => {
						this.is_loading_preview = false
						reject(err);
					})
			});
		},
		handleGetWebsiteMeta(url) {
			return new Promise((resolve, reject) => {
				var result = {
					facebook: {
						hostname: "",
						title: "",
						url: "",
						image: "",
						description: ""
					},
					twitter: {
						hostname: "",
						title: "",
						url: "",
						image: "",
						description: ""
					}
				};
				this.getMetaFromUrl({ url: url })
					.then(res => {
						let { status = false, data = [] } = res.data;
						if (status && data.length) {
							var facebook = data.filter(item => {
								return item.property.indexOf("og:") >= 0;
							});
							if (facebook.length) {
								let url = _.find(facebook, {
									property: "og:url"
								});
								if (url) {
									result.facebook.url = url.value;
								}
								let title = _.find(facebook, {
									property: "og:title"
								});
								if (title) {
									result.facebook.title = title.value;
								}
								let description = _.find(facebook, {
									property: "og:description"
								});
								if (description) {
									result.facebook.description =
										description.value;
								}
								let images_facebook = facebook
									.filter(item => item.property == "og:image")
									.map(item => item.value);
								result.facebook.image = images_facebook;
							}
							var twitter = data.filter(item => {
								return item.name.indexOf("twitter:") >= 0;
							});
							if (twitter.length) {
								let url = _.find(twitter, {
									name: "twitter:url"
								});
								if (url) {
									result.twitter.url = url.value;
								}
								let title = _.find(twitter, {
									name: "twitter:title"
								});
								if (title) {
									result.twitter.title = title.value;
								}
								let description = _.find(twitter, {
									name: "twitter:description"
								});
								if (description) {
									result.twitter.description =
										description.value;
								}
								let image = _.find(twitter, {
									name: "twitter:image"
								});
								if (image) {
									result.twitter.image = image.value;
								}
							} else if (facebook.length) {
								result.twitter.url = result.facebook.url;
								result.twitter.title = result.facebook.title;
								result.twitter.description =
									result.facebook.description;
								result.twitter.image = result.facebook.image
									.length
									? result.facebook.image[0]
									: "";
							}
							var hostname = this.$PublishHelper.extractHostname(
								url
							);
							result.facebook.hostname = hostname;
							result.twitter.hostname = hostname;
							resolve(result);
						} else {
							reject(result);
						}
					})
					.catch(err => {
						reject(result);
					});
			});
		},
		handleGetRandomProduct() {
			this.is_loading = true;
			this.getRandomProduct({
				select_product_options: this.productType,
				collections: this.collection.map(item => item.internal_id)
			})
			.then(async res => {
				let { status = false, data = null } = res.data;
				if (status) {
					var selected = [];
					if (data.main_image) {
						try {
							var main_image = await this.loadImage(
								data.main_image
							);
							this.main_image = {
								width: main_image.width,
								height: main_image.height,
								src: data.main_image
							};
							selected = await this.getProductImage();
						} catch (error) {}
					}
					var meta = {
						facebook: {
							hostname: "",
							title: "",
							url: "",
							image: "",
							description: ""
						},
						twitter: {
							hostname: "",
							title: "",
							url: "",
							image: "",
							description: ""
						}
					};
					try {
						meta = await this.handleGetPreviewProduct(
							`https://${this.shop.domain}/products/${data.handle}`
						);
					} catch (err) {}
					this.product = data;
					this.meta = meta;
					this.selected = selected;
				}
				this.is_loading = false;
			})
			.catch(err => {
				this.product = null;
				this.is_loading = false;
			})
		},
		handleChangeProduct() {
			if (!this.is_loading) {
				this.handleGetRandomProduct();
			}
		},
		handleConvertProductTag(content) {
			let text = content;
			text = text.replace(/{{(.*?)}}/gi, temp => {
				var tag = temp.replace("{{", "").replace("}}", "");
				if (
					this.product &&
					this.product.properties &&
					this.product.properties.hasOwnProperty(tag)
				) {
					tag = this.product.properties[tag];
				}
				if (this.discount_tag.indexOf(tag) >= 0) {
					switch (tag) {
						case "DISCOUNT_CODE":
							tag = this.discount.is_create_discount
								? this.discount_code
								: "";
							break;
						case "VALID_TIME":
							tag = this.discount.is_create_discount
								? this.discount.discount_limit_date
								: "";
							break;
						case "DISCOUNT_PERCENTAGE":
							tag = this.discount.is_create_discount
								? this.discount.discount_percent + "%"
								: "";
							break;
						default:
							break;
					}
				}
				if ( this.rate_tag.hasOwnProperty(tag) ) {
					tag = this.rate_tag[tag];
				}
				return tag;
			});
			return text;
		},
		generateDiscountCode() {
			var result = "";
			var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var charactersLength = characters.length;
			for (var i = 0; i < 6; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		},
		mergeImageDiscount(src, discount, logo) {
			return new Promise((resolve, reject) => {
				var image = new MergeImage({
					src,
					discount,
					logo
				});
				image
					.init()
					.then(res => {
						resolve(res);
					})
					.catch(err => {});
			});
		},
		loadImage(src) {
			var vm = this;
			return new Promise((resolve, reject) => {
				var img = new Image();
				img.crossOrigin = "Anonymous";
				img.src = src;
				img.onload = function(event) {
					resolve(img);
				};
				img.onerror = function(err) {
					reject(null);
				};
			});
		},
		loadImages(images) {
			return new Promise((resolve, reject) => {
				let promises = [];
				images.forEach(img => {
					promises.push(this.loadImage(img));
				});
				Promise.all(promises).then(results => {
					resolve(results);
				});
			});
		},
		getProductImage() {
			return new Promise(async (resolve, reject) => {
				if (this.main_image) {
					var object = {
						id: this.$helper.createId(),
						src: this.main_image.src,
						name: "",
						size: 0,
						type: "url",
						extension: "",
						width: this.main_image.width,
						height: this.main_image.height,
						ratio: this.main_image.width / this.main_image.height,
						is_error: false,
						is_loading: false
					};
					object["src"] = await this.mergeImageDiscount(
						this.main_image.src,
						this.discount,
						this.logo
					);
					resolve([object]);
				} else {
					resolve([]);
				}
			});
		},
		onChangeValue() {}
	},
	watch: {
		productType: function(value) {
			if (value == "all_product" || this.collection.length) {
				this.handleGetRandomProduct();
			} else {
				this.product = null;
			}
		},
		collection: function() {
			if (this.collection.length) {
				this.handleGetRandomProduct();
			} else {
				this.product = null;
			}
		},
		social: {
			handler: function() {
				this.is_loading = true;
				this.$nextTick(() => {
					this.is_loading = false;
				});
			},
			deep: true
		},
		"discount.discount_image": async function() {
			this.selected = await this.getProductImage();
		},
		"discount.discount_position": async function() {
			this.selected = await this.getProductImage();
		},
		"discount.discount_margin": async function() {
			this.selected = await this.getProductImage();
		},
		"logo.logo_media": async function() {
			this.selected = await this.getProductImage();
		},
		"logo.logo_position": async function() {
			this.selected = await this.getProductImage();
		},
		"logo.logo_margin": async function() {
			this.selected = await this.getProductImage();
		},
		"logo.logo_size": async function() {
			this.selected = await this.getProductImage();
		},
		"logo.logo_transparent": async function() {
			this.selected = await this.getProductImage();
		}
	},
	mounted() {
		this.is_loading = true;
		this.handleGetRandomProduct();
	}
};
</script>
<style lang="scss" scoped>
.social-post-preview {
	.social-post-preview-header {
		.list-tabs {
			border-bottom: none;
		}
	}
	.box-preview-loading {
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.box-preview-error {
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.box-preview {
		&-actions {
			margin-top: 16px;
			display: flex;
			align-items: center;
			font-size: 14px;
		}
	}
}
</style>