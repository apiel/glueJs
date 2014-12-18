/*
 * jquery.glueJs
 */
(function ($) {     
    var glueJs = function () {
        this.init();
    };
    glueJs.prototype = {
        data: {},
        init: function () { 
            var me = this;
            me.data = {};
            me._findBase();
        },
        _findBase: function () {
            var me = this;
            $('*[gl-base]').each(function() {
                me._findPath($(this), $(this).attr('gl-base').split('.'));
            });
        },
        _findPath: function(dom, path) {
            var me = this;
            var hasChild = 0;
            dom.find('*[gl-path]').each(function() {
                var parent = $(this).parent().closest('*[gl-base],*[gl-path]'); 
                if (parent[0] == dom[0]) {
                    me._findPath($(this), path.concat($(this).attr('gl-path').split('.')));
                    hasChild++;
                }
            });
            if (!hasChild) {
                me._initValue(dom, path);
            }
        },
        _initValue: function(dom, path) {
            var me = this;
            var val = dom.is(':input') ? dom.val() : dom.text();
            dom.attr('gl-id', path.join('.'));
            me._setData(path, val);
        },
        _setData: function(path, val) {
            var me = this;
            var name = path.pop();
            var data = me.data;
            $.each(path, function() {
                if (typeof(data[this]) === 'undefined') data[this] = {};
                data = data[this];
            });
            data[name] = val;            
        },
        getPath: function(dom) {
            var path = [];
            var isBase = false;
            while(!isBase) {
                dom = dom.closest('*[gl-base],*[gl-path]');
                isBase = dom.is('*[gl-base]');
                var attr = isBase ? dom.attr('gl-base') : dom.attr('gl-path');
                path = attr.split('.').concat(path);
                dom = dom.parent();
            }
            return path;
        },
        get: function(path) {
            var me = this;
            if (!Array.isArray(path)) {
                if (typeof(path) === 'object') path = me.getPath(path);
                else path = path.split('.');
            } 
            var data = me.data;
            $.each(path, function() {
                if (typeof(data[this]) === 'undefined') { data = null; return false; };
                data = data[this];
            });
            return data;
        },
        set: function(path, val) {
            var me = this;
            if (typeof(path) !== 'string') path = path.attr('gl-id');
            if (typeof(val) === 'undefined') val = dom.is(':input') ? dom.val() : dom.text();
            $('*[gl-id="'+path+'"]').each(function() {
                me._val($(this), val);
            });
            me._setData(path.split('.'), val);
            return me;
        },
        pull: function(dom, variables) {
            var me = this;
            dom.find('*[gl-pull]').each(function() {
                var path = $(this).attr('gl-pull');
                $.each(variables, function(search, replace) {
                    path = path.replace(search, replace);
                });
                me._val($(this), me.get(path.split('.')));
            });
            dom.find('*[gl-var]').each(function() {
                var attr = $(this).attr('gl-var');
                if (typeof(variables[attr]) !== 'undefined') me._val($(this), variables[attr]);
            });
            return me;
        },
        _val: function(dom, val) {
            if (dom.is(':input')) dom.val(val);
            else dom.text(val);  
        },
    };
    
    $.glueJs = new glueJs();
}(jQuery));
