# Array methods that are not modifiers (do not modify the array itself).
METHODS = 'concat join slice toString toLocaleString indexOf lastIndexOf forEach entries every some filter map reduce reduceRight'.split ' '

# Array prototype.
ARRAY_PROTO = Array.prototype

# Function to override the array modifiers methods to be reactive if desired (see Constructor).
__assignReactiveModifiers = (array) ->
  self = @
  array.pop = ->
    ReactiveArray.prototype.pop.apply self, arguments
  array.push = ->
    ReactiveArray.prototype.push.apply self, arguments
  array.shift = ->
    ReactiveArray.prototype.shift.apply self, arguments
  array.splice = ->
    ReactiveArray.prototype.splice.apply self, arguments
  array.unshift = ->
    ReactiveArray.prototype.unshift.apply self, arguments

# Constructor.
ReactiveArray = (initValue, equalsFn, makeArrayObjReactive) ->
  # If the constructor has not been called with the keyword 'new', create a new instance and return it.
  if not (@ instanceof ReactiveArray) then return new ReactiveArray initValue, equalsFn, makeArrayObjReactive
  
  # Ommited 'equalsFn' argument.
  if not (equalsFn instanceof Function)
    makeArrayObjReactive = equalsFn
    equalsFn = undefined

  # Set instance specific variables.
  @_data = undefined
  @_equalsFn = equalsFn
  @_dep = new Tracker.Dependency
  @_reactive_data_array = makeArrayObjReactive || true

  # Set initial value.
  if (typeof initValue != 'undefined') then @set initValue else @set []
  return

# Class' set function.
ReactiveArray.prototype.set = (value) ->
  # Uses the 'equalsFn' function as comparator if it has been defined upon construction.
  # If the values are equal the variable is not updated.
  if @_equalsFn and @_equalsFn @_data, value
    return

  if value instanceof Array then @_data = value else @_data = [value]

  # Override the array's modifiers functions to be reactive (default behaviour) if desired upon construction.
  if @_reactive_data_array then __assignReactiveModifiers.call @, @_data
  @_dep.changed()
  return

# Class' get function.
ReactiveArray.prototype.get = ->
  if Tracker.active then @_dep.depend()
  return @_data

# Array's reactive modifiers functions overrides.
ReactiveArray.prototype.pop = ->
  @_dep.changed()
  ARRAY_PROTO.pop.apply @_data, arguments

ReactiveArray.prototype.push = ->
  @_dep.changed()
  ARRAY_PROTO.push.apply @_data, arguments

ReactiveArray.prototype.shift = ->
  @_dep.changed()
  ARRAY_PROTO.shift.apply @_data, arguments

ReactiveArray.prototype.splice = ->
  @_dep.changed()
  ARRAY_PROTO.splice.apply @_data, arguments

ReactiveArray.prototype.unshift = ->
  @_dep.changed()
  ARRAY_PROTO.unshift.apply @_data, arguments
# End.

ReactiveArray.prototype.toString = ->
  return "ReactiveArray{ #{@get()} }"

# Make the other non-modifiers array methods available.
for a in METHODS
  if ARRAY_PROTO[a] instanceof Function then ReactiveArray.prototype[a] = ->
    ARRAY_PROTO[a].apply @_data, arguments