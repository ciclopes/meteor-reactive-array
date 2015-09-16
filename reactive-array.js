ReactiveArray = (function() {
  var ACCESSOR_METHODS, ITERATION_METHODS, MUTATOR_METHODS, REACTIVE_METHODS, __assignReactiveMethods, j, k, l, len, len1, len2, method;

  MUTATOR_METHODS = 'pop push reverse shift sort splice unshift'.split(' ');

  ACCESSOR_METHODS = 'concat join slice toLocaleString indexOf lastIndexOf'.split(' ');

  ITERATION_METHODS = 'forEach every some filter map reduce reduceRight'.split(' ');

  REACTIVE_METHODS = MUTATOR_METHODS.concat(ACCESSOR_METHODS);

  __assignReactiveMethods = function() {
    var j, len, method, self;
    self = this;
    for (j = 0, len = REACTIVE_METHODS.length; j < len; j++) {
      method = REACTIVE_METHODS[j];
      if (Array.prototype[method] instanceof Function) {
        (function(method_name) {
          return self.array[method_name] = function() {
            return ReactiveArray.prototype[method_name].apply(self, arguments);
          };
        })(method);
      }
    }
  };

  function ReactiveArray(initValue, comparator, makeArrayObjReactive) {
    if (!(this instanceof ReactiveArray)) {
      return new ReactiveArray(initValue, comparator, makeArrayObjReactive);
    }
    if (!(comparator instanceof Function)) {
      makeArrayObjReactive = comparator;
      comparator = void 0;
    }
    this.array = void 0;
    this.comparator = comparator;
    this.__dep = new Tracker.Dependency;
    this.__reactive_array = makeArrayObjReactive || true;
    this.set(initValue);
    return;
  }

  ReactiveArray.prototype.set = function(value) {
    if (this.comparator && this.comparator(this.array, value)) {
      return;
    }
    if (value instanceof Array) {
      this.array = value;
    } else {
      this.array = [value];
    }
    if (this.__reactive_array) {
      __assignReactiveMethods.call(this);
    }
    this.__dep.changed();
  };

  ReactiveArray.prototype.get = function() {
    this.__dep.depend();
    return this.array;
  };

  ReactiveArray.prototype.remove = function(valueOrFn) {
    var fn, i, ret;
    ret = [];
    fn = valueOrFn instanceof Function ? valueOrFn : function(value) {
      return value === valueOrFn;
    };
    i = this.array.length;
    while (i--) {
      if (fn(this.array[i])) {
        ret.unshift(this.array[i]);
        this.array.splice(i, 1);
      }
    }
    if (ret.length) {
      return ret;
    } else {
      return null;
    }
  };

  ReactiveArray.prototype.clear = function() {
    return this.set([]);
  };

  ReactiveArray.prototype.toString = function() {
    this.__dep.depend();
    return "ReactiveArray{ " + this.array + " }";
  };

  for (j = 0, len = MUTATOR_METHODS.length; j < len; j++) {
    method = MUTATOR_METHODS[j];
    if (Array.prototype[method] instanceof Function) {
      (function(method_name) {
        return ReactiveArray.prototype[method_name] = function() {
          var ret;
          ret = Array.prototype[method_name].apply(this.array, arguments);
          this.__dep.changed();
          return ret;
        };
      })(method);
    }
  }

  for (k = 0, len1 = ACCESSOR_METHODS.length; k < len1; k++) {
    method = ACCESSOR_METHODS[k];
    if (Array.prototype[method] instanceof Function) {
      (function(method_name) {
        return ReactiveArray.prototype[method_name] = function() {
          this.__dep.depend();
          return Array.prototype[method_name].apply(this.array, arguments);
        };
      })(method);
    }
  }

  for (l = 0, len2 = ITERATION_METHODS.length; l < len2; l++) {
    method = ITERATION_METHODS[l];
    if (Array.prototype[method] instanceof Function) {
      (function(method_name) {
        return ReactiveArray.prototype[method_name] = function() {
          return Array.prototype[method_name].apply(this.array, arguments);
        };
      })(method);
    }
  }

  return ReactiveArray;

})();
