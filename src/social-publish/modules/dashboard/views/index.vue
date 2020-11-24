<template>
	<div class="social-publish-dashboard">
		<div class="bg-light-gray4 p-t-32 p-b-32">
			<div class="container">
				<vue-dashboard-article   />
			</div>
		</div>
		<div class="bg-white p-t-32 p-b-32">
			<div class="container">
				<vue-dashboard-statistic   />
			</div>
		</div>
		<div class="bg-white p-t-32">
			<div class="container">
				<vue-dashboard-tutorial   />
			</div>
		</div>
		<div class="bg-white p-t-32 p-b-32">
			<div class="container">
				<vue-dashboard-timeline   />
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
import VueDashboardStatistic from '../components/vue-dashboard-statistic'
import VueDashboardArticle from '../components/vue-dashboard-article'
import VueDashboardTutorial from '../components/vue-dashboard-tutorial'
import VueDashboardTimeline from '../components/vue-dashboard-timeline'
export default {
	name : 'Dashboard',
	components:{
		VueDashboardStatistic,
		VueDashboardArticle,
		VueDashboardTutorial,
		VueDashboardTimeline
	},
	metaInfo(){
		return {
			title: 'Dashboard',
		}
	},
	data(){
		return {
			is_loading: true,
			is_loading_error : false,
			socials: [],
			filters : {
				range : 7,
			},
			articles : {
				news : {
					link : "https://help.socialhead.io/en/collections/2138849-socialpublish",
					data : [
						{
							title : 'WHAT’S NEW?',
							description : "",
							icon : ['far' , 'sparkles'],
							articles : [
								{
									title : 'New features in Socialpublish version 1.2',
									link  : "https://help.socialhead.io/en/articles/3683643-how-to-connect-your-social-media-accounts-to-socialpublish"
								},
								{
									title : 'How to add UTM tags to your URL',
									link : 'https://help.socialhead.io/en/articles/3784446-how-to-add-utm-tags-to-your-url'
								},
								{
									title : 'How to change time zone for your posts',
									link : 'https://help.socialhead.io/en/articles/3784614-how-to-change-time-zone-for-your-posts'
								},
							]
						},
						{
							title : 'Getting Started',
							description : "Get to know what Socialpublish is and how to get started",
							link : "https://help.socialhead.io/en/collections/2138849-socialpublish",
							icon : ['far','bookmark'],
							articles : [
								{
									title : 'How to connect your social media accounts to Socialpublish',
									link : 'https://help.socialhead.io/en/articles/3683643-how-to-connect-your-social-media-accounts-to-socialpublish'
								},
								{
									title : 'Which social media platform does Socialpublish integrate with?',
									link : 'https://help.socialhead.io/en/articles/3683656-socialpublish-integration-with-social-media-platforms'
								},
								{
									title : 'Which plan is Socialpublish offering? ',
									link : 'https://help.socialhead.io/en/articles/3683644-which-plan-is-socialpublish-offering'
								},
								{
									title : 'How to create a staff account, and why does the Support Team need it?',
									link : 'https://help.socialhead.io/en/articles/3683873-how-to-create-a-staff-account-and-why-does-support-team-need-it'
								},
							]
						}
					]
				},
				tutorials: {
					link : "https://help.socialhead.io/en/collections/2138849-socialpublish",
					data : [
						{
							title : 'Create Post',
							description : "Compose and schedule a post that matches your social media presence",
							icon : ['far','paper-plane'],
							articles : [
								{
									title : 'How to create a post',
									link : 'https://help.socialhead.io/en/articles/3677342-how-to-create-a-post'
								},
								{
									title : 'How to save as draft/schedule/publish a post',
									link : 'https://help.socialhead.io/en/articles/3683718-how-to-save-as-draft-schedule-publish-a-post'
								},
								{
									title : 'How to use Hashtag Group',
									link : 'https://help.socialhead.io/en/articles/3683805-how-to-use-hashtag-group'
								},
							]
						},
						{
							title : 'Autopilot',
							description : "Create different content for all products and have them published automatically",
							icon : ['far','robot'],
							articles : [
								{
									title : 'How to use Autopilot feature',
									link : 'https://help.socialhead.io/en/articles/3692586-how-to-use-autopilot-feature'
								},
							]
						},
						{
							title : 'Post Center',
							description : "Manage all your posts in one place with detailed status and performance",
							icon : ['far','list-alt'],
							articles : [
								{
									title : "Understand your post's status and performance in Posts Center",
									link : 'https://help.socialhead.io/en/articles/3683806-understand-your-post-s-status-and-performance-in-posts-center'
								},
							]
						},
						{
							title : 'FAQs',
							description : "",
							icon : ['far','life-ring'],
							articles : [
								{
									title : "Why don't I see my post on social media?",
									link : 'https://help.socialhead.io/en/articles/3722069-why-don-t-i-see-my-post-on-social-media'
								},
								{
									title : 'What will happen when you remove a social account from Socialpublish?',
									link : 'https://help.socialhead.io/en/articles/3686473-what-will-happen-when-you-remove-a-social-account-from-socialpublish'
								},
							]
						}
					]
				}
				
			},
			
		}
	},
	methods:{
		...mapActions({

		}),
		
	},
	mounted(){
		this.is_loading = false
	}
}
</script>
<style lang="scss" >
	.social-publish-dashboard{
		h3{
			font-weight: 600;
			font-size: 20px;
			line-height: 24px;
		}
	}
	// .vue-dashboard-main-page{
	// 	.select-inline{
	// 		min-width: 200px;
	// 	}
	// 	h3.page-title{
	// 		font-weight: 600;
	// 		font-size: 18px;
	// 		line-height: 21px;
	// 	}
	// 	h4.page-title{
	// 		font-weight: 600;
	// 		font-size: 16px;
	// 		line-height: 19px;
	// 	}
	// 	.box-dashboard{
	// 		background: #F8F8F8;
	// 	}
	// }
	// .select-account-item{
	// 	display: flex;
	// 	align-items: center;
	// 	height: 30px;
	// 	.item-avatar{
	// 		width: 20px;
	// 		height: 20px;
	// 		overflow: hidden;
	// 		border: 1px solid #CECECE;
	// 		@include flex(20px);
	// 		border-radius: 50%;
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: center;
	// 		img{
	// 			max-width: 100%;
	// 			max-height: 100%;
	// 		}
	// 	}
	// 	.item-name{
	// 		@include col;
	// 		padding-left: 8px;
	// 		color: #252627;
	// 	}
	// }
</style>
