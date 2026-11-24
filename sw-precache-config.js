module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/assets/images/*',
    'dist/*.eot',
    'dist/*.woff2',
    'dist/*.ttf',
    'dist/*.woff',        
    'dist/*.svg',
    'dist/*.gif',
    'dist/media/*',
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html',
  runtimeCaching: [{
    urlPattern: /pinwork-api\.herokuapp\.com/,
    handler: 'networkFirst'
  }]
};