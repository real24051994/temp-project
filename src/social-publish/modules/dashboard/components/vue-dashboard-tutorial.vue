<template>
	<div class="vue-dashboard-tutorial">
		<div class="vue-dashboard-tutorial-header d-flex m-b-36">
			<h3>Tutorials: Get To Know Everything About Us</h3>
			<div class="spacer"></div>
			<a :href="view_all" target="_blank">View all</a>
		</div>
		<div class="vue-dashboard-tutorial-body">
			<div class="row">
				<template v-for="(item, index) in data">
					<div class="col col-6 m-b-40" :key="`item_index_${index}`">
						<vue-dashboard-tutorial-item v-model="is_active" :data="item" />
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
import VueDashboardTutorialItem from './vue-dashboard-tutorial-item'
export default {
	name : 'VueTutorial',
	components:{
		VueDashboardTutorialItem
	},
	data(){
		return {
			is_active: '',
			view_all : 'https://help.socialhead.io/en/collections/2138849-socialpublish',
			data : [
				{
					id : 'create_post',
					title : 'Create Post',
					description : "Compose and schedule a post that matches your social media presence",
					icon : 'post',
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
					id : 'autopilot',
					title : 'Autopilot',
					description : "Create different content for all products and have them published automatically",
					icon : 'autopilot',
					articles : [
						{
							title : 'How to use Latest Product autopilot',
							link : 'https://help.socialhead.io/en/articles/3966655-how-to-use-latest-product-autopilot'
						},
						{
							title : 'How to use Random Product autopilot',
							link : 'https://help.socialhead.io/en/articles/3692586-how-to-use-random-product-autopilot'
						},
						{
							title : 'How to use the Discount Code and Add Tag On Image features',
							link : 'https://help.socialhead.io/en/articles/4068610-how-to-use-the-discount-code-and-add-tag-on-image-features'
						},
						{
							title : 'Understand your Autopilot scheduled posts better with Autopilot Queue',
							link : 'https://help.socialhead.io/en/articles/4206097-understand-your-autopilot-scheduled-posts-better-with-autopilot-queue'
						},
					]
				},
				{
					id : 'post_center',
					title : 'Post Center',
					description : "Manage all your posts in one place with detailed status and performance",
					icon : 'post-center',
					articles : [
						{
							title : "Understand your post's status and performance in Post Center",
							link : 'https://help.socialhead.io/en/articles/3683806-understand-your-post-s-status-and-performance-in-posts-center'
						},
					]
				},
				{
					id : 'faq',
					title : 'FAQs',
					description : "Find the most commonly raised questions and their answers here",
					icon : 'faq',
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
	methods :{

	}
}
</script>