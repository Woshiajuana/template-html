
import Toast            from 'utils/toast.util'

export default {

    check (data, mode) {
        let result = false;
        try {
            this.forEach(data, (prop, key) => {
                this._verify(prop, data, mode)
            })
        } catch (error) {
            result = true;
            !mode && Toast.msg(error);
        }
        return result;
    },

    single (data, mode) {
        let result = false;
        try {
            this._verify(data, data, mode)
        } catch (error) {
            result = true;
            !mode && Toast.msg(error);
        }
        return result;
    },


    // 提取
    input () {
        let result = {};
        if (arguments.length === 0)
            return result;
        let params = Array.prototype.slice.apply(arguments);
        params.forEach((param) => {
            this.forEach(param, (item, key) => {
                if (item.display === false) return null;
                key && (result[key] = item.value);
            })
        });
        return result;
    },

    // 赋值
    assignment () {
        if (arguments.length < 2)
            return null;
        let params = Array.prototype.slice.apply(arguments);
        let source = params[0];
        let expects = params.slice(1);
        expects.forEach((expect) => {
            this.forEach(expect, (item, key) => {
                let value = source[key];
                if (typeof value === 'undefined' || value === null)
                    return null;
                item.value = value;
            })
        });
    },

    _verify (prop, data, mode) {
        let {
            use,
            value,
            display,
        } = prop;
        if (!use || display === false)
            return null;
        use.forEach((item) => {
            let {
                nonempty,
                rule,
                prompt,
                callback,
            } = item;
            if (nonempty && (typeof value === 'undefined' || value === '')) {
                callback && callback(prop, data);
                throw prompt;
            }
            if (mode === 'nonempty') return null;
            if (value && typeof rule === 'function' && !rule(value, data)) {
                callback && callback(prop, data);
                throw prompt;
            }
            if (value && typeof rule === 'object' && !rule.test(value)) {
                callback && callback(prop, data);
                throw prompt;
            }
        });
    },

    forEach (obj, callback) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            obj.forEach(callback)
        } else {
            for(let key in obj){
                callback && callback(obj[key], key);
            }
        }
    },
}
