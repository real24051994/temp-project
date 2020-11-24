<template>
	<div class="vue-item-article">
		<a class="vue-item-article-image" :href="data.link" target="_blank">
			<img v-if="data.thumbnail" :src="data.thumbnail" alt="">
			<img v-else src="@publish/assets/icons/default.png" alt="">
		</a>
		<div class="vue-item-article-content">
			<a class="vue-item-article-title" :href="data.link" target="_blank">
				{{ data.title || '' }}
			</a>
			<div class="d-flex">
				<div class="vue-item-article-info" v-if="data.date">
					<i>
						<sh-icon :icon="['far','calendar-alt']" />
					</i>
					<span>
						{{ mixinParseTimeUTCtoTimezone(data.date , 'YYYY-MM-DD HH:mm:ss' , 'MMM D') }}
					</span>
				</div>
				<div class="vue-item-article-info m-l-16" v-if="data.time_read">
					<i>
						<sh-icon :icon="['far','eye']" />
					</i>
					<span>
						{{ data.time_read }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'ItemArticle',
	mixins : [mixin_time_format],
	props:{
		data :{
			type : Object,
			required : true
		}
	},
	filters : {

	}
}
</script>
<style lang="scss">
	.vue-item-article{
		display: flex;
		padding: 8px 24px;
		&-image{
			width: 64px;
			height: 64px;
			border-radius: 4px;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
			@include flex(64);
			border: 1px solid $light-gray3;
			img{
				max-width: 100%;
				max-height: 100%;
			}
		}	
		&-content{
			@include flex(calc(100% - 64px));
			padding-left: 16px;
			display: block;
		}
		&-title{
			font-size: 14px;
			line-height: 16px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			color: $text;
			margin-bottom: 8px;
		}
		&-info{
			color:  $light-gray1;
		}
	}
</style>