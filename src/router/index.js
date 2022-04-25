import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getToken } from '@/utils/auth'
import { selectUser, selectUserInfo } from '@/service/validate'
import { data } from 'autoprefixer'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/table/userInfo'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/table/logInfo'),
        meta: { title: '日志管理', icon: 'table' }
      },
      {
        path: 'literature',
        name: 'literature',
        component: () => import('@/views/table/literatureInfo'),
        meta: { title: '文献管理', icon: 'table' }
      },
      {
        path: 'store',
        name: 'store',
        component: () => import('@/views/table/storeInfo'),
        meta: { title: '用户收藏管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/literatureDataInfo',
    component: () => import('@/views/nested/info'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/nested/index'),
      meta: { title: '文献搜索', icon: 'el-icon-search' }
    }]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/文献推荐',
    name: 'Nested',
    meta: {
      title: '文献推荐',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '精彩推荐', icon: 'el-icon-s-management' }
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/downNumTop'),
        meta: { title: '最高下载', icon: 'el-icon-collection' }
      },
      {
        path: 'menu3',
        component: () => import('@/views/nested/storeNumTop'),
        meta: { title: '最高收藏', icon: 'el-icon-star-off' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const token = getToken()

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: token === 'admin-token' ? constantRoutes : asyncRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
