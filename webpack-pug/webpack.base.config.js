const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");

const PATHS = {
	src: path.join(__dirname, './src'),
	dist: path.join(__dirname, './dist'),
	assets: 'assets/'
};


// Pages const for HtmlWebpackPlugin

//const PAGES_DIR = PATHS.src;
const PAGES_DIR = `${PATHS.src}/pug/pages`;
const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter(fileName => fileName.endsWith('.pug'));


module.exports = {
	externals: {
		paths: PATHS
	},
	entry: {
		main: PATHS.src,
		//app_2: './src/js/app_2.js', Second point of entry
	},
	output: {
		path: PATHS.dist,
		filename: `${PATHS.assets}js/[name].[contenthash].js`,
		publicPath: '',
	},
	optimization: {
        minimize: false,
        splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true,
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude : '/node_modules/'
			},{
                test: /\.pug$/,
                loader: 'pug-loader?pretty=true'
            },{
				test:/\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			},{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			},{
				test:/\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: { path: `./postcss.config.js`}
						}
					},{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},{
				test:/\.css$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: { path: `./postcss.config.js`}
						}
					}
				]
			}
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
		}),
    	new MiniCssExtractPlugin({
    		filename: `${PATHS.assets}css/[name].[contenthash].css`,
    	}),
    	/*new HtmlWebpackPlugin({
    		hash: false,
			minify: false,
    		template: `${PATHS.src}/index.html`,
    		filename: './index.html',
    		//inject: false, Disable auto add scripts and styles
    	}),*/

		//Automatic creation any html pages (Don't forget to RERUN dev server!)
		...PAGES.map(
			page =>
				new HtmlWebpackPlugin({
                    hash: false,
                    minify: false,
					template: `${PAGES_DIR}/${page}`,
                    filename: `./${page.replace(/\.pug/,'.html')}`
                    //inject: false, Disable auto add scripts and styles
				})
		),
    	new CopyWebpackPlugin({
    		patterns: [
				{ from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
				//{ from: `${PATHS.src}/${PATHS.assets}video`, to: `${PATHS.assets}video` },
				//{ from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
				{ from: `${PATHS.src}/static`, to: ''},
    		]
    	})
  	]
};
