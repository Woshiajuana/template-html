
import './index.scss'

import FooterMixin from 'src/components/footer-section'
import HeaderMixin from 'src/components/header-section'

const app = new Vue ({
    title111: 'xxx',
    el: '#app',
    mixins: [
        FooterMixin,
        HeaderMixin,
    ],
    data () {
        return {
            title: '1',
            header: 'xxx',
            logo: require('src/assets/images/html/index.png'),
        }
    }
});

app.titleName = 'xxx'

console.log(app)

module.exports.title = '哈哈哈';
