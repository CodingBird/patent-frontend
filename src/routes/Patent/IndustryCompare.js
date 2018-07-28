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
  { id: 'industry_output_value', name: '工业总产值' },
  { id: 'main_input', name: '主营业务收入' },
  { id: 'total_profit', name: '利润总额' },
  { id: 'total_asset', name: '资产总计' },
  { id: 'export_value', name: '出口交货值' },
  { id: 'employee_count', name: '从业人员期末人数' },
  { id: 'company_count', name: '单位数量' },

  { id: 'main_input_tax', name: '主营业务税金及附加本期(千元)' },
  { id: 'added_tax', name: '应交增值税本期(千元)' },
  { id: 'total_wage', name: '从业人员工资总额' },
  { id: 'total_person_rd', name: 'R&D人员合计' },
  { id: 'total_funds_rd', name: 'R&D经费内部支出合计' },

  {
    id: 'patent_count',
    name: '专利申请数',
  },
  { id: 'invent_patent_count', name: '发明专利' },
  { id: 'valid_invent_patent_count', name: '有效发明专利' },
  { id: 'new_product_value', name: '新产品产值' },
  { id: 'new_product_amount', name: '新产品销售收入' },

  { id: 'trademark_count', name: '拥有注册商标' },
  { id: 'avg_wage', name: '平均工资' },
  { id: 'avg_rd_person_count', name: '平均R&D人员数' },
  { id: 'avg_rd_in_funds', name: '平均R&D经费内部支出' },
  { id: 'patent_person_rate', name: '有效发明专利/从业人员数' },
];

@Form.create()
export default class IndustryCompare extends PureComponent {
  state = {
    formValues: {},
    shoMetricChooseModal: false,
    chosenMetrics: ['工业总产值', '出口交货值', '主营业务收入', '利润总额', '资产总计'],
  };

  componentDidMount() {}

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ shoMetricChooseModal: true });
                }}
              >
                选择指标
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { showAddModel, form, onOk, handleAddModalVisible, selectedRows } = this.props;

    const industryData = selectedRows || [];
    industryData.map(item => {
      for (let metric of metrics) {
        item[metric.name] = item[metric.id];
      }
    });

    const { shoMetricChooseModal, chosenMetrics } = this.state;

    console.log(industryData);
    const ds = new DataSet();
    const dv = ds.createView().source(industryData);
    dv.transform({
      type: 'fold',
      fields: chosenMetrics, // 展开字段集
      key: '月份', // key字段
      value: '月均降雨量', // value字段
    });

    const _this = this;
    const metricChooseModalProps = {
      metrics: metrics,
      choosenMetrics: chosenMetrics,
      showAddModel: shoMetricChooseModal,
      onOk: function(values) {
        const chosenMetrics = values['chosenMetrics'];
        console.log(chosenMetrics);
        _this.setState({ chosenMetrics, shoMetricChooseModal: false });
      },
      handleAddModalVisible: function() {
        _this.setState({ shoMetricChooseModal: !shoMetricChooseModal });
      },
    };

    return (
      <Modal
        title={'选择指标'}
        visible={showAddModel}
        onOk={onOk}
        onCancel={() => handleAddModalVisible()}
        width={1000}
      >
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        <div style={{ width: 900, background: '#FFFFFF', marginTop: 20 }}>
          <Chart height={400} data={dv} forceFit>
            <Axis name="月份" />
            <Axis name="月均降雨量" />
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom
              type="interval"
              position="月份*月均降雨量"
              color={'name'}
              adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]}
            />
          </Chart>
        </div>

        <MetricChooseModal {...metricChooseModalProps} />
      </Modal>
    );
  }
}
