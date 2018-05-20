import { queryList, queryDetail } from '../services/company';

export default {
  namespace: 'company',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('fetch 1');
      console.log(payload);
      const response = yield call(queryList, payload);
      console.log('fetch 2');
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      console.log('fetch 1');
      console.log(payload);
      const response = yield call(queryDetail, payload);
      console.log('fetch 2');
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
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
