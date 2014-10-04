'use strict';

require('sugar');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var marked = require('marked');
var moment = require('moment');
var _ = require('lodash');
var cheerio = require('cheerio');
var config = require('../config');

var articles = [];
var templates = [];
var options = {
    reinit: true
};

marked.setOptions({
    langPrefix: ''
});

_.mixin({
    'page': function(collection, page, size) {
        // skip `(page - 1) * size` items then take `size` items
        return _.take(_.rest(collection, (page - 1) * size), size);
    }
});

var _getText = function(data, regex) {
    var match = data.match(regex);
    return match ? match[1].trim() : null;
};

var _getValues = function(data, regex) {
    var match = data.match(regex);
    return match ? match[1].trim().split(' ') : [];
};

var _getUrl = function(file, split) {
    var url = '/' + path.relative(options.contentPath, file);
    url = url.substr(0, url.lastIndexOf(split)).replace(/\\/g, '/');
    var p = url.substr(0, url.lastIndexOf('/'));
    return {
        url: url,
        path: p
    };
};

var _makeImagesResponsive = function(html) {
    var $ = cheerio.load(html);
    $('img').addClass('img-responsive');
    return $.html();
};

var parseForTemplates = function(file) {
    var contents = fs.readFileSync(file, 'utf8').split('---');
    var url = _getUrl(file, path.sep).url;

    var getSections = function() {
        var result = {};
        _.each(_.rest(contents), function(section) {
            var data = section.split('===');
            result[_getText(data[0], /section:(.*)/)] = _makeImagesResponsive(marked(data[1]));
        });
        return result;
    };

    templates.push({
        use: _getText(contents[0], /use:(.*)/),
        title: _getText(contents[0], /title:(.*)/),
        url: url,
        sections: getSections()
    });
};


var _getMeta = function(data) {
    return {
        preview: _getText(data, /preview:(.*)/),
        title: _getText(data, /title:(.*)/),
        author: _getText(data, /author:(.*)/),
        tags: _getValues(data, /tags:(.*)/),
        date: _getText(data, /date:(.*)/),
        image: _getText(data, /image:(.*)/)
    };
};

function buildArticle(file) {
    var sections = fs.readFileSync(file, 'utf8').split('---');
    if (sections.length === 1) {
        return;
    }
    var meta = _getMeta(sections[0]);
    var post = _makeImagesResponsive(marked(sections[1]));
    var url = _getUrl(file, '.');
    var date = moment(meta.date, config.dateFormat);

    articles.push({
        post: post,
        tags: meta.tags,
        author: meta.author,
        title: meta.title,
        image: meta.image,
        preview: marked(meta.preview),
        url: url.url,
        path: url.path,
        date: date,
        relativeDate: date.from(new Date())
    });
}

function init(opts, callback) {
    options = _.merge({}, options, opts);
    articles = [];
    templates = [];
    var files = glob.sync(options.contentPath + '/**/*.md');
    _.each(files, function(file) {
        if (file.match(/readme.md/)) {
            return;
        }
        if (file.match(/index.md/)) {
            parseForTemplates(file);
            return;
        }

        buildArticle(file);
    });

    articles = _(articles)
        .sortBy(function(article) {
            return article.date * -1;
        })
        .sortBy('path')
        .value();
    callback(null, articles);
}

var _reinit = function() {
    if (options.reinit && process.env.NODE_ENV !== 'production') {
        init(options, function() {});
    }
};

function find(url) {
    _reinit();
    var matchedOnUrl = _.findWhere(articles, {
        url: url
    });
    if (matchedOnUrl) {
        return matchedOnUrl;
    }
    var matchedOnPath = _.where(articles, {
        path: url
    });
    return matchedOnPath || articles;
}

function findByTag(tag) {
    _reinit();
    return _.where(articles, {
        tags: [tag]
    });
}

function findTemplate(url) {
    _reinit();
    return _.find(templates, {
        url: url
    });
}

module.exports = {
    init: init,
    find: find,
    findByTag: findByTag,
    findTemplate: findTemplate
};
