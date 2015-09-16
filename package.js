Package.describe({
  name: 'ciclopes:reactive-array',
  version: '0.0.4',
  summary: 'Another implementation of ReactiveArray taking into consideration the native array mutator, accessor and iteration methods, making the mutator and accessor ones reactive.',
  git: 'https://github.com/ciclopes/reactive-array',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('reactive-array.js');
  api.use('tracker');
  api.export('ReactiveArray');
});