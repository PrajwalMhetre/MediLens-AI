import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
};

export const AUTH_COOKIE_NAME = 'medilens_session';
const JWT_SECRET = process.env.JWT_SECRET ?? 'medilens-dev-secret-key-change-me';
const JWT_EXPIRES_IN = '7d';

const users = new Map<string, AppUser>();

export function ensureSeedUser() {
  const demoEmail = 'dr.elena@medilens.ai';

  if (!users.has(demoEmail)) {
    users.set(demoEmail, {
      id: 'demo-radiologist',
      name: 'Dr. Elena Moreno',
      email: demoEmail,
      role: 'Radiologist',
      passwordHash: bcrypt.hashSync('DemoRadiologist2026!', 10),
    });
  }
}

export function sanitizeUser(user: AppUser) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser as Omit<AppUser, 'passwordHash'>;
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  ensureSeedUser();

  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail || !input.name.trim() || !input.password.trim()) {
    return { error: 'Name, email, and password are required.' };
  }

  if (users.has(normalizedEmail)) {
    return { error: 'An account with this email already exists.' };
  }

  if (input.password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  const user: AppUser = {
    id: `user_${crypto.randomUUID()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    role: input.role || 'Radiologist',
    passwordHash: bcrypt.hashSync(input.password, 10),
  };

  users.set(normalizedEmail, user);
  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export function authenticateUser(email: string, password: string) {
  ensureSeedUser();

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) {
    return null;
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    return null;
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}

export function getUserProfileFromToken(token: string) {
  try {
    const payload = verifyToken(token) as JwtPayload & {
      sub: string;
      email: string;
      name: string;
      role: string;
    };

    const user = users.get(payload.email?.toLowerCase() ?? '');
    if (!user || user.id !== payload.sub) {
      return null;
    }

    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export function signToken(user: Pick<AppUser, 'id' | 'name' | 'email' | 'role'>) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
