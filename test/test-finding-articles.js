'use strict';

var should = require('should');
var path = require('path');
var articles = require('../lib/blogs');

describe('Finding Articles', function(){

	beforeEach(function(done){
		articles.init({
			contentPath: path.join(__dirname, 'support', 'nav'),
			reinit: false
		}, function(){
			done();
		});
	});

	describe('by tag', function(){

		it('finds from a valid tag', function() {
			var article = articles.findByTag('valid');
			article.should.have.lengthOf(1);
			article[0].tags.should.containEql('valid');
		});

		it('does not find any for an invalid tag', function() {
			articles.findByTag('invalid').should.be.empty;
		});

		it('finds multiple articles when mutliple have been tagged', function() {
			articles.findByTag('tag').should.have.lengthOf(5);
		});
	});

	describe('by url', function() {

		it('finds with valid url', function() {
			var article = articles.find('/section1/subsection1/test');
			should(article).not.eql(null);
			article.should.have.property('url', '/section1/subsection1/test');
		});

		it('does not find with invalid url', function() {
			articles.find('invalid/url').should.be.empty;
		});
	});

	describe('for templates', function() {
		it('finds the template defined', function() {
			var template = articles.findTemplate('/section2/subsection1');
			should(template).not.eql(undefined);
			template.should.have.property('use', 'template');
			template.should.have.property('url', '/section2/subsection1');
			template.should.have.property('sections');
		});
	});
});
