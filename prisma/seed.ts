import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'test123', // use a hashed password in real cases
    },
  })

  const customer = await prisma.customer.create({
    data: {
      name: 'Acme Corp',
      email: 'client@acme.com',
      userId: user.id,
    },
  })

  const project = await prisma.project.create({
    data: {
      name: 'Demo Video Project',
      description: 'A sample project',
      userId: user.id,
      customerId: customer.id,
      priority: 'HIGH',
    },
  })

  await prisma.task.createMany({
    data: [
      {
        name: 'Shoot footage',
        projectId: project.id,
        priority: 'HIGH',
      },
      {
        name: 'Edit draft',
        projectId: project.id,
        priority: 'MEDIUM',
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
