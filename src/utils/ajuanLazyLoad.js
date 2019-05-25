

$.fn.lazyload = function () {
    var elements = this;
    $(window).on('scroll', scrollEvent);
    scrollEvent();
    function scrollEvent() {
        var top = document.documentElement.scrollTop || document.body.scrollTop,
            clientH = document.documentElement.clientHeight || document.body.clientHeight;
        elements.each(function (index, item) {
            item = $(item);
            if((top + clientH) >= item.offset().top){
                if(item.type) return;
                item.type = true;
                item.prop('src', item.data('src'));
            }
        });
    }
};
