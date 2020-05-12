
import Toast                        from 'utils/toast.util'
import Config                       from 'config/env.config'
import Api                          from 'config/api.config'
import Store                        from 'utils/store.util'

function Http (url, data, options) {
    this.fn = options.fn || 'fetch';
    this.data = data;
    this.options = options;
    this.url = url;
    return this[this.fn]();
}

// 注册流程
Http.prototype.fetch = function () {
    let { AccessToken, UserID } = Store.dataToSessionStorageOperate.achieve('ACCESS_TOKEN');
    this.url = `${Config.API_URL_FETCH}${this.url}?access_token=${AccessToken}`;
    UserID && (this.data.UserId = UserID);
    console.log(this.url, '请求参数 => ', this.data);
    let headers = {
        'Content-Type': 'application/json;charset=UTF-8',
    };
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
                console.log(this.url, '请求返回 => ', response);
                let { Status, Message, Data } = response;
                if (Status !== 0)
                    return reject(Message);
                console.log(this.url, '请求返回格式化 => ', Data);
                resolve(Data);
            },
            error: (err = '') => {
                console.log(this.url, '请求错误 => ', err);
                let { response, status } = err;
                let msg = '网络繁忙，请稍后再试';
                try {
                    response = JSON.parse(response);
                    msg = response.Message;
                } catch (e) {
                    msg = '网络繁忙，请稍后再试';
                } finally {
                    if (status === 401) {
                        Store.dataToSessionStorageOperate.clear();
                    }
                    reject(msg);
                }
            }
        })
    });
};

const fn = (url, data = {}, options = {}) => {
    let { loading } = options;
    if (loading !== false) Toast.show(loading);
    return new Http(url, data, options).finally(() => {
        loading !== false && Toast.hide();
    });
};

fn.API = Api;

export default fn;

