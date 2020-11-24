<template>
	<div class="vue-social-account">
		<div class="vue-social-account-info">
			<div class="vue-social-account-icon">
				<img v-if="account.social_type == 'facebook' || account.social_type == 'facebook_fbe'" src="@shop/assets/icons/icon-facebook-account.svg" alt="" />
				<img v-else-if="account.social_type == 'google'" src="@shop/assets/icons/icon-google-account.svg" alt="" />
			</div>
			<div class="vue-social-account-content">
				<template v-if="account.social_type == 'google'">
					<div class="vue-social-account-email">
						{{ account.email }}
					</div>
					<div class="vue-social-account-id">{{ account.center_id }} - {{ getCountryName(account.target_market) }}</div>
				</template>
				<template v-else-if="account.social_type == 'facebook' || account.social_type == 'facebook_fbe'">
					<div class="vue-social-account-email">
						{{ account.name }}
					</div>
					<div class="vue-social-account-id">
						{{ account.center_id }}
					</div>
				</template>
			</div>
		</div>
		<div class="vue-social-account-action">
			<template v-if="account.social_type == 'google'">
				<a target="_blank" :href="`https://merchants.google.com/mc/items?a=${account.center_id}`">Open merchant</a>
			</template>
			<template v-else-if="account.social_type == 'facebook'">
				<a target="_blank" :href="`https://business.facebook.com/products/catalogs/${account.center_id}/products`">Open catalog</a>
			</template>
			<template v-else-if="account.social_type == 'facebook_fbe'">
				<a @click="visible = true"> Enable Shop </a>
			</template>
		</div>
		<template v-if="account.social_type == 'facebook_fbe'">
			<a-modal class="btn-modal-enable-facebook-fbe modal-enable-fbe-feed" centered width="500px" v-model="visible" :footer="false">
				<div class="d-flex flex-column">
					<div class="d-flex align-items-center">
						<div class="fb-logo m-r-5"><sh-icon style="font-size: 12px" :icon="['fab', 'facebook-f']" /></div>
						<div class="txt-enable">Enable Page Shop and Commerce Manager</div>
					</div>
					<div class="box-enable m-t-20">
						<div class="d-flex">
							<img width="86" height="80" src="@shop/assets/images/computer.png" alt="" />
							<div class="m-l-20">
								<div class="txt-settings">Commerce Manager</div>
								<p>Create and manage the new <b>Facebook Shop</b> in Commerce Manager</p>
								<a-button @click="handleOpenLinkCommercial" class="m-r-20" type="primary">Enable Commerce</a-button>
							</div>
						</div>
					</div>
					<div class="box-enable m-t-20">
						<div class="d-flex">
							<img width="67" height="80" src="@shop/assets/images/cellphone.png" alt="" />
							<div class="m-l-40">
								<div class="txt-settings">Page Shop</div>
								<p>A modal will show up after you click <b>"Enable Page Shop"</b>, please choose <b>"Add"</b> on <b>“Page Shop”</b> section to activate.</p>
								<a-button @click="handleOpenLink" class="m-r-20 btn-enable-facebook-fbe" type="primary">Enable Page Shop</a-button>
							</div>
						</div>
					</div>
				</div>
			</a-modal>
		</template>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	export default {
		name: "SocailAccount",
		props: {
			account: {
				type: Object,
			},
		},
		data(){
			return {
				visible : false,
			}
		},
		computed: {
			...mapGetters({
				countries: "auth/getCountry",
			}),
		},
		methods: {
			getCountryName(id) {
				var item = _.find(this.countries, { code: id });
				if (item) {
					return item.name;
				}
				return id;
			},
			handleOpenLinkCommercial() {
				window.open(`https://www.facebook.com/commerce_manager/?source=CATALOG_MANAGER_LANDING_PAGE`, '_blank', 'menubar=1,resizable=1,width=900,height=500')
			},
			handleOpenLink() {
				window.open(`https://www.facebook.com/facebook_business_extension?app_id=${this.account.app_id}&external_business_id=${this.account.fbe_ids.external_business_id}`,'_blank','menubar=1,resizable=1,width=900,height=500')
			},
		},
	};
</script>

<style lang="scss" scoped>
	.vue-social-account {
		width: 450px;
		display: flex;
		align-items: center;
		background: #ffffff;
		padding: 8px;
		border: 1px solid #e2e2e2;
		box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.03);
		border-radius: 6px;
		&-info {
			@include col;
			min-width: 0;
			display: flex;
			align-items: center;
		}
		&-content {
			padding-left: 12px;
		}
		&-email {
			color: #252627;
			font-style: normal;
			font-weight: 600;
		}
		&-id {
			font-size: 12px;
			color: #828282;
		}
		&-action {
			@include flex(150px);
			text-align: right;
		}
	}
</style>
<style lang="scss">
	.modal-enable-fbe-feed {
		.txt-enable {
			font-weight: 600;
			font-size: 18px;
		}
		.do-later {
			color: $dark-gray2;
			font-weight: 600;
			font-size: 14px;
			text-decoration: underline;
		}
		.box-enable {
			background: #f0f4ff;
			border-radius: 6px;
			padding: 20px;
			cursor: pointer;
			.txt-settings {
				color: #677b8c;
				font-weight: bold;
				font-size: 20px;
			}
			&:hover {
				background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.96) 100%), $primary-color;
				box-shadow: 0px 4px 10px rgba(46, 91, 189, 0.15);
			}
		}
		.fb-logo {
			background-color: $facebook;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			color: white;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border: 1px solid white;
		}
		.ant-modal-body {
			background: $base-color1;
			border-radius: 6px;
		}
	}
</style>
