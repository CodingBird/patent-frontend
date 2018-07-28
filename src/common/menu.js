import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '专利数据',
    icon: 'dashboard',
    path: 'patent/list',
  },
  {
    name: '产业数据',
    icon: 'dashboard',
    path: 'industry/list',
  },
  {
    name: '产业数据对比',
    icon: 'dashboard',
    path: 'industry/industry-compare',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
