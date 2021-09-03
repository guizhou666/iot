import request from '@/utils/request'

// 查询所有
export function getRoleList(params) {
    return request({
        url: '/service/101/api/v1/sysRoles',
        method: 'get',
        params
    })
}

// 带分页查询
export function getRoles(params) {
    return request({
        url: '/service/101/api/v1/sysRoles/page',
        method: 'get',
        params
    })
}

export function getRole(params) {
    return request({
        url: '/service/101/api/v1/sysRoles/' + params.id,
        method: 'get',
        params
    })
}

export function addRole(data) {
    return request({
        url: '/service/101/api/v1/sysRole',
        method: 'post',
        data
    })
}

export function editRole(data) {
    return request({
        url: '/service/101/api/v1/sysRoles/' + data.id,
        method: 'put',
        data
    })
}

export function delRole(data) {
    return request({
        url: '/service/101/api/v1/sysRoles/invalid',
        method: 'put',
        data
    })
}
// 角色权限配置查询
export function getAccess(params) {
    return request({
        url: `/service/101/api/v1/sysRoles/${params.id}/settingTree`,
        method: 'get',
        params
    })
}

// 首页产品相关角色查询
// export function getResourceIds(data) {
//     return request({
//         url: `/service/101/api/v1/sysRoles/getResourceIds`,
//         method: 'post',
//         data
//     })
// }

// 角色权限配置保存
export function saveAccess(data) {
    return request({
        url: `/service/101/api/v1/sysRoles/${data.id}/resource`,
        method: 'post',
        data
    })
}