import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.post('api/password_reset/', async (req, res, ctx) => {
    return await res(ctx.status(200))
  }),
  rest.post('api/token/', async (req, res, ctx) => {
    const {
      username,
      password
    } = await req.json()
    if (username === 'valid@email.com' && password === 'validPassword') {
      return await res(ctx.json({
        access: 'access token',
        refresh: 'refresh token'
      }))
    }
    return await res(ctx.status(401))
  }),
  rest.post('api/password_reset/validate_token/', async (req, res, ctx) => {
    const {
      token
    } = await req.json()
    if (token === 'valid token') {
      return await res(ctx.status(200))
    }
    return await res(ctx.status(400))
  }
  ),
  rest.post('api/password_reset/confirm/', async (req, res, ctx) => {
    const {
      token,
      password
    } = await req.json()
    if (token === 'valid token' && password === 'valid password') {
      return await res(ctx.status(200))
    }
    return await res(ctx.status(400), ctx.json({ password: ['The password is invalid'] }))
  }),
  rest.post('users/sign-up/', async (req, res, ctx) => {
    const {
      username,
      email,
      password
    } = await req.json()
    if (username === 'valid username' && email === 'valid@email.com' && password === 'valid password') {
      return await res(ctx.status(200), ctx.json({ access: 'access', refresh: 'refresh' }))
    }
    return await res(ctx.status(400))
  }),
  rest.get('users/viewed-lesson-intro/', async (req, res, ctx) => {
    return await res(ctx.status(200))
  }),
  rest.get('languages/article/:language/:slug', async (req, res, ctx) => {
    const { language, slug } = req.params
    if (language === 'Japanese' && slug === 'test-slug') {
      return await res(ctx.status(200), ctx.json({ 
        article: {
          title: 'Test Title',
          sections: [{
            content: 'Test Content',
            header: 'Test Header'
          }]
        },
        userHasFinishedThisArticle: false
       }))
    } else {
      return await res(ctx.status(404))
    }
  }),
  rest.get('languages/article', async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.json([
      { 
        category: 'test category',
        title: 'test title', 
        slug: 'test-slug',
        sections: [{
          header: 'test header',
          content: 'test content'
        }]
      }
    ]))
  }),
)
