<template>
	<div class="vue-create-feed-channel">
		<h5>
			Connected Channel
		</h5>
		<template v-if="channel">
			<div v-if="channel.social_type == 'google'" class="vue-create-feed-channel-google">
				<div class="vue-create-feed-channel-google-info">
					<div class="channel-info channel-info-google">
						<div class="channel-info-avatar">
							<div class="channel-info-avatar-circle">
								<img :src="channel.avatar" alt="">
							</div>
							<div class="channel-info-social">
								<img src="@shop/assets/icons/icon-google.svg" svg-inline alt="">
							</div>
						</div>
						<div class="channel-info-content">
							<div class="channel-info-email">
								{{ channel.email }}
							</div>
							<div class="channel-info-status">
								<div class="text-success" v-if="channel.status">
									<sh-icon :icon="['far','check']" /> Connected
								</div>
								<div class="text-danger" v-else>
									<sh-icon :icon="['far','check']" /> Error
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="vue-create-feed-channel-google-action">
					<a-button block @click="visible = true">
						Change Account
					</a-button>
				</div>
			</div>
			<div v-else-if="channel.social_type == 'facebook'" class="vue-create-feed-channel-facebook">
				<div class="vue-create-feed-channel-facebook-info">
					<div class="channel-info channel-info-facebook">
						<div class="channel-info-avatar">
							<div class="channel-info-avatar-circle">
								<img :src="channel.avatar" alt="">
							</div>
							<div class="channel-info-social">
								<img src="@shop/assets/icons/icon-facebook.svg" svg-inline alt="">
							</div>
						</div>
						<div class="channel-info-content">
							<div class="channel-info-name">
								{{ channel.name }}
							</div>
							<div class="channel-info-status">
								<div class="text-success" v-if="channel.status">
									<sh-icon :icon="['far','check']" /> Connected
								</div>
								<div class="text-danger" v-else>
									<sh-icon :icon="['far','check']" /> Error
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="vue-create-feed-channel-facebook-action">
					<a-button block @click="visible = true">
						Change Account
					</a-button>
				</div>
			</div>
			<div v-else-if="channel.social_type == 'facebook_fbe'" class="vue-create-feed-channel-facebook-fbe">
				<div class="vue-create-feed-channel-facebook-fbe-info">
					<div class="channel-info channel-info-facebook-fbe">
						<div class="channel-info-avatar">
							<div class="channel-info-avatar-circle">
								<img :src="channel.avatar" alt="">
							</div>
							<div class="channel-info-social">
								<img src="@shop/assets/icons/icon-facebook-fbe.svg" svg-inline alt="">
							</div>
						</div>
						<div class="channel-info-content">
							<div class="channel-info-name">
								{{ channel.name }}
							</div>
							<div class="channel-info-status">
								<div class="text-success" v-if="channel.status">
									<sh-icon :icon="['far','check']" /> Connected
								</div>
								<div class="text-danger" v-else>
									<sh-icon :icon="['far','check']" /> Error
								</div>
							</div>
						</div>
					</div>
					<div class="m-t-15">
						<a-button @click="visible = true">
							Change Account
						</a-button>
					</div>
					
				</div>
				<div class="vue-create-feed-channel-facebook-fbe-action" v-if="channel.fbe_ids">
					<div class="item-facebook-action">
						<label>Facebook Business</label>
						<div class="spacer"></div>
						<strong>
							{{ channel.fbe_ids.business ? channel.fbe_ids.business.name : '' }}
						</strong>
					</div>
					<div class="item-facebook-action">
						<label>Catalog</label>
						<div class="spacer"></div>
						<strong>
							{{ channel.fbe_ids.catalog ? channel.fbe_ids.catalog.name : '' }}
						</strong>
					</div>
				</div>
			</div>
		</template>
		<ModalAddFeedTemplate v-if="visible" :visible.sync="visible" @success="onLoginSuccess" />
	</div>
</template>
<script>
import ModalAddFeedTemplate from '../add-feed/modal-add-feed-template'
export default {
	name : 'VueCreateFeedChannel',
	components:{
		ModalAddFeedTemplate
	},
	props :{
		value :{
			required : true ,
			type : Object
		},
	},
	data(){
		return {
			visible : false,
		}
	},
	computed :{ 
		channel : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods : {
		onLoginSuccess(payload){
			var channel = payload.hasOwnProperty('social_type') ?  { accountInfo : payload } : payload
			this.$emit('on-change-channel' , channel)
		}
	}
}
</script>
<style lang="scss">
	.vue-create-feed-channel{
		padding: 16px 24px;
		.channel-info{
			display: flex;
			flex-wrap: nowrap;
			&-avatar{
				position: relative;
				@include flex(34px);
				&-circle{
					border-radius: 50%;
					width: 34px;
					height: 34px;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #E2E2E2;
				}
				img{
					max-width: 100%;
					max-height: 100%;
				}
			}
			&-social{
				position: absolute;
				bottom: 0;
				right: 0;
				z-index: 1;
				width:20px;
				height:20px;
				transform: translate(2px,2px);
			}
			&-content{
				@include col;
				min-width: 0;
				padding: 0 15px;
			}
			&-email {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: block;
				width:100%;
			}
			&-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: block;
				width:100%;
				font-weight: 600;
			}
			&-status{
				font-size: 12px;
			}
			&-facebook-fbe{
				display: flex;
				align-items: center;
				background: #F7F8FA;
				border: 1px solid #F3F3F3;
				border-radius: 4px;
				min-height: 70px;
				padding:  0 15px;
			}
		}
		&-facebook,&-google{
			width : 490px;
			display: flex;
			align-items: center;
			background: #F7F8FA;
			border: 1px solid #F3F3F3;
			border-radius: 4px;
			min-height: 70px;
			padding:  0 15px;
			&-info{
				@include col;
				min-width: 0;
				
			}	
			&-action{
				@include flex(140px);
			}
		}
		&-facebook-fbe{
			width : 100%;
			display: flex;
			&-info{
				@include flex(300px);
			}
			&-action{
				@include col;
				min-width: 0;
				padding-left: 30px;
				.item-facebook-action{
					display: flex;
					align-items: center;
					border-bottom: 1px dashed #CECECE;
					padding-bottom: 10px;
					margin-bottom: 10px;
					label{
						font-style: normal;
						font-weight: 600;
						font-size: 14px;
					}
					strong{
						font-weight: normal;
						color:#5B86E5;
					}
				}
			}
		}
	}
</style>