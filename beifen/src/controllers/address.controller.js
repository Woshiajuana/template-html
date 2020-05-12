import 'utils/extend.util'
import AddressData      from 'config/allAddress.json'

// 地址选择控制器
const AddressController = {
    data: AddressData,
    cityData: [],
    districtData: [],
    $elView: $('#popup-address'),
    $elListView: $('#popup-address-content'),
    $elCloseBtn: $('#close'),
    $elTab: $('.popup-address-tab-item'),
    result: [],
    index: 0,
    level: 3,
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
        this.districtData = [];
        this.cityData = [];
        this.result = [];
        $('.popup-address-tab-item').eq(0).text('省份');
        $('.popup-address-tab-item').eq(1).text('城市');
        $('.popup-address-tab-item').eq(2).text('区县');
        this.handleTab({target: this.$elTab[0]});
    },
    close () {
        this.$elView.hide();
    },
    handleTab (event) {
        let $el = $(event.target);
        let data = this.data;
        let index = this.index;
        if (event.target === this.$elTab[0]) {
            index = 0;
            data = this.data;
        } else if (event.target === this.$elTab[0] ) {
            index = 1;
            data = this.cityData;
        } else {
            index = 2;
            data = this.districtData;
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
        this.result[this.index] = { code: curCode, name: curName };
        if (this.index === this.level - 1) {
            this.close();
            return $.publish('address.select', this.result);
        }
        let data = [];
        if (this.index === 0) {
            this.cityData = [];
            this.districtData = [];
            this.data.forEach((item) => {
                let { code, cityList, areaList, name } = item;
                if (code === curCode + '') {
                    this.cityData = cityList || areaList;
                    data = this.cityData;
                }
            });
        } else if (this.index === 1) {
            this.districtData = [];
            this.cityData.forEach((item) => {
                let { code, cityList, areaList, name } = item;
                if (code === curCode + '') {
                    this.districtData = cityList || areaList;
                    data = this.districtData;
                }
            });
        }
        this.$elTab.removeClass('active').eq(this.index).text(curName);
        this.index++;
        this.$elTab.eq(this.index).addClass('active');
        this.renderHtml(data);
    },
};

export default AddressController;
