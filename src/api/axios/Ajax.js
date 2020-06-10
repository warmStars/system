function install(Vue, axios) {
    // 跨域
    if (process.env.NODE_ENV == "development") {
        axios.defaults.baseURL = "/api";
    } else {
        axios.defaults.baseURL = "https://zht.icbc.com.cn/sxlab/ncloud"
    }
    if (install.installed) {
        return;
    }
    install.installed = true;
    if (!axios) {
        // eslint-disable-next-line no-console
        console.error('You have to install axios');
        return;
    }

    axios.interceptors.request.use(function (config) {
        return config;
    });
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            return Promise.reject(error);
        }
    );
    Vue.axios = axios;

    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return axios;
            }
        },
        $http: {
            get() {
                return axios;
            }
        }
    });
}

export default {
    install
};
