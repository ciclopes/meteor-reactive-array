//********************************************************************************//
// The MIT License (MIT)                                                          //
//                                                                                //
// Copyright (c) 2015 Antônio Augusto Morais                                      //
//                                                                                //
// Permission is hereby granted, free of charge, to any person obtaining a copy   //
// of this software and associated documentation files (the "Software"), to deal  //
// in the Software without restriction, including without limitation the rights   //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      //
// copies of the Software, and to permit persons to whom the Software is          //
// furnished to do so, subject to the following conditions:                       //
//                                                                                //
// The above copyright notice and this permission notice shall be included in all //
// copies or substantial portions of the Software.                                //
//                                                                                //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR     //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE    //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER         //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  //
// SOFTWARE.                                                                      //
//********************************************************************************//

ReactiveArray = (function() {
  var ALL_METHODS, MUTATOR_METHODS, OTHER_METHODS, __assignReactiveMethods, j, k, len, len1, method;

  MUTATOR_METHODS = 'pop push reverse shift sort splice unshift'.split(' ');

  OTHER_METHODS = 'concat join slice toLocaleString indexOf lastIndexOf forEach every some filter map reduce reduceRight'.split(' ');

  ALL_METHODS = MUTATOR_METHODS.concat(OTHER_METHODS);

  __assignReactiveMethods = function() {
    var j, len, method, self;
    self = this;
    for (j = 0, len = ALL_METHODS.length; j < len; j++) {
      method = ALL_METHODS[j];
      if (Array.prototype[method] instanceof Function) {
        (function(method_name) {
          return self.array[method_name] = function() {
            return ReactiveArray.prototype[method_name].apply(self, arguments);
          };
        })(method);
      }
    }
  };

  function ReactiveArray(initValue, equalsEvaluatorFunction, makeArrayObjReactive) {
    if (!(this instanceof ReactiveArray)) {
      return new ReactiveArray(initValue, equalsEvaluatorFunction, makeArrayObjReactive);
    }
    if (!(equalsEvaluatorFunction instanceof Function)) {
      makeArrayObjReactive = equalsEvaluatorFunction;
      equalsEvaluatorFunction = void 0;
    }
    this.array = void 0;
    this.equalsEvaluatorFunction = equalsEvaluatorFunction;
    this.__dep = new Tracker.Dependency;
    this.__reactive_array = makeArrayObjReactive || true;
    this.set(initValue || []);
    return;
  }

  ReactiveArray.prototype.set = function(value) {
    if (this.equalsEvaluatorFunction && this.equalsEvaluatorFunction(this.array, value)) {
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

  for (k = 0, len1 = OTHER_METHODS.length; k < len1; k++) {
    method = OTHER_METHODS[k];
    if (Array.prototype[method] instanceof Function) {
      (function(method_name) {
        return ReactiveArray.prototype[method_name] = function() {
          this.__dep.depend();
          return Array.prototype[method_name].apply(this.array, arguments);
        };
      })(method);
    }
  }

  return ReactiveArray;

})();
