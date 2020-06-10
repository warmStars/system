/* globals API_PATH */
import util from './utils.js';

/**
 *  获取本地存储的信息
 * @param {string} key 需要获取的信息的字段名
 * @return 返回所需要取得数据
 *
 */
function getSessionData(key) {
    return util.getSessionStorage(key);
}
/**
 *  设置本地存储信息
 * @param key 需要存储的信息的key
 * @param data 所需要存储的信息 字符串或json字符串
 */

function setSessionData(key, data) {
    util.setSessionStorage(key, data);
}

/**
 *  移除本地存储信息
 * @param key
 */

function removeSessionData(key) {
    util.removeStorageData(key);
}

function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;

    Vue.getSessionData = getSessionData;
    Vue.setSessionData = setSessionData;
    Vue.removeSessionData = removeSessionData;

    Object.defineProperties(Vue.prototype, {
        getSessionData: {
            get() {
                return getSessionData;
            }
        },
        setSessionData: {
            get() {
                return setSessionData;
            }
        },
        removeSessionData: {
            get() {
                return removeSessionData;
            }
        },
    });
}

export default {
    install
};
