// Generated by CoffeeScript 1.3.1
(function() {
  var JqueryValidatorSourcesControl;

  JqueryValidatorSourcesControl = (function() {

    JqueryValidatorSourcesControl.name = 'JqueryValidatorSourcesControl';

    function JqueryValidatorSourcesControl(elem, layer, options) {
      var source, url, _i, _len, _ref, _ref1,
        _this = this;
      this.elem = elem;
      this.layer = layer;
      this.options = options != null ? options : {};
      this.sources = [];
      if (this.options.sources) {
        _ref = this.options.sources;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          source = _ref[_i];
          this.sources.push(source);
        }
      }
      _ref1 = this.layer.sources;
      for (url in _ref1) {
        source = _ref1[url];
        if (this.sources.indexOf(source) < 0) {
          this.sources.push(source);
        }
      }
      this.layer.on('sourceadd', function(e) {
        if (_this.sources.indexOf(e.source) < 0) {
          _this.sources.push(e.source);
        }
        return _this.update();
      });
      this.layer.on('sourceremove', this.update, this);
      this.update();
    }

    JqueryValidatorSourcesControl.prototype.update = function() {
      var source, _i, _len, _ref, _results;
      this.elem.html('');
      _ref = this.sources;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        _results.push(this.elem.append(this.buildListItem(source)));
      }
      return _results;
    };

    JqueryValidatorSourcesControl.prototype.buildListItem = function(source) {
      var cb, li,
        _this = this;
      cb = $('<input type="checkbox" />');
      if (this.layer.sources[source.url]) {
        cb.attr('checked', 'checked');
      }
      cb.change(function() {
        if (cb.attr('checked')) {
          return _this.layer.addSource(source);
        } else {
          return _this.layer.removeSource(source);
        }
      });
      li = $('<li />');
      li.append(cb);
      li.append(source.name);
      return li;
    };

    return JqueryValidatorSourcesControl;

  })();

  jQuery.fn.validatorSourcesControl = function(layer, options) {
    return this.each(function() {
      return new JqueryValidatorSourcesControl($(this), layer, options);
    });
  };

}).call(this);