import { stringify } from 'qs';
import { get, post, exportData } from '../utils/request';

export async function queryList(params) {
  return get('/company/list', params);
}

export async function queryDetail(params) {
  return get('/company/detail', params);
}

export async function queryYearPatent(params) {
  return get('/company/queryYearPatent', params);
}

export async function exportBasicInfo(params) {
  return exportData('/company/exportBaseInfo', {});
}

export async function exportProducts(params) {
  return exportData('/company/exportProducts', {});
}
export async function exportYearBus(params) {
  return exportData('/company/exportYearBus', {});
}
export async function exportYearPatent(params) {
  return exportData('/company/exportYearPatent', {});
}
