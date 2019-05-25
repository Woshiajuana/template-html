
import Params                       from 'utils/params.util'
import Config                       from 'config/env.config'
import Http                         from 'utils/http.util'
import Verify                       from 'utils/verify.util'
import Toast                        from 'utils/toast.util'
import Filter                       from 'utils/filter.util'
import Data                         from './data.mixin'


// 列表控制器
const Controller = {
    params: {},
    page: 1,
    rows: 10,
    pageTotal: 0,
    loading: false,
    status: {
        initial: {
            text: '处理中',
            style: 'status-2',
        },
        processing: {
            text: '处理中',
            style: 'status-2',
        },
        failed: {
            text: '失败',
            style: 'status-3',
        },
        success: {
            text: '成功',
            style: 'status-1',
        },
    },
    init () {
        this.params = Params.get();
        $('.form').on('input', 'input', this.handleInput.bind(this));
        $('#button').on('touchend', this.handleSubmit.bind(this));
        $(window).scroll(this.handleScroll.bind(this));
        this.renderHtml();
    },
    handleScroll () {
        //下面三个参数很重要,大家可以自行百度下具体的解释,一般简单的无限滚动加载都会用到这个
        let scrollTop = $(window).scrollTop();//匹配元素的滚动条的垂直位置
        let scrollHeight = $(document).height();//匹配元素document的高度
        let windowHeight = $(window).height();//匹配元素的高度
        if(scrollHeight - scrollTop - windowHeight < 50 ){
            console.log('加载1')
            if (this.loading || this.page === this.pageTotal) return null;
            console.log('加载2')
            this.loading = true;
            this.page++;
            this.reqOrderList();
        }
    },
    handleInput (event) {
        let $el = $(event.target);
        let key = $el.data('key');
        Data.objInput[key].value = $el.val();
    },
    renderHtml () {
        let strHtml = '';
        let data = Data.objInput;
        for (let key in data) {
            let { label, value, type, max, disabled, placeholder } = data[key];
            strHtml += `
        <div class="form-item ${disabled && 'form-item-arrow'} form-item-${key}">
            <label>${label}</label>
            <div class="input">
                <input data-key="${key}" type="${type}" value="${value}" maxlength="${max}" placeholder="${placeholder}">
            </div>
        </div>
           `;
        }
        $('.form').html(strHtml);
    },
    handleSubmit () {
        if (Verify.check(Data.objInput)) return null;
        this.reqOrderList();
    },
    reqOrderList () {
        let options = Verify.input(Data.objInput);
        Http(Config.API_URL_TR_FETCH + Http.API.Req_userOrder, {
            ...options,
            page: this.page,
            rows: this.rows,
        }).then((res) => {
            if (!res) {
                Toast.msg('亲~无订单记录');
                return $('#list').html('');
            }
            res = res || {};
            let { lastPage, list } = res;
            this.pageTotal = lastPage || 0;
            let html = '';
            if (list) {
                list.forEach((item) => {
                    let { fromBankCardNo, tradeAmount, toBankCardNo, tradeStatus, fromBankName, toBankName, submitDate} = item;
                    html += `
                    <li class="item ${this.status[tradeStatus] && this.status[tradeStatus].style}">
                        <p>
                            <span class="type">${this.status[tradeStatus] && this.status[tradeStatus].text}</span>
                            <span>￥${tradeAmount || ''}</span>
                        </p>
                        <p>借记卡：${Filter.filterBankCard(toBankCardNo) || ''}  ${toBankName || ''}</p>
                        <p>信用卡：${Filter.filterBankCard(fromBankCardNo) || ''}  ${fromBankName || ''}</p>
                        <p>${submitDate}</p>
                    </li>
                    `;
                });
            }
            $('#list').append(html);
        }).toast().finally(() => {
            this.loading = false;
        });
    },
};
Controller.init();
