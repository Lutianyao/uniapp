<template>
    <view class="container">
        <block>
            <!-- 有封面图 -->
            <view class="userinfo" v-if="LoginUser.cover" :style="{ background: 'url(' + LoginUser.cover + ')' }">
                <!-- 在微信平台出现 -->
                <!-- #ifdef MP-WEIXIN -->
                <!-- 头像 -->
                <view class="userinfo-avatar">
                    <open-data type="userAvatarUrl"></open-data>
                </view>

                <!-- 昵称 -->
                <view class="nickname-carid">
                    <view v-if="LoginUser.nickname" class="userinfo-nickname">
                        {{ LoginUser.nickname }}
                    </view>
                    <open-data v-else class="userinfo-nickname" type="userNickName"></open-data>
                </view>

                <view class="userinfo-carid" v-if="!LoginUser">
                    <u-button type="success" @click="AuthLogin">授权登录</u-button>
                </view>
                <!-- #endif -->

                <!-- 在H5 || app => 应用软件 -->
                <!-- #ifdef H5 || APP-PLUS -->
                <view class="avatar">
                    <u-image width="100%" height="200px" src="/static/images/logo.png"></u-image>
                </view>

                <view class="nickname-carid">
                    <text class="userinfo-nickname" v-if="LoginUser.nickname">
                        {{ LoginUser.nickname }}
                    </text>
                    <text class="userinfo-nickname" v-else>临时用户</text>
                </view>

                <view class="userinfo-carid" v-if="!LoginUser">
                    <u-button type="success" shape="circle">用户登录</u-button>
                </view>
                <!-- #endif -->

            </view>

            <!-- 没有封面图 -->
            <view v-else class="userinfo">
                <!-- #ifdef MP-WEIXIN -->
                <!-- 头像 -->
                <view class="userinfo-avatar">
                    <open-data type="userAvatarUrl"></open-data>
                </view>

                <!-- 昵称 -->
                <view class="nickname-carid">
                    <view class="userinfo-nickname" v-if="LoginUser.nickname">
                        {{ LoginUser.nickname }}
                    </view>
                    <open-data v-else class="userinfo-nickname" type="userNickName">
                    </open-data>
                </view>

                <view class="userinfo-carid" v-if="!LoginUser">
                    <u-button type="success" @click="AuthLogin">授权登录</u-button>
                </view>
                <!-- #endif -->

                <!-- #ifdef H5 || APP-PLUS -->
                <view class="avatar">
                    <u-image width="100%" height="200px" src="/static/images/logo.png">
                    </u-image>
                </view>

                <view class="nickname-carid">
                    <text class="userinfo-nickname" v-if="LoginUser.nickname">
                        {{ LoginUser.nickname }}
                    </text>
                    <text class="userinfo-nickname">临时用户</text>
                </view>

                <view class="userinfo-carid" v-if="!LoginUser">
                    <u-button type="success" shape="circle">用户登录</u-button>
                </view>
                <!-- #endif -->
            </view>
            <view class="usermotto">
                <view class="profile-items" @click="onProfile">
                    <text>修改信息</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <view class="profile-items" @click="onMyOrder">
                    <text>我的预约</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <view class="profile-items" @click="onAddress">
                    <text>我的收货地址</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <view class="profile-items" @click="onRecord">
                    <text>消费记录</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <view class="profile-items" @click="calling">
                    <text>联系我们</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <view class="profile-items" @click="calling">
                    <text>联系我们</text>
                    <image src='/static/images/icons/row.png'></image>
                </view>
                <!-- <view class="profile-items" @click="logout" v-if="LoginUser">
                    <text>退出登陆</text>
                    <image src='/static/images/icons/row.png'></image>
                </view> -->
            </view>
        </block>
        <u-toast ref="uToast"></u-toast>
        <u-modal :show="showdel" showCancelButton :content='content' @confirm="confirm" ref="uModal"
            @cancel="showdel = false"></u-modal>
    </view>
</template>
<script>
export default {
    onShow() {
        let LoginUser = uni.getStorageSync('LoginUser')

        this.LoginUser = LoginUser
    },
    data() {
        return {
            LoginUser: null,
            showdel: false,
            content: '是否确认退出登陆?'
        }
    },
    methods: {
        AuthLogin() {
            uni.login({
                // 获取code
                provider: 'weixin',
                success: async (res) => {
                    // 获取到的code进行赋值
                    let code = res.code
                    let result = await this.$u.api.user.login({ code: code })
                    // 登录失败=>出错了/未绑定账号
                    if (result.code === 0) {
                        this.$refs.uToast.show({
                            type: 'default',
                            message: result.msg,
                            duration: 1400
                        })
                        // 去绑定账号页
                        if (result.url) {
                            setTimeout(() => {
                                this.$u.route({
                                    url: 'pages/user/bind/bind'
                                })
                            }, 1500);
                        }
                        return false
                    } else {
                        this.$refs.uToast.show({
                            type: 'default',
                            message: result.msg,
                            duration: 1400
                        })
                        uni.setStorageSync('LoginUser', result.data)
                        this.LoginUser = result.data
                        return false
                    }
                }
            })
        },
        onProfile() {
            this.$u.route({
                url: 'pages/user/profile/profile'
            })
        },
        onAddress() {
            this.$u.route({
                url: 'pages/user/address/index'
            })
        },
        onMyOrder() {
            this.$u.route({
                url: 'pages/project/order/index'
            })
        },
        onRecord() {
            this.$u.route({
                url: 'pages/user/record/record'
            })
        },
        calling() {
            uni.makePhoneCall({
                phoneNumber: '13232123456'
            });
        },
        // logout() {
        //     this.showdel = true
        // },
        // confirm() {
        //     this.showdel = false
        //     uni.removeStorageSync('LoginUser')
        //     uni.switchTab({
        //         url: '/pages/user/base/index',
        //     })
        // },
    }
}
</script>
<style>
page {
    background-color: rgb(247, 247, 247);
}

.login {
    margin-top: 500rpx;
    background-color: #0173DE;
    width: 400rpx;
    color: white;
    opacity: 0.7;
}

.button-hover {
    color: white;
    opacity: 1;
    background-color: #0173DE;
}

.login {
    margin: 400rpx;
}

.userinfo {
    width: 100%;
    height: 350rpx;
    padding: 40rpx 0rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
    color: white;
}

.userinfo-avatar {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    overflow: hidden;
}

.nickname-carid {
    font-size: 36rpx;
    margin: 10rpx 0;
}

.userinfo-carid {
    padding-bottom: 5rpx;
    font-size: 26rpx;
}

.usermotto {
    width: 100%;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.profile-items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: auto;
    width: auto;
    padding: 20rpx 50rpx;
    border-bottom: 20rpx solid rgb(234, 234, 234);
    font-size: 26rpx;
    box-shadow: 0 0 10px #DDD;
}

.profile-items image {
    height: 36rpx;
    width: 36rpx;
}


.auth {
    width: 300rpx;
    background-color: #4ea9f5;
    border-radius: 20rpx;
    margin-top: 20rpx;
    color: #fff;
}
</style>