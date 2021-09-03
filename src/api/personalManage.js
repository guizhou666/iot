import request from '@/utils/request';
// 获取人员树
export function getTmPersonsTree(params) {
  return request({
    url: '/service/103/api/v1/tmPersons/page',
    method: 'get',
    params
  });
};
// 新增人员
export function addTmPersons(data) {
  return request({
    url: '/service/103/api/v1/tmPerson',
    method: 'post',
    data
  });
};
// 修改人员
export function editTmPersons(data){
    return request({
        url: `/service/103/api/v1/tmPersons/${data.id}`,
        method:'put',
        data
    })
}
// 人员详情
export function departmentDetail(params){
    return request({
        url: `/service/103/api/v1/tmPersons/${params.id}`,
        method:'get',
        params
    })
}
// 人员信息批量作废
export function deleteTmPersons(data){
    return request({
        url: '/service/103/api/v1/tmPersons/invalid',
        method:'put',
        data
    })
}
// 获取人员列表
export function getPersonList(params) {
    return request({
        url: '/service/103/api/v1/tmPersons/page',
        method:'get',
        params
    })
}
// 获取人员详情
export function getPersonDetail(params){
    return request({
        url: `/service/103/api/v1/tmPersons/${params.id}`,
        method:'get',
        // params
    })
}
