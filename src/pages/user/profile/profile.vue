<template>
    <view class="container">
        <!-- 封面图片 -->
        <view class="cover" v-if="LoginUser.cover" :style="{ background: 'url(' + LoginUser.cover + ')' }">
            <view class="avatar">
                <!-- #ifdef MP-WEIXIN -->
                <open-data type="userAvatarUrl"></open-data>
                <!-- #endif-->
                <!-- #ifdef H5 || APP-PLUS -->
                <u-image width="100%" height="200px" src="/static/images/cover.jpg"></u-image>
                <!-- #endif -->
            </view>
        </view>
        <!-- 没有封面图 -->
        <view class="cover" v-else>
            <view class="avatar">
                <!-- #ifdef MP-WEIXIN -->
                <open-data type="userAvatarUrl"></open-data>
                <!-- #endif-->
                <!-- #ifdef H5 || APP-PLUS -->
                <u-image width="100%" height="200px" src="/static/images/cover.jpg"></u-image>
                <!-- #endif -->
            </view>
        </view>
        <view class="profile">
            <u--form :model="LoginUser" labelPosition="left" ref="profile" :errorType="errorType">
                <!-- 昵称 -->
                <u-form-item label="昵称" prop="nickname">
                    <u--input v-model="LoginUser.nickname" placeholder="请输入昵称"></u--input>
                </u-form-item>
                <!-- 邮箱 -->
                <u-form-item label="邮箱" prop="email">
                    <u--input v-model="LoginUser.email" disabled placeholder="请输入邮箱"></u--input>
                </u-form-item>
                <!-- 性别 -->
                <u-form-item label='性别' prop='sex' @click="SexShow = true">
                    <u--input v-model="LoginUser.sex_text" disabled disabledColor="#ffffff" placeholder="请选择性别"
                        border="none">
                    </u--input>
                    <u-icon slot="right" name="arrow-right">
                    </u-icon>
                </u-form-item>
                <!-- 地区 -->
                <u-form-item label='地区' prop='region_text' @click="RegionShow = true">
                    <pick-regions :defaultRegion="LoginUser.region" @getRegion="handleGetRegion">
                        <u--input v-model="LoginUser.region_text" disabled disabledColor="#ffffff" placeholder="请选择地区"
                            border="none">
                        </u--input>
                        <u-icon slot="right" name="arrow-right">
                        </u-icon>
                    </pick-regions>
                    <u-icon slot="right" name="arrow-right">
                    </u-icon>
                </u-form-item>
                <!-- 个人简介 -->
                <u-form-item label="简介" prop="content">
                    <u--textarea v-model="LoginUser.content" placeholder="请输入个人简介" height="70" count="true">
                    </u--textarea>
                </u-form-item>
                <!-- 封面图 -->
                <u-form-item label="封面图" prop="cover" labelWidth="50">
                    <u-upload ref="cover" name="cover" :maxCount="1" :fileList="cover" @afterRead="CoverUpload"
                        @delete="CoverDel">
                    </u-upload>
                </u-form-item>
                <!-- 提交按钮 -->
                <u-button @click="submit" type="primary" shape="circle" text="提交修改"></u-button>
            </u--form>
        </view>

        <!-- 性别的选择器 -->
        <u-picker :show="SexShow" :columns="SexList" :defaultIndex=defaultIndex keyName="label" @confirm="SexChange" @cancel="SexShow = false">
        </u-picker>
        <!-- 消息提示的组件 -->
        <u-toast ref="notice"></u-toast>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
// 引用地区选择组件
import pickRegions from '@/components/pick-regions/pick-regions.vue'
export default {
    components: {
        pickRegions
    },
    onReady() {
        let LoginUser = uni.getStorageSync('LoginUser');
        this.LoginUser = LoginUser;
        if (LoginUser.cover) {
            this.cover.push({
                url: LoginUser.cover
            })
        }
        this.defaultIndex = [LoginUser.sex]
        this.$refs.profile.setRules(this.rules)
    },
    data() {
        return {
            LoginUser: {
                nickname: '',
                email: '',
                sex_text: '',
                region_text: '',
                content: ''
            },
            SexList: [
                [
                    { label: '保密', id: '0' },
                    { label: '男', id: '1', },
                    { label: '女', id: '2' }
                ]
            ],
            errorType: ['toast'],
            SexShow: false,
            cover: [],
            RegionShow: false,
            RegionCode: null,
            defaultIndex:[1],
            //表单验证规则
            rules: {
                email: [
                    {
                        required: true,
                        type: 'email',
                        message: '您输入的邮箱格式错误',
                        // 可以单个或者同时写两个触发验证方式
                        trigger: 'blur,change'
                    }
                ],
                nickname: [
                    {
                        required: true,
                        message: '您输入的昵称错误',
                        // 可以单个或者同时写两个触发验证方式
                        trigger: 'blur,change'
                    }
                ],
                sex: [
                    {
                        required: true,
                        message: '请选择性别',
                        trigger: ['change', 'blur'],
                    },
                ],
                region_text: [
                    {
                        required: true,
                        message: '请选择地区',
                        trigger: ['change', 'blur'],
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: ['change', 'blur'],
                    }
                ],
            }
        }
    },
    methods: {
        // 修改性别
        SexChange(value) {
            this.LoginUser.sex_text = value.value[0].label
            this.LoginUser.sex = value.value[0].id
            this.SexShow = false
        },
        // 上传图片
        CoverUpload(value) {
            this.cover.push(value.file)
        },
        // 删除图片
        CoverDel() {
            this.cover = []
        },
        // 修改地区
        handleGetRegion(value) {
            let [province, city, district] = value
            let region_text = ''
            let code = null
            if (province.code) {
                region_text += province.name + '-'
                code = province.code
            }
            if (city.code) {
                region_text += city.name + '-'
                code = city.code
            }
            if (district.code) {
                region_text += district.name
                code = district.code
            }
            this.LoginUser.region_text = region_text
            this.RegionCode = code
        },
        submit() {
            this.$refs.profile.validate().then(async res => {
                let thumb = this.cover[0] ? this.cover[0].thumb : ''
                let data = {}
                if (thumb) {
                    data = {
                        filePath: thumb,
                        name: 'cover',
                        formData: {
                            userid: this.LoginUser.id,
                            nickname: this.LoginUser.nickname,
                            sex: this.LoginUser.sex,
                            code: this.RegionCode ? this.RegionCode : '',
                            content: this.LoginUser.content
                        }
                    }
                } else {
                    data = {
                        userid: this.LoginUser.id,
                        nickname: this.LoginUser.nickname,
                        sex: this.LoginUser.sex,
                        code: this.RegionCode ? this.RegionCode : '',
                        content: this.LoginUser.content
                    }
                }
                let result = await this.$u.api.user.profile(data)
                if (result.code === 1) {
                    uni.setStorageSync('LoginUser', result.data)
                    this.$refs.notice.show({
                        type: 'default',
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
                    this.$refs.notice.show({
                        type: 'default',
                        message: result.msg,
                        duration: 1400
                    })
                }
            }).catch(error => {

            })
        }
    }
}
</script>
<style>
.cover {
    width: 100%;
    background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
    position: relative;
    padding: 5vh 0vh;
    text-align: center;
    z-index: 0;
}

.nickname {
    color: #fff;
}

.avatar {
    width: 12vh;
    height: 12vh;
    margin: 0 auto;
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 3vh;
}

.profile {
    margin-top: 3vh;
    background: #fff;
    padding: 0vh 2vh;
    text-align: left;
}
</style>