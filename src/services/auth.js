const install = (vue, vm) => {
    let check = () => {
        let LoginUser = uni.getStorageSync('LoginUser')

        if (!LoginUser) {
            uni.showToast({
                title: '请先登录',
                icon: 'error',
                duration: 1500
            })
            // uni.removeStorageSync('LoginUser')
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/user/base/index'
                })
            }, 1000);
        }else{
            
        }
    }

    vm.$u.auth = {
        check
    }
}

export default {
    install
}