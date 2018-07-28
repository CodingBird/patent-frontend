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
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;
import styles from './IndustryDetail.less';

const FormItem = Form.Item;
const { Option } = Select;

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@connect(({ industry, loading }) => ({
  industry,
  loading: loading.effects['industry/fetchDetail'],
}))
@Form.create()
export default class IndustryDetail extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'industry/fetchDetail',
      payload: {
        id,
      },
    });
  }

  render() {
    const { industry, loading } = this.props;
    const { detail } = industry;
    console.log(detail);
    return (
      <PageHeaderLayout title="行业数据详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="行业信息" style={{ marginBottom: 32 }}>
            <Description term="行业名称">{detail.name}</Description>
            <Description term="单位数">{detail.company_count}</Description>
            <Description term="从业人员期末人数">{detail.employee_count}年</Description>
            <Description term="工业总产值">{detail.industry_output_value}</Description>
            <Description term="出口交货值">{detail.export_value || '-'}</Description>
            <Description term="主营业务收入">{detail.main_input}</Description>
            <Description term="利润总额">{detail.total_profit}</Description>
            <Description term="主营业务税金及附加本期(千元)">
              {detail.main_input_tax || '-'}
            </Description>
            <Description term="应交增值税本期(千元)">{detail.added_tax || '-'}</Description>
            <Description term="从业人员工资总额">{detail.total_wage || '-'}</Description>
            <Description term="资产总计">{detail.total_asset || '-'}</Description>
            <Description term="R&D人员合计">{detail.total_person_rd || '-'}</Description>
            <Description term="R&D经费内部支出合计">{detail.total_funds_rd || '-'}</Description>
            <Description term="专利申请数">{detail.patent_count || '-'}</Description>
            <Description term="发明专利">{detail.invent_patent_count || '-'}</Description>
            <Description term="有效发明专利">{detail.valid_invent_patent_count || '-'}</Description>
            <Description term="新产品产值">{detail.new_product_value || '-'}</Description>
            <Description term="新产品销售收入">{detail.new_product_amount || '-'}</Description>
            <Description term="拥有注册商标">{detail.trademark_count || '-'}</Description>
            <Description term="平均工资">{detail.avg_wage || '-'}</Description>
            <Description term="平均R&D人员数">{detail.avg_rd_person_count || '-'}</Description>
            <Description term="平均R&D经费内部支出">{detail.avg_rd_in_funds || '-'}</Description>
            <Description term="有效发明专利/从业人员数">
              {detail.patent_person_rate || '-'}
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
