import { db } from "@/lib/db";
import { requireUser } from "@/hooks/require-user";

export async function GET() {
  const session = await requireUser();
  try {
    const projects = await db.project.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        customer: {
          select: {
            name: true
          }
        }
      }
    });
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error(error); // Zobrazí chybu v konzoli pro lepší diagnostiku
    return new Response('Error fetching projects', { status: 500 });
  }
}


