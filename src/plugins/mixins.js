import Vue from 'vue'
import axios from './axios'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faExclamationCircle } from "@fortawesome/pro-regular-svg-icons";
const iconFaExclamationCircle = icon(faExclamationCircle).html[0]
Vue.mixin({
    data: ()=>({
		
	}),
    methods:{
        redirect(route){
            this.$router.push(route)
        },
        setRouterLinkDefault( { name  , params , query } ){
            let current = {
                name : this.$route.name,
                params : this.$route.params,
                query : this.$route.query
            }
            if( name ){
                current.name = name
            }
            if( params ){
                current.params = params
            }
            if( query ){
                current.query = query
            }
            return current
        },
        pushRouterLinkDefault( { name  , params , query } ){
			// return new Promise((resolve, reject)=>{
				let current = {
					name : this.$route.name,
					params : this.$route.params,
					query : this.$route.query
				}
				if( name ){
					current.name = name
				}
				if( params ){
					current.params = params
				}
				if( query ){
					current.query = query
				}
				this.$router.push(current)
			// })
		},
		showFormErrors(message){
			var content = ''
            if( message ){
                if( typeof message == 'string'){
                    content = message 
                }else if(typeof message == 'object'){
                    for (const key in message) {
                        if (message.hasOwnProperty(key)) {
                            const element = message[key];
                            if( typeof element == 'object' && element.length ){
                                content = element[0]
                            }
                            break
                        }
                    }
                }
            }
			this.$notification['error']({
				message: 'Error',
				description: content,
			});
		},
		createAxiosCancelRequestToken(){
			const CancelToken = axios.CancelToken;
			return CancelToken.source()
		},
		toastError(payload){
			let  { title = '' , message  = '', duration = 5 , className = ''} = payload
			var customClass = 'toast-error ' + className
			this.$notification.open({
				'message': title,
				'icon': function(createElement){
					return createElement('i' , {
						domProps: {
							innerHTML: iconFaExclamationCircle
						}
					})
				},
				'class' : customClass ,
				'duration' : duration,
				'description' :message,
			});
		},
		toastSuccess(payload){
			let { title = '' , message  = '' , duration = 5 , className  = '' }  = payload
			var customClass = 'toast-success ' + className
			this.$notification.open({
				'message': title,
				'icon': function(createElement){
					return createElement('i' , {
						domProps: {
							innerHTML: iconFaExclamationCircle
						}
					})
				},
				'class' : customClass ,
				'duration' : duration,
				'description' :message,
			});
		},
		toastWarning(payload){
			let { title = '' , message  = '' , duration = 5 , className = ''}  = payload
			var customClass = 'toast-warning ' + className
			this.$notification.open({
				"class" : payload.class ? payload.class : '',
				'message': title,
				'icon': function(createElement){
					return createElement('i' , {
						domProps: {
							innerHTML: iconFaExclamationCircle
						}
					})
				},
				'class' : customClass ,
				'duration' : duration,
				'description' :message,
			});
		},
	},
})