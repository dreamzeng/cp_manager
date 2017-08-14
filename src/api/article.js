import fetch from 'utils/fetch';

//文章
//列表
export function articleList(query) {
  return fetch({
    url: '/article',
    method: 'get',
    params: query
  });
}
//添加
export function articleAdd(params) {
  return fetch({
    url: '/article/add',
    method: 'POST',
    data: params
  });
}
//详情
export function articleDetail(id) {
  return fetch({
    url: '/article/detail/'+id,
    method: 'get'
  });
}
//修改
export function articleUpdate(params) {
  return fetch({
    url: '/article/update',
    method: 'POST',
    data: params
  });
}
//删除文章
export function articleDel(id) {
  return fetch({
    url: '/article/delete/'+id,
    method: 'POST'
  });
}
//批量删除文章
export function articleDelBatch(idList) {
  return fetch({
    url: '/article/delete_batch/'+idList,
    method: 'POST'
  });
}