import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');

const home = _import('home/index');


/* Introduction */
const Introduction = _import('introduction/index');


/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

/* error log */
const ErrorLog = _import('errlog/index');

/* 开奖数据 */
const LotteryData  = _import('lotteryData/index');
/* 彩种数据 */
const Lottery = _import('lottery/index');
/* 频道 */
const Channel = _import('channel/index');

//文章
const articleList = _import('article/list');
const articleAdd = _import('article/add');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      name: '首页',
      hidden: true,
      children: [{ path: 'home', component: home }]
    },
    
    {
      path: '/introduction',
      component: Layout,
      redirect: '/introduction/index',
      icon: 'xinrenzhinan',
      noDropdown: true,
      children: [{ path: 'index', component: Introduction, name: '简述' }]
    }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/LotteryData',
    component: Layout,
    redirect: 'noredirect',
    name: '开奖数据',
    icon: 'wujiaoxing',
    children: [
        { path: 'index', component: LotteryData, name: '开奖列表'}
    ]
  },
  {
    path: '/Lottery',
    component: Layout,
    redirect: 'noredirect',
    name: '彩种数据',
    icon: 'zonghe',
    children: [
        { path: 'index', component: Lottery, name: '彩种列表'}
    ]
  },
  {
    path: '/Channel',
    component:Layout,
    redirect:'noredirect',
    name:'频道',
    icon:'location',
    children: [
        { path: 'index', component: Channel, name: '频道列表'}
    ]
  },{
    path:'/article',
    component:Layout,
    redirect:'noredirect',
    name:'文章管理',
    icon:'feiji',
    children:[
      {path:'list',component:articleList,name:'文章列表'},
      {path:'add',component:articleAdd,name:'新增文章'}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
