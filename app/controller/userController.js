'user strict'
const Controller = require('egg').Controller
const Crypto = require('crypto')

class UserController extends Controller {
    // 登录
    async loginByUsername() {
        const { ctx, app } = this
        const { username, password } = ctx.request.body
        if (!username) {
            return {
                errorCode: 1,
                errorMessage: '请输入用户名'
            }
        }
        if (!password) {
            return {
                errorCode: 1,
                errorMessage: '请输入密码'
            }
        }
        const result = await ctx.model.Admin.findUser(username)
        let salt
        if (result && result.length > 0) {
            salt = result[0].salt
        } else {
            return { errorCode: 1, errorMessage: "用户名或密码错误" }
        }

        const saltPassword = password + ':' + salt
        const md5 = Crypto.createHash('md5')
        md5.update(saltPassword)
        const md5Password = md5.digest('hex')
        let isLogin = false

        ctx.status = 200
        if (md5Password === result[0].password) {
            const menuList = ctx.model.Menu.findMenuByAdminId(result[0].id)
            isLogin = true
            ctx.session.user = {
                userId: result[0].id,
                userName: result[0].username,
                isLogin: isLogin,
                isSystem: result[0].isSystem
            }

            ctx.body = {
                errorCode: 0,
                errorMessage: '登录成功',
                data: {
                    userId: result[0].id,
                    userName: result[0].username,
                    roles: result[0].username,
                    introduction: "我是超级管理员",
                    avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                    token: username
                }
            }
        } else {
            ctx.body = {
                errorCode: 1,
                errorMessage: "用户名或密码错误"
            }
        }

    }

    // 获取用户信息
    async getUserInfo() {
        const { ctx, app } = this
        const { token } = ctx.query
        const result = await ctx.model.Admin.findUser(token)
        ctx.status = 200
        if (!result || result.length === 0) {
            ctx.body = {
                errorCode: 1,
                errorMessage: '登录失败，请重新登录',
            }
            return 
        }
        ctx.body = {
            errorCode: 0,
            errorMessage: '登录成功',
            data: {
                userId: result[0].id,
                userName: result[0].username,
                roles: result[0].username,
                introduction: "我是超级管理员",
                avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                token: token
            }
        }
    }
}

module.exports = UserController