<template>
	<a-modal transitionName="none" maskTransitionName="none" :footer="false" :title="false" v-model="visible" :closable="false"  >
		<div class="modal-reconnect-error">
			<div class="modal-reconnect-error-header">
				<div  class="item-social-account">
					<div  class="item-social-account-media">
						<div  class="item-social-account-media-avatar">
							<img  :src="social.avatar" alt="">
						</div>
						<div  class="item-social-account-media-social item-social" :class="`social-${social.social_type}`"></div>
					</div>
				</div>
			</div>
			<div class="modal-reconnect-error-body">
				<h3>{{ $t('account.error.reconnect.title') }}</h3>
				<p v-html="$t('account.error.reconnect.content')">
					
				</p>
			</div>
			<div class="modal-reconnect-error-footer">
				<a-button type="primary"   @click="visible = false">
					{{ $t('account.btn.close_modal_reconnect') }}
				</a-button>
			</div>
		</div>
	</a-modal>
</template>
<script>
export default {
	name  : 'VueReconnectSocialError',
	props:{
		value :{
			type : Boolean,
		},
		social : {
			type : Object
		}
	},
	data(){
		return {

		}
	},
	computed:{
		visible :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.modal-reconnect-error{
		padding: 24px 0;
		.item-social-account{
			justify-content: center;
			height: 50px;
			.item-social-account-media{
				max-width: 55px;
				&-avatar{
					width: 50px;
					height: 50px;
					img{
						width: 100%;
					}
				}
				&-social{
					top: auto;
					left: auto;
					bottom : 0;
					right : 0;
				}
			}
		}
		&-header{
			margin-bottom: 15px;
		}
		&-body{
			text-align: center;
			margin-bottom: 30px;
			h3{
				font-weight: 600;
				font-size: 20px;
				line-height: 24px;
			}
			p{
				font-weight: normal;
				font-size: 14px;
				line-height: 17px;
			}
		}
		&-footer{
			text-align: center;
			.ant-btn{
				min-width :280px;
			}
		}
	}
</style>