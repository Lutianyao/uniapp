<template>
    <view>
        <!-- 轮播图 -->
        <u-swiper :list="list" indicator indicatorMode="dot">
        </u-swiper>
        <!-- 表单 -->
        <view class="project">
            <u--form :model="project" ref="add" :errorType="errorType" :rules="rules">
                <view class="item">
                    <u-form-item label="预约服务" labelWidth="70" prop="projectname" @click="ProShow = true">
                        <u--input v-model="project.projectname" disabled disabledColor="#ffffff" placeholder="请选择预约服务"
                            border="none">
                        </u--input>
                        <u-icon slot="right" name="arrow-right">
                        </u-icon>
                    </u-form-item>
                </view>
                <view class="item">
                    <u-form-item label="上门地址" labelWidth="70" prop="address" @click="AddrShow = true">
                        <u--input v-model="project.address" disabled disabledColor="#ffffff" placeholder="请选择上门地址"
                            border="none">
                        </u--input>
                        <u-icon slot="right" name="arrow-right">
                        </u-icon>
                    </u-form-item>
                </view>
                <view class="item">
                    <u-form-item label="预约时间" labelWidth="70" prop="createtime_text" @click="DateShow = true">
                        <u--input v-model="project.createtime_text" disabled disabledColor="#ffffff"
                            placeholder="请选择预约时间" border="none">
                        </u--input>
                        <u-icon slot="right" name="arrow-right">
                        </u-icon>
                    </u-form-item>
                </view>
                <!-- 预约备注 -->
                <view class="item">
                    <u-form-item labelWidth="70" prop="content">
                        <u--textarea v-model="project.content" placeholder="请输入预约备注" height="70" count="true">
                        </u--textarea>
                    </u-form-item>
                </view>
                <!-- 提交按钮 -->
                <view class='but'>
                    <button form-type="submit" :customStyle="BtnStyle" @click="submit">我要预约</button>
                </view>
            </u--form>
        </view>
        <!-- 预约服务的选择器 -->
        <u-picker :show="ProShow" :columns="prolist" keyName="name" @confirm="ProChange" @cancel="ProShow = false">
        </u-picker>
        <!-- 上门地址 -->
        <u-picker :show="AddrShow" :columns="addrlist" keyName="name" @confirm="AddrChange" @cancel="AddrShow = false">
        </u-picker>
        <u-datetime-picker ref="datetimePicker" :show="DateShow" mode="datetime" v-model="project.createtime"
            @confirm="DateChange" @cancel="DateShow = false">
        </u-datetime-picker>
        <!-- 消息提示的组件 -->
        <u-toast ref="notice"></u-toast>
        <u-notify ref="uNotify"></u-notify>

    </view>
