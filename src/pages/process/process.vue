<template>
    <view>
        <view class="views">
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">完善个人资料并且填写收货地址</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">开始预约</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">填写预约相关的信息</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">提交后，等待平台联系您</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">师傅会主动与您沟通，并且进行报价</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">双方协商完成后，平台会接单服务</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">师傅会根据您的地址，进行上门服务</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">服务完成后，平台会自动修改订单状态</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">订单已完成后，可对该订单进行评分</view>
            </view>
            <view class="item">
                <u-icon name="checkmark-circle" color="#00b8ff" size="24"></u-icon>
                <view class="text">评分完成后，会送出积分礼品</view>
            </view>
        </view>
    </view>
</template>

<style>
.views{
    margin:10px 20px 0;
}

.item{
    width: 100%;
    height: 70rpx;
    color: #00b8ff;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 60rpx;
    font-size: 24rpx;
}

.item::after{
    content: '';
    height: 60rpx;
    border: 1px solid #ccc;
    display: block;
    position: absolute;
    bottom: -60rpx;
    left: 20rpx;
}

.item:last-child::after{
    display: none;
}

.u-icon{
    margin-right: 20rpx;
}

@media screen and (max-width:320px){
    .item::after{
        left: 25rpx;
    }
}
</style>