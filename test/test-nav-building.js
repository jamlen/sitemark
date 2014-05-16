'use strict';

require('should');
var builder = require('../lib/navBuilder');

describe.skip('NavigationBuilder', function(){

    it('builds', function(done){

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

        builder.init({contentPath: __dirname + '/../content/'}, function(){
            var nav = builder.get();
            console.log(JSON.stringify(nav, undefined, 2));
            nav.should.equal(expected);
            done();
        });
    });
});
