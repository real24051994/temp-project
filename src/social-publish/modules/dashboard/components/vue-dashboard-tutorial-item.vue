<template>
	<div class="vue-tutorial-item" :class="{ 'is-active' : visible}">
		<div class="vue-tutorial-item-header">
			<div class="vue-tutorial-item-icon">
				<sh-icon :icon="['sh', data.icon]" />
			</div>
			<h4>
				{{ data.title }}
			</h4>
			<p>
				{{ data.description }}
			</p>
		</div>
		<div class="vue-tutorial-item-body">
			<a-button class="btn-toggle" @click="onClick" block>
				<template v-if="visible">
					<sh-icon :icon="['far','chevron-up']" />
				</template>
				<template v-else>
					<sh-icon :icon="['far','chevron-down']" />
				</template>
			</a-button>
			<vue-slide-toggle :open="visible" >
				<div class="vue-tutorial-item-wrap">
					<a v-for="(item,index) in data.articles" :key="`item_index_${index}`" class="item-article" :href="item.link" target="_blank">
						<span class="item-article-index">
							<strong>
								{{ index + 1}}
							</strong>
						</span>
						<span class="item-article-title">
							{{ item.title }}
						</span>	
						<span class="item-article-icon">
							<sh-icon :icon="['far','chevron-right']" />
						</span>
					</a>
				</div>
			</vue-slide-toggle>
		</div>
	</div>
</template>
<script>
export default {
	name : 'TutorialItem',
	props:{
		data :{
			type : Object,
		},
		value :{

		}
	},
	data(){
		return {

		}
	},
	computed :{
		visible : function(){
			return this.value == this.data.id
		},
		is_active : {
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{
		onClick(){
			this.is_active = this.is_active == this.data.id ? '' : this.data.id 
		}
	}
}
</script>
<style lang="scss">
	.vue-tutorial-item{
		border-radius: 4px;
		background-color: $base-color1;
		border: 1px solid $light-gray3;
		&.is-active{
			border-color: $primary-color;
		}
		&-header{
			position: relative;
			padding: 32px 32px 0;
			min-height: 102px;
			h4{
				font-weight: 600;
				font-size: 16px;
				line-height: 20px;
				margin-bottom: 8px;
			}
			p{
				margin: 0;
			}
		}
		&-icon{
			width: 40px;
			height: 40px;
			position: absolute;
			top: 0;
			left: 36px;
			transform: translateY(-50%);
			background: $primary-color;
			box-shadow: 0px 4px 10px rgba(91, 134, 229, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
			color: #fff;
			border-radius: 50%;
		}
		&-body{
			width: 100%;
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;
			overflow: hidden;
			.btn-toggle{
				border-color: transparent;
				background-color: transparent;
			}
		}
		&-wrap{
			background-color: #fff;
			padding: 0;
			border-top: 1px solid $light-gray3;
			.item-article{
				display: flex;
				align-items: center;
				min-height: 64px;
				padding: 0 32px;
				color: $text;
				background-color: #fff;
				&:hover{
					background-color: $light-gray5;
				}
				&-index{
					@include flex(24px);
					display: flex;
					align-items: center;
					justify-content: center;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					border: 2px solid $primary-color;
					font-weight: 600;
				}
				&-title {
					@include col;
					padding: 0 16px;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				&-icon{
					@include flex(40px);
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
			}
		}
	}
</style>