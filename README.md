# socialhead

## Project setup
```
npm install
```
### Social Publish 
#### Compiles and hot-reloads for development
```
npm run publish:dev
```
#### Compiles and minifies for production
```
npm run publish:build => dist/social-publish
```

### Social Shop 
#### Compiles and hot-reloads for development
```
npm run shop:dev
```
#### Compiles and minifies for production
```
npm run shop:build => dist/social-shop
```

### Social Publish 
#### Compiles and hot-reloads for development
```
npm run publish:dev
```
#### Compiles and minifies for production
```
npm run publish:build => dist/social-publish
```


### Config
#### config for development
```
.env.development.local
```
#### config for production
```
.env
```

### Setup Module example social publish
#### App file
```
	App render in src/layouts/App.vue

```
#### config for layouts
```
	layout path => src/social-publish/layouts
	layout default  => src/social-publish/layouts/default.vue

```
#### global component & plugins
```
	confirm plugin

	$confirm({
		title : {
			type : String,
			default : ''
		},
		content : {
			type : String,
			default : ''
		},
		okText : {
			type : String,
			default : 'Ok'
		},
		okType : {
			type : String,
			default : 'primary'
		},
		cancelText : {
			type : String,
			default : 'cancel'
		},
		cancelType : {
			type : String,
			default : ''
		},
		zIndex : {
			type : Number,
			default : 10002
		},
		onOk : {
			type : Function,
		},
		onCancel : {
			type : Function,
		}
		checkbox : {
			type : Boonlean,
		}, 
		checkboxValue : {
			type : Boonlean,
		},
		checkboxContent : {
			type : String
		},
		wrapClassName : {
			type : String
		},
	})

```
