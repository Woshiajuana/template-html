
import './index.scss'


import 'src/assets/scss/_common.scss'

import FooterMixin from 'src/components/footer-section'
import HeaderMixin from 'src/components/header-section'

new Vue ({
    el: '#app',
    mixins: [
        FooterMixin,
        HeaderMixin,
    ],
    data () {
        return {
            strBodyPrompt: '我是主体噢',
            logo: require('src/assets/images/html/index.png'),
        }
    }
});
