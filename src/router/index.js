import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/records',
                    component: () => import('../components/page/RecordTable.vue'),
                    meta: { title: '用户意见' }
                },
                {
                    path: '/news',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/NewsTable.vue'),
                    meta: { title: '新闻' }
                },
                {
                    // 编辑新新闻
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '新闻编辑' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
