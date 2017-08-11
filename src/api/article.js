import fetch from 'utils/fetch';

//文章

export function articleList(query) {
  return fetch({
    url: '/article',
    method: 'get',
    params: query
  });
}