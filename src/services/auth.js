const install = (vue, vm) => {
    let check = async () => {
        // 获取cookie
        let LoginUser = uni.getStorageSync('LoginUser')
        // 判断是否存在
        if (!LoginUser) {
            uni.showToast({
                title: '请先登录',
                icon: 'error',
                duration: 1500
            })
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/user/base/index'
                })
            }, 1000);
        }
        // 将userid传到后台检查账号密码信息是否正确
        let userid = LoginUser.id ? LoginUser.id : 0
        let result = await uni.$u.api.user.check({ userid: userid })
        // 若账号密码不正确则清除该cookie
        if (result.code === 0) {
            uni.showToast({
                title: result.msg,
                icon: 'error',
                duration: 1500
            })
            uni.removeStorageSync('LoginUser')
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/user/base/index'
                })
            }, 1000);
        } else {
            uni.setStorageSync('LoginUser', result.data)
        }
    }
    vm.$u.auth = {
        check
    }
}

export default {
    install
}