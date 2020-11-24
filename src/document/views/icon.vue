<template>
	<div class="list-socialhead-icons">
		<div class="socialhead-icon" v-for="item in icons" :key="item" @click="copyItem(item)">
			<div class="socialhead-icon-block">
				<sh-icon :icon="['sh',`${item}`]" />
			</div>
			<div class="socialhead-icon-text">
				{{ item }}
			</div>
		</div>
	</div>
</template>
<script>
import objects from '@/assets/vendor/socialhead-icons/fileName.js'
export default {
	name : 'SocialheadIcons',
	data(){
		return {
			icons : objects,
		}
	},
	methods : {
		copyItem(item){
			var str = `<sh-icon :icon="['sh','${item}']" />`
			const el = document.createElement('textarea');
			el.value = str;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
			this.toastSuccess({
				title : 'Copied to clipboard',
			})
		},
	},
}
</script>
<style lang="scss" scoped>
	.list-socialhead-icons{
		.socialhead-icon{
			width: 150px;
			margin: 10px;
			display: inline-flex;
			border: 1px solid #f2f2f2;
			background-color: #fff;
			cursor: pointer;
			align-items: center;
			&:hover{
				background-color: $light-primary1;
			}
			&-block{
				width: 40px;
				height: 50px;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				font-size: 25px;
				color: $text;
			}
			&-text{
				font-size: 13px;
			}
		}
	}
	
</style>