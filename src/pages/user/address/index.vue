<template>
    <view class="list">
        <u-radio-group v-model="active" placement="column" @change="groupChange" v-if="AddressList.length > 0">
            <view class="item" v-for="item in AddressList" :key="item.id">
                <view class="header">
                    <view class="address-name">收货人：{{item.consignee}}</view>
                    <view class="address-name">联系方式：{{item.mobile}}</view>
                </view>
                <view class="city">地址：{{item.region_text}} {{item.address}}</view>
                <!-- <view class="address">详细地址：财智大厦</view> -->
                <view class="btn-box">
                    <view class="left-btn">
                        <u-radio :customStyle="{marginBottom: '8px'}" label="设置默认地址" :name="item.id">
                        </u-radio>
                    </view>
                    <view class="right-btn">
                        <view class="edit" @click="onEdit(item.id)">
                            <span>
                                <image src="/static/images/icons/edit.png"></image>
                            </span>
                            <span>编辑</span>
                        </view>
                        <view class="del" @click="onDel(item.id)">
                            <span>
                                <image src="/static/images/icons/del.png"></image>
                            </span>
                            <span>删除</span>
                        </view>
                    </view>
                </view>
            </view>
        </u-radio-group>
        <u-empty mode="list" v-else>
        </u-empty>
        <!-- 底部添加地址 -->
        <u-button type="primary" @click="add" :custom-style="addressBtn" text="新增地址"></u-button>
        <u-modal :show="show" :content="content" @confirm="confirm" @cancel="cancel" :asyncClose="true" showCancelButton
            ref="uModal">
        </u-modal>
        <u-toast ref="notice"></u-toast>
    </view>
</template>
<script>
export default {
    onShow() {
        let LoginUser = uni.getStorageSync('LoginUser');
        this.LoginUser = LoginUser;
        this.AddressData()
    },
    data() {
        return {
            LoginUser: null,
            active: 0,
            AddressList: [],
            addressBtn: {
                position: 'fixed',
                left: '0',
                bottom: '0',
                width: '100%',
                backgroundColor: '#4ea9f5',
                borderRadius: '0px',
                color: '#fff',
            },
            show: false,
            content: '',
            addressid: null
        }
    },
    methods: {
        // 选择默认收货地址
        async groupChange(value) {
            let data = {
                userid: this.LoginUser.id,
                id: value
            }
            let result = await this.$u.api.user.AddressSelect(data)
            if (result.code === 1) {
                this.AddressData()
            }
        },
        // 请求收货地址列表
        async AddressData() {
            let result = await this.$u.api.user.AddressIndex({ userid: this.LoginUser.id })
            if (result.code === 1) {
                for (let item of result.data) {
                    if (item.status == 1) {
                        this.active = item.id
                    }
                }
                this.AddressList = result.data
            }
        },
        // 新增地址
        add() {
            this.$u.route({
                url: 'pages/user/address/add'
            })
        },
        // 删除收货地址
        onDel(value) {
            this.show = true;
            this.content = '确定删除该地址？';
            this.addressid = value
            return false
        },
        // 确认删除收货地址
        async confirm() {
            let result = await this.$u.api.user.AddressDel({ addressid: this.addressid })
            if (result.code === 1) {
                if (result.code === 1) {
                    this.AddressData()
                    this.$refs.notice.show({
                        type: 'default',
                        message: result.msg,
                        duration: 1400
                    })
                }
            } else {
                this.$refs.notice.show({
                    type: 'default',
                    message: result.msg,
                    duration: 1400
                })
            }
            this.show = false;
        },
        // 取消
        cancel() {
            this.show = false;
        },
        onEdit(value) {
            this.$u.route('pages/user/address/edit', {
                addressid: value
            })
        }
    },
}
</script>
<style>
.address-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #4ea9f5;
    border-radius: 0px;
    color: #fff;
}

/* 列表 */

.list .item {
    margin: 20rpx 0;
    padding: 30rpx 20rpx;
    box-shadow: 0 0 20px #ccc;
    font-size: 25rpx;
}

.list .header {
    display: flex;
    justify-content: space-between;
}

.list .city {
    margin: 20rpx 0;
}

.btn-box {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-between;
}

.right-btn {
    display: flex;
    align-items: center;
}

.right-btn .edit,
.right-btn .del {
    margin-right: 20rpx;
    display: flex;
}

.right-btn span:first-child {
    width: 35rpx;
    height: 35rpx;
    display: block;
    margin-right: 10rpx;
}

.right-btn span image {
    width: 100%;
    height: 100%;
}

.right-btn .edit span:last-child {
    color: #4ea9f5;
}

.right-btn .del span:last-child {
    color: red;
}

/* 修改单选按钮 */
radio .wx-radio-input {
    width: 35rpx;
    height: 35rpx;
}

radio .wx-radio-input.wx-radio-input-checked {
    width: 35rpx;
    height: 35rpx;
}

radio .wx-radio-input.wx-radio-input-checked::before {
    width: 35rpx;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 30rpx;
}
</style>