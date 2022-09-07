<template>
    <view>
        <view class="user">
            <view class="user-imge">
                <open-data type="userAvatarUrl"></open-data>
            </view>
            <text>请填写已有账号或新注册账号</text>
        </view>

        <u--form borderBottom labelAlign="right" errorType="toast" :rules="rules" :model="user" ref="bind">
            <u-form-item label="邮箱" prop="email" borderBottom>
                <u--input v-model="user.email" border="none" placeholder="请输入邮箱"></u--input>
            </u-form-item>
            <u-form-item label="密码" prop="password" borderBottom>
                <u--input v-model="user.password" border="none" placeholder="请输入密码" password></u--input>
            </u-form-item>
        </u--form>
        <u-button text="绑定" type="primary" @click="submit"></u-button>
        <!-- 顶部提示 -->
        <u-notify ref="uNotify"></u-notify>
        <!-- 弹出确认框 -->
        <!-- show=>是否显示 content=>显示的内容 confirm=>点击确认 cancel=>点击取消 asyncClose=>是否异步确认 showCancelButton=>显示取消 closeOnClickOverlay=>点击遮罩关闭 -->
        <u-modal :show="show" :content="content" @confirm="confirm" @cancel="cancel" :asyncClose="true" showCancelButton
            :closeOnClickOverlay="true" ref="uModal">
        </u-modal>
        <!-- 轻提示 -->
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    onReady() {
        this.$refs.bind.setRules(this.rules)
    },
    data() {
        return {
            user: {
                email: '',
                password: ''
            },
            rules: {
                email: [{
                    type: 'string',
                    required: true,
                    message: '请填写邮箱',
                    trigger: ['blur', 'change']
                }],
                password: [
                    {
                        type: 'string',
                        required: true,
                        message: '请输入密码',
                        // 可以单个或者同时写两个触发验证方式
                        trigger: ['blur', 'change']
                    }
                ]
            },
            show: false,
            content: ''
        }
    },
    methods: {
        submit() {
            this.$refs.bind.validate().then(res => {
                uni.login({
                    provider: 'weixin',
                    success: async (auth) => {
                        let data = {
                            email: this.user.email,
                            password: this.user.password,
                            code: auth.code
                        }
                        let result = await this.$u.api.user.bind(data)
                        // 绑定成功
                        if (result.code === 1) {
                            this.$refs.uNotify.show({
                                type: 'success',
                                message: result.msg,
                                duration: 1500
                            })
                            // 关闭后跳转
                            setTimeout(() => {
                                this.$u.route({
                                    type: 'switchTab',
                                    url: 'pages/user/base/index'
                                })
                            }, 1500);
                            return false
                        } else {
                            if (result.url) {
                                this.show = true;
                                this.content = result.msg
                                return false
                            }
                            this.$refs.uNotify.show({
                                type: 'error',
                                message: result.msg,
                                duration: 1500
                            })
                        }
                    }
                })
            }).catch(error => {
            })
        },
        async confirm() {
            uni.login({
                provider: 'weixin',
                success: async (auth) => {
                    let data = {
                        email: this.user.email,
                        password: this.user.password,
                        code: auth.code
                    }
                    let result = await this.$u.api.user.register(data)
                    if (result.code === 1) {
                        this.$refs.uNotify.show({
                            type: 'success',
                            message: result.msg,
                            duration: 1400
                        })
                        // 关闭后跳转
                        setTimeout(() => {
                            this.$u.route({
                                type: 'switchTab',
                                url: 'pages/user/base/index'
                            })
                        }, 1500);
                        return false
                    } else {
                        this.$refs.uToast.show({
                            type: 'default',
                            message: result.msg,
                            duration: 1400
                        })
                    }
                }
            })
            this.show = false;
        },
        cancel() {
            this.show = false;
        }
    },
}
</script>
<style>
.user {
    width: 100%;
    height: 450rpx;
    background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
    padding-top: 40rpx;
}

.user-imge {
    width: 200rpx;
    height: 200rpx;
    background-color: greenyellow;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
}

.user-imge image {
    width: 100%;
    height: 100%;
}

.user text {
    margin-top: 50rpx;
    display: block;
    text-align: center;
    color: #fff;
}
</style>