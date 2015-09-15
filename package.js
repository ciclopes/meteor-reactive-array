Package.describe({
  name: 'ciclopes:reactive-array',
  version: '0.0.1',
  summary: 'Another implementation of ReactiveArray taking into consideration the native array modifiers methods, making them reactive as well.',
  git: 'https://github.com/ciclopes/reactive-array',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('reactive-array.js');
  api.use('tracker');
});