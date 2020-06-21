import request from '@/utils/request'

export const load = (params: any) =>
  request({
    url: '/get',
    method: 'get',
    params
  })

export const create = (data: any) =>
  request({
    url: '/post',
    method: 'post',
    data
  })
