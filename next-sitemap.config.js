/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sravnipay.ru',
  generateRobotsTxt: true,
  outDir: './public',
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/api',
    '/admin/*',
  ],
  additionalPaths: async () => {
    const paths = []
    const today = new Date().toISOString()
    
    const mainPages = [
      { loc: '/', priority: 1.0, changefreq: 'daily' },
      { loc: '/allmfo', priority: 0.9, changefreq: 'daily' },
      { loc: '/cards', priority: 0.8, changefreq: 'weekly' },
      { loc: '/articles', priority: 0.8, changefreq: 'daily' },
      { loc: '/faq', priority: 0.7, changefreq: 'monthly' },
      { loc: '/about', priority: 0.6, changefreq: 'monthly' },
      { loc: '/privacy', priority: 0.5, changefreq: 'monthly' },
      { loc: '/terms', priority: 0.5, changefreq: 'monthly' },
      { loc: '/zajmy-online', priority: 0.8, changefreq: 'daily' },
    ]
    
    for (var i = 0; i < mainPages.length; i++) {
      var page = mainPages[i]
      paths.push({
        loc: page.loc,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: today,
      })
    }
    
    var articles = [
      'kak-vybrat-luchshij-mikrozajm',
      'chto-takoe-grejs-period',
      'kak-uluchshit-kreditnuyu-istoriju',
      'kreditnaya-karta-ili-mikrozajm',
      'bezopasnost-pri-onlajn-zayavkah',
    ]
    
    for (var j = 0; j < articles.length; j++) {
      paths.push({
        loc: '/articles/' + articles[j],
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: today,
      })
    }
    
    var cities = [
      'moskva',
      'sankt-peterburg',
      'novosibirsk',
      'ekaterinburg',
      'kazan',
    ]
    
    for (var k = 0; k < cities.length; k++) {
      paths.push({
        loc: '/zajmy-online/' + cities[k],
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: today,
      })
    }
    
    return paths
  },
}
