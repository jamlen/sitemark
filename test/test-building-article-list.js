'use strict';

var _ = require('lodash');
var path = require('path');
var moment = require('moment');
var Articles = require('../lib/blogs');

describe('Building Article List', function() {

    var articles;

    beforeEach(function(done) {
        Articles.init({
            contentPath: path.join(__dirname, 'support', 'nav'),
            reinit: false
        }, function(err, a) {
            articles = a;
            done();
        });
    });

    it('builds correct number of articles', function(){
        articles.should.have.lengthOf(5);
    });

    it('build correct article structure', function() {
        var expected = {
            author: 'Author',
            post: '<p>Test</p>\n',
            tags: ['valid', 'tag'],
            image: 'image.png',
            title: 'Test Title',
            preview: '<p>Test Preview Text</p>\n',
            url: '/section1/subsection1/test',
            path: '/section1/subsection1',
            date: moment('2014-05-24', 'YYYY-MM-dd')
        };
        _.omit(articles[0], 'relativeDate').should.eql(expected);
    });

    it('Ignores articles that do not have required metadata');

});
