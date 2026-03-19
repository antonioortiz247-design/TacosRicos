import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: 'MERCADO_PAGO_ACCESS_TOKEN missing' }, { status: 500 });

  const { paymentId } = await request.json();

  if (!paymentId) return NextResponse.json({ ok: false, error: 'paymentId is required' }, { status: 400 });

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const payment = await response.json();

  if (!response.ok) return NextResponse.json({ ok: false, error: payment }, { status: 400 });

  const mappedStatus = payment.status === 'approved' ? 'paid' : payment.status === 'rejected' ? 'failed' : 'pending';

  return NextResponse.json({
    ok: true,
    payment_status: mappedStatus,
    payment
  });
}
