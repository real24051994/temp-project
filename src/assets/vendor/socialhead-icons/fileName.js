var context = require.context('./', true, /\.js$/);
var objects = []
context.keys().forEach((filename)=>{
	if (filename === "./index.js" || filename === "./fileName.js") return; 
	objects.push(filename.split('/').pop().replace(/\.\w+$/, '').replace(/[A-Z]/g, '-$&').toLowerCase().replace(/sh-/, ''))
});
console.log(objects);
export default objects