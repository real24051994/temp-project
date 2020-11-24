<template>
	<div class="social-publish-maintaince">
		<div class="container">
			<div class="row">
				<div class="col col-6 d-flex align-items-center">
					<div class="maintaince-wrap maintaince-wrap-image text-center">
						<div class="maintaince-image-bg m-b-20">
							<img src="../assets/bg.png" alt="">
							<div class="maintaince-image-icon">
								<div class="maintaince-image-icon-wrap">
									<div class="maintaince-image-icon-animation">
										<img svg-inline src="../assets/conf.svg" alt="">
									</div>
								</div>
							</div>
						</div>
						<div class="maintaince-time">
							<h3 class="m-b-10">Maintenance time</h3>
							<div class="maintaince-time-wrap">
								<strong>3</strong>
								<i>:</i>
								<strong>0</strong>
								<strong>0</strong>
								<i> - </i>
								<strong>5</strong>
								<i>:</i>
								<strong>0</strong>
								<strong>0</strong>
								<span>AM (UTC)</span>
							</div>
						</div>
					</div>
				</div>
				<div class="col col-6">
					<div class="maintaince-wrap maintaince-wrap-content">
						<div class="maintaince-logo m-b-24">
							<img svg-inline src="../assets/logo.svg" alt="">
						</div>
						<div class="maintaince-title m-b-20">
							A Brand New Socialhead app is buffering!
						</div>
						<div class="maintaince-content">
							<p>
								In this version, all 4 socialhead products will be united in 1 to bring you the best social selling app ever! 
							</p>
							<div class="maintaince-box m-b-10">
								<p class="maintaince-box-title">
									<strong>
										<sh-icon :icon="['far','star']" /> What’s new
									</strong>
								</p>
								<p>
									<strong>4  in 1</strong>
								</p>
								<p>
									Get all 4 apps in 1 for FREE
								</p>
								<p>
									<img svg-inline class="m-r-18" src="../assets/Socialpublish.svg" alt="">
									<img svg-inline class="m-r-18" src="../assets/Socialreply.svg" alt="">
									<img svg-inline class="m-r-18" src="../assets/Socialwidget.svg" alt="">
									<img svg-inline src="../assets/Socialshop.svg" alt="">
								</p>
								<p>
									<strong>New User Interface</strong>
								</p>
								<p>
									Simplified and seamless between 4 apps
								</p>
								<p>
									<strong>Instagram widget</strong>
								</p>
								<p>
									Custom position
								</p>
							</div>
							<p>
								Should you have any question or issue, please contact us at: 
								<a href="mailto:support@socialhead.io">support@socialhead.io</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name : 'Maintain',
	metaInfo(){
		return {
			title: 'Maintenance'
		}
	},
}
</script>
<style lang="scss" scoped>
	.social-publish-maintaince{
		padding: 100px 0;
		color:  $text;
		.maintaince{
			&-image{
				
				&-bg{
					position: relative;
					img{
						max-width: 100%;
					}
				}
				&-icon{
					position: absolute;
					top: 8.85%;
					right: 12.07%;
					width: 16.42%;
					z-index: 1;
					&-wrap{
						position: relative;
						padding-bottom: 100%;
					}
					&-animation{
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						padding: 10px;
						border-radius: 50%;
						border: 3px solid #ffffff;
						background: #E1F1FF;
						background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%), #E1F1FF;
						display: flex;
						align-items: center;
						justify-content: center;
						svg{
							width: 100%;
							height: auto;
							animation: antRotate 1.5s linear infinite;
							transform-origin: center center;
						}
					}
				}
			}
			&-time{
				h3{
					font-weight: 600;
					font-size: 16px;
					line-height: 19px;
				}
				&-wrap{
					color: #333842;
					span{
						font-weight: normal;
						font-size: 14px;
						line-height: 17px;
						margin-left: 8px;
					}
					strong{
						font-style: normal;
						font-weight: normal;
						font-size: 14px;
						line-height: 17px;
						display: inline-block;
						padding: 0 2px;
						border-radius: 3px;
						color: $white;
						background-color: #333842;
						margin-right: 2px;
					}
					i{
						font-style: normal;
						font-weight: 500;
						font-size: 14px;
						line-height: 17px;
						margin-right: 2px;
					}
				}
			}
			&-logo{
				display: flex;
				align-items: center;
				svg{
					height: 40px;
					width: auto;
				}
				h1{
					font-weight: 600;
					font-size: 22px;
					margin: 0;
					color: #4080FF;
				}
			}
			&-aside{
				display: flex;
				justify-content: flex-end;
				width: 100%;
			}
			&-content{
				p{
					font-size: 14px;
					margin-bottom: 8px;
				}
			}
			&-title{
				font-weight: 600;
				font-size: 32px;
				line-height: 40px;
				margin-bottom: 4px;
			}
			&-box{
				border: 1px solid #E2E2E2;
				border-radius: 4px;
				padding: 16px 24px;
				&-title{
					font-size: 16px;
					font-weight: 500;
				}
			}
		}
	}
</style>