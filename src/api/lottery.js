import fetch from 'utils/fetch';

export function lotteryList(query) {
  return fetch({
    url: '/lottery',
    method: 'get',
    params: query
  });
}
