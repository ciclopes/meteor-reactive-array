Package.describe({
  name: 'ciclopes:reactive-array',
  version: '0.0.5',
  summary: "Another implementation of ReactiveArray taking into consideration the Javascript's native array mutator, accessor and iteration methods, making them reactive.",
  git: 'https://github.com/ciclopes/reactive-array',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('reactive-array.js');
  api.use('tracker');
  api.export('ReactiveArray');
});