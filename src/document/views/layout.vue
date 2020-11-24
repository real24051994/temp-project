<template>
	<div class="p-l-50 p-r-50 p-t-15 p-b-15">
		<ul class="list-doc-partial">
			<li>
				<router-link :to="{ name : 'DocButton'}">Button</router-link>
			</li>
			<li>
				<router-link :to="{ name : 'DocIcon'}">Icon</router-link>
			</li>
		</ul>
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>
<script>
	export default {
		name: 'VueLayout',
	}
</script>
<style lang="scss">
	.list-doc-partial{
		display: flex;
		list-style: none;
		padding: 10px 15px;
		li{
			margin-left: 15px;
			a{
				color: $text;
				&.router-link-active{
					color: $primary-color;
				}
			}
		}
	}
</style>