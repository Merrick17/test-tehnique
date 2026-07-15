import * as argon2 from "argon2";
import { Prisma, PrismaClient, LeadStatus } from "@prisma/client";

const prisma = new PrismaClient();

const POSTAL_CODES = [
  "75001",
  "75002",
  "75003",
  "75011",
  "75015",
  "69001",
  "69002",
  "69006",
  "13001",
  "13002",
  "13008",
  "33000",
  "33000",
  "44000",
  "59000",
  "31000",
  "67000",
  "21000",
];

const ALL_DAY = [{ startMinute: 0, endMinute: 1440 }];
const BUSINESS_HOURS = [{ startMinute: 8 * 60, endMinute: 19 * 60 }];
const MORNING_AND_EVENING = [
  { startMinute: 7 * 60, endMinute: 12 * 60 },
  { startMinute: 17 * 60, endMinute: 22 * 60 },
];
const MORNING_ONLY = [{ startMinute: 0, endMinute: 12 * 60 }];
const AFTERNOON = [{ startMinute: 12 * 60, endMinute: 18 * 60 }];
const NIGHT_OWL = [
  { startMinute: 0, endMinute: 6 * 60 },
  { startMinute: 22 * 60, endMinute: 24 * 60 },
];

const FIRST_NAMES = [
  "Alice",
  "Bruno",
  "Chloe",
  "David",
  "Emma",
  "Farid",
  "Grace",
  "Hugo",
  "Ines",
  "Julien",
  "Karim",
  "Lea",
  "Manon",
  "Nael",
  "Olivia",
  "Paul",
  "Quentin",
  "Rania",
  "Samir",
  "Thea",
  "Ulysse",
  "Valentina",
  "William",
  "Yasmine",
  "Ziad",
];

const LAST_NAMES = [
  "Martin",
  "Bernard",
  "Dubois",
  "Thomas",
  "Robert",
  "Petit",
  "Durand",
  "Leroy",
  "Moreau",
  "Simon",
  "Laurent",
  "Lefebvre",
  "Roux",
  "Fournier",
  "Girard",
  "Bonnet",
  "Garnier",
  "Faure",
  "Mercier",
  "Blanc",
];

type DeliveryMeta = {
  id: string;
  clientId: string;
  verticalId: string;
  verticalSlug: string;
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: number;
  isActive: boolean;
  clientIsActive: boolean;
  postalCodes: string[];
  timeWindows: { startMinute: number; endMinute: number }[];
};

const randomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomBirthDate = (minAge: number, maxAge: number, reference: Date): Date => {
  const age = randomInt(minAge, maxAge);
  const year = reference.getFullYear() - age;
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  return new Date(year, month, day);
};

const calculateAge = (birthDate: Date, referenceDate: Date): number => {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const birthdayNotReached =
    referenceDate.getMonth() < birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
      referenceDate.getDate() < birthDate.getDate());
  if (birthdayNotReached) {
    age -= 1;
  }
  return age;
};

const dateToMinuteOfDay = (date: Date): number =>
  date.getHours() * 60 + date.getMinutes();

const isDeliveryEligible = (
  input: {
    birthDate: Date;
    postalCode: string;
    verticalId: string;
    receivedAt: Date;
  },
  delivery: DeliveryMeta,
  distributedToday: number
): boolean => {
  if (!delivery.isActive || !delivery.clientIsActive) return false;
  if (delivery.verticalId !== input.verticalId) return false;

  const age = calculateAge(input.birthDate, input.receivedAt);
  if (age < delivery.minAge || age > delivery.maxAge) return false;

  if (!delivery.postalCodes.includes(input.postalCode)) return false;

  const receivedMinute = dateToMinuteOfDay(input.receivedAt);
  const acceptsTime = delivery.timeWindows.some(
    (window) =>
      receivedMinute >= window.startMinute &&
      receivedMinute < window.endMinute
  );
  if (!acceptsTime) return false;

  return distributedToday < delivery.dailyCapacity;
};

