
// 头部控制器
const HeaderController = {
    $elBtn: $('#return-btn'),
    $elReturn: $('#return-btn'),
    device: {},
    init () {
        this.$elReturn.on('touchend', this.handleReturn)
    },
    handleReturn () {
        window.history.go(-1);
    }
};

export default HeaderController;
