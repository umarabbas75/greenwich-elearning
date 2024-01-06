import { NextResponse } from 'next/server';

import { backendLogin } from '@/lib/auth/login';

export async function POST(request: Request) {
  const reqPayload = await request.json();

  try {
    const res = await backendLogin({ payload: reqPayload });
    const { status, data, message } = res || {};

    const response = NextResponse.json({ status, message });
    response.cookies.set('token', data?.token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ status: 200, message: 'testing failed' });
  }
}
