<template>
    <view>
        <view class="information">
            <text class='subject'>{{info.project.name}}</text>
            <text class='createtime'>预约时间：{{info.createtime}}</text>
            <text class='content'>备注：{{info.content}}</text>
            <text class='price' v-if="info.status == 1 && info.price >= 0">价格：￥{{info.price}}</text>
        </view>
        <view class='mar'> </view>

        <view class="process">
            <!-- 已下单 -->
            <view v-if="info.status >= 0 || info.status < -1 || info.status == -1" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>已下单</text>
                        <text class='cate-stat'>已完成</text>
                    </view>
                </view>
            </view>

            <!-- 未接单 -->
            <view v-if="info.status == 0" class='progres-undone'>
                <view class='line'></view>
                <icon type="success" size="20" color="grey" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>未接单</text>
                        <text class='cate-stat'>正在进行</text>
                    </view>
                </view>
            </view>

            <!-- 已接单 -->
            <view v-if="info.status > 0 || info.status < -1 || info.status == -1" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>已接单</text>
                        <text class='cate-stat'>已完成</text>
                    </view>
                </view>
            </view>

            <!-- 未付款 -->
            <view v-if="info.status == 1" class='progres-undone'>
                <view class='line'></view>
                <icon type="success" size="20" color="grey" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>未付款</text>
                        <text class='cate-stat'>正在进行</text>
                    </view>
                </view>
            </view>

            <!-- 已付款 -->
            <view v-if="info.status > 1 || info.status < -1 || info.status == -1" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>已付款</text>
                        <text class='cate-stat'>已完成</text>
                    </view>
                </view>
            </view>

            <!-- 等待上门 -->
            <view v-if="info.status == 2" class='progres-undone'>
                <view class='line'></view>
                <icon type="success" size="20" color="grey" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>等待上门</text>
                        <text class='cate-stat'>正在进行</text>
                    </view>
                </view>
            </view>

            <!-- 预约售后中 -->
            <view v-if="info.status == -2" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>售后中</text>
                        <text class='cate-stat'>等审核</text>
                    </view>
                </view>
            </view>

            <!-- 撤销预约被拒绝 -->
            <view v-if="info.status == -3" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>售后结束</text>
                        <text class='cate-stat'>重新申请售后</text>
                    </view>
                </view>
            </view>

            <!-- 撤销预约结束 -->
            <view v-if="info.status == -1" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>撤销预约成功</text>
                        <text class='cate-stat'>售后结束</text>
                    </view>
                </view>
            </view>


            <!-- 预约已完成 -->
            <view v-if="info.status > 2" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>预约已完成</text>
                        <text class='cate-stat'>已完成</text>
                    </view>
                </view>
            </view>

            <!-- 已评分 -->
            <view v-if="info.status >= 3 && info.rate" class='progres-done'>
                <view class='line'></view>
                <icon type="success" size="20" color="rgb(78,169,245)" />
                <view class='cateA'>
                    <view class='cate'>
                        <text class='cate-item'>已评分：{{info.rate}}分</text>
                        <text class='cate-stat'>已完成</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- 消息提示的组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>
<script>
export default {
    onLoad(option) {
        this.$u.auth.check()
        if (!option || JSON.stringify(option) == '{}') {
            this.$refs.notice.show({
                message: '该预约订单不存在',
                type: 'error',
                icon: true,
                complete: () => {
                    this.$u.route({
                        url: 'pages/project/order/index'
                    })
                }
            })
            return false
        }
        let LoginUser = uni.getStorageSync('LoginUser')
        this.LoginUser = LoginUser
        this.orderid = option.orderid
        this.Info()
    },
    data() {
        return {
            orderid: 0,
            LoginUser: {},
            info: {
                project: {}
            }
        }
    },
    methods: {
        async Info() {
            let result = await this.$u.api.project.OrderInfo({ orderid: this.orderid })

            if (result.code === 1) {
                this.info = result.data
            }
        }
    },
}
</script>
<style>
/* pages/query/query.wxss */
page {
    background-color: rgb(247, 247, 247);
}

.information {
    border-top: 1rpx solid rgb(194, 194, 194);
    border-bottom: 30rpx solid rgb(240, 240, 240);
    padding: 30rpx;
    box-shadow: 0 0 10px #DDD;
}

.begin-time,
.end-time {
    font-size: 30rpx;
    color: rgb(140, 140, 140);
}

.information text {
    display: block;
}

.mar {
    width: 95%;
    margin: 20rpx auto;
    height: 2rpx;
    background-color: #CCCCCC;
}

.progres-done,
.progres-undone {
    width: 550rpx;
    margin: 50rpx 50rpx 0 150rpx;
    position: relative;
    /* height: 150rpx; */
    height: 100rpx;
    /*暂时设置为固定*/
}
.progres-undone {
    color: rgb(140, 140, 140);
}

.line {
    width: 6rpx;
    height: 130rpx;
    background-color: #CCCCCC;
    display: inline-block;
    position: absolute;
    top: 60rpx;
    left: -50rpx;
    z-index: 2;
}

.progres-done .line {
    background-color: rgb(78, 169, 245);
}

icon {
    display: inline-block;
    position: absolute;
    top: 30rpx;
    left: -67rpx;
    z-index: 3;
}

.cateA {
    display: inline-block;
    position: relative;
    width: 500rpx;
    padding: 15rpx;
    /*border-bottom: 1rpx solid #CCCCCC;*/
    box-shadow: 0 0 10rpx #DDD;
    margin-top: 20rpx;
}

.cate {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 32rpx;
}

.cate-stat {
    font-size: 26rpx;

}

.progres-done {
    color: rgb(1, 115, 222);
}

.pro-time {
    font-size: 26rpx;

}

#last {
    display: none;
}

.process view:last-child .line {
    display: none;
}
</style>