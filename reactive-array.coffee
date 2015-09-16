class ReactiveArray
  # Array mutator methods.
  MUTATOR_METHODS = 'pop push reverse shift sort splice unshift'.split ' '
  # Array non-mutator methods (do not modify the array itself).
  ACCESSOR_METHODS = 'concat join slice toLocaleString indexOf lastIndexOf'.split ' '
  ITERATION_METHODS = 'forEach every some filter map reduce reduceRight'.split ' '
  REACTIVE_METHODS = MUTATOR_METHODS.concat ACCESSOR_METHODS

  # Overrides the array's mutator and accessor methods to be reactive.
  __assignReactiveMethods = ->
    self = @

    for method in REACTIVE_METHODS
      if Array::[method] instanceof Function then ((method_name) ->
        self.array[method_name] = ->
          ReactiveArray::[method_name].apply self, arguments
      )(method)
    return

  constructor: (initValue, comparator, makeArrayObjReactive) ->
    # If the constructor has not been called with the keyword 'new', create a new instance and return it.
    if not (@ instanceof ReactiveArray) then return new ReactiveArray initValue, comparator, makeArrayObjReactive
    
    # Ommited 'comparator' argument.
    if not (comparator instanceof Function)
      makeArrayObjReactive = comparator
      comparator = undefined

    # Set instance specific variables.
    @array = undefined
    @comparator = comparator
    @__dep = new Tracker.Dependency
    @__reactive_array = makeArrayObjReactive || true

    # Set initial value.
    @set initValue
    return

  # Set function.
  set: (value) ->
    # Uses the 'comparator' if it has been defined upon construction.
    # If the values are equal then the variable is not updated.
    if @comparator and @comparator @array, value then return

    if value instanceof Array then @array = value else @array = [value]

    # Override the array's mutator and accessor methods to be reactive if desired upon construction (default behaviour).
    if @__reactive_array then __assignReactiveMethods.call @
    @__dep.changed()
    return

  # Get function.
  get: ->
    @__dep.depend()
    return @array

  # Removes items from the array based either on a value or an evaluation function and returns a Javascript array containing the removed items or null if no items have been removed.
  remove: (valueOrFn) ->
    ret = []
    fn = if valueOrFn instanceof Function then valueOrFn else (value) -> value is valueOrFn
    i = @array.length

    while i--
      if fn @array[i]
        ret.unshift @array[i]
        @array.splice i, 1

    if ret.length then ret else null

  # Clear function.
  clear: ->
    @set []

  # ToString function.
  toString: ->
    @__dep.depend()
    return "ReactiveArray{ #{@array} }"

  # Makes the array mutator methods available and reactive.
  for method in MUTATOR_METHODS
    if Array::[method] instanceof Function then ((method_name) ->
      ReactiveArray::[method_name] = ->
        ret = Array::[method_name].apply @array, arguments
        @__dep.changed()
        ret
    )(method)

  # Makes the array accessor methods available and reactive.
  for method in ACCESSOR_METHODS
    if Array::[method] instanceof Function then ((method_name) ->
      ReactiveArray::[method_name] = ->
        @__dep.depend()
        Array::[method_name].apply @array, arguments
    )(method)

  # Makes the array iteration methods available.
  for method in ITERATION_METHODS
    if Array::[method] instanceof Function then ((method_name) ->
      ReactiveArray::[method_name] = ->
        Array::[method_name].apply @array, arguments
    )(method)