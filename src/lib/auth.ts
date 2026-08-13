import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
};

export type SafeUser = Omit<AppUser, 'passwordHash'>;

export const AUTH_COOKIE_NAME = 'medilens_session';
const JWT_EXPIRES_IN = '7d';
const USERS_FILE_PATH = path.join(process.cwd(), '.data', 'users.json');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === 'development' ? 'medilens-dev-secret-key-change-me' : undefined);

  if (!secret) {
    throw new Error('JWT_SECRET must be configured in production.');
  }

  return secret;
}

async function loadUsers(): Promise<Map<string, AppUser>> {
  try {
    const fileContents = await fs.readFile(USERS_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContents) as Record<string, AppUser>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

async function saveUsers(users: Map<string, AppUser>) {
  await fs.mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(Object.fromEntries(users), null, 2), 'utf8');
}

export async function ensureSeedUser() {
  const demoEmail = 'dr.elena@medilens.ai';
  const users = await loadUsers();

  if (!users.has(demoEmail)) {
    users.set(demoEmail, {
      id: 'demo-radiologist',
      name: 'Dr. Elena Moreno',
      email: demoEmail,
      role: 'Radiologist',
      passwordHash: bcrypt.hashSync('DemoRadiologist2026!', 10),
    });

    await saveUsers(users);
  }
}

export function sanitizeUser(user: AppUser): SafeUser {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'passwordHash')
  ) as SafeUser;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  await ensureSeedUser();
  const users = await loadUsers();

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
  await saveUsers(users);
  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function authenticateUser(email: string, password: string) {
  await ensureSeedUser();
  const users = await loadUsers();

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

export async function getUserProfileFromToken(token: string) {
  try {
    const payload = verifyToken(token) as JwtPayload & {
      sub: string;
      email: string;
      name: string;
      role: string;
    };

    const users = await loadUsers();
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
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret());
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
