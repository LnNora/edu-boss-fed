/**
 * 资源分类相关请求模板
 */
import request from "@/utils/request"

export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
