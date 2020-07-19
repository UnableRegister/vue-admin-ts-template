import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const recycleRoutes: RouteConfig = {
  path: '/recycle',
  component: Layout,
  redirect: '/recycle/order-list',
  name: 'Recycle',
  meta: {
    title: 'recycle',
    icon: 'international'
  },
  children: [
    {
      path: 'recycle-list',
      component: () => import('@/views/recycle/order-list/index.vue'),
      name: 'OrderList',
      meta: { title: 'recycleList' }
    },
    {
      path: 'recycle-order/:id',
      component: () => import('@/views/recycle/order/index.vue'),
      name: 'RecycleOrder',
      meta: { title: 'recycleOrder' },
      props: true
    }
  ]
}

export default recycleRoutes
