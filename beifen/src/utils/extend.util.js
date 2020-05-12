
(($) => {
    let o = $({});//自定义事件对象
    $.each({
        trigger: 'publish',
        on: 'subscribe',
        off: 'unSubscribe'
    }, function(key, val) {
        $[val] = function() {
            o[key].apply(o, arguments);
        };
    });
})($);
