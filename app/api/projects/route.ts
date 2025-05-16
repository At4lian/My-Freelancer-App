import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const projects = await db.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return new Response(JSON.stringify(projects), { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(`Error fetching projects: ${errorMessage}`, { status: 500 })
  }
}
