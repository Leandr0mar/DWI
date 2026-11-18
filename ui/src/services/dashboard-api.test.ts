import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardApiError, getList, getOne, mutate, type Category } from './dashboard-api'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('dashboard API service', () => {
  it('loads typed collections with included credentials', async () => {
    const categories: Category[] = [{ id: 8, nombre: 'Clásicos', estado: true }]
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(categories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))

    await expect(getList<Category>('/api/v1/catalogo/categorias')).resolves.toEqual(categories)
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBaseUrl}/api/v1/catalogo/categorias`,
      { credentials: 'include' },
    )
  })

  it('fetches a CSRF token before sending an authenticated JSON mutation', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'csrf-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response('created', { status: 201 }))

    await expect(mutate('/api/v1/catalogo/categorias', 'POST', { nombre: 'Frutales', estado: true }))
      .resolves.toBe('created')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${apiBaseUrl}/api/v1/auth/csrf`,
      { credentials: 'include' },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${apiBaseUrl}/api/v1/catalogo/categorias`,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': 'csrf-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: 'Frutales', estado: true }),
      }),
    )
  })

  it('does not expose server-provided validation or exception messages', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
      fieldErrors: { nombre: 'internal sql constraint details' },
      message: 'Sensitive exception text.',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }))

    const request = getOne<Category>('/api/v1/catalogo/categorias/8')
    await expect(request).rejects.toBeInstanceOf(DashboardApiError)
    await expect(request).rejects.toMatchObject({
      status: 400,
      message: 'No se pudo completar la solicitud. Verifica los datos ingresados.',
    })
  })

  it('maps server failures to a predefined message without reading the response body', async () => {
    fetchMock.mockResolvedValueOnce(new Response('database password: private', { status: 500 }))

    await expect(getOne<Category>('/api/v1/catalogo/categorias/8')).rejects.toMatchObject({
      status: 500,
      message: 'Ocurrió un problema. Inténtalo nuevamente más tarde.',
    })
  })
})
