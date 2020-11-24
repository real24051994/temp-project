<template>
	<div class="vue-dashboard-banner">
		<a-carousel class="box-dashboard-article-carousel" arrows>
			<div slot="prevArrow" class="carousel-arrow">
				<sh-icon :icon="['far','angle-left']" />
			</div>
			<div slot="nextArrow" class="carousel-arrow">
				<sh-icon :icon="['far','angle-right']" />
			</div>
			<div class="carousel-item" v-for="item in banners" :key="item.id" >
				<a v-if="item.type == 'hyperlink'" target="_blank" :href="item.link" class="item-banner">
					<img class="img-responsive" :src="item.src" alt="">
				</a>
				<router-link v-else-if="item.type == 'router-link'" :to="item.link" class="item-banner">
					<img class="img-responsive" :src="item.src" alt="">
				</router-link>
			</div>
		</a-carousel>
	</div>
</template>
<script>
export default {
	name : 'VueDashboardBanner',
	data(){
		return {
			banners : [
				{
					link : "https://bit.ly/2FxjJ8L",
					src : require('../assets/images/Banner.png'),
					type : 'hyperlink'
				},
				{
					link : {
						"name" : "Pricing"
					},
					src : require('../assets/images/Banner.png'),
					type : 'router-link'
				},
				{
					link : "https://pagefly.link/urgSmtep",
					src : require('../assets/images/Banner.png'),
					type : 'hyperlink'
				}
			]
		}
	}
}
</script>
<style lang="scss">
	.vue-dashboard-banner{
		.slick-slider{
			z-index: 1;
		}
		.item-banner{
			display: block;
			// height: 200px;
			// width: 100%;
		}
		.carousel{
			&-arrow{
				width: 40px;
				height: 40px;
				background: #fff;
				color: $text;
				z-index: 1000;
				box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
				border: 1px solid $border-color;
				border-radius: 50%;
				font-size: 20px;
				line-height: 40px;
				text-align: center;
				&.slick-prev{
					left: 5px;
				}
				&.slick-next{
					right: 5px;
				}
				&::before{
					content: none;
				}
				&:hover{
					background: #fff;
					color: $primary-color;
				}
			}
		}
	}
</style>