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
        var articles = blogs.findByTag('communities');

        if (articles.length === 0) {
            return res.render('help', { title: config.title, config: config, nav: nav });
        }
        articles = articles.sortBy(function(article){ return article.date * -1; })

        var template = blogs.findTemplate(req.url);
        if (template) {
            return res.render(template.use, { title: template.title, template: template, blogs: articles, config: config, nav: nav });
        }

        res.render('all', { title: config.title, blogs: articles, config: config, nav: nav });
    });

    app.get('/tag/:tag', function(req, res, next){
        var articles = blogs.findByTag(req.param('tag'))

        if (articles.length === 0) {
            return res.render('help', { title: config.title, config: config, nav: nav });
        }
        res.render('all', { title: config.title, blogs: articles, config: config, nav: nav });
    });

    app.get('/*', function(req, res, next) {
        var blog = blogs.find(req.url);

        if (!blog) {
            return next();
        }
        if (_.isArray(blog)) {
            var template = blogs.findTemplate(req.url);
            if (template) {
                return res.render(template.use, { title: template.title, template: template, blogs: blog, config: config, nav: nav });
            }
            if (blog.length === 0) {
                return res.render('help', { title: config.title, config: config, nav: nav });
            }
            return res.render('all', { title: config.title, blogs: blog, config: config, nav: nav });
        }
        res.render('post', { title: blog.title, blog: blog, config: config, nav: nav });
    });
};

module.exports = routes;
