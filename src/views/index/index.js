
import Toast                        from 'utils/toast.util'
import ParamsUtil                   from 'utils/params.util'
import Store                        from 'utils/store.util'

// 控制器
const Controller = {
    $el: $('#keyboard-value'),
    $elKeyBoard: $('#keyboard'),
    $elButton: $('#button'),
    $elKeys: $('.keyboard-item.btn'),
    params: {},
    max: 9,
    // 初始化
    init () {
        this.getParamsByUrl();
        this.addEvent();
    },
    // 获取URL参数
    getParamsByUrl () {
        this.params = ParamsUtil.get();
    },
    // 注册事件
    addEvent() {
        this.$elKeys.on('touchend', this.handleKey.bind(this));
        this.$elButton.on('click', this.handlePay.bind(this));
    },
    // 去支付
    handlePay () {
        let type = this.$elButton.hasClass('disabled');
        if (type) return null;
        let amount = this.getValue() || '0';
        console.log(amount);
        if (+amount < 10) return Toast.msg('单笔最低不能少于10元');
        Store.dataToLocalStorageOperate.save('USER_AMOUNT', amount);
        window.location.href = './confirm.html';
    },
    // 处理按键事件
    handleKey (e) {
        let key = $(e.target).data('value').toString();
        let curValue = this.getValue();
        switch (key) {
            case 'C':
                this.countClearKey();
                break;
            case '.':
                this.countSpotKey(curValue, key);
                break;
            case '-':
                this.countBackKey(curValue, key);
                break;
            default:
                this.countNumberKey(curValue, key);
                break;
        }
        this.buttonDisabled(curValue);
    },
    // 是否可点击
    buttonDisabled () {
        let value = this.getValue();
        if (value) {
            this.$elButton.removeClass('disabled')
        } else {
            this.$elButton.addClass('disabled')
        }
    },
    // clear
    countClearKey () {
        this.setValue('');
    },
    // .
    countSpotKey (curValue, key) {
        if (curValue.indexOf('.') > -1)
            return null;
        if (curValue === '')
            curValue = '0';
        let newValue = curValue + key;
        this.setValue(newValue);
    },
    // countBackKey
    countBackKey (curValue, key) {
        if (curValue === '')
            return null;
        let arr = curValue.split('');
        arr.pop();
        let newValue = arr.join('');
        this.setValue(newValue);
    },
    // 数字
    countNumberKey (curValue, key) {
        let len = curValue.split('.')[0].length;
        if (len > this.max && curValue.indexOf('.') === -1)
            return null;
        if (curValue.indexOf('.') > -1 && curValue.split('.')[1].length >= 2)
            return null;
        if (curValue === '0')
            curValue = '';
        let newValue = curValue + key;
        this.setValue(newValue);
    },
    // 获取当前输入值
    getValue () {
        return this.$el.data('value').toString();
    },
    // 设置输入值
    setValue (value) {
        this.$el.data('value', value);
        if (value === '') {
            this.$el.removeClass('input-value');
            this.$el.text('￥0');
        } else {
            this.$el.addClass('input-value');
            this.$el.text(`￥${value}`);
        }
    },
};
Controller.init();

