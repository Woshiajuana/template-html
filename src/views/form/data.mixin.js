
import Regular                      from 'utils/regular.util'
import Config                       from 'config/env.config'

export default {
    // 前端跳转地址
    fontNotifyUrl: `${Config.BASE_HTML}dist/form.html`,
    objHidden: {
        // 开户行省
        bankProvince: {
            label: '开户行省',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开户行省',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开户行省',
                },
            ],
        },
        // 开户行市
        bankCity: {
            label: '开户行市',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开户行市',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开户行市',
                },
            ],
        },
        // 商户区县
        merchantDistrict: {
            label: '商户区县',
            value: '上海浦东新区',
            max: 30,
            type: 'text',
            placeholder: '请输入商户区县',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入商户区县',
                },
            ],
        },
    },
    objInput1: {
        // 商户真实姓名
        realName: {
            label: '姓名',
            value: '',
            max: 10,
            type: 'text',
            placeholder: '请输入真实姓名',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入真实姓名',
                },
            ],
        },
        // 身份证号码
        idCardNo: {
            label: '身份证号码',
            value: '',
            max: 18,
            type: 'text',
            placeholder: '请输入身份证号码',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入身份证号码',
                },
                {
                    rule: Regular.isIDCard,
                    prompt: '身份证号码输入有误',
                },
            ],
        },
        // 商户详细地址
        mercAddress: {
            label: '商户详细地址',
            value: '',
            max: 99,
            type: 'text',
            placeholder: '请输入商户详细地址',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入商户详细地址',
                },
            ],
        },
        // 结算卡号
        bankCardNo: {
            label: '结算卡号',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入结算卡号',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入结算卡号',
                },
            ],
        },
        // 开户行名称
        bankName: {
            label: '开户行名称',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开户行名称',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开户行名称',
                },
            ],
        },
        // 开户支行名称
        bankBranchName:  {
            label: '开户支行名称',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开户支行名称',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开户支行名称',
                },
            ],
        },
        // 开户行省市
        bankArea:  {
            label: '开户行省市',
            value: '',
            max: 30,
            type: 'text',
            disabled: true,
            placeholder: '请选择开户行省市',
            use: [
                {
                    nonempty: true,
                    prompt: '请选择开户行省市',
                },
            ],
        },
        // 开户行地址
        bankAddress:  {
            label: '开户行地址',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开户行地址',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开户行地址',
                },
            ],
        },
    },
    objInput2: {
// 开卡的信用卡号
        bankcardNum:  {
            label: '开卡的信用卡号',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开卡的信用卡号',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开卡的信用卡号',
                },
            ],
        },
        // 开卡银行卡绑定手机号
        bindPhone: {
            label: '预留手机号',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入预留手机号',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入预留手机号',
                },
            ],
        },
        // 开卡银行名称
        khBankName: {
            label: '开卡银行名称',
            value: '',
            max: 30,
            type: 'text',
            placeholder: '请输入开卡银行名称',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入开卡银行名称',
                },
            ],
        },
        // 开卡 cvv
        cvv: {
            label: '安全码',
            value: '',
            max: 3,
            type: 'tel',
            placeholder: '信用卡背后CVN2后的三位数字',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入安全码',
                },
            ],
        },
        // 过期时间 信用卡必填 mmyy
        expiredTime: {
            label: '有效期',
            value: '',
            max: 4,
            type: 'tel',
            placeholder: '信用卡背后有效期MMYY',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入有效期',
                },
            ],
        },
    }
}
