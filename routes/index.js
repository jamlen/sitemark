'use strict';

var config = require('../config');
var blogs = require('../lib/blogs');
var navBuilder = require('../lib/navBuilder');
var _ = require('lodash');
var path = require('path');

var routes = function(app) {

    var nav;

    navBuilder.init({
        contentPath: path.resolve(__dirname + '/../content')
    }, function(result){
        nav = result;
    });


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
            if (blog.length === 0) {
                return res.render('help', { config: config, nav: nav });
            }
            return res.render('all', { blogs: blog, config: config, nav: nav });
        }
        res.render('post', { blog: blog, config: config, nav: nav });
    });
};

module.exports = routes;
