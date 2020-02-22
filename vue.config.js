module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/':{
                target:'http://47.98.190.231/api/',
                changeOrigin:true,
            }
        }
    }
}
