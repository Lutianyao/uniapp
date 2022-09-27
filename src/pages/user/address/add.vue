<template>
    <view>
        <u--form labelPosition="left" :model="form" :rules="rules" :labelWidth="75" labelAlign="right" ref="form">
            <u-form-item label="收货人" prop="consignee" borderBottom>
                <u--input v-model="form.consignee" placeholder="请输入收货人"></u--input>
            </u-form-item>

            <u-form-item label="联系号码" prop="mobile" borderBottom>
                <u--input v-model="form.mobile" placeholder="请输入联系号码"></u--input>
            </u-form-item>

            <!-- 地区 -->
            <u-form-item label='选择地区' prop='region_text' @click="RegionShow = true">
                <pick-regions :defaultRegion="form.region" @getRegion="handleGetRegion">
                    <u--input v-model="form.region_text" disabled disabledColor="#ffffff" placeholder="请选择地区"
                        border="none">
                    </u--input>
                    <u-icon slot="right" name="arrow-right">
                    </u-icon>
                </pick-regions>
                <u-icon slot="right" name="arrow-right">
                </u-icon>
            </u-form-item>

            <u-form-item label="详细地址" prop="address" borderBottom>
                <u--input v-model="form.address" placeholder="请输入详细地址"></u--input>
            </u-form-item>

            <u-form-item label=" " prop="status" borderBottom>
                <u-checkbox-group v-model="checkboxValue1" placement="column" @change="checkboxChange">
                    <u-checkbox label="设置默认收货地址" name="1">
                    </u-checkbox>
                </u-checkbox-group>
            </u-form-item>
        </u--form>

        <u-button type="primary" @click="add" :custom-style="addressBtn" text="添加地址"></u-button>
        <u-toast ref="notice"></u-toast>
    </view>
</template>
<script>
// 引用地区选择组件
import pickRegions from '@/components/pick-regions/pick-regions.vue'
export default {
    components: {
        pickRegions
    },
    onShow() {
        this.$u.auth.check()
        // 获取cookie
        let LoginUser = uni.getStorageSync('LoginUser')
        // 给表单的属性赋值
        this.form.consignee = LoginUser.nickname ? LoginUser.nickname : ''
        this.form.region = LoginUser.region ? LoginUser.region : []
        this.form.region_text = LoginUser.region_text ? LoginUser.region_text : ''

        this.RegionCode = LoginUser.district
        // 将cookie数据赋值给LoginUser
        this.LoginUser = LoginUser
        // 调用规则
        this.$refs.form.setRules(this.rules)
    },
    data() {
        return {
            rules: {
                consignee: [{
                    required: true,
                    message: '请输入收货人',
                    trigger: ['change', 'blur'],
                }],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: ['change', 'blur'],
                    },
                    {
                        // 自定义验证函数，见上说明
                        validator: (rule, value, callback) => {
                            // 上面有说，返回true表示校验通过，返回false表示不通过
                            // uni.$u.test.mobile()就是返回true或者false的
                            return uni.$u.test.mobile(value);
                        },
                        message: '手机号码不正确',
                        // 触发器可以同时用blur和change
                        trigger: ['change', 'blur'],
                    }
                ],
                region_text: [
                    {
                        required: true,
                        message: '请选择地区',
                        trigger: ['change', 'blur'],
                    }
                ],
                address: [
                    {
                        required: true,
                        message: '请输入详情地址',
                        trigger: ['change', 'blur'],
                    }
                ],
            },
            addressBtn: {
                top: '3em',
                width: '100%',
                backgroundColor: '#4ea9f5',
                borderRadius: '0px',
                color: '#fff',
            },
            form: {
                consignee: '',
                mobile: '',
                address: '',
                region_text: '',
                region: []
            },
            RegionShow: false,
            RegionCode: null,
            LoginUser: {},
            checkboxValue1: [],
            status: 0,
        }
    },
    methods: {
        handleGetRegion(value) {
            let [province, city, district] = value
            let region_text = ''
            let region_code = null
            let region = []

            if (province.name) {
                region_text = province.name + '-'
                region_code = province.code
                region.push(province.name)
            }

            if (city.name) {
                region_text += city.name + '-'
                region_code = city.code
                region.push(city.name)
            }

            if (district.name) {
                region_text += district.name
                region_code = district.code
                region.push(district.name)
            }

            this.form.region_text = region_text

            this.RegionCode = region_code

            this.form.region = region

            this.RegionShow = false
        },
        // 是否设置为默认收货地址
        checkboxChange(value) {
            if (value.length > 0) {
                this.status = 1
            } else {
                this.status = 0
            }
        },
        add() {
            this.$refs.form.validate().then(async res => {
                let data = {
                    userid: this.LoginUser.id,
                    consignee: this.form.consignee,
                    mobile: this.form.mobile,
                    address: this.form.address,
                    status: this.status,
                    code: this.RegionCode
                }
                let result =await this.$u.api.user.AddressAdd(data)
                if (result.code === 1) {
                    this.$refs.notice.show({
                        type: 'success',
                        message: result.msg,
                        duration: 1400
                    })
                    // 关闭后跳转
                    setTimeout(() => {
                        this.$u.route({
                            url: 'pages/user/address/index'
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