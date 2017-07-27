import fetch from 'utils/fetch';

//频道

export function channelList(query) {
  return fetch({
    url: '/channel/query',
    method: 'get',
    params: query
  });
}
export function channelAdd(params) {
  return fetch({
    url: '/channel/add',
    method: 'POST',
    data: params
  });
}
export function channelUpdate(params) {
  return fetch({
    url: '/channel/update',
    method: 'POST',
    data: params
  });
}
export function channelDel(id) {
  return fetch({
    url: '/channel/delete/'+id,
    method: 'POST'
  });
}