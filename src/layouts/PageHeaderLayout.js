import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => {
  console.log(restProps);
  return (
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
      <PageHeader key="pageheader" {...restProps} />
      {/* <div
        style={{
          height: '30px',
          backgroundColor: 'white',
          textAlign: 'left',
          verticalAlign: 'middle',
          paddingLeft: '20px',
        }}
      >
        <h3>问卷调查数据</h3>
      </div> */}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
