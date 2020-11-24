// var prefix = "sh";
import { library } from '@fortawesome/fontawesome-svg-core'
var context = require.context('./', true, /\.js$/);
context.keys().forEach((filename)=>{
	if (filename === "./index.js" || filename === "./fileName.js") return; 
	// var item = context(filename)
	// var prefix = filename.split('/').pop().replace(/\.\w+$/, '').replace(/[A-Z]/g, '-$&').toLowerCase().replace(/sh-/, '')
	// item.default.iconName = prefix
	library.add(context(filename))
});