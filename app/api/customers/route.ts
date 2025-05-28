import { db } from "@/lib/db";
import { requireUser } from "@/hooks/require-user";

export async function GET() {
  const session = await requireUser();
  try {
    const customers = await db.customer.findMany({
      where: {
        createdByUserId: session.user?.id,
      },
    });
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    console.error(error); // Zobrazí chybu v konzoli pro lepší diagnostiku
    return new Response('Error fetching customers', { status: 500 });
  }
}

