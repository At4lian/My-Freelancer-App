// app/api/customers/[customerId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from "@/hooks/require-user";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const customerId = url.pathname.split('/').pop(); // Extract customerId from the URL

  const session = await requireUser();

  try {
    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId is required' },
        { status: 400 }
      );
    }

    const customer = await db.customer.findUnique({
      where: { 
        id: customerId,
        createdByUserId: session.user?.id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Zákazník nenalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch {
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
