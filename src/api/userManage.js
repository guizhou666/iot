import request from '@/utils/request'

export function getUsers(params) {
    return request({
        url: '/service/101/api/v1/sysUsers/page',
        method: 'get',
        params
    })
}

// 查询单个用户信息
export function getUser(params) {
    return request({
        // url: '/service/101/api/v1/sysUsers/' + params.id,
        url: `/service/101/api/v1/sysUsers/${params.id}/detail`,
        method: 'get',
        params
    })
}

export function addUser(data) {
    return request({
        url: '/service/101/api/v1/sysUser',
        method: 'post',
        data
    })
}

export function editUser(data) {
    return request({
        // url: '/service/101/api/v1/sysUsers/' + data.id,
        url: `/service/101/api/v1/sysUsers/${data.id}/update`,
        method: 'put',
        data
    })
}

export function delUser(data) {
    return request({
        url: '/service/101/api/v1/sysUsers/invalid',
        method: 'put',
        data
    })
}
// 重置用户密码
export function resetPsw(data) {
    return request({
        url: `/service/101/api/v1/sysUser/${data.id}/reset`,
        method: 'post',
        data
    })
}

export function enabledUser(data) {
    return request({
        url: `/service/101/api/v1/sysUsers/change`,
        method: 'put',
        data
    })
}


//用户角色获取资源信息
// export function getRoleResource(params) {
//     return request({
//         url: `/service/101/api/v1/sysUser/roleResource`,
//         method: 'get',
//         params
//     })
// }