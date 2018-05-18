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
      </Form>
    );
  }

  renderAdvancedForm() {
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
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="发明专利申请量">
              {getFieldDecorator('invention_patent_apply_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('invention_patent_apply_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('invention_patent_apply_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="发明专利授权量">
              {getFieldDecorator('invention_patent_authorize_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('invention_patent_authorize_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('invention_patent_authorize_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="发明专利拥有量">
              {getFieldDecorator('invention_patent_owning_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('invention_patent_owning_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('invention_patent_owning_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="实用新型申请量">
              {getFieldDecorator('practical_new_apply_count_min')(<Input placeholder="大于等于" />)}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('practical_new_apply_count_max')(<Input placeholder="小于等于" />)}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('practical_new_apply_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="实用新型授权量">
              {getFieldDecorator('practical_new_authorize_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('practical_new_authorize_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('practical_new_authorize_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="实用新型拥有量">
              {getFieldDecorator('practical_new_owning_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('practical_new_owning_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('practical_new_owning_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="外观设计申请量">
              {getFieldDecorator('appearance_design_apply_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('appearance_design_apply_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('appearance_design_apply_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="外观设计授权量">
              {getFieldDecorator('appearance_design_authorize_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('appearance_design_authorize_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('appearance_design_authorize_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="外观设计拥有量">
              {getFieldDecorator('appearance_design_owning_count_min')(
                <Input placeholder="大于等于" />
              )}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('appearance_design_owning_count_max')(
                <Input placeholder="小于等于" />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('appearance_design_owning_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="PCT专利申请数量">
              {getFieldDecorator('pct_patent_apply_count_min')(<Input placeholder="大于等于" />)}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('pct_patent_apply_count_max')(<Input placeholder="小于等于" />)}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('pct_patent_apply_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={7}>
            <FormItem label="已注册商标量">
              {getFieldDecorator('registed_trademark_count_min')(<Input placeholder="大于等于" />)}
            </FormItem>
          </Col>
          -
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('registed_trademark_count_max')(<Input placeholder="小于等于" />)}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('registed_trademark_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
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
          {/* <Col span={8} style={{ marginLeft: 20 }}>
            <FormItem label="年份">
              {getFieldDecorator('invention_patent_owning_count_year')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="2014">2014年</Option>
                  <Option value="2015">2015年</Option>
                  <Option value="2016">2016年</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { company: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    // let data = [];
    const columns = [
      {
        title: '公司编号',
        dataIndex: 'code',
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        render: (val, record) => <Link to={`/patent/company-detail/${record.code}`}>{val}</Link>,
      },
      {
        title: '注册资本',
        dataIndex: 'registered_capital',
        sorter: true,
        align: 'right',
        render: val => `${val} 万`,
        // mark to display a total number
        needTotal: true,
      },
      {
        title: '创办年份',
        dataIndex: 'create_year',
      },
      {
        title: '联系电话',
        dataIndex: 'phone_number',
      },
      {
        title: '资产总额',
        dataIndex: 'total_assets',
      },
      {
        title: '固定资产总额',
        dataIndex: 'total_capital_asserts',
      },
      {
        title: '负债总额',
        dataIndex: 'total_indebtedness',
      },
      {
        title: '控股子公司数量',
        dataIndex: 'subsidiary_company_count',
      },
      {
        title: '职工人数',
        dataIndex: 'total_staff_count',
      },
      // {
      //   title: '硕士',
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
      {
        title: '单位性质',
        dataIndex: 'type',
      },
      // {
      //   title: '状态',
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
      // {
      //   title: '操作',
      //   render: () => (
      //     <Fragment>
      //       <a href="">配置</a>
      //       <Divider type="vertical" />
      //       <a href="">订阅警报</a>
      //     </Fragment>
      //   ),
      // },
    ];

    return (
      <PageHeaderLayout title="问卷调查数据">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
