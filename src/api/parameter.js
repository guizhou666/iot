import request from '@/utils/request'


// 获取参数分页列表
export function getParameter(params) {
    return request({
        url: '/service/101/api/v1/sysParams/page',
        method: 'get',
        params
    })
}

// 添加参数
export function addParameter(data) {
    return request({
        url: '/service/101/api/v1/sysParam',
        method: 'post',
        data
    })
}

// 修改参数
export function editParameter(data) {
    return request({
        url: `/service/101/api/v1/sysParam/${data.id}/update`,
        method: 'put',
        data
    })
}

// 查看参数详情
export function getParameterDetail(params) {
    return request({
        url: `/service/101/api/v1/sysParam/${params.id}/detail`,
        method: 'get',
    })
}

//作废参数
export function invalidParameter(data) {
    return request({
        url: '/service/101/api/v1/sysParams/invalid',
        method: 'put',
        data
    })
}

