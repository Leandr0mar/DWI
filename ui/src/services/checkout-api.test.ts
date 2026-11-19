import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createCheckoutOrder,
  createMyAddress,
  getMyAddresses,
} from './checkout-api'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('checkout API', () => {
  it('loads only the authenticated customer address collection', async () => {
    const addresses = [{
      id: 11,
      clienteId: 5,
      clienteNombre: 'Ana García',
      zonaId: 2,
      zona: 'Miraflores',
      alias: 'Casa',
      linea1: 'Av. Larco 123',
      linea2: null,
      referencia: null,
      esPrincipal: true,
    }]
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(addresses), { status: 200 }))

    await expect(getMyAddresses()).resolves.toEqual(addresses)
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBaseUrl}/api/v1/cliente/direcciones`,
      { credentials: 'include' },
    )
  })

  it('creates an order using address and quantities without client or payment details', async () => {
    const payload = {
      direccionId: 11,
      detalles: [{ productoId: 4, cantidad: 2 }],
    }
    const order = {
      id: 72,
      uuid: 'pedido-72',
      subtotal: 24,
      costoEnvio: 8,
      igv: 4.32,
      total: 36.32,
      estadoPago: 'PENDIENTE',
      estadoPedido: 'PREPARANDO',
    }
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'csrf-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(order), { status: 201 }))

    await expect(createCheckoutOrder(payload)).resolves.toEqual(order)
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${apiBaseUrl}/api/pedidos/checkout`,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': 'csrf-token', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    )
  })

  it('maps address mutation failures to a safe message', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'csrf-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('database detail', { status: 500 }))

    await expect(createMyAddress({
      zonaId: 2,
      alias: 'Casa',
      linea1: 'Av. Larco 123',
      linea2: '',
      referencia: '',
      esPrincipal: true,
    })).rejects.toMatchObject({
      status: 500,
      message: 'No se pudo completar la solicitud. Inténtalo nuevamente más tarde.',
    })
  })
})
