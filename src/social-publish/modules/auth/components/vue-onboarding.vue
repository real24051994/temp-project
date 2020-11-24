<template>
	<div class="vue-onboarding" >
		<div class="vue-onboarding-mask" ref="mask"></div>
		<transition name="fade-in">
			<div class="vue-onboarding-container" v-if="visible" :style="container_style">
				<div class="vue-onboarding-wrapper">
					<div class="vue-onboarding-content">
						<div class="vue-onboarding-icon" v-if="current_step.icon" :style="current_step.iconStyle">
							<img :src="current_step.icon" alt="">
						</div>
						<div class="vue-onboarding-title">
							{{ current_step.title }}
						</div>
						<div class="vue-onboarding-message">
							{{ current_step.content }}
						</div>
						<div class="vue-onboarding-footer" v-if="current_step.btn">
							<div class="vue-onboarding-btn">
								<a-button :type="current_step.btnClass" @click="current_step.eventClick">
									{{ current_step.btn}}
								</a-button>
							</div>
							<div class="vue-onboarding-step">
								Step {{ step + 1}} / {{data.length}}
							</div>
						</div>
					</div>
					<div  :style="current_step.caretStyle" :class="`vue-onboarding-arrow ${current_step.caretType}`"></div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
	name:  'VueOnboarding',
	data(){
		return {
			timeout : null,
			timeout_route : null,
			timeout_change : null,
			visible : false,
			current_step : null,
			clone_style : {},
			container_style : {},
			show_complete : false,
			images: [
				require('../assets/onboarding/step-0.png'),
				require('../assets/onboarding/step-2.png'),
				require('../assets/onboarding/step-3.png'),
				require('../assets/onboarding/step-4.png'),
			],
			data : [
				{
					wrapId : '#vue-list-post-accounts',
					focusId: '#vue-list-post-accounts-btn-trigger',
					route : ['ManagePost'],
					containerTop : true,
					containerLeft : false,
					containerCustomStyle : {
						transform : 'translate(40px,40px)'
					},
					containerCustomClass : 'onboarding-white',
					focusCustomClass : 'onboarding-border-primary',
					title : 'Manage All your social profiles',
					content : 'Connect to any social account and manage all accounts in a single page.',
					caretType : 'left',
					caretStyle : {
						bottom : '15px'
					},
					icon : require('../assets/onboarding/step-0.png'),
					iconStyle :{
						'margin-top' : '-76px'
					},
					btn : null,
					btnClass : null,
					eventClick : ()=>{
						this.redirect({
							name : 'ManageAccount'
						})
						this.step = 1
					}
				},
				{
					wrapId : '#vue-onboarding-add-account',
					focusId: '#vue-onboarding-add-account',
					route : ['ManageAccount'],
					containerTop : false,
					containerLeft : false,
					containerCustomStyle : {
						transform : 'translate(-100%,20px)'
					},
					containerCustomClass : '',
					focusCustomClass : 'onboarding-border-white',
					title : 'Add Social Account',
					content : 'Start connecting to your social accounts and promoting your pages',
					caretType : 'top',
					caretStyle : {
						right : '15px'
					},
					icon : require('../assets/onboarding/step-0.png'),
					iconStyle :{
						'margin-top' : '-76px'
					},
					btn : null,
					btnClass : null,
					eventClick : ()=>{
						this.step = 2
					}
				},
				{
					wrapId : '.modal-add-social-accounts .ant-modal-body',
					focusId: '.modal-add-social-accounts .ant-modal-body',
					route : ['ManageAccount'],
					containerTop : false,
					containerLeft : true,
					containerCustomStyle : {
						transform : 'translate(100%,20px)'
					},
					containerCustomClass : '',
					focusCustomClass : 'onboarding-border-primary',
					title : 'Choose your social media platform',
					content : 'Support publishing a post on Facebook and Twitter. More platforms are coming soon. Stay tuned!',
					caretType : 'top',
					caretStyle : {
						right : '30px'
					},
					icon : require('../assets/onboarding/step-2.png'),
					iconStyle :{

					},
					btn : null,
					btnClass : null,
					eventClick : (event)=>{
						if( $(event.target).is('.modal-add-social-item , .modal-add-social-item *')){
							this.step = -1
						}
					}
				},
				{
					wrapId : '#app-layout-master',
					focusId: '#vue-sidebar-create-post',
					route : ['ManageAccount' ,'ManagePost'],
					containerTop : false,
					containerLeft : false,
					containerCustomStyle : {
						transform : 'translate(20px, -54px)'
					},
					containerCustomClass : 'onboarding-sidebar',
					focusCustomClass : 'vue-onboarding-prevent-click',
					title : 'Publish a post',
					content : 'Start composing your media content and schedule them for any social profile',
					caretType : 'left',
					caretStyle : {
						top : '20px'
					},
					icon : require('../assets/onboarding/step-3.png'),
					iconStyle :{

					},
					btn : 'Next',
					btnClass : 'primary',
					eventClick : (event)=>{
						this.step = 4
						this.updateInstalledOnboarding({ type : 'install_app'})
					}
				},
				{
					wrapId : '#app-layout-master',
					focusId: '#vue-sidebar-manage-post',
					route : ['ManageAccount' ,'ManagePost'],
					containerTop : false,
					containerLeft : false,
					containerCustomStyle : {
						transform : 'translate(20px, -54px)'
					},
					containerCustomClass : 'onboarding-sidebar',
					focusCustomClass : 'vue-onboarding-prevent-click',
					title : 'Manage all kinds of posts in one place',
					content : 'Manage all kinds of posts in one place. Moreover, you take other actions such as edit, duplicate, and delete on any posts',
					caretType : 'left',
					caretStyle : {
						top : '20px'
					},
					icon : require('../assets/onboarding/step-4.png'),
					iconStyle :{

					},
					btn : 'Got It',
					btnClass : 'primary',
					eventClick : (event)=>{
						this.setInstalledOnboarding(true)
						
					}
				},
			],
		}
	},
	computed:{
		...mapGetters({
			// installed_onboarding : 'auth/getInstalledOnboarding',
			// installed_onboarding_step : 'auth/getInstalledOnboardingStep'
		}),
		step : {
			get(){
				return this.installed_onboarding_step
			},
			set(value){
				this.setInstalledOnboardingStep(value)
			}
		},
	},
	methods:{
		...mapActions({
			updateInstalledOnboarding : 'auth/updateInstalledOnboarding'
		}),
		...mapMutations({
			setInstalledOnboarding : 'auth/setInstalledOnboarding',
			setInstalledOnboardingStep : 'auth/setInstalledOnboardingStep'
		}),
		changeStep(){

		},
		show(){
			this.getStep()
		},
		getStep(){

			if( this.step == -1){
				this.visible = false
				if( this.timeout_route ){
					clearTimeout(this.timeout_route)
				}
				if( this.timeout ){
					clearTimeout(this.timeout)
					this.timeout = null
				}
				if( this.timeout_change ){
					clearTimeout(this.timeout_change)
					this.timeout_change = null
				}
			}else{
				this.current_step = this.data.length >= this.step ? this.data[this.step] : null

				if( this.current_step ){

					if( this.current_step.route.indexOf(this.$route.name)  >= 0 ){

						if( this.timeout_route ){
							clearTimeout(this.timeout_route)
						}
						this.show_complete = false 
						if( this.timeout ){
							clearTimeout(this.timeout)
							this.timeout = null
						}
						this.getPosition()
					}else{
						this.timeout_route = setTimeout(this.getStep , 1000);
					}
				}
			}
		},
		getOffset( el ) {
			var x = 0;
			var y = 0;
			while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
				x += el.offsetLeft - el.scrollLeft;
				y += el.offsetTop - el.scrollTop;
				el = el.offsetParent;
			}
			return { top: y, left: x };
		},
		getPosition(){
			var body = document.querySelector('body')
			var wrapElement = document.querySelector(this.current_step.wrapId)
			var width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
			var height = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight
			if( wrapElement ){
				wrapElement.classList.add('vue-onboarding-actived')
				body.classList.add('vue-onboarding-showed')
				var wrapElementOffset = this.getOffset(wrapElement)
				if(this.current_step.containerCustomClass){
					wrapElement.classList.add(this.current_step.containerCustomClass)
				}
				var focusElement = document.querySelector(this.current_step.focusId)
				if( focusElement ){
					focusElement.classList.add('vue-onboarding-focused')
					if(this.current_step.focusCustomClass){
						focusElement.classList.add(this.current_step.focusCustomClass)
					}
					var focusElementOffset = this.getOffset(focusElement)
					this.container_style = {}
					if( this.current_step.containerTop ){
						this.container_style['bottom'] = ( height -  focusElementOffset.top) + 'px'
					}else{
						this.container_style['top'] = (focusElementOffset.top + focusElement.offsetHeight) + 'px'
					}

					if( this.current_step.containerLeft){
						this.container_style['right'] = ( width -  focusElementOffset.left) + 'px'
					}else{
						this.container_style['left'] = (focusElementOffset.left + focusElement.offsetWidth) + 'px'
					}
					if(this.current_step.containerCustomStyle){
						this.container_style = Object.assign(this.container_style, this.current_step.containerCustomStyle)
					}
					if( typeof this.current_step.eventClick == 'function'){
						this.visible = false
						focusElement.addEventListener("click", (event)=>{
							if( this.visible == true ){
								this.current_step.eventClick(event)
							}
						});
					}
					
				}
				this.visible = true
				if( this.timeout ){
					clearTimeout(this.timeout)
					this.timeout = null
				}
				
			}else{
				this.timeout = setTimeout(this.getPosition , 1000);
			}
		},
		next(){

		},
		prev(){

		},
		removeOnboardingClass(){
			var arr = [
				'vue-onboarding-showed' ,
				'vue-onboarding-actived' ,
				'vue-onboarding-focused',
				'vue-onboarding-prevent-click',
				'onboarding-border-primary',
				'onboarding-border-white',
				'onboarding-white',
				'onboarding-sidebar'
			]
			arr.forEach((item)=>{
				$(`.${item}`).removeClass(item)
			})
			$(window).off('resize' , this.getPosition )
		},
		loadImage(src){
			var vm = this 
			return new Promise((resolve) => {
				var img = new Image();
				img.src = src;
				img.onload = function (event) {
					resolve(img)
				}
			});
		},
		loadImages(images){
			return new Promise((resolve, reject)=>{
				let promises = [];
				images.forEach((img)=>{
					promises.push(this.loadImage(img))
				})
				Promise.all(promises)
				.then((results) => {
					resolve(results)
				})
			});
		},
	},
	watch :{
		'installed_onboarding_step' : function(){
			this.visible = false 
			if( this.timeout_change ){
				clearTimeout(this.timeout_change)
				this.timeout_change = null
			}
			this.removeOnboardingClass()
			this.timeout_change = setTimeout( ()=>{
				this.show()
			}, 500);
		},
		'installed_onboarding' : function(value){
			if( value == true ){
				$(window).off('resize' , this.getPosition )
			}
		},
		visible: function(value){
			if( value ){
				$(this.$refs.mask).fadeIn(300)
			}else{
				$(this.$refs.mask).fadeOut(300)
			}
		},
	},
	async mounted(){
		if( !this.installed_onboarding ){
			$(window).on('resize' , this.getPosition )
			await this.loadImages(this.images)
		}
		setTimeout( ()=>{
			this.show()
		}, 1000);
	},
	beforeDestroy(){
		if( this.timeout ){
			clearTimeout(this.timeout)
		}
		if( this.timeout_route ){
			clearTimeout(this.timeout_route)
		}
		this.removeOnboardingClass()
	}
}
</script>
<style lang="scss" >
	.vue-onboarding{
		&-showed{
			width: 100%;
			height: 100%;
			overflow: hidden;
			.ant-modal-mask{
				display: none;
			}
			.ant-modal-wrap{
				
			}
			.modal-add-social-accounts{
				pointer-events: none;
				z-index: 10001;
				.ant-modal-content{
					pointer-events: all;
					.ant-modal-close{
						pointer-events: none;
						opacity: 0.3;
					}
				}
			}
		}
		&-mask{
			z-index: 10000;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.65);
			display: none;
		}
		&-actived{
			z-index: 100000000000 !important;
			border-radius: 4px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
			&.onboarding-white {
				background: #fff !important;
			}
			&.onboarding-sidebar{
				z-index: unset !important;
				.app-layout-collapse{
					opacity: 0;
					visibility: hidden;
				}
				.app-layout-sidebar{
					z-index: 10001;
					.app-sidebar{
						&:before{
							content: none;
						}
					}
					.app-sidebar-menu .navbar-item.is-active .navbar-link{
						&:before{
							content: none !important;
						}
					}
					.app-sidebar-menu {
						.navbar-item{
							.navbar-link{
								cursor: pointer;
								background: rgba(24, 144, 255,0.1);
								color:$primary-color;
								&:not(.vue-onboarding-focused){
									pointer-events: none;
									background: transparent;
									color : $app-sidebar-text-color;
								}
							}
						}

					}
				}
				
			}
		}
		&-focused{
			&.onboarding-border{
				&-primary{
					border:2px solid $primary-color;
				}
				&-white{
					border:2px solid #fff
				}
			}
			&.vue-onboarding-prevent-click{
				pointer-events: none;
				user-select: none;
				position: relative;
				z-index: 2;
			}

		}
		&-clone{
			background: #fff;
			z-index:10001 ;
			position: fixed;
			background-color: rgba(255,255,255,.9);
			border: 1px solid #777;
			border: 1px solid rgba(0,0,0,.5);
			border-radius: 4px;
			box-shadow: 0 2px 15px rgba(0,0,0,.4);
			user-select: none;
			pointer-events: none;
		}
		&-container{
			z-index: 10002;
			position: fixed;
			
		}
		&-wrapper{
			position: relative;
			width: 420px;
			background: #fff;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			padding: 32px;
			&:before{
				content: '';
				width: 98px;
				height: 104px;
				position: absolute;
				left: 0;
				top: 0;
				pointer-events: none;
				z-index: 0;
				background-image:  url('../assets/onboarding/left.png');
			}
			&:after{
				content : '';
				width: 88px;
				height: 104px;
				position: absolute;
				right: 0;
				top: 0;
				pointer-events: none;
				z-index: 0;
				background-image:  url('../assets/onboarding/right.png');
			}
		}
		&-icon{
			margin-bottom: 20px;
			img{
				max-width: 100%;
			}
		}
		&-title{
			font-size: 16px;
			font-weight: 600;
			margin-bottom: 10px;
		}
		&-message{
			font-size: 14px;
			margin-bottom: 10px;
		}
		&-step{
			color: #97999F;
			font-size: 14px;
			font-weight: 600;
			text-align: right;
		}
		&-content{
			position: relative;
			z-index: 2;
		}
		&-footer{
			display: flex;
			align-items: center;
			margin-top: 10px;
		}
		&-btn, &-step{
			@include flex(50%);
		}
		&-arrow{
			position: absolute;
			width: 16px;
			height: 16px;
			background: #fff;
			&.top{
				top: -8px;
				transform: rotate(135deg);
			}
			&.bottom{
				bottom: -8px;
				transform: rotate(-45deg);
			}
			&.left{
				left: -8px;
				transform: rotate(135deg);
			}
			&.right{
				right: -8px;
				transform: rotate(-45deg)
			}
		}
	}
</style>