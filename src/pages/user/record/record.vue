<template>
    <view>
        <u-empty v-if="list.length==0" mode="history">
        </u-empty>
        <u-cell-group v-else v-for="item in list" :key="item.id">
            <u-cell :title="item.content" :label="item.createtime" center></u-cell>
        </u-cell-group>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    onShow() {
        this.RecordList()
    },
    data() {
        return {
            LoginUser: uni.getStorageSync('LoginUser'),
            list: []
        }
    },
    methods: {
        async RecordList() {
            let data = {
                action: 'uniapp',
                userid: this.LoginUser.id
            }

            let result = await this.$u.api.user.Record(data)
            if (result.code == '1') {
                this.list = result.data
            } else {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg
                })
                return false
            }
        }
    }
}
</script>