const webpack = require('webpack');
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'assets',
    lintOnSave: false,
    runtimeCompiler: false,
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('components', resolve('./src/components'))
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production'
        } else {
            config.mode = 'development'
        }
    },
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {},
        modules: false
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: "http://192.168.1.30:9041",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/yapi': {
                target: 'http://yapi.demo.qunar.com/mock/46500',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/yapi': '/'
                }
            }
        }
    },
    pluginOptions: {
        // ...
    }
}