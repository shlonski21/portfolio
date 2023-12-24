var ghpages = require('gh-pages');

ghpages.publish('dist', {
    branch: 'gh-pages',
    repo: 'https://github.com/shlonski21/portfolio.git'
}, function (err) { });