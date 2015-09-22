Package.describe({
  name: 'trusktr:lowclass',
  version: '2.0.0',
  summary: 'Low-complexity class inheritance.',
  git: 'https://github.com/infamous/motor.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2-rc.7');

  // TODO
  api.use([
    'rocket:module@0.8.2'
  ], 'client');

  api.add_files([
    'entry.js',
    'npm.json',
  ], 'client');

  api.export('motor');
});
