import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const users = await sql`
      SELECT id, email, name, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    const result = await sql`
      INSERT INTO users (email, name, role)
      VALUES (${email}, ${name}, ${role})
      RETURNING id, email, name, role, created_at
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}