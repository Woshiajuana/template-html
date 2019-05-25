
import Toast            from 'utils/toast.util'
import Config           from 'config/env.config'
import Api              from 'config/api.config'

function Http (url, data, options) {
    this.fn = options.fn || 'fetch';
    this.data = data;
    this.options = options;
    this.url = url;
    return this[this.fn]();
}

// 注册流程
Http.prototype.fetch = function () {
    // let url = `${Config.API_URL_FETCH}${this.url}`;
    console.log(this.url + '请求 => ', this.data);
    let headers = {'Content-Type': 'application/json;charset=UTF-8'};
    this.options.token && (headers.access_token = this.options.token);
    console.log('headers', headers);
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            timeout: 60 * 1000,
            url: this.url,
            data: JSON.stringify(this.data),
            dataType: 'json',
            headers,
            ...this.options,
            success: (response) => {
                console.log(response);
                let { respCode, respMessage, data } = response;
                if (respCode !== 'S0001')
                    return reject(respMessage);
                resolve(data);
            },
            error: (err = '') => {
                console.log(err);
                let {
                    status,
                    responseJSON,
                } = err;
                let msg = '网络繁忙，请稍后再试';
                if (responseJSON && responseJSON.msg)
                    msg = responseJSON.msg;
                reject(msg);
            }
        })
    });
};

const fn = (url, data = {}, options = {}) => {
    let {loading} = options;
    if (loading !== false) Toast.show(loading);
    return new Http(url, data, options).finally(() => {
        loading !== false && Toast.hide();
    });
};

fn.API = Api;

export default fn;

