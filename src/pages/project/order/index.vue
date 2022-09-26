<template>
    <view>
        <u-sticky bgColor="#fff">
            <u-tabs ref="tabs" :list="list" lineWidth="40" @change="SelectProject"></u-tabs>
        </u-sticky>
        <view class='orders' v-if="OrderList.length > 0">
            <view class='order-item' v-for="item in OrderList" :key="item.id">
                <view><text>预约项目：</text>{{item.project.name}}</view>
                <view><text>预约时间：</text>{{item.createtime}}</view>
                <view><text>预约状态：</text>{{item.status_text}}</view>
                <view v-if="item.price"><text>费用：</text>{{item.price}}元</view>
                <view class="action">
                    <u-button @click="ToInfo(item.id)" class="item" type="primary" size="mini">详情</u-button>

                    <!-- 商家已接单(已报价) -->
                    <u-button @click="ToPay(item.id)" v-if="item.status == 1 && item.price" class="item" type="success"
                        size="mini">
                        确认支付</u-button>

                    <!-- 已支付、未服务 -->
                    <u-button @click="ToRevoke(item.id)" v-if="item.status > 0 && !item.rate" class="item" type="warning"
                        size="mini">撤销预约</u-button>

                    <u-button @click="ToCancel(item.id)" v-if="item.status == -2 && !item.rate" class="item"
                        type="warning" size="mini">取消撤销</u-button>

                    <!-- 已服务、未评价 -->
                    <u-button @click="ToRate(item.id)" v-if="item.status == 3 && !item.rate" class="item" type="success"
                        size="mini">评分</u-button>
                    <!-- 删除 -->
                    <u-button @click="ToDel(item.id)" v-if="item.status == 3 || item.status == -1 || item.status == -3" 
                    class="item" type="error" size="mini">删除</u-button>
                </view>
            </view>
        </view>

        <view class="orders" v-else>
            <u-empty mode="order">
            </u-empty>
        </view>
        <u-modal :show="PayShow" title="确认支付该订单" showCancelButton @confirm="PayConfirm" @cancel="PayShow = false">
        </u-modal>
        <u-modal :show="RevokeShow" title="确认撤销该预约" showCancelButton @confirm="RevokeConfirm"
            @cancel="RevokeShow = false">
        </u-modal>
        <u-modal :show="DelShow" title="确认删除该订单" showCancelButton @confirm="DelConfirm"
            @cancel="DelShow = false">
        </u-modal>
        <u-popup :show="show" mode="bottom" :round="10" safeAreaInsetTop="true" @close="close">
            <view class="rate">
                <u-rate size="30" :count="count" v-model="value"></u-rate>
            </view>
            <view class="content">
                <text>您的五星好评，是我们无限的动力</text>
            </view>
            <u-button type="warning" text="确定" @click="rate"></u-button>
        </u-popup>

        <!-- 消息提示的组件 -->
        <!-- <u-notify ref="uNotify"></u-notify> -->
        <u-toast ref="uNotify"></u-toast>
    </view>
</template>
<script>
export default {
    onShow() {
        this.LoginUser = uni.getStorageSync('LoginUser')
        this.OrderData()
    },
    data() {
        return {
            list: [{
                name: '全部',
                status: '',
            },
            {
                name: '未接单',
                status: 0
            },
            {
                name: '已接单',
                status: 1
            },
            {
                name: '已付款',
                status: 2
            },
            {
                name: '已完成',
                status: 3
            },
            {
                name: '撤销预约',
                status: -1
            },
            {
                name: '撤销申请中',
                status: -2
            },
            {
                name: '撤销拒绝',
                status: -3
            }
            ],
            LoginUser: {},
            OrderList: [],
            status: null,
            PayShow: false,
            RevokeShow: false,
            DelShow: false,
            orderid: 0,
            show: false,
            count: 5,
            value: 0
        }
    },
    methods: {
        // 异步请求订单列表数据
        async OrderData() {
            let data = {
                userid: this.LoginUser.id
            }

            if (this.status || this.status == 0) {
                data.status = this.status
            }

            let result = await this.$u.api.project.OrderIndex(data)
            if (result.code === 0) {
                return false
            }
            this.OrderList = result.data
        },
        // 选择分类
        SelectProject(value) {
            let status = value.status

            this.status = status

            this.OrderData()
        },
        // 点击支付
        ToPay(orderid) {
            this.PayShow = true

            this.orderid = orderid
        },
        // 确认支付
        async PayConfirm() {
            let data = {
                userid: this.LoginUser.id,
                orderid: this.orderid
            }

            let result = await this.$u.api.project.OrderPay(data)
            if (result.code === 0) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })
                return false
            } else {
                this.$refs.uNotify.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                })
                this.OrderData()
                this.PayShow = false
                return false
            }
        },
        // 点击订单详情
        ToInfo(orderid) {
            this.$u.route({
                url: 'pages/project/order/info',
                params: {
                    orderid: orderid
                }
            })
        },
        // 点击撤销预约
        ToRevoke(orderid) {
            this.orderid = orderid
            this.RevokeShow = true
        },
        // 确定撤销
        async RevokeConfirm() {
            let result = await this.$u.api.project.OrderRevoke({ orderid: this.orderid })
            if (result.code === 0) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })
            } else {
                this.$refs.uNotify.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                })
                this.OrderData()
                this.RevokeShow = false
                return false
            }
        },
        // 取消撤销
        async ToCancel(orderid) {
            let result = await this.$u.api.project.Cancel({ orderid: orderid })
            if (result.code === 0) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })
            } else {
                this.$refs.uNotify.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                })
                this.OrderData()
                return false
            }
        },
        // 点击评分
        ToRate(orderid) {
            this.orderid=orderid
            this.show = true
        },
        // 关闭评分展示
        close() {
            this.show = false
        },
        // 评分
        async rate(){
            let data={
                orderid:this.orderid,
                rate:this.value
            }
            let result = await this.$u.api.project.Rate(data)
            if (result.code === 0) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })
            } else {
                this.$refs.uNotify.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                })
                this.OrderData()
            }
            this.show = false
        },
        // 删除
        ToDel(orderid){
            this.orderid = orderid
            this.DelShow = true
        },
        async DelConfirm(){
            let result = await this.$u.api.project.Del({ orderid: this.orderid })
            if (result.code === 0) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })
            } else {
                this.$refs.uNotify.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                })
                this.OrderData()
                this.DelShow = false
            }
        }
    }
}
</script>
<style>
page {
    background-color: rgb(247, 247, 247);
    font-size: 34rpx;
}

.myorder {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: 30rpx;
}

.myorder view {
    height: 2rpx;
    background-color: #CCC;
    width: auto;
}

.order-item {
    padding: 20rpx 30rpx;
    margin: 30rpx 0rpx;
    border-bottom: 2rpx solid #CCCCCC;
    box-shadow: 0 0 10px #DDD;
}

.order-item text {
    font-size: 32rpx;
}

.order-item .action {
    text-align: right;
    margin-top: 1em;
}

.order-item .action button {
    margin-right: .5em !important;
    width: 20% !important;
    display: inline-block;
    height: 26px;
    line-height: 26px;
}

.u-tabs__wrapper__nav__item__text {
    white-space: nowrap;
}

.rate {
    margin: auto;
    /* padding: 30px; */
}
.content{
    margin: auto;
    padding: 20px;
}
</style>