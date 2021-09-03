import request from '@/utils/request'
const qs = require('qs')
// 查询所有产品（不带分页列表）
export function getProductList(params) {
    return request({
        url: '/service/101/api/v1/appInfos',
        method: 'get',
        params
    })
}
// 租户管理--产品配置--修改添加--获取主产品
export function getAppNames(params) {
    return request({
        url: '/service/101/api/v1/appNames',
        method: 'get',
        params
    })
}

// 机构管理--产品配置--修改添加--获取产品
export function getTenementAppNames(params) {
    return request({
        url: `/service/101/api/v1/appInfos/${params.id}/tenantApp`,
        method: 'get',
        params
    })
}

// 查询所有版本信息（不带分页列表）
export function getVersionList(params) {
    return request({
        url: '/service/101/api/v1/appVersions',
        method: 'get',
        params
    })
}

// 带分页查询
export function getProducts(params) {
    return request({
        url: '/service/101/api/v1/appInfos/page',
        method: 'get',
        params
    })
}

export function getProduct(params) {
    return request({
        url: '/service/101/api/v1/appInfos/' + params.id,
        method: 'get',
        params
    })
}

export function addProduct(data) {
    return request({
        url: '/service/101/api/v1/appInfo',
        method: 'post',
        data
    })
}
// 租户机构管理中的产品修改
// export function termAndOrgEditProduct(data) {
//   return request({
//       url: '/service/101/api/v1/appInfos/addNew',
//       method: 'post',
//       data
//   })
// }


// 产品管理修改产品
export function editProduct(data) {
    return request({
        url: '/service/101/api/v1/appInfos/' + data.id,
        method: 'put',
        data
    })
}

export function delProduct(data) {
    return request({
        url: '/service/101/api/v1/appInfos/invalid',
        method: 'put',
        data
    })
}
// 已关联资源查询
export function getRelevanceResource(params) {
    return request({
        url: `/service/101/api/v1/appInfos/${params.id}/settingTree`,
        method: 'get',
        //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
        params: {
            id: params.id,
            resourceIds: qs.stringify(params.resourceIds, { arrayFormat: 'repeat' }) || ''
        }
    })
}

// 更新产品
export function updateProduct(data) {
    return request({
        url: `/service/101/api/v1/appInfos/${data.appId}/update`,
        method: 'post',
        data
    })
}

// 启用禁用产品
export function enabledProduct(data) {
    return request({
        url: `/service/101/api/v1/appInfos/change`,
        method: 'put',
        data
    })
}

// 查询产品使用情况
export function getProductCondtion(params) {
    return request({
        url: `/service/101/api/v1/appInfos/usage`,
        method: 'get',
        params
    })
}
// 获取产品详情
export function getProductDetail(params) {
    return request({
        url: `/service/101/api/v1/appInfos/${params.id}`,
        method: 'get',
        params
    })
}


// 关联资源
export function relevanceResource(data) {
    return request({
        url: `/service/101/api/v1/appInfos/${data.id}/resource`,
        method: 'post',
        data
    })
}


// 批量更换Logo/显示风格
export function batchChangeLogoOrStyle(data) {
    return request({
        url: '/service/101/api/v1/appInfos/batchUpdate',
        method: 'put',
        data
    })
}

// 产品重命名
export function rename(data) {
    return request({
        url: '/service/101/api/v1/appInfos/reName',
        method: 'put',
        data
    })
}

// 修改产品
export function updatePro(data) {
    return request({
        url: `/service/101/api/v1/appInfos/${data.id}`,
        method: 'put',
        data
    })
}
// 我的产品获取的产品关联资源
export function produceRelevanceResource(params) {
    return request({
        url: `/service/101/api/v1/appInfos/${params.id}/settingTree`,
        method: 'get',
        params
    })
}