const sortEligibleDeliveries = (
  deliveries: DeliveryMeta[],
  dailyCounts: Map<string, number>
): DeliveryMeta[] =>
  [...deliveries].sort((a, b) => {
    if (a.pricePerLead !== b.pricePerLead) {
      return b.pricePerLead - a.pricePerLead;
    }
    const ca = dailyCounts.get(a.id) ?? 0;
    const cb = dailyCounts.get(b.id) ?? 0;
    if (ca !== cb) {
      return ca - cb;
    }
    return a.id.localeCompare(b.id);
  });

async function main() {
  console.log("Seeding users...");
  const passwordHash = await argon2.hash("admin123");
  const secondHash = await argon2.hash("admin456");

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "ops@example.com" },
    update: {},
    create: {
      email: "ops@example.com",
      passwordHash: secondHash,
      role: "ADMIN",
    },
  });

  console.log("Seeding verticals...");
  const verticalDefs = [
    { name: "Auto Insurance", slug: "auto-insurance" },
    { name: "Home Insurance", slug: "home-insurance" },
    { name: "Health Insurance", slug: "health-insurance" },
    { name: "Life Insurance", slug: "life-insurance" },
    { name: "Pet Insurance", slug: "pet-insurance" },
    { name: "Travel Insurance", slug: "travel-insurance" },
  ];

  const verticals: { id: string; slug: string }[] = [];
  for (const vertical of verticalDefs) {
    const created = await prisma.vertical.upsert({
      where: { slug: vertical.slug },
      update: { name: vertical.name },
      create: vertical,
    });
    verticals.push(created);
  }

  const bySlug = (slug: string) =>
    verticals.find((vertical) => vertical.slug === slug)!;

  console.log("Seeding clients...");
  const clientDefs = [
    { name: "Acme Leads", email: "contact@acmeleads.example", isActive: true },
    {
      name: "Bright Path Insurance",
      email: "hello@brightpath.example",
      isActive: true,
    },
    {
      name: "Clearview Partners",
      email: "sales@clearview.example",
      isActive: true,
    },
    { name: "Delta Brokers", email: "info@deltabrokers.example", isActive: false },
    { name: "Evergreen Group", email: "biz@evergreen.example", isActive: true },
    { name: "Flux Media", email: "team@fluxmedia.example", isActive: true },
    { name: "Globex", email: "leads@globex.example", isActive: true },
    { name: "Helios Agency", email: "contact@helios.example", isActive: false },
    { name: "Initech", email: "data@initech.example", isActive: true },
    { name: "Jade Networks", email: "ops@jadenet.example", isActive: true },
  ];

  const clients: { id: string; name: string; isActive: boolean }[] = [];
  for (const clientDef of clientDefs) {
    const existing = await prisma.client.findFirst({
      where: { name: clientDef.name },
    });
    const client =
      existing ??
      (await prisma.client.create({
        data: {
          name: clientDef.name,
          email: clientDef.email,
          isActive: clientDef.isActive,
        },
      }));
    clients.push(client);
  }

  const byClientName = (name: string) =>
    clients.find((client) => client.name === name)!;

  console.log("Clearing deliveries / leads / distributions...");
  await prisma.distribution.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.deliveryTimeWindow.deleteMany();
  await prisma.deliveryPostalCode.deleteMany();
  await prisma.delivery.deleteMany();

  type DeliveryDef = {
    client: string;
    vertical: string;
    minAge: number;
    maxAge: number;
    dailyCapacity: number;
    pricePerLead: number;
    isActive: boolean;
    postalCodes: string[];
    timeWindows: { startMinute: number; endMinute: number }[];
  };

  const deliveryDefs: DeliveryDef[] = [
    {
      client: "Acme Leads",
      vertical: "auto-insurance",
      minAge: 18,
      maxAge: 45,
      dailyCapacity: 20,
      pricePerLead: 12.5,
      isActive: true,
      postalCodes: ["75001", "75002", "75011"],
      timeWindows: BUSINESS_HOURS,
    },
    {
      client: "Acme Leads",
      vertical: "home-insurance",
      minAge: 25,
      maxAge: 65,
      dailyCapacity: 10,
      pricePerLead: 9.0,
      isActive: true,
      postalCodes: ["69001", "69002"],
      timeWindows: ALL_DAY,
    },
    {
      client: "Acme Leads",
      vertical: "auto-insurance",
      minAge: 18,
      maxAge: 99,
      dailyCapacity: 6,
      pricePerLead: 12.5,
      isActive: true,
      postalCodes: ["75001", "75002", "13001", "13002"],
      timeWindows: MORNING_AND_EVENING,
    },
    {
      client: "Bright Path Insurance",
      vertical: "auto-insurance",
      minAge: 30,
      maxAge: 60,
      dailyCapacity: 15,
      pricePerLead: 15.0,
      isActive: true,
      postalCodes: ["75001", "75002", "13001", "13002"],
      timeWindows: MORNING_AND_EVENING,
    },
    {
      client: "Bright Path Insurance",
      vertical: "health-insurance",
      minAge: 18,
      maxAge: 80,
      dailyCapacity: 25,
      pricePerLead: 7.5,
      isActive: true,
      postalCodes: POSTAL_CODES,
      timeWindows: ALL_DAY,
    },
    {
      client: "Bright Path Insurance",
      vertical: "life-insurance",
      minAge: 30,
      maxAge: 70,
      dailyCapacity: 12,
      pricePerLead: 18.0,
      isActive: true,
      postalCodes: ["75001", "75002", "69001", "59000"],
      timeWindows: BUSINESS_HOURS,
    },
    {
      client: "Clearview Partners",
      vertical: "home-insurance",
      minAge: 21,
      maxAge: 55,
      dailyCapacity: 8,
      pricePerLead: 11.0,
      isActive: true,
      postalCodes: ["33000", "44000", "59000", "31000"],
      timeWindows: BUSINESS_HOURS,
    },
    {
      client: "Clearview Partners",
      vertical: "home-insurance",
      minAge: 21,
      maxAge: 55,
      dailyCapacity: 8,
      pricePerLead: 11.0,
      isActive: true,
      postalCodes: ["67000", "21000", "75003", "75015"],
      timeWindows: AFTERNOON,
    },
    {
      client: "Clearview Partners",
      vertical: "health-insurance",
      minAge: 40,
      maxAge: 75,
      dailyCapacity: 12,
      pricePerLead: 13.75,
      isActive: false,
      postalCodes: ["75001", "69001"],
      timeWindows: ALL_DAY,
    },
    {
      client: "Clearview Partners",
      vertical: "pet-insurance",
      minAge: 18,
      maxAge: 99,
      dailyCapacity: 30,
      pricePerLead: 6.5,
      isActive: true,
      postalCodes: POSTAL_CODES,
      timeWindows: ALL_DAY,
    },
    {
      client: "Delta Brokers",
      vertical: "auto-insurance",
      minAge: 18,
      maxAge: 99,
      dailyCapacity: 5,
      pricePerLead: 20.0,
      isActive: true,
      postalCodes: POSTAL_CODES,
      timeWindows: ALL_DAY,
    },
    {
      client: "Delta Brokers",
      vertical: "travel-insurance",
      minAge: 18,
      maxAge: 80,
      dailyCapacity: 20,
      pricePerLead: 8.25,
      isActive: true,
      postalCodes: POSTAL_CODES,
      timeWindows: ALL_DAY,
    },
    {
      client: "Evergreen Group",
      vertical: "auto-insurance",
      minAge: 50,
      maxAge: 99,
      dailyCapacity: 10,
      pricePerLead: 16.5,
      isActive: true,
      postalCodes: ["75001", "69001", "13001", "59000"],
      timeWindows: MORNING_ONLY,
    },
    {
      client: "Evergreen Group",
      vertical: "health-insurance",
      minAge: 18,
      maxAge: 35,
      dailyCapacity: 9,
      pricePerLead: 10.0,
      isActive: true,
      postalCodes: ["75002", "75011", "69002", "33000", "44000"],
      timeWindows: NIGHT_OWL,
    },
    {
      client: "Flux Media",
      vertical: "home-insurance",
      minAge: 28,
      maxAge: 60,
      dailyCapacity: 14,
      pricePerLead: 9.75,
      isActive: true,
      postalCodes: ["75003", "75015", "69006", "13008"],
      timeWindows: BUSINESS_HOURS,
    },
    {
      client: "Globex",
      vertical: "life-insurance",
      minAge: 35,
      maxAge: 65,
      dailyCapacity: 7,
      pricePerLead: 19.5,
      isActive: true,
      postalCodes: ["75001", "69001", "59000", "67000"],
      timeWindows: MORNING_AND_EVENING,
    },
    {
      client: "Globex",
      vertical: "travel-insurance",
      minAge: 18,
      maxAge: 70,
      dailyCapacity: 18,
      pricePerLead: 7.0,
      isActive: true,
      postalCodes: ["33000", "59000", "31000", "67000", "21000"],
      timeWindows: ALL_DAY,
    },
    {
      client: "Helios Agency",
      vertical: "auto-insurance",
      minAge: 18,
      maxAge: 45,
      dailyCapacity: 15,
      pricePerLead: 17.0,
      isActive: true,
      postalCodes: ["75001", "75002", "75011", "75015"],
      timeWindows: BUSINESS_HOURS,
    },
    {
      client: "Initech",
      vertical: "pet-insurance",
      minAge: 25,
      maxAge: 90,
      dailyCapacity: 16,
      pricePerLead: 5.75,
      isActive: true,
      postalCodes: ["75015", "69002", "13002", "44000"],
      timeWindows: AFTERNOON,
    },
    {
      client: "Initech",
      vertical: "health-insurance",
      minAge: 60,
      maxAge: 99,
      dailyCapacity: 4,
      pricePerLead: 14.5,
      isActive: true,
      postalCodes: ["75001", "69001", "59000"],
      timeWindows: MORNING_ONLY,
    },
    {
      client: "Jade Networks",
      vertical: "travel-insurance",
      minAge: 21,
      maxAge: 50,
      dailyCapacity: 11,
      pricePerLead: 8.75,
      isActive: true,
      postalCodes: ["75003", "75011", "13001", "33000", "21000"],
      timeWindows: BUSINESS_HOURS,
    },
  ];

  console.log(`Seeding ${deliveryDefs.length} deliveries...`);
  const deliveryMeta: DeliveryMeta[] = [];
  for (const deliveryDef of deliveryDefs) {
    const client = byClientName(deliveryDef.client);
    const vertical = bySlug(deliveryDef.vertical);

    const delivery = await prisma.delivery.create({
      data: {
        clientId: client.id,
        verticalId: vertical.id,
        minAge: deliveryDef.minAge,
        maxAge: deliveryDef.maxAge,
        dailyCapacity: deliveryDef.dailyCapacity,
        pricePerLead: deliveryDef.pricePerLead,
        isActive: deliveryDef.isActive,
        postalCodes: {
          create: deliveryDef.postalCodes.map((postalCode) => ({
            postalCode,
          })),
        },
        timeWindows: {
          create: deliveryDef.timeWindows,
        },
      },
    });

    deliveryMeta.push({
      id: delivery.id,
      clientId: client.id,
      verticalId: vertical.id,
      verticalSlug: deliveryDef.vertical,
      minAge: deliveryDef.minAge,
      maxAge: deliveryDef.maxAge,
      dailyCapacity: deliveryDef.dailyCapacity,
      pricePerLead: deliveryDef.pricePerLead,
      isActive: deliveryDef.isActive,
      clientIsActive: client.isActive,
      postalCodes: deliveryDef.postalCodes,
      timeWindows: deliveryDef.timeWindows,
    });
  }

  console.log("Generating leads with realistic routing...");

  const days = 30;
  const now = new Date();
  let totalLeads = 0;
  let totalDistributed = 0;
  let totalRejected = 0;

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset -= 1) {
    const dailyCounts = new Map<string, number>();
    for (const delivery of deliveryMeta) {
      dailyCounts.set(delivery.id, 0);
    }

    const leadsPerDay = randomInt(6, 14);

    for (let leadIndex = 0; leadIndex < leadsPerDay; leadIndex += 1) {
      const date = new Date(now);
      date.setDate(date.getDate() - dayOffset);
      const hour = randomItem([
        randomInt(7, 9),
        randomInt(10, 12),
        randomInt(13, 17),
        randomInt(18, 21),
        randomInt(0, 23),
      ]);
      date.setHours(hour, randomInt(0, 59), 0, 0);

      const activeVerticalSlugs = [
        ...new Set(
          deliveryMeta
            .filter(
              (delivery) =>
                delivery.isActive && delivery.clientIsActive
            )
            .map((delivery) => delivery.verticalSlug)
        ),
      ];
      const verticalSlug = randomItem(activeVerticalSlugs);
      const matchingDeliveries = deliveryMeta.filter(
        (delivery) =>
          delivery.verticalSlug === verticalSlug &&
          delivery.isActive &&
          delivery.clientIsActive
      );
      const leadPostalCodes = [
        ...new Set(
          matchingDeliveries.flatMap((delivery) => delivery.postalCodes)
        ),
      ];
      const postalCode =
        Math.random() < 0.85
          ? randomItem(leadPostalCodes)
          : randomItem(POSTAL_CODES);

      const maxEligibleAge = Math.max(
        ...matchingDeliveries.map((delivery) => delivery.maxAge)
      );
      const minEligibleAge = Math.min(
        ...matchingDeliveries.map((delivery) => delivery.minAge)
      );
      const birthDate = randomBirthDate(minEligibleAge, maxEligibleAge, date);

      const vertical = bySlug(verticalSlug);
      const receivedAt = date;

      const eligible = deliveryMeta.filter((delivery) =>
        isDeliveryEligible(
          { birthDate, postalCode, verticalId: vertical.id, receivedAt },
          delivery,
          dailyCounts.get(delivery.id) ?? 0
        )
      );

      const ranked = sortEligibleDeliveries(eligible, dailyCounts);
      const winner = ranked[0] ?? null;

      const lead = await prisma.lead.create({
        data: {
          firstName: randomItem(FIRST_NAMES),
          lastName: randomItem(LAST_NAMES),
          birthDate,
          postalCode,
          verticalId: vertical.id,
          receivedAt,
          status: winner
            ? LeadStatus.DISTRIBUTED
            : LeadStatus.NON_DISTRIBUTED,
        },
      });

      if (winner) {
        await prisma.distribution.create({
          data: {
            leadId: lead.id,
            clientId: winner.clientId,
            deliveryId: winner.id,
            pricePaid: new Prisma.Decimal(winner.pricePerLead),
            distributedAt: receivedAt,
          },
        });
        dailyCounts.set(
          winner.id,
          (dailyCounts.get(winner.id) ?? 0) + 1
        );
        totalDistributed += 1;
      } else {
        totalRejected += 1;
      }

      totalLeads += 1;
    }
  }

  console.log(
    `Seeded ${totalLeads} leads: ${totalDistributed} distributed, ${totalRejected} non-distributed across ${days} days.`
  );
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });