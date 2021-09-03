import request from '@/utils/request'

export function login(params) {
    return request({
        url: '/service/101/api/v1/login',
        method: 'post',
        params
    })
}

// 退出
export function logout(params) {
    return request({
        url: '/service/101/api/v1/loginOut',
        method: 'put',
        params
    })
}


// 用户重置密码
export function resetPassword(data) {
    return request({
        url: `/service/101/api/v1/sysUser/${data.id}/reset`,
        method: 'PUT',
        data
    })
}

// 用户头像修改
export function updateUserIcon(data) {
    return request({
        url: `/service/101/api/v1/sysUsers/headUrl`,
        method: 'PUT',
        data
    })
}