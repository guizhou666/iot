import request from '@/utils/request'

// 查询所有
export function getCharts(params) {
    return request({
        url: '/vue-admin-template/template/getCharts',
        method: 'get',
        params
    })
}
