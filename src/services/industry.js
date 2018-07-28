import { stringify } from 'qs';
import { get, post } from '../utils/request';

export async function queryList(params) {
  return get('/industry/list', params);
}

export async function queryDetail(params) {
  return get('/industry/detail', params);
}
