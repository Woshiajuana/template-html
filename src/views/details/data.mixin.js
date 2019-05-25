
import Regular                      from 'utils/regular.util'

export default {
    objInput: {
        // 开卡银行卡绑定手机号
        phone: {
            label: '手机号',
            value: '',
            max: 11,
            type: 'tel',
            placeholder: '请输入手机号',
            use: [
                {
                    nonempty: true,
                    prompt: '请输入手机号',
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
    }
}
