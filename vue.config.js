'use strict'
const webpack = require('webpack')
const path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = '业务支撑平台' // 页面标题设置

const themeColor = '#4989f7' // 页面标题设置

const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'assets',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/service/101': {
                // target: 'http://192.168.30.10:10101',
                target: 'http://192.168.20.40:10101', 
                // target: 'http://192.168.20.171',
                ws: true,
                changeOrign: true
            },
            '/service/103': {
                // target: 'http://192.168.30.10:10103',
                target: 'http://192.168.20.40:10103', // 要访问的接口域名
                // target: 'http://192.168.20.171', // 要访问的接口域名
                ws: true, // 是否启用websockets
                changeOrigin: true //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                //   pathRewrite: {
                //     "^/api": "" //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
                //   },
            },
            '/service/107': {
                // target: 'http://192.168.20.171',
                target: 'http://192.168.20.40:10086',
                changeOrign: true
            }
        },
        // 开启mock server
        // after: require('./mock/mock-server.js')
    },
    configureWebpack: {
        // name是提供标题，可以在index.html注入到title属性
        name: name,
        devtool: 'source-map',
        resolve: {
            alias: {
                '@': resolve('src'),
                styles: resolve('src/styles')
            },
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // 生成仅包含颜色的替换样式（主题色等）
            new ThemeColorReplacer({
                fileName: 'style/theme-colors.[contenthash:8].css',
                matchColors: [
                    ...forElementUI.getElementUISeries(themeColor), // element-ui主色系列
                    '#0cdd3a', // 自定义颜色
                    '#c655dd'
                ],
                changeSelector: forElementUI.changeSelector,
                isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
            })
        ]
    },
    // 全局引入混入的主题scss文件
    css: {
        loaderOptions: {
            sass: {
                data: `@import "src/assets/themes/_handle.scss";` //如果 sass-loader为最新版本 key值为 ‘prependData'  否则是  'data'
            }
        }
    },
    chainWebpack(config) {
        // it can improve the speed of the first screen, it is recommended to turn on preload
        config.plugin('preload').tap(() => [{
            rel: 'preload',
            // to ignore runtime.js
            // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
            fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            include: 'initial'
        }])

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config.when(process.env.NODE_ENV !== 'development', config => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [{
                    // `runtime` must same as runtimeChunk name. default is `runtime`
                    inline: /runtime\..*\.js$/
                }])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: 'chunk-elementUI', // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            })
            // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
            config.optimization.runtimeChunk('single')
        })
    }
}