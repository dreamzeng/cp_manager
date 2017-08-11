import fetch from 'utils/fetch';

//文章

export function articleList(params) {
  return fetch({
    url: '/upload/image',
    method: 'POST',
    params: params
  });
}