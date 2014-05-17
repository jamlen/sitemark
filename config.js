'use strict';

var crypto = require('crypto');

module.exports = {
    email: 'code@james-allen.co.uk',
    title: 'SiteMark - Markdown powered websites',
    style: 'monokai'
};

var gravatarHash = crypto.createHash('md5').update(module.exports.email).digest('hex');
module.exports.gravatar = 'http://www.gravatar.com/avatar/' + gravatarHash + '?s=200';
