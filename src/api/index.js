import request from '../utils/request'

export const report = (params) => request({
  method: 'post',
  url: '/',
  params
})