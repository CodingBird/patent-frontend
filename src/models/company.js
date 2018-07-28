import { queryList, queryDetail, queryYearPatent } from '../services/company';

export default {
  namespace: 'company',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    yearPatentList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      console.log('fetch 2');
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchYearPatent({ payload }, { call, put }) {
      const response = yield call(queryYearPatent, payload);
      yield put({
        type: 'saveYearPatent',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveYearPatent(state, action) {
      return {
        ...state,
        yearPatentList: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateSearchArr(state, action) {
      return {
        ...state,
        searchArr: action.payload,
      };
    },
  },
};
