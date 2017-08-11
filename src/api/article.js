import fetch from 'utils/fetch';

//文章

export function articleList(query) {
  return fetch({
    url: '/article',
    method: 'get',
    params: query
  });
}

export function articleAdd(params) {
  return fetch({
    url: '/article/add',
    method: 'POST',
    data: params
  });
}

export function articleDetail(id) {
  return fetch({
    url: '/article/detail/'+id,
    method: 'get'
  });
}