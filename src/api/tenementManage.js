import request from '@/utils/request'

// 查询所有
export function getTenementList(params) {
    return request({
        url: '/service/103/api/v1/tmTenants',
        method: 'get',
        params
    })
}

// 带分页查询
export function getTenements(params) {
    return request({
        url: '/service/103/api/v1/tmTenants/page',
        method: 'get',
        params
    })
}

// 查询单个租户详情
export function getTenement(params) {
    return request({
        url: '/service/103/api/v1/tmTenants/' + params.id,
        method: 'get',
    })
}

export function addTenement(data) {
    return request({
        url: '/service/103/api/v1/tmTenant',
        method: 'post',
        data
    })
}

export function editTenement(data) {
    return request({
        url: '/service/103/api/v1/tmTenants/' + data.id,
        method: 'put',
        data
    })
}

export function delTenement(data) {
    return request({
        url: '/service/103/api/v1/tmTenants/invalid',
        method: 'put',
        data
    })
}
// 租户权限配置查询
export function getAccess(params) {
    return request({
        url: `/service/103/api/v1/tmTenants/${params.id}/settingTree`,
        method: 'get',
        params
    })
}
// 租户权限配置保存
export function saveAccess(data) {
    return request({
        url: `/service/103/api/v1/tmTenants/${data.id}/tenement`,
        method: 'post',
        data
    })
}

// 租户权限配置保存
export function enabledTenement(data) {
    return request({
        url: `/service/103/api/v1/tmTenants/change`,
        method: 'put',
        data
    })
}


