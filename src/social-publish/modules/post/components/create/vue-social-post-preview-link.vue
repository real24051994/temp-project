<template>
	<div class="vue-social-post-preview-link">
		<transition name="fade-in" mode="out-in">
			<div class="item-link-loading" v-if="loading" key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div v-else key="is-loading-success" class="item-link" :class="{ 'item-link-facebook' : socialType == 'facebook' ,'item-link-twitter' : socialType == 'twitter'   }">
				<template v-if="socialType == 'facebook'">
					
					<template v-if="meta.image.length == 1">
						<div class="item-link-image" v-if="meta.image" :style="{ 'background-image': 'url(' + meta.image + ')' }">
							<img style="width:100%" src="@/assets/grid/500x333.png" alt="">
						</div>
						<div class="item-link-image" v-else :style="{ 'background-image': 'url(' + require(`@/assets/grid/square2.png`) + ')' }">
							<img style="width:100%" src="@/assets/grid/500x333.png" alt="">
						</div>
					</template>
					<template v-else-if="meta.image.length > 1">
						<a-carousel  arrows :dots="false" class="m-t-5">
							<div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
								<sh-icon icon="caret-left" />
							</div>
							<div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
								<sh-icon icon="caret-right" />
							</div>
							<div class="item-link-image" v-for="item in meta.image" :key="item.id" :style="{ 'background-image': 'url(' + item + ')' }">
								<img style="width:100%" src="@/assets/grid/500x333.png" alt="">
							</div>
						</a-carousel>
					</template>

				</template>
				<template v-else-if="socialType == 'twitter'">
					<div class="item-link-image" v-if="meta.image" :style="{ 'background-image': 'url(' + meta.image + ')' }">
						<img style="width:100%" src="@/assets/grid/500x333.png" alt="">
					</div>
					<div class="item-link-image" v-else :style="{ 'background-image': 'url(' + require(`@/assets/grid/square.png`) + ')' }">
						<img style="width:100%" src="@/assets/grid/500x333.png" alt="">
					</div>
				</template>
				<div class="item-link-content">
					<div class="item-link-title" v-if="meta.title">
						{{meta.title }}
					</div>
					<div class="item-link-description" v-if="meta.description">
						<div v-line-clamp:20="2">
							{{meta.description }}
						</div>
					</div>
					<div class="item-link-hostname" v-if="meta.hostname">
						{{meta.hostname }}
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name : 'PreviewLink',
	props:{
		socialType : {
			type : String,
			default : 'facebook'
		},
		meta : {
			type : Object,
			required: true,
		},
		loading :{ 
			type : Boolean,
			default: false,
		}
	},
}
</script>