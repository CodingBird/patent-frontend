import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Select,
  message,
  Divider,
  Menu,
  DatePicker,
  Dropdown,
  Modal,
} from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { View, DataSet } from '@antv/data-set';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MetricChooseModal from './MetricChooseModal';
import styles from './IndustryList.less';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const metrics = [
  { id: 'invention_patent_apply_count', name: '发明专利申请量' },
  { id: 'invention_patent_authorize_count', name: '发明专利授权量' },
  { id: 'invention_patent_owning_count', name: '发明专利拥有量' },

  { id: 'practical_new_apply_count', name: '实用新型申请量' },
  { id: 'practical_new_authorize_count', name: '实用新型授权量' },
  { id: 'practical_new_owning_count', name: '实用新型拥有量' },

  { id: 'appearance_design_apply_count', name: '外观设计申请量' },
  { id: 'appearance_design_authorize_count', name: '外观设计授权量' },
  { id: 'appearance_design_owning_count', name: '外观设计拥有量' },
  { id: 'pct_patent_apply_count', name: 'PCT专利申请数量' },
  { id: 'cognation_patent_count', name: '同族专利数量' },

  { id: 'trademark_apply_count', name: '商标申请量' },
  { id: 'registed_trademark_count', name: '已注册商标量' },
  { id: 'outside_trademark_count', name: '境外注册商标量' },
  { id: 'famous_trademark_count', name: '著名商标量' },
  { id: 'resounding_trademark_count', name: '驰名商标量' },
];

const patentMetrics = [
  '发明专利申请量',
  '发明专利授权量',
  '发明专利拥有量',
  '实用新型申请量',
  '实用新型授权量',
  '实用新型拥有量',
  '外观设计申请量',
  '外观设计授权量',
  '外观设计拥有量',
  'PCT专利申请数量',
  '同族专利数量',
];

const trademarkMetrics = [
  '商标申请量',
  '已注册商标量',
  '境外注册商标量',
  '著名商标量',
  '驰名商标量',
];

@Form.create()
export default class PatentTrend extends PureComponent {
  state = {
    formValues: {},
    shoMetricChooseModal: false,
    chosenMetrics: ['工业总产值', '出口交货值', '主营业务收入', '利润总额', '资产总计'],
  };

  componentDidMount() {}

  render() {
    const { showAddModel, form, onOk, handleAddModalVisible, list, type } = this.props;
    list.map(item => {
      for (let metric of metrics) {
        item[metric.name] = item[metric.id];
      }
    });
    const ds = new DataSet();
    const dv = ds.createView().source(list);
    const chosenMetics = type == 'patent' ? patentMetrics : trademarkMetrics;
    dv.transform({ type: 'fold', fields: chosenMetics, key: 'city', value: 'temperature' }); // key字段 // value字段
    console.log(dv);
    const cols = { year: { alias: '年份', range: [0, 1] } };

    return (
      <Modal
        title={type == 'patent' ? '专利趋势' : '商标趋势'}
        visible={showAddModel}
        onOk={onOk}
        onCancel={() => handleAddModalVisible()}
        width={1000}
      >
        <div style={{ width: 900, background: '#FFFFFF', marginTop: 20 }}>
          <Chart height={400} data={dv} scale={cols} forceFit>
            <Legend />
            <Axis name="year" />
            <Axis name="temperature" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="year*temperature" size={2} color={'city'} />
            <Geom
              type="point"
              position="year*temperature"
              size={4}
              shape={'circle'}
              color={'city'}
              style={{ stroke: '#fff', lineWidth: 1 }}
            />
          </Chart>
        </div>
      </Modal>
    );
  }
}
