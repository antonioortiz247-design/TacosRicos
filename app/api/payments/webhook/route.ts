import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const mpStatus = body?.data?.status ?? body?.status;
  const status = mpStatus === 'approved' ? 'paid' : mpStatus === 'rejected' ? 'failed' : 'pending';

  return NextResponse.json({ ok: true, provider: 'mercado_pago', mapped_status: status });
}
