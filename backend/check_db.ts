import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const employeesCnt = await prisma.employee.count()
  const attendanceCnt = await prisma.attendance.count()
  const activityCnt = await prisma.activity.count()
  
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  const presentToday = await prisma.attendance.count({
    where: { date: today, status: 'Present' }
  })

  console.log({
    employeesCnt,
    attendanceCnt,
    activityCnt,
    today: today.toISOString(),
    presentToday
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
