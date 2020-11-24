<template>
	<div class="item-utm">
		<div class="item-utm-checkbox">
			<a-switch id="enable_shoten_link" v-model="item.utm_status" :disabled="disabled" />
		</div>
		<div class="item-utm-social">
			<div class="item-social-account" >
				<div class="item-social-account-media">
					<div class="item-social-account-media-avatar">
						<img v-if="item.account.avatar" :src="item.account.avatar" alt="">
						<img v-else src="@/assets/icons/user.png" alt="">
					</div>
					<div class="item-social-account-media-social item-social" :class="`social-${item.account.social_type}`"></div>
				</div>
				<div class="item-social-account-title">
					<div  v-line-clamp:20="2" >{{ item.account.name }}</div>
				</div>
			</div>
		</div>
		<div class="item-utm-tag">
			<div class="item-utm-tag-label">UTM</div>
			<div class="item-utm-tag-url">
				<template v-if="data.utm_tag">
					<a-popover :title="false" placement="bottom" >
						<template slot="content">
							<div class="item-utm-tag-url-popover">
								{{data.utm_tag}}
							</div>
						</template>
						<div  v-line-clamp:20="2">{{ data.utm_tag }}</div>
					</a-popover>
				</template>
				<template v-else>
					N/A
				</template>
			</div>
		</div>
		<div class="item-utm-action">
			<a class="btn-edit" @click="onClick" :disabled="disabled">
				<template v-if="data.utm_tag">
					Edit UTM
				</template>
				<template  v-else>
					<i class="m-r-8" ><sh-icon :icon="['far','plus']" /></i>Assign UTM
				</template>
			</a>
		</div>
	</div>
</template>
<script>
export default {
	name : 'VueSettingUtmItem',
	props:{
		data : {
			type : Object,
			required : true
		},
		disabled : {
			type : Boolean,
			default : false,
		}
	},
	computed:{
		item :{
			get(){
				return this.data 
			},
			set(value){
				this.$emit('update:data', value)
			}
		},
	},
	methods:{
		onClick( ){
			let { social_account_id , social_type } = this.data 
			this.$emit('on-click-item', { social_account_id : this.data.social_account_id , social_type : this.data.account.social_type })
		}
	},
}
</script>
<style lang="scss" scoped>
	.item-utm{
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		padding: 5px 0;
		border-bottom: 1px solid $border-color;
		&:first-child{
			border-top: 1px solid $border-color;
		}
		&-checkbox{
			@include flex(80px);
			padding: 0 16px;
			.ant-switch{
				min-width: 40px;
			}
		}
		&-social{
			@include flex(200px);
			padding: 0 16px;
		}
		&-tag{
			@include col;
			padding: 0 16px;
			display: flex;
			align-items: center;
			&-label{
				background: #CECECE;
				border-radius: 5px;
				color: #fff;
				text-align: center;
				padding: 2px 0;
				font-size: 12px;
				margin-right: 15px;
				font-weight: 600;
				@include flex(40px)
			}
			&-url{
				word-break: break-all;
				&-popover{
					max-width: 400px;
					word-break: break-all;
				}
			}
		}
		&-action{
			@include flex(140px);
			padding: 0 16px;
			text-align: right;
			a{
				cursor: pointer;
				user-select: none;
			}
			.btn{
				&-create{
					color: $text;
				}
				&-edit{
					color: $primary-color;
				}
			}
		}
	}
</style>