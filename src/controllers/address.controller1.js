import 'utils/extend.util'
import AddressData      from 'config/allAddress.json'

// 地址选择控制器
const AddressController = {
    data: AddressData,
    provinceData: [],
    $elView: $('#popup-address'),
    $elListView: $('#popup-address-content'),
    $elCloseBtn: $('#close'),
    $elTab: $('.popup-address-tab-item'),
    result: [],
    index: 0,
    init () {
        this.$elCloseBtn.on('touchend', this.close.bind(this));
        this.$elListView.on('click', '.popup-address-content-item', this.handleSelect.bind(this));
        this.$elTab.on('touchend', this.handleTab.bind(this));
        $.subscribe('address.show', this.show.bind(this));
        $.subscribe('address.close', this.close.bind(this));
        this.renderHtml(this.data);
    },
    show () {
        this.$elView.show();
        this.provinceData = [];
        this.handleTab({target: this.$elTab[0]});
    },
    close () {
        this.$elView.hide();
    },
    handleTab (event) {
        let $el = $(event.target);
        let data = this.data;
        let index = this.index;
        if (event.target !== this.$elTab[0]) {
            index = 1;
            data = this.provinceData;
        } else {
            index = 0;
        }
        if (!data.length) return null;
        this.index = index;
        this.renderHtml(data);
        this.$elTab.removeClass('active');
        $el.addClass('active');
    },
    renderHtml (data) {
        let strHtml = '';
        data.forEach((item) => {
            strHtml += `<li class="popup-address-content-item" 
data-code="${item.code}" 
data-name="${item.province || item.name}">${item.province || item.name}</li>`
        });
        this.$elListView.html(strHtml);
    },
    handleSelect (event) {
        let $el = $(event.target);
        let curCode = $el.data('code');
        let curName = $el.data('name');
        if (this.index === 0) {
            this.result = [{ code: curCode, name: curName }];
        } else {
            this.result.push({ code: curCode, name: curName });
            this.close();
            return $.publish('address.select', this.result);
        }
        this.provinceData = [];
        this.data.forEach((item) => {
            let { code, provincecode, province } = item;
            if (code === curCode + '') {
                this.provinceData = provincecode;
                this.$elTab
                    .removeClass('active')
                    .eq(this.index)
                    .text(province);
                this.index = 1;
                this.$elTab.eq(this.index)
                    .addClass('active');
            }
        });
        this.renderHtml(this.provinceData);
    },
};

export default AddressController;
