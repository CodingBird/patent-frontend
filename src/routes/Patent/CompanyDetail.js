import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CompanyDetail.less';

const { Description } = DescriptionList;

const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'success' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="processing" text="进行中" />
      ),
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
export default class CompanyDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    let companyCode = this.props.match.params.code;
    dispatch({
      type: 'company/fetchDetail',
      payload: { companyCode },
    });
  }

  render() {
    const { company: { data }, loading } = this.props;
    console.log('detail');
    console.log(data);
    let {
      baseInfo = {},
      patentSate = {},
      productList = [],
      yearOperateStateList = [],
      yearPatentList = [],
    } = data;
    console.log('baseInfo');
    console.log(baseInfo);
    // const { basicGoods, basicProgress } = profile;
    // const { company: { data } } = profile;
    let basicGoods = [],
      basicProgress = [];
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const productColumns = [
      {
        title: '产品名称',
        dataIndex: 'product_name',
      },
      {
        title: '相应发明专利数量（单位：件）',
        dataIndex: 'patent_count',
        align: 'center',
      },
      {
        title: '相应实用新型专利数量（单位：件）',
        dataIndex: 'practical_patent_count',
        align: 'center',
      },
    ];
    const operateColumns = [
      {
        title: '年份',
        dataIndex: 'year',
      },
      {
        title: '销售总收入（万元）',
        dataIndex: 'total_sale',
        align: 'center',
      },
      {
        title: '新产品销售收入（万元）',
        dataIndex: 'new_product_sale',
        align: 'center',
      },
      {
        title: '专利产品销售收入（万元）',
        dataIndex: 'patent_product_sale',
        align: 'center',
      },
      {
        title: '出口销售总额（万元）',
        dataIndex: 'export_sale',
        align: 'center',
      },
      {
        title: '利税总额（万元）',
        dataIndex: 'total_profit',
        align: 'center',
      },
      {
        title: '税后利润（万元）',
        dataIndex: 'after_tax_profit',
        align: 'center',
      },
      {
        title: '员工数（人）',
        dataIndex: 'staff_count',
        align: 'center',
      },
      {
        title: 'R&D经费投入（万元）',
        dataIndex: 'r_d_cost',
        align: 'center',
      },
    ];
    const patentColumns = [
      {
        title: '年份',
        dataIndex: 'year',
      },
      {
        title: '发明专利',
        children: [
          {
            title: '申请量',
            dataIndex: 'invention_patent_apply_count',
            align: 'center',
            width: 100,
          },
          {
            title: '授权量',
            dataIndex: 'invention_patent_authorize_count',
            align: 'center',
            width: 100,
          },
          {
            title: '拥有量',
            dataIndex: 'invention_patent_owning_count',
            align: 'center',
            width: 100,
          },
        ],
      },
      {
        title: '实用新型',
        children: [
          {
            title: '申请量',
            dataIndex: 'practical_new_apply_count',
            align: 'center',
            width: 100,
          },
          {
            title: '授权量',
            dataIndex: 'practical_new_authorize_count',
            align: 'center',
            width: 100,
          },
          {
            title: '拥有量',
            dataIndex: 'practical_new_owning_count',
            align: 'center',
            width: 100,
          },
        ],
      },
      {
        title: '外观设计',
        children: [
          {
            title: '申请量',
            dataIndex: 'appearance_design_apply_count',
            align: 'center',
            width: 100,
          },
          {
            title: '授权量',
            dataIndex: 'appearance_design_authorize_count',
            align: 'center',
            width: 100,
          },
          {
            title: '拥有量',
            dataIndex: 'appearance_design_owning_count',
            align: 'center',
            width: 100,
          },
        ],
      },
      {
        title: 'PCT专利申请数量',
        dataIndex: 'pct_patent_apply_count',
        align: 'center',
      },
      {
        title: '同族专利数量',
        dataIndex: 'cognation_patent_count',
        align: 'center',
      },
    ];
    const trademarkColumns = [
      {
        title: '年份',
        dataIndex: 'year',
      },
      {
        title: '商标申请量',
        dataIndex: 'trademark_apply_count',
        align: 'center',
      },
      {
        title: '已注册商标量',
        dataIndex: 'registed_trademark_count',
        align: 'center',
      },
      {
        title: '境外注册商标量',
        dataIndex: 'outside_trademark_count',
        align: 'center',
      },
      {
        title: '著名商标量',
        dataIndex: 'famous_trademark_count',
        align: 'center',
      },
      {
        title: '驰名商标量',
        dataIndex: 'resounding_trademark_count',
        align: 'center',
      },
    ];
    return (
      <PageHeaderLayout title="详细信息">
        <Card bordered={false}>
          <DescriptionList size="large" title="公司基本信息" style={{ marginBottom: 32 }}>
            <Description term="公司名称">{baseInfo.name}</Description>
            <Description term="注册资本">{baseInfo.registered_capital}</Description>
            <Description term="创办年份">{baseInfo.create_year}年</Description>
            <Description term="联系电话">{baseInfo.phone_number}</Description>
            <Description term="资产总额">{baseInfo.total_assets}</Description>
            <Description term="固定资产总额">{baseInfo.total_capital_asserts}</Description>
            <Description term="负债总额">{baseInfo.total_indebtedness}</Description>
            <Description term="控股子公司数量">
              {baseInfo.subsidiary_company_count || '-'}
            </Description>
            <Description term="现有职工人数">{baseInfo.total_staff_count || '-'}</Description>
            <Description term="硕士">{baseInfo.master_staff_count || '-'}</Description>
            <Description term="博士">{baseInfo.doctor_staff_count || '-'}</Description>
            <Description term="科研人员">{baseInfo.researcher_count || '-'}</Description>
            <Description term="单位性质">{baseInfo.type || '-'}</Description>
          </DescriptionList>

          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>企业主导产品</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={productList}
            columns={productColumns}
            rowKey="id"
            size="small"
            bordered
          />
          <div className={styles.title}>经营情况</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={yearOperateStateList}
            columns={operateColumns}
            scroll={{ x: 1300 }}
            size="small"
            bordered
          />
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>专利拥有情况</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={yearPatentList}
            columns={patentColumns}
            scroll={{ x: 1300 }}
            size="small"
            bordered
          />
          <div className={styles.title}>商标拥有情况</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={yearPatentList}
            columns={trademarkColumns}
            scroll={{ x: 1300 }}
            size="small"
            bordered
          />

          <DescriptionList size="large" title="知识产权创造情况" style={{ marginBottom: 32 }}>
            <Description term="著作权登记(件)">
              {patentSate.copyright_registration_count}件
            </Description>
            <Description term="其中计算机软件著作权登记（件）">
              {patentSate.software_copyright_registration_count}件
            </Description>
            <Description term="集成电路布图设计登记">
              {patentSate.ic_diagram_registration_count}件
            </Description>
            <Description term="已明确界定为本单位商业（技术）秘密加以保护的项数为">
              {patentSate.secret_registration_count}件
            </Description>
            <Description term="发明专利维持年限5年以上">
              {patentSate.five_year_patent_count}件
            </Description>
            <Description term="实用新型维持年限3年以上">
              {patentSate.practical_new_three_year_count}件
            </Description>
            <Description term="维持年限为10年以上的发明专利">
              {patentSate.ten_year_patent_count}件
            </Description>
            <Description term="形成国家或行业标准数量">
              {patentSate.standard_patent_count}条
            </Description>
            <Description term="企业获得知识产权的主要途径">
              {patentSate.from_independent_create === 1 ? '自主创造 ' : ''}
              {patentSate.from_licensed === 1 ? '被许可 ' : ''}
              {patentSate.from_transfer === 1 ? '被转让' : ''}
            </Description>
          </DescriptionList>
          <DescriptionList size="large" title="企业知识产权运用效果" style={{ marginBottom: 32 }}>
            <Description term="专利自行实施数量（件）">
              {patentSate.patent_execute_count}件
            </Description>
            <Description term="版权自行实施数量（件）">
              {patentSate.copyright_execute_count}件
            </Description>
            <Description term="专利许可数量（件）">{patentSate.patent_license_count}件</Description>
            <Description term="版权许可数量（件）">
              {patentSate.copyright_license_count}件
            </Description>
            <Description term="专利转让数量（件）">
              {patentSate.patent_transfer_count}件
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
