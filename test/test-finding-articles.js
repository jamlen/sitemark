'use strict';

require('should');
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
			articles.findByTag('tag').should.have.lengthOf(2);
		});
	});
});
