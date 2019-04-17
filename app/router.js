'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app
    router.post('/api/loginByUsername', controller.userController.loginByUsername)
    router.get('/api/getUserInfo', controller.userController.getUserInfo)
}
