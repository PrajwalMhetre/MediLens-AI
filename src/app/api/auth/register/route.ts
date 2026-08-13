import { NextRequest, NextResponse } from 'next/server';
import { createUser, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const password = String(body?.password ?? '');
    const role = String(body?.role ?? 'Radiologist').trim();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const result = await createUser({ name, email, password, role });
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        token: result.token,
      },
      { status: 201 }
    );

    return setAuthCookie(response, result.token);
  } catch {
    return NextResponse.json({ error: 'Unable to create account right now.' }, { status: 500 });
  }
}
