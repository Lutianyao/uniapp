const files = require.context('.', false, /\.js$/)

const list = {}

files.keys().forEach(key => {
    if (key === './index.js') return

    const item = files(key).default;

    // 对象合并 => 把每个js里面的接口合并一个集合里
    Object.assign(list, item)
})

export default list