/*
 * jquery.glueJs
 */
(function ($) {     
    var glueJs = function () {
        this.init();
    };
    glueJs.prototype = {
        data: {},
        cacheData: {},
        init: function () { 
            var me = this;
            me.data = {};
            me._findBase();
        },
        _findBase: function () {
            var me = this;
            $('*[gl-base]').each(function() {
                me._findPath($(this), $(this).attr('gl-base'));
            });
        },
        _findPath: function(dom, path) {
            var me = this;
            var hasChild = 0;
            dom.find('*[gl-path]').each(function() { // foreach of them set gl-id
                var parent = $(this).parent().closest('*[gl-base],*[gl-path]'); 
                if (parent[0] == dom[0]) {
                    me._findPath($(this), path+'.'+$(this).attr('gl-path'));
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
            dom.attr('gl-id', path);
            me._setCacheData(path, val);
        },
        _getCacheData: function(path) {
          var me = this;
          return typeof(me.cacheData[path]) !== 'undefined' ? me.cacheData[path] : null;
        },
        _setCacheData: function(path, val) {
          var me = this;
          me.cacheData[path] = val;
        },
        getPath: function(dom) {
            var path = [];
            var isBase = false;
            while(!isBase) {
                dom = dom.closest('*[gl-base],*[gl-path]');
                isBase = dom.is('*[gl-base]');
                var attr = isBase ? dom.attr('gl-base') : dom.attr('gl-path');
                path.push(attr);
                dom = dom.parent();
            }
            return path.join('.');
        },
        _setData: function(data, path, val) {
            var me = this;
            path = path.split('.');
            var name = path.pop();
            $.each(path, function() {
                if (typeof(data[this]) === 'undefined') data[this] = {};
                data = data[this];
            });
            data[name] = val;     
        },
        get: function(path) {
            var me = this;
            if (!Array.isArray(path)) {
              if (typeof(path) === 'undefined') path = '';
              else if (typeof(path) === 'object') path = me.getPath(path);
            } 
            var data = {};
            $.each(me.cacheData, function(key, val) {
              if (key.indexOf(path) === 0) {
                var subPath = path.length ? key.substr(path.length+1) : key;
                if (subPath === '') {
                  data = val;
                } else {
                  me._setData(data, subPath, val);
                }
              }
            });
            return data;
        },
        set: function(path, val) {
            var me = this;
            if (typeof(path) !== 'string') path = path.attr('gl-id');
            if (me._getCacheData(path) !== val) {
              $('*[gl-id="'+path+'"]').each(function() {
                  me._val($(this), val);
              });
              me._setCacheData(path, val);
            }
            return me;
        },
        _pull: function(dom, variables) {
            var me = this;
            if (dom.is('[gl-pull]')) {
                var path = dom.attr('gl-pull');
				if (typeof(variables)!== 'undefined') {
					$.each(variables, function(search, replace) {
						path = path.replace(new RegExp(search, 'g'), replace);
					});
				}
                dom.attr('gl-id', path);
                me._val(dom, me._getCacheData(path));
            } else if (typeof(variables)!== 'undefined' && dom.is('[gl-var]')) {
                var attr = dom.attr('gl-var');
                if (typeof(variables[attr]) !== 'undefined') {
                    me._val(dom, variables[attr]);
                    dom.attr('gl-val', variables[attr]);
                }
            }
        },
        pull: function(dom, variables) {
            var me = this;
            dom.find('*[gl-pull],*[gl-var]').each(function() {
                me._pull($(this), variables);
            });
            return me;
        },
        push: function(dom) {
            var me = this;
            me.set(dom, dom.is(':input') ? dom.val() : dom.text());
        },
        _val: function(dom, val) {
            if (dom.is(':input')) {
              if (dom.val() !== val)
                dom.val(val);
            }
            else {
              if (dom.text() !== val)
                dom.text(val);
            }  
        },
    };
    
    $.glueJs = new glueJs();
    
    $.fn.glueJs = function(action, options) {
		$(this).each(function() {
			if (action === 'push') $.glueJs.push($(this));
			if (action === 'pull') $.glueJs._pull($(this), options);
		});
    };
}(jQuery));
