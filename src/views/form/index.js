
import Params                       from 'utils/params.util'
import Http                         from 'utils/http.util'
import Verify                       from 'utils/verify.util'
import Store                        from 'utils/store.util'
import Config                       from 'config/env.config'
import Data                         from './data.mixin'

import AddressController            from 'controllers/address.controller'
AddressController.init();

// 列表控制器
const Controller = {
    params: {},
    index: 0,
    init () {
        this.params = Params.get();
        this.assignmentData();
        $.subscribe('address.select', this.handleAddressSelect.bind(this));
        $('#button').on('touchend', this.handleSubmit.bind(this));
        $('.form').on('input', 'input', this.handleInput.bind(this))
            .on('click', '.form-item-bankArea', this.handleArea.bind(this));
        $('.tab-item').on('touchend', this.handleTabSwitch.bind(this));
        this.renderHtml();
    },
    handleTabSwitch (event) {
        this.index = $(event.target).data('value');
        $('.tab-item').removeClass('active').eq(this.index).addClass('active');
        $('.form').removeClass('active').eq(this.index).addClass('active');
        this.renderHtml();
    },
    handleInput (event) {
        let $el = $(event.target);
        let key = $el.data('key');
        Data.objInput1[key] && (Data.objInput1[key].value = $el.val());
        Data.objInput2[key] && (Data.objInput2[key].value = $el.val());
        this.keepFormData();
    },
    handleArea () {
        $('input').blur();
        $.publish('address.show');
    },
    handleAddressSelect (e, province, city, district) {
        console.log( province, city, district)
        let area = `${province.name} ${city.name} ${district.name}`;
        console.log('area', area);
        $('.form-item-bankArea input').val(area);
        Data.objInput1.bankArea.value = area;
        Data.objHidden.bankProvince.value = province.name;
        Data.objHidden.bankCity.value = city.name;
        Data.objHidden.merchantDistrict.value = district.name;
        this.keepFormData();
    },
    assignmentData () {
        let data = Store.dataToLocalStorageOperate.achieve('FORM_DATA') || {};
        console.log(data);
        Verify.assignment(data, Data.objInput1, Data.objInput2, Data.objHidden);
        console.log(Data);
    },
    keepFormData () {
        let data = Verify.input(Data.objInput1, Data.objInput2, Data.objHidden);
        Store.dataToLocalStorageOperate.save('FORM_DATA', data);
    },
    renderHtml () {
        let strHtml = '';
        let data = Data[this.index === 0 ? 'objInput1' : 'objInput2'];
        for (let key in data) {
            let { label, value, type, max, disabled, placeholder } = data[key];
            strHtml += `
        <div class="form-item ${disabled && 'form-item-arrow'} form-item-${key}">
            <label>${label}</label>
            <div class="input">
            `;
            if (disabled) {
                strHtml += `
                <input data-key="${key}" type="${type}" value="${value}" maxlength="${max}" disabled placeholder="${placeholder}">
                `
            } else {
                strHtml += `
                <input data-key="${key}" type="${type}" value="${value}" maxlength="${max}" placeholder="${placeholder}">
                `
            }
            strHtml += `
            </div>
            <div class="select-arrow">
                <select>
                    <option>选项</option>
                </select>
            </div>
        </div>
           `;
        }
        $('.form').eq(this.index).html(strHtml);
    },
    handleSubmit () {
        if (Verify.check(Data.objInput1)) return null;
        if (Verify.check(Data.objInput2)) return null;
        let options = Verify.input(Data.objInput1,Data.objInput2, Data.objHidden);
        this.keepFormData();
        options.fontNotifyUrl = Data.fontNotifyUrl;
        Http(Config.API_URL_FETCH + Http.API.Do_openChannel, options).then((res) => {
            res = res || {};
            let { type, result } = res;
            if (type === '1')
                return window.location.href = './cashier.html';
            if (type === '2')
                return window.location.href = result;
            $('body').append(result);
            $('form').submit();
        }).toast();
    },
};

Controller.init();
