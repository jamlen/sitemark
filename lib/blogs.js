'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var marked = require('marked');
var moment = require('moment');
var _ = require('lodash');

var articles = [];

marked.setOptions({ langPrefix: '' });

var _getMeta = function(data) {
    var getText = function(regex) {
        var match = data.match(regex);
        return match ? match[1].trim() : '';
    };

    var getValues = function(regex) {
        var match = data.match(regex);
        return match ? match[1].trim().split(' ') : [];
    };

    return {
        preview: getText(/preview:(.*)/),
        title: getText(/title:(.*)/),
        tags: getValues(/tags:(.*)/),
        date: getText(/date:(.*)/)
    };
};

var init = function() {
    var files = glob.sync(__dirname + '/../content/**/*.md');
    _.each(files, function(file) {
        if (file.match(/readme.md/)) {
            return;
        }

        var sections = fs.readFileSync(file, 'utf8').split('---');
        var meta = _getMeta(sections[0]);
        var post = marked(sections[1]);
        var url = path.relative('./', file);
        url = url.substr(7, url.lastIndexOf('.')-7);

        articles.push({
            post: post,
            tags: meta.tags,
            title: meta.title,
            preview: marked(meta.preview),
            url: url,
            path: url.substr(0, url.lastIndexOf('/')),
            date: new Date(meta.date),
            relativeDate: moment(new Date(meta.date)).from(new Date())
        });
    });

    articles = _(articles)
        .sortBy(function(article){ return article.date * -1; })
        .sortBy('path')
        .value();
};

var _reinit = function() {
    if (process.env.NODE_ENV !== 'production') {
        articles = [];
        init();
    }
};

var find = function(url) {
    _reinit();
    if (url) {
        var results = _.findWhere(articles, { url: url });

        if (results !== null && results !== undefined) {
            return results;
        }
        return _.where(articles, { path: url });
    }
    return articles;
};

var findByTag = function(tag) {
    _reinit();
    if (tag) {
        var results = _.where(articles, function(article){ return _.contains(article.tags, tag) });

        if (results !== null && results !== undefined) {
            return results;
        }
    }
    return [];
};

module.exports = {
    init: init,
    find: find,
    findByTag: findByTag
};

init();
