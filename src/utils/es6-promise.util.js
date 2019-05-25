// import 'babel-polyfill'
import Toast            from 'utils/toast.util'

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

Promise.prototype.null = function () {
    return this.catch(err => {
        err && console.log(err);
    });
};


Promise.prototype.toast = function () {
    return this.catch(err => {
        Toast.msg(err);
    });
};
