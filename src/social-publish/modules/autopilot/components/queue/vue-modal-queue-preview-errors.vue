<template>
	<div class="vue-social-preview-error">
		<transition-group name="fade-in" mode="out-in"  tag="ul" >
			<li v-for="(item,index) in data" :key="`error_index_${index}`">
				<i class="m-r-5">
					<sh-icon :icon="['far','exclamation-circle']" />
				</i>
				<template v-if="item == 'image_or_video'">
					{{ $t('error.image_or_video') }}
				</template>
				<template v-else-if="item == 'max_size'">
					{{ $t('error.max_size' , { max_size : rules.max_size , social_network : socialType }) }}
				</template>
				<template v-else-if="item == 'max_length'">
					{{ $t('error.max_length' , { max_length : rules.max_character , social_network : socialType }) }}
				</template>
				<template v-else-if="item == 'min_width'">
					{{ $t('error.min_width', { min_width : rules.min_width }) }}
				</template>
				<template v-else-if="item == 'max_width'">
					{{ $t('error.max_width', { max_width : rules.max_width }) }}
				</template>
				<template v-else-if="item == 'min_height'">
					{{ $t('error.min_height', { min_height : rules.min_height }) }}
				</template>
				<template v-else-if="item == 'max_height'">
					{{ $t('error.max_height', { max_height : rules.max_height }) }}
				</template>
			</li>
		</transition-group>
	</div>
</template>
<script>
import config from '../../config'
export default {
	name : 'VueSocialErrors',
	props:{
		data : {
			type : Array,
			required :true,
		},
		socialType : {
			type : String,
			required : true,
		}
	},
	computed: {
		rules(){
			if( this.socialType == 'facebook'){
				return config.facebook
			}
			if( this.socialType == 'twitter'){
				return config.twitter
			}
			return {
				max_character : 0,
				min_width : 0,
				max_width : 0,
				min_height: 0,
				max_height : 0,
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.vue-social-preview-error{
		ul{
			padding: 0 ;
			list-style: none;

			li{
				color: $danger;
			}
		}
	}
</style>