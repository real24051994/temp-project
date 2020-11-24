import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from 'js-cookie'
Vue.use(VueI18n)
import en from './en'
const defaultLang = 'en';

let messages = { 
	en : en
}
let currentLang =  cookie.get('socialhead-language')  

export default new VueI18n({
	locale: currentLang ? currentLang : defaultLang,
	fallbackLocale: defaultLang,
	messages: messages,
})