const path = require("path");
const resolve = dir => path.join(__dirname, dir);

module.exports = {
    // devServer用于配置开发服务器
    devServer: {
        // 配置HTTP代理，将所有请求代理到http://localhost:3000
        proxy: 'http://localhost:3000'
    },

    // chainWebpack用于配置Webpack的构建流程
    chainWebpack: config => {
        // 设置目录别名，@表示src目录
        config.resolve.alias.set("@", resolve("src"));

        // 根据不同的环境配置不同的打包入口、插件等
        config.when(process.env.NODE_ENV === 'production', config => {
            /* 设置打包入口为main-prod.js */
            config.entry('app').clear().add('./src/main-prod.js')

            // 配置外部依赖，将Vue、VueRouter、axios、Vuex等作为外部依赖引入
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                vuex: 'Vuex',
                /* 'js-md5': 'md5' */
            })

            // 配置HTML插件参数，添加参数isProd
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        config.when(process.env.NODE_ENV === 'development', config => {
            // 设置打包入口为main.js
            config.entry('app').clear().add('./src/main.js')

            // 配置HTML插件参数，添加参数isProd
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },

    // productionSourceMap用于控制是否生成生产环境的source map文件
    productionSourceMap: false
}