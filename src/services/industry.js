import { stringify } from 'qs';
import { get, post, exportData } from '../utils/request';

export async function queryList(params) {
  return get('/industry/list', params);
}

export async function queryDetail(params) {
  return get('/industry/detail', params);
}

export async function exportCsv(params) {
  return exportData('/industry/export', {});
}
