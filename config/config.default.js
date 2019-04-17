'use strict'

module.exports = appInfo => {
    const config = exports = {}

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1522725425962_5535'

    // add your config here
    config.cors = {
        //origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true,
    }
    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        // timestamps: false,
        // freezeTableName: true,
        // underscored: true,
        database: 'study',
        host: 'localhost',
        port: '3306',
        username: 'root',
        password: 'yan37719615',
    }

    config.session = {
        key: 'vue-admin',
        httpOnly: false,
        encrypt: false,
    }

    config.security = {
        csrf: false,
        domainWhiteList: ['http://localhost:9527'],
    }

    config.middleware = []

    config.cluster = {
        listen: {
            port: 3000,
            hostname: '0.0.0.0',
        }
    }

    return config
}
