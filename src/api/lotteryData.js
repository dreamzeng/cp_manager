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
/*export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}
*/
