<template>
	<div class="social-post-static">
		<div class="post-static-row">
			<label>Publish Time</label>
			<div class="post-static-time" v-html="mixinFormatDateUTCtoTimezone(timeOn , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
		</div>
		<hr>
		<div class="post-static-loading" v-if="is_loading" key="is-loading">
			<a-spin>
				<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
			</a-spin>
		</div>
		<div v-else key="loading-success">
			<template v-if="is_loading_error">
				Something went wrong ! Please try again
			</template>
			<template v-else>
				<template v-if="socialType == 'facebook'">
					<div class="post-static-row m-b-8">
						<span class="post-static-number">
							{{ data.total }}
						</span>
						<span class="post-static-text m-l-5">
							Engage
						</span>
					</div>
					<div class="post-static-block-wrap">
						<div class="post-static-block">
							<div class="post-static-block-content">
								<div class="post-static-block-icon">
									<sh-icon icon="thumbs-up" />
								</div>
								<div class="post-static-block-number">
									{{ data.likes }}
								</div>
								<div class="post-static-block-text">
									Likes
								</div>
							</div>
						</div>
						<div class="post-static-block">
							<div class="post-static-block-content">
								<div class="post-static-block-icon">
									<sh-icon icon="comment" />
								</div>
								<div class="post-static-block-number">
									{{ data.comments }}
								</div>
								<div class="post-static-block-text">
									Comments
								</div>
							</div>
						</div>
						<div class="post-static-block">
							<div class="post-static-block-content">
								<div class="post-static-block-icon">
									<sh-icon icon="share-square" />
								</div>
								<div class="post-static-block-number">
									{{ data.shares }}
								</div>
								<div class="post-static-block-text">
									Shares
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="socialType == 'twitter'">
					<div class="post-static-row m-b-8">
						<label>Engagement</label>
					</div>
					<div class="post-static-block-wrap">
						<div class="post-static-block">
							<div class="post-static-block-content">
								<div class="post-static-block-icon">
									<sh-icon icon="heart" />
								</div>
								<div class="post-static-block-number">
									{{ data.favorites }}
								</div>
								<div class="post-static-block-text">
									Likes
								</div>
							</div>
						</div>
						<div class="post-static-block">
							<div class="post-static-block-content">
								<div class="post-static-block-icon">
									<sh-icon icon="retweet" />
								</div>
								<div class="post-static-block-number">
									{{ data.retweets }}
								</div>
								<div class="post-static-block-text">
									Retweet
								</div>
							</div>
						</div>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'SocialPostStatic',
	mixins : [mixin_time_format],
	props:{
		value :{
			// type : String,
			required : true 
		},
		timeOn : {
			type : String,
			// default : ''
		},
		socialType : {
			type : String,
		}
	},
	data(){
		return {
			is_loading : true,
			is_loading_error: false,
			data : {
				total : 0,
				likes : 0,
				comments: 0,
				shares: 0,
				favorites: 0,
				retweets: 0,
			},
			show_static: true,
		}
	},
	computed:{
		// publish_on(){
		// 	var date = moment(this.timeOn)
		// 	return `<strong>${date.format('hh:mm A')}</strong><span class="m-l-8">${date.format('DD/MM/YYYY')}</span>`
		// }
	},
	methods:{
		...mapActions({
			getPostStatic : 'post/getPostStatic'
		})
	},
	created(){
		this.is_loading = true
		if( this.show_static  ){
			if( this.value ){
				this.getPostStatic({ id : this.value}).then((res)=>{
					let { status = false  , data } = res.data 
					if( status ){
						if( data ){
							this.data = data 
						}else{
							this.is_loading_error = true
						}
					}
					this.is_loading = false
				})
				.catch((err)=>{
					this.is_loading_error = true
					this.is_loading = false
				})
			}else{
				this.is_loading = false
			}
			
		}else{
			this.is_loading = false
		}
	}
}
</script>
<style lang="scss" >
	.social-post-static{
		padding: 0 24px;
		.post-static{
			&-loading{
				height: 300px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&-incomming{
				i{
					font-size: 30px;
				}
				p{
					font-size: 14px;
				}
			}
			&-time{
				background: #F3F3F3;
				border: 1px solid $border-color;
				border-radius: 4px;
				min-height: 32px;
				padding: 6px 18px;
				display: inline-flex;
				align-items: center;
				margin-left: 16px;
				font-size: 14px;
				strong{
					font-weight: 600;
					margin-right: 5px;
				}
			}
			&-number{
				font-weight: 600;
				font-size: 24px;
			}
			&-label{
				font-size: 16px;
				color: #A5A5A5;
			}
			&-block{
				width: 140px;
				height: 120px;
				padding: 16px;
				background: #F7F9FF;
				position: relative;
				text-align: center;
				display: inline-flex;
				align-items: center;
				&-wrap{
					display: flex;
					flex-wrap: wrap;
				}
				&-content{
					width: 100%;
				}
				&-number{
					font-weight: 600;
					font-size: 24px;
				}
				&-text{
					font-weight: normal;
					font-size: 14px;
				}
				&-icon{
					width: 34px;
					height: 34px;
					border-radius: 50%;
					overflow: hidden;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					font-size: 16px;
					background-color: rgba(64, 128, 255,0.1);
					color: $primary-color;
				}
				~ .post-static-block{
					&:before{
						content: '';
						position: absolute;
						top: 16px;
						bottom: 16px;
						left: 0;
						width: 1px;
						background: #E6EEFF;
					}
				}
			}
		}
		hr{
			margin: 16px 0;
		}
		label{
			font-size: 14px;
			font-weight: 600;
		}
	}
</style>