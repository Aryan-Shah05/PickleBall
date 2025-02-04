import { PrismaClient, CourtStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courts = [
    {
      id: '1',
      name: 'Court A',
      type: 'Professional',
      isIndoor: true,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 40,
      peakHourRate: 60,
      maintenanceSchedule: JSON.stringify({
        monday: '6:00-7:00',
        thursday: '6:00-7:00'
      })
    },
    {
      id: '2',
      name: 'Court B',
      type: 'Professional',
      isIndoor: true,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 40,
      peakHourRate: 60,
      maintenanceSchedule: JSON.stringify({
        tuesday: '6:00-7:00',
        friday: '6:00-7:00'
      })
    },
    {
      id: '3',
      name: 'Court C',
      type: 'Amateur',
      isIndoor: false,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 30,
      peakHourRate: 45,
      maintenanceSchedule: JSON.stringify({
        wednesday: '6:00-7:00',
        saturday: '6:00-7:00'
      })
    },
    {
      id: '4',
      name: 'Court D',
      type: 'Amateur',
      isIndoor: false,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 30,
      peakHourRate: 45,
      maintenanceSchedule: JSON.stringify({
        monday: '14:00-15:00',
        thursday: '14:00-15:00'
      })
    },
    {
      id: '5',
      name: 'Court E',
      type: 'Training',
      isIndoor: true,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 25,
      peakHourRate: 35,
      maintenanceSchedule: JSON.stringify({
        tuesday: '14:00-15:00',
        friday: '14:00-15:00'
      })
    },
    {
      id: '6',
      name: 'Court F',
      type: 'Training',
      isIndoor: false,
      status: CourtStatus.AVAILABLE,
      hourlyRate: 25,
      peakHourRate: 35,
      maintenanceSchedule: JSON.stringify({
        wednesday: '14:00-15:00',
        saturday: '14:00-15:00'
      })
    }
  ];

  for (const court of courts) {
    await prisma.court.upsert({
      where: { id: court.id },
      update: court,
      create: court
    });
  }

  console.log('Courts seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 