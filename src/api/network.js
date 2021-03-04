import axios from 'axios'
// json-bigint 处理js数值超出范围外(-2^53到2^53)不准确的问题
import JSONbig from 'json-bigint'
// 如果在非组件中使用路由需要引入
// import router from '@/router'

// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// axios.defaults.baseURL = 'http://api-toutiao-web.itheima.net/'
// axios.defaults.timeout = 5000
const instance = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',
  timeout: 5000,
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  // data就是响应数据
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const userInfo = JSON.parse(sessionStorage.getItem('data'))
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default {
  get: function (path, obj = {}) {
    return new Promise(function (resolve, reject) {
      instance.get(path, {
        params: obj
      })
        .then(function (response) {
          // console.log(response);
          resolve(response)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  post: function (path, obj = {}) {
    return new Promise(function (resolve, reject) {
      instance.post(path, obj)
        .then(function (response) {
          // console.log(response);
          resolve(response)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  all: function (list) {
    return new Promise(function (resolve, reject) {
      axios.all(list)
        .then(axios.spread(function (...result) {
          resolve(result)
        }))
        .catch(function (error) {
          reject(error)
        })
    })
  },
  elseMethods: function (path, request, obj = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: request,
        url: path,
        data: obj
      }).then((res) => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  syncPost: function (path, obj) {
    instance.post(path, obj).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
      // return error
    })
  }
}
