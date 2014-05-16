'use strict';

var config = require('../config');
var blogs = require('../lib/blogs');
var _ = require('lodash');

var routes = function(app) {

    var nav = [
    {
        section: { label: 'Communities', url: '/communities'},
        pages: [
            { label: 'Mottram', url: '/communities/mottram'},
            { label: 'Hattersley', url: '/communities/hattersley'},
            { label: 'Broadbottom', url: '/communities/broadbottom'}
        ]
    },
    {
        section: { label: 'Councellors', url: '/councellors'},
        pages: [
            { label: 'Joe Bloggs', url: '/councellors/joe-bloggs'}
        ]
    },
    {
        section: { label: 'National', url: '/national'},
        pages: []
    }
    ];

    app.get('/', function(req, res) {
        var all = blogs.find();

        if (all.length === 0) {
            return res.render('help', { config: config, nav: nav });
        }

        res.render('all', { blogs: all, config: config, nav: nav });
    });

    app.get('/*', function(req, res, next) {
        var blog = blogs.find(req.url);

        if (!blog) {
            return next();
        }
        if (_.isArray(blog)) {
            res.render('all', { blogs: blog, config: config, nav: nav });
        } else {
            res.render('post', { blog: blog, config: config, nav: nav });
        }
    });
};

module.exports = routes;
