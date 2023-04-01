import {
  ArticlesList,
  ArticlesUrls
} from '../index'

describe('Articles List', () => {
  it('All article links are valid', () => {
    for (const url of Object.values(ArticlesUrls)) {
      let articleFoundInUrl = null
      const splitUrl = url.split('/')
      // First two parts of split URL are a blank string cuz
      const articleCategory = splitUrl[2]
      const articleName = splitUrl[3]
      for (const { category, articles } of ArticlesList) {
        if (category.toLowerCase() === articleCategory.toLowerCase()) {
          for (const article of articles) {
            if (article.url === articleName) {
              articleFoundInUrl = article
              break
            }
          }
        }
        if (articleFoundInUrl != null) {
          break
        }
      }
      expect(articleFoundInUrl).not.toBeNull()
    }
  })
})
