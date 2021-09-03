import request from '@/utils/request';
export function upload(data) {
  return request({
    url: '/service/107/api/vi/Upload',
    method: 'post',
    data
  });
};
// 查找图片
export function getImg(filekey) {
  return request({
    url: `/service/107/api/vi/img/${filekey}`,
    method: 'get',
    responseType: 'blob'
  });
};

export function download(data) {
  return request({
    url: '/service/101/api/v1/sysLoginLog/page',
    method: 'get',
    params
  });
};
