/*
 * jquery.glueJs
 */
(function ($) {     
    var glueJs = function () {
        this.init();
    };
    glueJs.prototype = {
        cacheData: {},
        init: function () { 
            var me = this;
            $('*[gl-tpl]').hide();
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
            dom.find('*[gl-path]').each(function() {
              var tpl = $(this).closest('*[gl-tpl]');
              if (tpl.length) { // if is in template
                tpl.attr('gl-tpl', path);
              }
              else {
                var parent = $(this).parent().closest('*[gl-base],*[gl-path]'); 
                if (parent[0] === dom[0]) {
                    var _path = path+'.'+$(this).attr('gl-path');
                    $(this).attr('gl-id', _path);
                    me._findPath($(this), _path);
                    hasChild++;
                }
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
          return dom.closest('*[gl-base],*[gl-path]').attr('gl-id');
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
              me.setTpl(path);
              $('*[gl-id="'+path+'"]').each(function() {
                  me._val($(this), val);
              });
              me._setCacheData(path, val);
            }
            return me;
        },
        setTpl: function(path) { // to optimise!!!
          var me = this;
          if (!$('*[gl-id="'+path+'"]').length) {
            var _path = [];
            path = path.split('.');
            $.each(path.slice(0, -1), function(k, name) {
              _path.push(name);
              var __path = _path.join('.');
              var tpl = $('*[gl-tpl="'+__path+'"]');
              if (tpl.length && !$('*[gl-id="'+__path+'.'+path[k+1]+'"]').length) {
                var newTpl = tpl.clone().removeAttr('gl-tpl').attr('gl-path', path[k+1]).show();
                me._findPath(newTpl, __path+'.'+path[k+1]);
                tpl.parent().append(newTpl);
              }
            });
          }
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
