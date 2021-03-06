meteor-reactive-array
=====================

Meteor's best ReactiveArray package, taking into consideration the Javascript's native array mutator, accessor and iteration methods, making them reactive.

<a name="toc"></a>
### Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Important notes](#important-notes)
* [Methods](#methods)
  - [Constructor](#methods-constructor)
  - [Set](#methods-set)
  - [Get](#methods-get)
  - [Remove](#methods-remove)
  - [Clear](#methods-clear)
  - [GetLength](#methods-getlength)
* [License](#license)

<a name="installation"></a>
### Installation

On your command prompt just type:

`meteor add ciclopes:reactive-array`

<a name="usage"></a>
### Usage

Just assign a new instance of ReactiveArray to a variable and you're done.

i.e.: `var reactive_array = new ReactiveArray`

You can also assign a new instance with a initial value and other things (see [Constructor](#methods-constrctor)):

`var reactive_array = new ReactiveArray([1,2,3,4,5])`

Example of a reactive usage in a Template helper:

```
// template_name.js

Template.template_name.helpers(
    reactive_length: function () {
        return reactive_array.getLength();
    }
);

// template_name.html

<template name="template_name">
    {{reactive_length}}
</template>
```

Then just call a mutator method and see the reactiveness work!

e.g. `reavtive_array.push(0)`

ALL ARRAY'S MUTATOR, ACCESSOR AND ITERATION METHODS (SEE [REFERENCE][1]) **ARE AVAILABLE TO ALL INSTANCES OF ReactiveArray AND THEY'RE ALL REACTIVE**. ALL MUTATOR METHODS TRIGGER A RECOMPUTATION OF WHATEVER THE ReactiveArray INSTANCES ARE BEING USED IN.

<a name="important-notes"></a>
### Important notes

The ReactiveArray instances are not array-like objects. Therefore, they cannot be called within `Array.prototype.[any_method].call` nor `Array.prototype.[any_method].apply` as the context. What _CAN_ be used as the context in such cases is the instance's built-in array object, retrieved through [Get](#methods-get), _BUT_ these calls _WILL NOT BE REACTIVE_.

<a name="methods"></a>
### Methods

<a name="methods-constructor"></a>
#### Constructor:

`ReactiveArray(initialValue, equalsFunction, makeArrayObjectReactive) -> Object`

* `initialValue: Array` The array's initial value. Becomes the ReactiveArray instance's built-in array object.
* `initialValue: Anything (2)` The array's initial value. It's wrapped inside a Javascript regular array and becomes the ReactiveArray instance's built-in array object. Default: `[]`
* `equalsFunction: Function(oldValue: Array, newValue: Anything) -> Boolean` A function that receives the arguments `oldValue` and `newValue` and evaluates their equality. When set, this function will be called inside [Set](#methods-set). By default this method just returns `false` (given `newValue` may just be `oldValue` mutated), forcing the variable to always be updated on every `set(newValue)` call.
* `makeArrayObjectReactive: Boolean` As seen in [Important notes](#important-notes), the ReactiveArray instances are not array-like objects, but _THEY HAVE_ a built-in array that is returned by [Get](#methods-get). When this argument is set to `true` (which is default), the built-in array object becomes reactive as well. If set to `false`, the built-in array will be just a regular non-reactive Javascript array.

<a name="methods-set"></a>
#### Set:

`reactive_array.set(value)`

Sets the built-in array object contained inside the ReactiveArray instance.
Uses the `equalsFunction` (see [Constructor](#methods-constructor)) as equality evaluator to decide wether or not to update the variable. If `equalsFunction` returns a falsy value, which means the old and new values are _DIFFERENT_, then the variable _IS_ updated. Otherwise, there is no update.

* `value: Array` Becomes the instance's built-in array object.
* `value: Anything (2)` It's wrapped inside a regular Javascript array and becomes the instance's array object.

**Caution**
This method will make the newly set array to be reactive, if defined upon the ReactiveArray instance creation (see [Constructor](#methods-constructor)).

**Caution 2**
Calling this method with no argument will cause `value` to be considered `undefined`. So this would be the same as calling `set([undefined])`. To clear the array, see [Clear](#methods-clear).

<a name="methods-get"></a>
#### Get:

`reactive_array.get() -> Array`

Returns the built-in array object contained inside the ReactiveArray instance. If defined upon the ReactiveArray instance creation, this array may be reactive (see [Constructor](#methods-constructor)).

<a name="methods-remove"></a>
#### Remove:

`reactive_array.remove(valueOrEvaluationFunction) -> Array`

Returns a regular non-reactive Javascript array containing all removed elements evalueated by `valueOrEvaluationFunction` as truthy, if `valueOrEvaluationFunction` is a function, or strictly equal to `valueOrEvaluationFunction` otherwise.

* `valueOrEvaluationFunction: Function(element: Anything) -> Boolean` Evaluation function that returns a truthy value meaning that `element` should be removed or a falsy value otherwise.
* `valueOrEvaluationFunction: Anything (2)` A value that is wrapped in a strict equality function to evaluate which elements of the array should be removed.

e.g.:
```
// removes every element % 2 === 0 (even numbers) from the array

removed_elements = reactive_array.remove( function(element) {
  return element % 2 === 0
})

// removes every element === 2 from the array

removed_elements = reactive_array.remove(2)

// from this point, it's easy to make 'removed_elements' a reactive source

removed_elements = new ReactiveArray(removed_elements)
```

<a name="methods-clear"></a>
#### Clear:

`reactive_array.clear()`

Clears the instance's built-in array object. It's a shorthand of `set([])`.

<a name="methods-getlength"></a>
#### GetLength:

`reactive_array.getLength() -> Number`

A reactive function that returns the length of the instance's built-in array object.

<a name="license"></a>
### License:
The MIT License (MIT)

Copyright (c) 2015 Antônio Augusto Morais

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

##### Check out my [other projects][2].

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype "Array.prototype (MDN)"
[2]: https://github.com/ciclopes "Ciclopes (GitHub)"