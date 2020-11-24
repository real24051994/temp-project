<template>
	<div class="social-post-tab social-post-tab-image">
		<div class="list-items-image">
			<template v-for="(item , index) in images">
				<div class="item-image"  :key="`index${index}`">
					<div class="item-image-preview">
						<img :src="item.src" alt="">
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'TabImages',
	components:{

	},
	props:{
		value :{
			type : Array,
			required : true,
		},
	},
	computed:{
		images :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		 
	},
	mounted(){

	}
}
</script>