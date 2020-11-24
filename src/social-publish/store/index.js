import store from '@/store'
const files = require.context('./modules', false, /\.js$/)
files.keys().forEach(fileName => {
	const STORE_KEY = fileName.split('/').pop().replace(/\.\w+$/, '')
	if (!(STORE_KEY in store._modules.root._children)) {
		store.registerModule(STORE_KEY,  files(fileName).default);
	}
});