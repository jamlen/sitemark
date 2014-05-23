'use strict';

require('sugar');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var marked = require('marked');
var moment = require('moment');
var _ = require('lodash');
var cheerio = require('cheerio');

var articles = [];
var templates = [];

marked.setOptions({ langPrefix: '' });


var getText = function(data, regex) {
    var match = data.match(regex);
    return match ? match[1].trim() : '';
};

var getValues = function(data, regex) {
    var match = data.match(regex);
    return match ? match[1].trim().split(' ') : [];
};

var makeImagesResponsive = function(html) {
    var $ = cheerio.load(html);
    $('img').addClass('img-responsive');
    return $.html();
};

var parseForTemplates = function(file) {
    var contents = fs.readFileSync(file, 'utf8').split('---');
    var url = path.relative('./', file);
    url = url.substr(7, url.lastIndexOf(path.sep)-7).replace(/\\/g, '/');
    if (url === '') { url = '/'; }

    var getSections = function(){
        var result = {};
        _.each(_.rest(contents), function(section) {
            var data = section.split('===');
            result[getText(data[0], /section:(.*)/)] = makeImagesResponsive(marked(data[1]));
        });
        return result;
    };

    templates.push({
        use: getText(contents[0], /use:(.*)/),
        title: getText(contents[0], /title:(.*)/),
        url: url,
        sections: getSections()
    });
};


var _getMeta = function(data) {
    return {
        preview: getText(data, /preview:(.*)/),
        title: getText(data, /title:(.*)/),
        tags: getValues(data, /tags:(.*)/),
        date: getText(data, /date:(.*)/)
    };
};

var init = function() {
    var files = glob.sync(__dirname + '/../content/**/*.md');
    _.each(files, function(file) {
        if (file.match(/readme.md/)) {
            return;
        }
        if (file.match(/index.md/)) {
            parseForTemplates(file);
            return;
        }

        var sections = fs.readFileSync(file, 'utf8').split('---');
        var meta = _getMeta(sections[0]);
        var post = makeImagesResponsive(marked(sections[1]));
        var url = path.relative('./', file);
        url = url.substr(7, url.lastIndexOf('.')-7).replace(/\\/g, '/');

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
        templates = [];
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
    return _.where(articles, { tags: [tag] });
};

var findTemplate = function(url) {
    _reinit();
    if (url) {
        return _.find(templates, {url: url});
    }
    return null;
};

module.exports = {
    init: init,
    find: find,
    findByTag: findByTag,
    findTemplate: findTemplate
};

init();
