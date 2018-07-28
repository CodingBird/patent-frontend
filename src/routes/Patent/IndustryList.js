import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
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
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './IndustryList.less';
import IndustryCompare from './IndustryCompare';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@connect(({ industry, loading }) => ({
  industry,
  loading: loading.models.industry,
}))
@Form.create()
export default class IndustryList extends PureComponent {
  state = {
    formValues: {},
    selectedRows: [],
    showCompareModal: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'industry/fetch' });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({ type: 'industry/fetch', payload: params });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({ type: 'industry/fetch', payload: values });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="行业名称">
              {getFieldDecorator('industryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const columns = [
      {
        title: '行业名称',
        dataIndex: 'name',
        align: 'center',
        render: (val, record) => <Link to={`/industry/industry-detail/${record.id}`}>{val}</Link>,
      },
      { title: '单位数', dataIndex: 'company_count', align: 'center' },
      { title: '从业人员期末人数', dataIndex: 'employee_count', align: 'center' },
      { title: '工业总产值', dataIndex: 'industry_output_value', align: 'center' },
      { title: '出口交货值', dataIndex: 'export_value', align: 'center' },
      { title: '主营业务收入', dataIndex: 'main_input', align: 'center' },
      { title: '利润总额', dataIndex: 'total_profit', align: 'center' },
      { title: '主营业务税金及附加本期(千元)', dataIndex: 'main_input_tax', align: 'center' },
      { title: '应交增值税本期(千元)', dataIndex: 'added_tax', align: 'center' },
      { title: '从业人员工资总额', dataIndex: 'total_wage', align: 'center' },
      { title: '资产总计', dataIndex: 'total_asset', align: 'center' },

      // { title: 'R&D人员合计', dataIndex: 'total_person_rd', align: 'center' },
      // { title: 'R&D经费内部支出合计', dataIndex: 'total_funds_rd', align: 'center' },
      // { title: '专利申请数', dataIndex: 'patent_count', align: 'center' },
      // { title: '发明专利', dataIndex: 'invent_patent_count', align: 'center' },
      // { title: '有效发明专利', dataIndex: 'valid_invent_patent_count', align: 'center' },
      // { title: '新产品产值', dataIndex: 'new_product_value', align: 'center' },
      // { title: '新产品销售收入', dataIndex: 'new_product_amount', align: 'center' },
      // { title: '拥有注册商标', dataIndex: 'trademark_count', align: 'center' },
      // { title: '平均工资', dataIndex: 'avg_wage', align: 'center' },
      // { title: '平均R&D人员数', dataIndex: 'avg_rd_person_count', align: 'center' },
      // { title: '平均R&D经费内部支出', dataIndex: 'avg_rd_in_funds', align: 'center' },
      // { title: '有效发明专利/从业人员数', dataIndex: 'patent_person_rate', align: 'center' },
    ];
    const { industry, loading } = this.props;
    const { data } = industry;
    console.log('data....');
    console.log(data);
    const { selectedRows, showCompareModal } = this.state;

    const _this = this;
    const compareProps = {
      selectedRows: selectedRows,
      showAddModel: showCompareModal,
      onOk: function(values) {
        _this.setState({ showCompareModal: false });
      },
      handleAddModalVisible: function() {
        _this.setState({ showCompareModal: !showCompareModal });
      },
    };
    return (
      <PageHeaderLayout title="吴中区密集型产业数据">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 1 && (
                <span>
                  <Button
                    onClick={() => {
                      this.setState({ showCompareModal: true });
                    }}
                  >
                    产业对比
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowKey={'id'}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <IndustryCompare {...compareProps} />
      </PageHeaderLayout>
    );
  }
}
