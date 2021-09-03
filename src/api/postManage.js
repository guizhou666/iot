import request from '@/utils/request';
// 获取部门树
export function getDepartmentTree(params) {
  return request({
    url: '/service/103/api/v1/sysDepts/tree',
    method: 'get',
    params
  });
};
// 获取部门树子节点
export function getChildDepartment(params) {
  return request({
    url: '/service/103/api/v1/sysDepts/treeNext',
    method: 'get',
    params
  });
};
// 新增部门
export function addDepartment(data) {
  return request({
    url: '/service/103/api/v1/sysDept',
    method: 'post',
    data
  });
};
// 修改部门
export function editDepartment(data){
    return request({
        url: `/service/103/api/v1/sysDepts/${data.id}`,
        method:'put',
        data
    })
}
// 部门详情
export function departmentDetail(params){
    return request({
        url: `/service/103/api/v1/sysDepts/${params.id}`,
        method:'get',
        params
    })
}
// 部门信息批量作废
export function deleteDepartment(data){
    return request({
        url: '/service/103/api/v1/sysDepts/invalid',
        method:'put',
        data
    })
}
// 获取人员列表
export function getUserList(params) {
    return request({
        url: '/service/103/api/v1/tmPersons/page',
        method:'get',
        params
    })
}
// 获取人员详情
export function getUserDetail(params){
    return request({
        url: `/service/103/api/v1/tmPersons/${params.id}`,
        method:'get',
        // params
    })
}

// 分页获取岗位
export function getPostList(params) {
  return request({
    url: '/service/103/api/v1/tmPosts/page',
    method: 'get',
    params
  })
}

// 获取岗位列表
export function getPosts(params) {
  return request({
    url: '/service/103/api/v1/tmPosts',
    method: 'get',
    params
  })
}
// 添加岗位
export function addPost(data) {
  return request({
    url: '/service/103/api/v1/tmPost',
    method: 'post',
    data
  })
}
// 编辑岗位
export function editPost(data) {
  return request({
    url: `/service/103/api/v1/tmPosts/${data.id}`,
    method: 'put',
    data
  })
}
// 作废岗位
export function deletePost(data) {
  return request({
    url: `/service/103/api/v1/tmPosts/invalid`,
    method: 'put',
    data
  })
}
// 岗位详情
export function postDetail(params) {
  return request({
    url: `/service/103/api/v1/tmPosts/${params.id}`,
    method: 'get',
    // params
  })
}