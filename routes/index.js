'use strict';

var config = require('../config');
var blogs = require('../lib/blogs');
var navBuilder = require('../lib/navBuilder');
var _ = require('lodash');
var path = require('path');

_.mixin({
    'hasValue': function(value) {
        return !_.isNull(value) && !_.isUndefined(value);
    }
});

var routes = function(app) {

    var nav;

    navBuilder.init({
        contentPath: path.resolve(__dirname + '/../content')
    }, function(result){
        nav = result;
    });

    function getPageWithTemplate(url, article){
        var page = 'all';
        var title = config.title;
        var template = blogs.findTemplate(url);
        if (_.hasValue(template)) {
            page = 'templates/'+template.use;
            title = template.title;
        }
        var locals = { title: title, template: template, blogs: article, config: config, nav: nav };
        return { page: page, locals: locals};
    }

    app.get('/', function(req, res) {
        var articles = blogs.findByTag('communities');

        if (articles.length === 0) {
            return res.render('help', { title: config.title, config: config, nav: nav });
        }
        articles = articles.sortBy(function(article){ return article.date * -1; });

        var template = getPageWithTemplate(req.url, articles);
        res.render(template.page, template.locals);
    });

    app.get('/tag/:tag', function(req, res, next){
        var articles = blogs.findByTag(req.param('tag'));

        if (articles.length === 0) {
            return next();
        }
        res.render('all', { title: config.title, blogs: articles, config: config, nav: nav });
    });

    app.get('/*', function(req, res, next) {
        var blog = blogs.find(req.url);

        if (!blog) {
            return next();
        }
        if (_.isArray(blog)) {
            var template = getPageWithTemplate(req.url, blog);
            return res.render(template.page, template.locals);
        }
        res.render('post', { title: blog.title, blog: blog, config: config, nav: nav });
    });
};

module.exports = routes;
