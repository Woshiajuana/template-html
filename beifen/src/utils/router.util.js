
export default {
    push (page, params) {
        let strParams = '';
        for (let key in params) {
            strParams += `&${key}=${encodeURIComponent(params[key])}`;
        }
        if (!page) return null;
        // window.location.href = `./${page}?v=${new Date().getTime()}${strParams}`;
        window.location.href = `./${page}.html?v=${new Date().getTime()}${strParams}`;
    },
    getParams () {
        let str = location.search.substring(location.search.indexOf('?'));
        let obj = {};
        if (str) {
            let ary = str.substr(1).split('&');
            ary.forEach((item) => {
                let subAry = item.split('=');
                obj[subAry[0]] = decodeURIComponent(subAry[1]);
            });
        }
        console.log(obj);
        return obj;
    },
    pop (num = -1) {
        window.history.go(num);
    },
    link (url, params) {
        let strParams = '';
        for (let key in params) {
            strParams += `&${key}=${encodeURIComponent(params[key])}`;
        }
        window.location.href = `${url}?${strParams}`;
    },
}
