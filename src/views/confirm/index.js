
import Params                       from 'utils/params.util'
import Http                         from 'utils/http.util'
import Store                        from 'utils/store.util'
import Toast                        from 'utils/toast.util'
import Filter                       from 'utils/filter.util'
import Config                       from 'config/env.config'

import 'utils/ajuanLazyLoad.js'

// 列表控制器
const Controller = {
    params: {},
    data: {},
    init () {
        this.params = Params.get();
        console.log(this.params);
        this.assignmentData();
        $('#button').on('click', this.handleSubmit.bind(this));
    },
    assignmentData () {
        this.data = Store.dataToLocalStorageOperate.achieve('FORM_DATA') || {};
        console.log(this.data);
        for (let key in this.data) {
            let value = this.data[key];
            if (['bankcardNum', 'bankCardNo'].indexOf(key) > -1) value = Filter.filterBankCard(value);
            // if (['realName'].indexOf(key) > -1) value = Filter.filterName(value);
            $(`.${key}`).text(value);
        }
        let amount = Store.dataToLocalStorageOperate.achieve('USER_AMOUNT') || '0';
        $('.amount').text(`-${amount}`);
        let rate = (Math.ceil(+amount * 0.5) / 100 ).toFixed(2);
        $('.rate').text(`${rate}`);
        let collections = ((+amount) - (+rate) - 1).toFixed(2);
        $('.collections').text(`+${collections}`);
    },
    handleSubmit () {
        let amount = Store.dataToLocalStorageOperate.achieve('USER_AMOUNT') || '0';
        let { bindPhone, realName, idCardNo, bankcardNum, khBankName,
            bankCardNo, bankName, } = this.data;
        if (!bindPhone) bindPhone = '';
        let options = {
            brandId: 111,
            tradeNo: `${bindPhone.substring(4)}${new Date().getTime().toString()}`,
            tradeAmount: amount,
            phone: bindPhone,
            fromName: realName,
            fromIdCardNo: idCardNo,

            fromBankCardNo: bankcardNum,
            fromBankName: khBankName,

            toName: realName,
            toIdCardNo: idCardNo,
            toBankName: bankName,
            toBankCardNo: bankCardNo,
            ip: '127.0.0.1'
        };
        Http(Config.API_URL_TR_FETCH + Http.API.Req_userToken, {
            phone: options.phone,
            idCardNo: options.fromIdCardNo,
            bankCardNo: options.fromBankCardNo,
        }).then((res) => {
            return Http(Config.API_URL_TR_FETCH + Http.API.Do_userTransaction, options, {token: res});
        }).then((res) => {
            Toast.msg('收银成功');
            setTimeout(() => {
                window.history.go(-2);
            }, 2000)
        }).toast();

    },
};
Controller.init();
