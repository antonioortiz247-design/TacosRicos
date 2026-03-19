import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: 'MERCADO_PAGO_ACCESS_TOKEN missing' }, { status: 500 });

  const body = await request.json();

  const preferencePayload = {
    items: [
      {
        title: `Pedido ${body.businessName ?? 'Taquería'}`,
        quantity: 1,
        unit_price: Number(body.total ?? 0),
        currency_id: 'MXN'
      }
    ],
    back_urls: {
      success: body.successUrl,
      failure: body.failureUrl,
      pending: body.pendingUrl
    },
    auto_return: 'approved',
    metadata: {
      orderItems: body.items ?? []
    }
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preferencePayload)
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: data }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
    preference_id: data.id
  });
}
