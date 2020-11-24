const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const { argv } = require('yargs')
const appname = argv.app
const app_config = require('./src/config/index.js')
var configureWebpackPlugins = [
	new webpack.ProvidePlugin(app_config[appname]['provide_plugin']),
	new webpack.DefinePlugin({
		'process.env.VUE_APP_NAME': JSON.stringify(appname)
	}),
	new CopyWebpackPlugin([{
		from: `src/social-${appname}/public`,
		to: ''
	}]),
]
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? app_config[appname].public_path : '/',
	chainWebpack: config => {
		config.resolve.alias.set('@', path.resolve('src'))
		config.resolve.alias.set('@publish', path.resolve('src/social-publish'))
		config.resolve.alias.set('@shop', path.resolve('src/social-shop'))
		config.resolve.alias.set('@widget', path.resolve('src/social-widget'))
		config.resolve.alias.set('@reply', path.resolve('src/social-reply'))
		config.resolve.alias.set('@head', path.resolve('src/social-head'))
		config.resolve.alias.set('@layouts', path.resolve(`src/social-${appname}/layouts`))
		config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader").options({});
		config.plugin('html').tap(args => {
			args[0].template = `src/social-${appname}/public/index.html`
			return args
		})
		if (process.env.NODE_ENV == 'production') {
			config.module.rule('images').use('url-loader').loader('url-loader').tap(options => {
				options.limit = -1
				return options
			})
		}
	},
	configureWebpack: {
		performance: {
			hints: false
		},
		optimization: {
			splitChunks: {
				chunks: 'async',
				maxInitialRequests: 4,
				maxAsyncRequests: 6,
				minChunks: 1,
				minSize: 1000000,
				maxSize: 1500000,
			}
		},
		plugins: configureWebpackPlugins
	},
	lintOnSave: false,
	devServer: {
		port: 3200
	},
	css: {
		loaderOptions: {
			scss: {
				data: `@import "@/styles/scss/static/_variables.scss"; @import "@/styles/scss/static/_mixins.scss";`
			},
			less: {
				modifyVars: {

				},
				javascriptEnabled: true
			}
		},
		sourceMap: process.env.NODE_ENV === 'development'
	}
}