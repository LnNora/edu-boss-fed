/**
 * 资源相关请求模板
 */
import request from "@/utils/request"

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
