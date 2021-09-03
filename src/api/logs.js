import request from '@/utils/request';
export function getOpractionLog(params) {
    return request({
        url: '/service/101/api/v1/sysOpLog/page',
        method: 'get',
        params
    });
};

export function getLoginLog(params) {
    return request({
        url: '/service/101/api/v1/sysLoginLog/page',
        method: 'get',
        params
    });
};
// 查询操作日志操作模块
export function getOperateModule(params) {
    return request({
        url: '/service/101/api/v1/sysOpLog/getModule',
        method: 'get',
        params
    });
};