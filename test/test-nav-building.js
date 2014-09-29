'use strict';

require('should');
var path = require('path');
var builder = require('../lib/navBuilder');

describe('NavigationBuilder', function(){
	var nav;

    beforeEach(function(done){
        builder.init({contentPath: path.join(__dirname, 'support', 'nav')}, function(navigation){
			nav = navigation;
            done();
        });
    });

	it('builds', function(){
        var expected = [
        {
            section: { label: 'Section1', url: '/section1'},
            pages: [
                { label: 'Subsection1', url: '/section1/subsection1'},
                { label: 'Subsection2', url: '/section1/subsection2'}
            ]
        },
        {
            section: { label: 'Section2', url: '/section2'},
            pages: [
                { label: 'Subsection1', url: '/section2/subsection1'}
            ]
        },
        {
            section: { label: 'Section3', url: '/section3'},
            pages: [
                { label: 'Subsection1', url: '/section3/subsection1'}
            ]
        },
        {
            section: { label: 'Section4', url: '/section4'},
            pages: []
        }];
		
        nav.should.eql(expected);
	});
});
