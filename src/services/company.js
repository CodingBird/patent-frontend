import { stringify } from 'qs';
import { get, post } from '../utils/request';

export async function queryList(params) {
  return get('/company/list', params);
}

export async function queryDetail(params) {
  return get('/company/detail', params);
}

export async function queryYearPatent(params) {
  return get('/company/queryYearPatent', params);
}
