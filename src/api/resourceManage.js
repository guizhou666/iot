import request from '@/utils/request'
const qs = require('qs')
// 查询所有
export function getResourceList(params) {
    return request({
        url: '/service/101/api/v1/sysResources',
        method: 'get',
        params
    })
}

// 带分页查询
export function getResources(params) {
    return request({
        url: '/service/101/api/v1/sysResources/tree',
        method: 'get',
        params
    })
}

export function getResource(params) {
    return request({
        url: '/service/101/api/v1/sysResources/' + params.id,
        method: 'get',
    })
}
// 添加资源
export function addResource(data) {
    return request({
        url: '/service/101/api/v1/sysResource',
        method: 'post',
        data
    })
}
// 修改资源
export function editResource(data,id) {
    return request({
        url: '/service/101/api/v1/sysResources/' + id,
        method: 'put',
        data
    })
}

export function delResource(data) {
    return request({
        url: '/service/101/api/v1/sysResources/invalid',
        method: 'put',
        data
    })
}
// 角色权限配置查询
export function getAccess(params) {
    return request({
        url: `/service/101/api/v1/sysResources/${params.id}/settingTree`,
        method: 'get',
        params
    })
}
// 角色权限配置保存
export function saveAccess(data) {
    return request({
        url: `/service/101/api/v1/sysResources/${data.id}/resource`,
        method: 'post',
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
        //   resourceIds: qs.stringify(params.resourceIds, { arrayFormat: 'repeat' })  || '',
          roleIds: qs.stringify(params.roleIds, { arrayFormat: 'repeat' })  || '',
          flag: params.flag
      }
  })
}
