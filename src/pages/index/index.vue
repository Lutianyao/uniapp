<template>
	<view>
		<u-swiper :list="list" indicator indicatorMode="dot">
		</u-swiper>
		<button class="order" @click="OrderBtn">
			开始预约
		</button>
		<button class="process" @click="ProcessBtn">
			预约流程
		</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				'/static/images/order-images/show-1.jpg',
				'/static/images/order-images/show-2.jpg',
				'/static/images/order-images/show-3.jpg',
			]

		}
	},
	onShow() {
		this.Home()
	},
	methods: {
		ProcessBtn() {
			this.$u.route({
				url: 'pages/process/process'
			})
		},
		async Home() {
			let result = await this.$u.api.home.Home();
			if (result.data.RecomList.length > 0) {
				let list = []
				for (let item of result.data.RecomList) {
					list.push(item.cover_cdn)
				}
				this.list = list
			}
		}
	}
}
</script>

<style>
page {
	background-color: rgb(247, 247, 247);
}

swiper {
	width: 100%;
	height: 400rpx !important;
	margin-bottom: 50rpx;
}

swiper image {
	width: 100%;
	height: 400rpx !important;
}

/* 开始预约 */
.order {
	width: 200px;
	height: 50px;
	background-color: #0173DE;
	color: #fff;
	margin-top: 20px;
	margin-bottom: 20px;
}


/* 预约流程 */
.process {
	width: 200px;
	height: 50px;
	background-color: #0173DE;
	color: #fff;
}
</style>
