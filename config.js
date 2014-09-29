'use strict';

var crypto = require('crypto');

module.exports = {
    email: 'code@james-allen.co.uk',
    brand: 'SiteMark',
    title: 'SiteMark - Markdown powered websites',
    style: 'monokai',
	dateFormat: 'YYYY-MM-dd'
};

var gravatarHash = crypto.createHash('md5').update(module.exports.email).digest('hex');
module.exports.gravatar = 'http://www.gravatar.com/avatar/' + gravatarHash + '?s=200';
