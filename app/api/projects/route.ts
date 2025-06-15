import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany(

      
    );
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error(error); // Zobrazí chybu v konzoli pro lepší diagnostiku
    return new Response('Error fetching projects', { status: 500 });
  }
}


