import fetch from 'utils/fetch';
//采种

export function lotteryList(query) {
  return fetch({
    url: '/lottery',
    method: 'get',
    params: query
  });
}
export function lotteryAdd(params) {
  return fetch({
    url: '/lottery/add',
    method: 'POST',
    data: params
  });
}
export function lotteryUpdate(params) {
  return fetch({
    url: '/lottery/update',
    method: 'POST',
    data: params
  });
}