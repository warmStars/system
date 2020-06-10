import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import util from '@/api/publicMethods/utils';
// 全局访问封装
import { ApiPlugin } from '@/api/axios/index';
// 跨域地址、请求访问
import OSPAjax from '@/api/axios/Ajax';
// 自定义onload、onerror
import OSPApi from '@/api/axios/APIMan';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import sessionStorageData from '@/api/publicMethods/sessionStorageData';
Vue.config.productionTip = false;
Vue.use(OSPApi);
Vue.use(OSPAjax, axios);
Vue.use(ApiPlugin);
Vue.use(sessionStorageData);
Vue.use(ElementUI, {
    size: 'small'
});
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = util.getSessionStorage('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        role === 'admin' ? next() : next('/403');
    } else {
        next();
    }
});
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
