'use strict';
import promise from 'es6-promise';
import Vue from 'vue';
import { isArray as _isArray, isObject as _isObject, isNil as _isNil, filter as _filter, each as _each, isFunction as _isFunction } from 'lodash';
import { Message } from 'element-ui';
import qs from 'qs';
// axios兼容IE
promise.polyfill();
/**
 * 参数过滤函数
 * @param obj
 * @returns {*}
 */
function filterNull(obj) {
    if (_isArray(obj)) {
        obj = _filter(obj, function (value) {
            if (_isNil(value)) {
                return false;
            } else {
                filterNull(value);
                return true;
            }
        });
    } else if (_isObject(obj)) {
        _each(obj, function (value, key) {
            if (_isNil(value)) {
                delete obj[key];
            }
            obj[key] = filterNull(value);
        });
    }
    obj = _isNil(obj) ? '' : obj;
    return obj;
}
function apiAxios(options) {
    let data = null;
    let header = {};
    let params = null;
    options.hasNoTime = options.hasNoTime || false;
    options.noSlash = options.noSlash || false;
    if (options.data) {
        if (options.NoFilterNull) {
            params = options.data;
        } else {
            params = filterNull(options.data);
        }
    }
    if (options.headers) {
        header = {
            'Content-type': 'application/x-www-form-urlencoded',
        };
        data = qs.stringify(params);
    } else {
        header = {
            'Content-type': 'application/json'
        };
        data = params;
    }
    header = Object.assign(header, options.header || {});
    let method = options.method;
    let onload = options.onload || function () { };
    let onerror = options.onerror || null;
    let url = options.url;
    Vue.axios({
        method: options.method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? data : null,
        params: method === 'GET' || method === 'DELETE' ? data : null,
        headers: header,
        withCredentials: false
    }).then(
        Vue.ajaxHandler({
            success: res => {
                onload && onload(res || res.result);
            },
            error: res => {
                if (onerror && _isFunction(onerror)) {
                    onerror(res.res || res.result || res);
                } else {
                    Message.error(res.message || res.msg || res.mes || '请求错误!')
                }
            }
        })
    ).catch(function (err) {
        let res = err && err.response;
        onerror && onerror(res);
        Message.error(res.message || res.msg || res.mes || '请求错误!')
        if (err === undefined) {
            window.alert('api error, HTTP CODE: ' + res.status);
        }
    });
}

let ajaxApi = {
    post_token: function (url, token, params, success, failure) {
        apiAxios({
            url: url,
            method: 'POST',
            tokenPos: true,
            hasToken: true,
            token: token,
            data: params,
            onload: success,
            onerror: failure
        });
    },
    post_notoken: function (url, params, success, failure) {
        apiAxios({
            url: url,
            method: 'POST',
            tokenPos: true,
            hasToken: false,
            token: null,
            data: params,
            onload: success,
            onerror: failure
        });
    },
    get_token: function (url, token, params, success, failure) {
        apiAxios({
            url: url,
            method: 'GET',
            tokenPos: true,
            hasToken: true,
            token: token,
            data: params,
            onload: success,
            onerror: failure
        });
    },
    get_notoken: function (url, params, success, failure) {
        apiAxios({
            url: url,
            method: 'GET',
            tokenPos: true,
            hasToken: false,
            token: null,
            data: params,
            onload: success,
            onerror: failure
        });
    },
    post: function (options) {
        options = options || {};
        apiAxios(
            Object.assign({ hasToken: true, tokenPos: false }, options, {
                method: 'POST'
            })
        );
    },
    get: function (options) {
        options = options || {};
        apiAxios(
            Object.assign({ hasToken: true, tokenPos: false }, options, {
                method: 'GET'
            })
        );
    },
    delete: function (options) {
        options = options || {};
        apiAxios(
            Object.assign({ hasToken: true, tokenPos: false }, options, {
                method: 'delete'
            })
        );
    }
};

/**
 * Install plugin
 * @param Vue
 * @param axios
 */

function ApiPlugin(Vue) {
    if (ApiPlugin.installed) {
        return;
    }
    ApiPlugin.installed = true;

    Object.assign(Vue.prototype, ajaxApi);
}

export { ajaxApi, ApiPlugin };
