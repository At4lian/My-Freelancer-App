"use client"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useState, useEffect } from "react"
import { schema } from "@/components/data-table" // wherever your zod schema is

interface Project {
  id: string
  name: string
  description?: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD"
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: string | null

  // anything else your table expects
}


export default function Page() {
  
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      const rawData = await res.json()

      const validated = schema.array().safeParse(rawData)

      if (validated.success) {
        setProjects(validated.data)
      } else {
        console.error("Validation failed", validated.error)
      }
    } catch (err) {
      console.error("Failed to fetch projects", err)
    }
  }

  fetchProjects()
}, [])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={projects} />
      </div>
    </div>
  )
}
