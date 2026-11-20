import { afterEach, describe, expect, it, vi } from 'vitest'

// The production build sets VITE_CWI_API_BASE_URL=/api; news requests must not become /api/api/...
describe('news API addresses', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  async function requestedUrl(base: string) {
    vi.stubEnv('VITE_CWI_API_BASE_URL', base)
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { categories: [], featured: [] } }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const { getNewsHome, newsImageUrl } = await import('./newsApi')
    await getNewsHome()
    return { image: newsImageUrl('/api/v1/public/news/images/abc'), request: fetchMock.mock.calls[0][0] as string }
  }

  it('uses the site itself when the build base is /api', async () => {
    expect(await requestedUrl('/api')).toEqual({ image: '/api/v1/public/news/images/abc', request: '/api/v1/public/news/home' })
  })

  it('uses a full backend address as given', async () => {
    expect(await requestedUrl('http://localhost:8088/')).toEqual({
      image: 'http://localhost:8088/api/v1/public/news/images/abc',
      request: 'http://localhost:8088/api/v1/public/news/home',
    })
  })
})
