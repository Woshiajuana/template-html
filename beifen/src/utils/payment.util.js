

export default {
    aLiPay: (order) => new Promise((resolve, reject) => {
        window.android
        && window.android.invokeMethod
        && window.android.invokeMethod(5, [ order ]);
        window.payOrder
        && window.payOrder(order);
        window.onPayResultStatus = (code) => {
            let msg = '支付结果未知';
            if (code === '6001') msg = '已取消';
            else if (code === '5000') msg = '重复请求';
            else if (code === '6002') msg = '网络连接出错';
            code === '9000' ? resolve() : reject(msg);
        };
    }),
}
