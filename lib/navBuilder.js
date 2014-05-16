'use strict';

var _ = require('lodash');
var path = require('path');

var navigation = [];

var _sectionExists = function(path){
    if(_.isString(path)){
        path = [path];
    }

    return _.any(navigation, function(obj){
        return _.isEqual(_.pluck(obj, 'label')[0], path[0]);
    });
};

var _addSection = function(dir){

    if(_sectionExists(dir)){
        return;
    }
    navigation.push({ section:{ label: dir[0], url: '/'+dir[0] }, pages: [] });
};

var _addPage = function(path){

    if(!_sectionExists(path[0]) || path.length !== 2){
        return;
    }
    _.each(navigation, function(item){
        if(item.section.label === path[0]){
            item.pages.push({ label: path[1], url: '/'+path[0]+'/'+path[1] });
        }
    });
};

var init = function(options, cb){
    var fs = require('q-io/fs');
    navigation = [];

    fs.listDirectoryTree(options.contentPath)
        .then(function(directories){
            _.each(directories, function(dir){
                var p = path.relative('./content', dir).split('/');
                if (!_.isEmpty(p[0])){
                    _addSection(p);
                    _addPage(p);
                }
            });
            cb(navigation);
        });
};

module.exports = {
    init: init,
};
