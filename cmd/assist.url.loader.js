let _loaderUtils = require('loader-utils');

module.exports = function (content) {
    let options = (0, _loaderUtils.getOptions)(this) || {};
    let {
        urlLoader,
        html,
        css,
    } = options;
    let type = this.resource.replace(/\\/g, '/').indexOf('/css/') > 0;
    urlLoader.publicPath = type ? css.publicPath : html.publicPath;
    return content;
};
module.exports.raw = true;
