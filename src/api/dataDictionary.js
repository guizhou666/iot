import request from '@/utils/request';
export function addDictionary(data){
    return request({
      url: '/service/101/api/v1/sysDictionary',
      method: 'post',
      data
    });
}
export function getList(params){
    return request({
      url: '/service/101/api/v1/sysDictionarys',
      method: 'get',
      params
    });
}
export function getDetail(params){
    return request({
      url: `/service/101/api/v1/sysDictionary/${params.id}/detail`,
      method: 'get',
    //   params
    });
}
export function changeData(data){
    return request({
      url: `/service/101/api/v1/sysDictionary/${data.id}/update`,
      method: 'put',
      data
    });
}
export function deleteData(data){
    return request({
      url: `/service/101/api/v1/sysDictionarys/invalid`,
      method: 'put',
      data
    });
}
// 获取显示风格
export function getStyle(){
    return request({
      url: `/service/101/api/v1/sysDictionarys/getStyle`,
      method: 'get',
    });
}