import fetch from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/history',
    method: 'get',
    params: query
  });
}
export function historyAdd(params) {
  return fetch({
    url: '/history/add',
    method: 'POST',
    data: params
  });
}
export function historyUpdate(params) {
  return fetch({
    url: '/history/update',
    method: 'POST',
    data: params
  });
}
export function historyDel(id) {
  return fetch({
    url: '/history/delete/'+id,
    method: 'POST'
  });
}