import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout

})

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}
// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false
let requests: any[] = []
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了2xx范围
    const { status } = error.response
    if (status === 4000) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效（没提供token、token错误、token过期了）
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      if (!isRefreshing) {
        isRefreshing = true
        // 尝试刷新获取新的token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }
          store.commit('setUser', res.data.content)
          requests.forEach(cb => cb())
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false
        })
      }
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没收到响应（请求超时，网络断开）
    Message.error('请求超时，请刷新重试')
  } else { // 设置请求时触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出
  return Promise.reject(error)
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
export default request
