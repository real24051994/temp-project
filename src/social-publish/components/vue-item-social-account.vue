<template>
	<div v-if="hasCheckbox" class="item-social-account-checkbox" :class="{ 'is-checked' : isChecked}">
		<template v-if="aside_collapse">
			<template v-if="data.connect_error">
				<vue-error-social-account-popover v-model="data.connect_error" :on-click-reconnect="onReconnect">
					<div  class="item-social-account">
						<div class="item-social-account-media">
							<div class="item-social-account-media-avatar">
								<img v-if="data.avatar" :src="data.avatar" alt="">
								<img v-else src="@/assets/icons/user.png" alt="">
							</div>
							<div class="item-social-account-media-social is-error">
								<sh-icon  icon="exclamation" />
							</div>
						</div>
					</div>
				</vue-error-social-account-popover>
			</template>
			<a-popover v-else :title="false" placement="rightTop" >
				<template slot="content">
					<template>
						{{ data.name }}
					</template>
				</template>
				<slot>
					<div  class="item-social-account">
						<div class="item-social-account-media">
							<div class="item-social-account-media-avatar">
								<img v-if="data.avatar" :src="data.avatar" alt="">
								<img v-else src="@/assets/icons/user.png" alt="">
							</div>
							<template v-if="data.connect_error">
								<div class="item-social-account-media-social is-error">
									<vue-error-social-account-popover v-model="data.connect_error" :on-click-reconnect="onReconnect">
										<sh-icon  icon="exclamation" />
									</vue-error-social-account-popover>
								</div>
							</template>
							<template v-else>
								<div v-if="isChecked" class="item-social-account-media-social is-checked">
									<sh-icon  icon="check" />
								</div>
								<div v-else class="item-social-account-media-social item-social" :class="`social-${data.social_type}`"></div>
							</template>
						</div>
					</div>
				</slot>
			</a-popover>
		</template>
		<template v-else>
			<div class="item-social-account" >
				<div class="item-social-account-media">
					<div class="item-social-account-media-avatar">
						<img v-if="data.avatar" :src="data.avatar" alt="">
						<img v-else src="@/assets/icons/user.png" alt="">
					</div>
					<div class="item-social-account-media-social item-social" :class="`social-${data.social_type}`"></div>
				</div>
				<div class="item-social-account-title">
					<div  v-line-clamp:20="2">{{ data.name }}</div>
				</div>
				<div class="item-social-account-action">
					<template v-if="data.connect_error">
						<vue-error-social-account-popover v-model="data.connect_error" :on-click-reconnect="onReconnect" />
					</template>
					<template v-else>
						<a-checkbox :checked="isChecked" ></a-checkbox>
					</template>
				</div>
			</div>
		</template>
	</div>
	<div v-else class="item-social-account-non-checkbox">
		<template v-if="aside_collapse">
			<template v-if="data.connect_error">
				<vue-error-social-account-popover :key="data.id" v-model="data.connect_error" :on-click-reconnect="onReconnect">
					<div  class="item-social-account">
						<div class="item-social-account-media">
							<div class="item-social-account-media-avatar">
								<img v-if="data.avatar" :src="data.avatar" alt="">
								<img v-else src="@/assets/icons/user.png" alt="">
							</div>
							<div class="item-social-account-media-social is-error">
								<sh-icon  icon="exclamation" />
							</div>
						</div>
					</div>
				</vue-error-social-account-popover>
			</template>
			<template v-else>
				<a-popover :key="data.id" :title="false" placement="rightTop" >
					<template slot="content">
						<template>
							{{ data.name }}
						</template>
					</template>
					<slot>
						<div class="item-social-account" >
							<div class="item-social-account-media">
								<div class="item-social-account-media-avatar">
									<img v-if="data.avatar" :src="data.avatar" alt="">
									<img v-else src="@/assets/icons/user.png" alt="">
								</div>
								<div class="item-social-account-media-social item-social" :class="`social-${data.social_type}`"></div>
							</div>
							<div class="item-social-account-title">
								<div  v-line-clamp:20="2">{{ data.name }}</div>
							</div>
						</div>
					</slot>
				</a-popover>
			</template>
		</template>
		<template v-else>
			<div class="item-social-account" >
				<div class="item-social-account-media">
					<div class="item-social-account-media-avatar">
						<img v-if="data.avatar" :src="data.avatar" alt="">
						<img v-else src="@/assets/icons/user.png" alt="">
					</div>
					<div class="item-social-account-media-social item-social" :class="`social-${data.social_type}`"></div>
				</div>
				<div class="item-social-account-title">
					<div  v-line-clamp:20="2">{{ data.name }}</div>
				</div>
				<div class="item-social-account-action" v-if="data.connect_error">
					<vue-error-social-account-popover v-model="data.connect_error" :on-click-reconnect="onReconnect"/>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
	name : 'ItemSocial',
	props:{
		data :{
			type : Object,
			required : true,
		},
		hasCheckbox:{
			type : Boolean,
			default : false,
		},
		isChecked :{
			type : Boolean,
			default : false,
		}
	},
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse'
		}),
	},
	methods:{
		onReconnect(){
			this.$emit('on-reconnect')
		}
	}
}
</script>