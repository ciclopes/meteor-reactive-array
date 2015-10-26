Package.describe({
  name: 'ciclopes:reactive-array',
  version: '0.0.12',
  summary: "Meteor's best ReactiveArray package.",
  git: 'https://github.com/ciclopes/meteor-reactive-array.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('reactive-array.js');
  api.use('tracker');
  api.export('ReactiveArray');
});