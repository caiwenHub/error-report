import request from '../utils/request'

export const reportApi = (method, params, url) => request({
  method,
  url,
  params
})