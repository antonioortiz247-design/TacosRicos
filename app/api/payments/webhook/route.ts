import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const status = body?.status === 'approved' ? 'paid' : body?.status === 'rejected' ? 'failed' : 'pending';

  return NextResponse.json({ ok: true, mapped_status: status });
}
