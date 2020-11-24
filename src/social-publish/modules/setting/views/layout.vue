<template>
	<div class="vue-list-setting-page">
		<div class="vue-list-setting-container vue-setting vue-setting-main-page" >
			<div class="list-setting-content  page-container">
				<div class="list-setting-content-header  page-container-header">
					<div class="container">
						<div class="row">
							<div class="col col-12">
								<div class="list-setting-content-title">
									<h1 class="page-title">{{ $t('setting.title.page') }}</h1>
								</div>
							</div>
							<div class="col col-12">
								<div class="vue-list-tabs">
									<template v-for="item in tabs">
										<router-link :to="setRouterLink(item.router)" class="item-tab" :key="item.id" :class="{ 'is-actived' : activeRouterLink(item.router)}">
											{{ $t(`setting.tab.${item.id}`) }}
										</router-link>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="list-setting-content-body page-container-body">
					<transition name="fade-in" mode="out-in">
						<router-view />
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'VueLayout',
		metaInfo(){
			return {
				title: 'General Setting',
			}
		},
		data(){
			return {
				tabs : [
					{
						id : 'setting',
						router : 'Setting'
					},
					{
						id : 'integrate',
						router : 'Integrate'
					}
				],
			}
		},
		methods:{
			setRouterLink(name){
				return {
					name
				}
			},
			activeRouterLink(name){
				return this.$route.name == name
			}
		}
	}
</script>