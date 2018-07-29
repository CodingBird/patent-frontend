import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CompanyList.less';
import PatentTrend from './PatentTrend';

import * as companyService from '../../services/company';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
export default class CompanyList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    searchArr: [],
    showTrendModal: false,
    trendType: 'patent',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetch',
    });
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
      // currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'company/fetch',
      payload: {},
    });
  };

  handleAddSearchType = () => {
    let searchType = {
      search_type: [
        { key: 'invention_patent_apply_count', val: '发明专利申请量' },
        { key: 'invention_patent_authorize_count', val: '发明专利授权量' },
        { key: 'invention_patent_owning_count', val: '发明专利拥有量' },

        { key: 'practical_new_apply_count', val: '实用新型申请量' },
        { key: 'practical_new_authorize_count', val: '实用新型授权量' },
        { key: 'practical_new_owning_count', val: '实用新型拥有量' },

        { key: 'appearance_design_apply_count', val: '外观设计申请量' },
        { key: 'appearance_design_authorize_count', val: '外观设计授权量' },
        { key: 'appearance_design_owning_count', val: '外观设计拥有量' },

        { key: 'registed_trademark_count', val: '已注册商标量' },
        { key: 'copyright_registration_count', val: '著作权登记件数' },
      ],
      min_val: '',
      max_val: '',
      year: [
        { key: '2014', val: '2014年' },
        { key: '2015', val: '2015年' },
        { key: '2016', val: '2016年' },
        { key: '2017', val: '2017年' },
        { key: '2018', val: '2018年' },
        { key: '2019', val: '2019年' },
        { key: '2020', val: '2020年' },
      ],
    };
    let { searchArr } = this.state;
    searchArr.push(searchType);
    console.log(searchArr);
    const { dispatch, form } = this.props;
    dispatch({
      type: 'company/updateSearchArr',
      payload: searchArr,
    });
  };

  handleRemoveSearchType = () => {
    let { searchArr } = this.state;
    if (searchArr.length <= 0) {
      return;
    }
    searchArr.shift();
    const { dispatch } = this.props;
    dispatch({
      type: 'company/updateSearchArr',
      payload: searchArr,
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      let { searchArr } = this.state;
      console.log(searchArr);
      for (let i = 0; i < searchArr.length; i++) {
        let key_type = values['search_type_' + i];
        values[key_type + '_min'] = values['min_' + i];
        values[key_type + '_max'] = values['max_' + i];
        values[key_type + '_year'] = values['year_' + i];
        values[key_type + '_bool'] = values['bool_' + i];

        delete values['min_' + i];
        delete values['max_' + i];
        delete values['year_' + i];
        delete values['bool_' + i];
        delete values['search_type_' + i];
      }

      this.setState({
        formValues: values,
      });

      console.log('values');
      console.log(values);
      dispatch({
        type: 'company/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="公司名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                高级搜索 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
        <div style={{ marginBottom: 20 }}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={24}>
              导出：<Button type="primary" onClick={this.exportBaseInfo}>
                公司基本信息
              </Button>
              <span> </span>
              <Button type="primary" onClick={this.exportProducts}>
                公司产品信息
              </Button>{' '}
              <span> </span>
              <Button type="primary" onClick={this.exportYearBus}>
                历年经营数据
              </Button>
              <span> </span>
              <Button type="primary" onClick={this.exportYearPatent}>
                历年专利数据
              </Button>
            </Col>
            {/* <Col md={8} sm={24}>
              <Button type="primary">导出</Button>
            </Col> */}
          </Row>
        </div>
      </Form>
    );
  }

  exportBaseInfo = () => {
    companyService.exportBasicInfo();
  };

  exportProducts = () => {
    companyService.exportProducts();
  };

  exportYearBus = () => {
    companyService.exportYearBus();
  };

  exportYearPatent = () => {
    companyService.exportYearPatent();
  };

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    let { searchArr } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="公司名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <div style={{ marginBottom: 20 }}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={24}>
              导出：<Button type="primary" onClick={this.exportBaseInfo}>
                公司基本信息
              </Button>
              <span> </span>
              <Button type="primary" onClick={this.exportProducts}>
                公司产品信息
              </Button>{' '}
              <span> </span>
              <Button type="primary" onClick={this.exportYearBus}>
                历年经营数据
              </Button>
              <span> </span>
              <Button type="primary" onClick={this.exportYearPatent}>
                历年专利数据
              </Button>
            </Col>
            {/* <Col md={8} sm={24}>
              <Button type="primary">导出</Button>
            </Col> */}
          </Row>
        </div>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="著作权登记(件)">
              {getFieldDecorator('copyright_registration_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('copyright_registration_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={4} style={{ marginLeft: 20 }}>
            <Button onClick={this.handleAddSearchType}>+</Button>
            <Button onClick={this.handleRemoveSearchType} style={{ marginLeft: 20 }}>
              -
            </Button>
          </Col>
        </Row>
        {searchArr.map((item, idx) => (
          <Row type="flex" key={idx}>
            <Col span={2}>
              {getFieldDecorator('bool_' + idx, {
                initialValue: 'and',
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="and">并且</Option>
                  <Option value="or">或者</Option>
                </Select>
              )}
            </Col>
            <Col span={3}>
              {getFieldDecorator('search_type_' + idx)(
                <Select placeholder="请选择搜索字段" style={{ width: '100%' }} allowClear>
                  {item['search_type'].map(y => <Option value={y.key}>{y.val}</Option>)}
                </Select>
              )}
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('min_' + idx)(<Input placeholder="大于等于" />)}
              </FormItem>
            </Col>
            -
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('max_' + idx)(<Input placeholder="小于等于" />)}
              </FormItem>
            </Col>
            <Col span={4} style={{ marginLeft: 20 }}>
              <FormItem label="年份">
                {getFieldDecorator('year_' + idx)(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    {item['year'].map(y => <Option value={y.key}>{y.val}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        ))}
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  async showPatentTrend(record) {
    // console.log(record);
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetchYearPatent',
      payload: { companyCode: record.code },
    });
    this.setState({ showTrendModal: true, trendType: 'patent' });
  }

  async showTrademarkTrend(record) {
    // console.log(record);
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetchYearPatent',
      payload: { companyCode: record.code },
    });
    this.setState({ showTrendModal: true, trendType: 'trademark' });
  }

  render() {
    console.log('render...');
    const { company: { data, yearPatentList }, loading } = this.props;
    const { selectedRows, modalVisible, trendType } = this.state;
    // let data = [];
    const columns = [
      { title: '公司编号', dataIndex: 'code' },
      {
        title: '公司名称',
        dataIndex: 'name',
        render: (val, record) => (
          <Link to={`/patent/company-detail/${record.code}`} target="_blank">
            {val}
          </Link>
        ),
      },
      {
        title: '注册资本',
        dataIndex: 'registered_capital',
        align: 'right',
        render: val => (val ? `${val} 万` : '-'),
        needTotal: true,
      },
      { title: '创办年份', dataIndex: 'create_year', align: 'center' },
      { title: '联系电话', dataIndex: 'phone_number', align: 'center' },
      { title: '资产总额', dataIndex: 'total_assets', align: 'center' },
      { title: '固定资产总额', dataIndex: 'total_capital_asserts', align: 'center' },
      { title: '负债总额', dataIndex: 'total_indebtedness', align: 'center' },
      { title: '控股子公司数量', dataIndex: 'subsidiary_company_count', align: 'center' },
      { title: '职工人数', dataIndex: 'total_staff_count', align: 'center' }, //   title: '硕士', // mark to display a total number // {
      //   dataIndex: 'master_staff_count',
      // },
      // {
      //   title: '博士',
      //   dataIndex: 'doctor_staff_count',
      // },
      // {
      //   title: '科研人员',
      //   dataIndex: 'researcher_count',
      // },
      { title: '单位性质', dataIndex: 'type', align: 'center' },
      { title: '专利拥有量', dataIndex: 'invention_patent_owning_count', align: 'center' },
      { title: '注册商标拥有量', dataIndex: 'registed_trademark_count', align: 'center' },
      { title: '著作权拥有量', dataIndex: 'copyright_registration_count', align: 'center' }, //   title: '状态', // {
      //   dataIndex: 'status',
      //   filters: [
      //     {
      //       text: status[0],
      //       value: 0,
      //     },
      //     {
      //       text: status[1],
      //       value: 1,
      //     },
      //     {
      //       text: status[2],
      //       value: 2,
      //     },
      //     {
      //       text: status[3],
      //       value: 3,
      //     },
      //   ],
      //   onFilter: (value, record) => record.status.toString() === value,
      //   render(val) {
      //     return <Badge status={statusMap[val]} text={status[val]} />;
      //   },
      // },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updatedAt',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '操作',
        fixed: 'right',
        render: (val, record) => (
          <Fragment>
            <a href="javasript:void()" onClick={() => this.showPatentTrend(record)}>
              专利趋势
            </a>
            <Divider type="vertical" />
            <a href="javasript:void()" onClick={() => this.showTrademarkTrend(record)}>
              商标趋势
            </a>
          </Fragment>
        ),
      },
    ];

    const { showTrendModal } = this.state;

    const _this = this;
    const trendProps = {
      list: yearPatentList,
      type: trendType,
      showAddModel: showTrendModal,
      onOk: function(values) {
        _this.setState({ showTrendModal: false });
      },
      handleAddModalVisible: function() {
        _this.setState({ showTrendModal: !showTrendModal });
      },
    };

    return (
      <PageHeaderLayout title="吴中区知识产权密集型企业数据库">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              loading={
                loading // selectedRows={selectedRows}
              }
              data={data}
              columns={columns}
              onChange={
                this.handleStandardTableChange // onSelectRow={this.handleSelectRows}
              }
              scroll={{ x: 1500 }}
            />
          </div>
          <PatentTrend {...trendProps} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