</template>
<script>
export default {
    data() {
        return {
            list: [],
            prolist: [],
            addrlist: [],
            errorType: ['notice'],
            ProShow: false,
            AddrShow: false,
            DateShow: false,
            project: {
                projectid: 0,
                projectname: '',
                address: '',
                addrid: 0,
                createtime: Number(new Date()),
                createtime_text: '',
                content: ''
            },
            rules: {
                projectname: [
                    {
                        required: true,
                        message: '请选择预约服务',
                        trigger: ['change', 'blur'],
                    }
                ],
                address: [
                    {
                        required: true,
                        message: '请选择上门地址',
                        trigger: ['change', 'blur'],
                    }
                ],
                createtime_text: [
                    {
                        required: true,
                        message: '请选择预约时间',
                        trigger: ['change', 'blur'],
                    }
                ],
            },
        }
    },
    onReady() {
        this.$u.auth.check()
        this.LoginUser = uni.getStorageSync('LoginUser')
        this.$refs.add.setRules(this.rules)
        this.Home()
        this.ProjectName()
        this.AddressData()
    },
    methods: {
        // 获取轮播图数据
        async Home() {
            let result = await this.$u.api.home.Home();
            if (result.data.RecomList.length > 0) {
                let list = []
                for (let item of result.data.RecomList) {
                    list.push(item.cover_cdn)
                }
                this.list = list
            }
        },
        // 获取预约服务数据
        async ProjectName() {
            let result = await this.$u.api.project.Project();

            if (result.data.length <= 0) {
                let data = [
                    [
                        {
                            name: '暂无预约服务'
                        }
                    ]
                ]
                this.prolist = data
                return false;
            }
            this.prolist = [result.data]
        },
        // 获取用户地址数据
        async AddressData() {
            let result = await this.$u.api.user.AddressIndex({ userid: this.LoginUser.id });
            if (result.data.length <= 0) {
                this.addrlist = [
                    [
                        {
                            name: '暂无上门地址'
                        }
                    ]
                ]
                return false
            }
            let list = []
            for (let item of result.data) {
                list.push({
                    id: item.id,
                    name: item.region_text + ' ' + item.address
                })
            }
            this.addrlist.push(list)
        },
        // 获取选择的服务并且赋值
        ProChange(value) {
            let { id, name } = value.value[0]
            this.project.projectid = id
            this.project.projectname = name
            this.ProShow = false
        },
        // 获取选择的地址并且赋值
        AddrChange(value) {
            let { id, name } = value.value[0]
            this.project.addrid = id
            this.project.address = name
            this.AddrShow = false
        },
        // 获取选择的时间并且赋值
        DateChange(value) {
            let time = value.value
            let date = Number(new Date()) + 60 * 60 * 1000
            if (time < date) {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: '请提前一个小时预约'
                })
                return false
            }
            this.project.createtime = time
            this.project.createtime_text = this.$u.timeFormat(time, 'yyyy-mm-dd hh:MM')
            this.DateShow = false
        },
        submit() {
            this.$refs.add.validate().then(async res => {
                let data = {
                    userid: this.LoginUser.id,
                    addrid: this.project.addrid,
                    projectid: this.project.projectid,
                    content: this.project.content,
                    createtime: Math.floor(this.project.createtime / 1000)
                }

                let result = await this.$u.api.project.OrderAdd(data)

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

                    setTimeout(() => {
                        this.$u.route({
                            url: 'pages/project/order/index',
                        })
                    }, 1500);

                    return false
                }
            }).catch(error => {
                this.$refs.uNotify.show({
                    type: 'error',
                    message: error[0].message
                })
                return false
            })
        }
    }
}
</script>
<style>
.u-swiper {
    width: 100%;
    height: 400rpx !important;
    margin-bottom: 50rpx;
}

.u-swiper image {
    width: 100%;
    height: 100% !important;
}

.u-swiper__wrapper {
    height: 400rpx !important;
}

.service {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.service {
    width: 670rpx;
    height: auto;
    padding: 20rpx 45rpx 20rpx 35rpx;
    border-bottom: 1rpx solid #CCCCCC;
}

.service-name {
    width: 80%;
    font-size: 36rpx;
}

.service-price {
    font-size: 36rpx;
}

picker {
    color: #000;
    padding: 20rpx;
    border-radius: 20rpx;
    font-size: 36rpx;
    border: 1rpx solid #CCC;
    margin: 20rpx;
    box-shadow: 0 0 10px #DDD;
}

button {
    width: 400rpx;
    background-color: #0173DE;
    color: white;
    opacity: 0.7;
    box-shadow: 0 0 10px #DDD;
    font-size: 34rpx;
    margin-bottom: 30rpx;
}

.button-hover {

    color: white;
    opacity: 1;
    background-color: #0173DE;
}

.but {
    margin-top: 50rpx;
}

picker view {
    font-size: 30rpx;
}

.project {
    width: 90%;
    margin: 0 auto;
}

.project .item {
    color: #000;
    padding: 0rpx 20rpx;
    border-radius: 20rpx;
    font-size: 36rpx;
    border: 1rpx solid #CCC;
    margin: 20rpx;
    box-shadow: 0 0 10px #DDD;
    background-color: #fff;
}

.project .item .u-form-item {
    padding: 0rpx;
}

.project .u-input {
    background-color: rgba(0, 0, 0, 0) !important;
}
</style>