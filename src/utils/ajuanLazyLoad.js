

$.fn.lazyload = function () {
    var elements = this;
    $(window).on('scroll', scrollEvent);
    scrollEvent();
    function scrollEvent() {
        var top = document.documentElement.scrollTop || document.body.scrollTop,
            clientH = document.documentElement.clientHeight || document.body.clientHeight;
        elements.each(function (index, item) {
            item = $(item);
            let src = item.data('src');
            if((top + clientH) >= item.offset().top && src){
                item.prop('src', item.data('src')).removeAttr('data-src');
            }
        });
    }
};
