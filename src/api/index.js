//默认引入模块
const files = require.context('./',true,/index.js$/)

// 定义存放的对象
const modules = {}

files.keys().forEach(key => {
    if(key === './index.js')
    {
        return
    }

    const item = files(key).default

    var mod = {}

	//替换路径 => api/文件夹
	var name = key.replace(/\.\/(.*)\/index.js/, "$1")

    // 定义对象的属性
    mod[name] = item

    // 合并对象
    Object.assign(modules, mod)
})

const install = (Vue, vm) => {
	//加载模块
	modules

	//循环组合接口API
	let api = {}

	for(let ModeName in modules) 
	{
		if(JSON.stringify(modules[ModeName]) == "{}")
		{
			continue
		}
		for(let ApiName in modules[ModeName]) 
		{
			let config = modules[ModeName][ApiName]
			config.name = ApiName
			if(!config.name || !config.url)
			{
				continue
			}

			if(!api[ModeName])
			{
				api[ModeName] = {}
			}

			switch(config.method.toUpperCase())
			{
				case "GET":
					api[ModeName][config.name] = (data = {}) => {
						return uni.$u.http.get(config.url,data)
					}
					break
				case "POST":
					api[ModeName][config.name] = (data = {}) => uni.$u.http.post(config.url,data)
					break
				case "UPLOAD":
					api[ModeName][config.name] = (data = {}) => {
						if(data.filePath)
						{
							return uni.$u.http.upload(config.url,data)
						}else
						{
							return uni.$u.http.post(config.url,data)
						}
					}
					break
			}
		}
	}

	vm.$u.api = api
}

export default {
	install
}