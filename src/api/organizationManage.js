import request from '@/utils/request'

// 查询所有产品（不带分页列表）
export function getOrganizationList(params) {
    return request({
        url: '/service/103/api/v1/tmOrg',
        method: 'get',
        params
    })
}

// 带分页查询
export function getOrganizations(params) {
    return request({
        url: '/service/103/api/v1/tmOrgs/page',
        method: 'get',
        params
    })
}

// 查询详情
export function getOrganization(params) {
    return request({
        url: '/service/103/api/v1/tmOrgs/' + params.id,
        method: 'get',
        params
    })
}

export function addOrganization(data) {
    return request({
        url: '/service/103/api/v1/tmOrg',
        method: 'post',
        data
    })
}

export function editOrganization(data) {
    return request({
        url: '/service/103/api/v1/tmOrgs/' + data.id,
        method: 'put',
        data
    })
}

export function delOrganization(data) {
    return request({
        url: '/service/103/api/v1/tmOrgs/invalid',
        method: 'put',
        data
    })
}
// 已关联资源查询
export function getRelevanceResource(params) {
    return request({
        url: `/service/103/api/v1/tmOrgs/${params.id}/settingTree`,
        method: 'get',
        params
    })
}

// 更新产品
export function updateOrganization(data) {
    return request({
        url: `/service/103/api/v1/tmOrg/update/${data.id}`,
        method: 'post',
        data
    })
}

// 启用禁用产品
export function enabledOrganization(data) {
    return request({
        url: `/service/103/api/v1/tmOrgs/change`,
        method: 'put',
        data
    })
}

// 查询产品使用情况
export function getOrganizationCondtion(params) {
    return request({
        url: `/service/103/api/v1/tmOrg/usage`,
        method: 'get',
        params
    })
}
// 获取产品详情
export function getOrganizationDetail(params) {
    return request({
        url: `/service/103/api/v1/tmOrg/${params.id}`,
        method: 'get',
        params
    })
}


// 关联资源
export function relevanceResource(data) {
    return request({
        url: `/service/103/api/v1/tmOrg/${data.id}/resource`,
        method: 'post',
        data
    })
}


// 批量更换Logo/显示风格
export function batchChangeLogoOrStyle(data){
    return request({
        url: '/service/103/api/v1/tmOrg/batchUpdate',
        method:'put',
        data
    })
}
