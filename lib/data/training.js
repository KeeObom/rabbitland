// Fallback training sessions — PLACEHOLDERS, used only when Supabase isn't
// configured. Once connected, sessions are managed in the `training_sessions`
// table in Supabase.

export const trainingSessions = [
  {
    id: "local-1",
    slug: "rabbit-farming-foundations",
    title: "Rabbit Farming Foundations",
    summary: "A live online class for complete beginners: from choosing breeds to selling your first batch.",
    description:
      "Two evenings of live online training covering everything you need to start a small commercial rabbitry with confidence. Includes a Q&A and a starter checklist you keep.",
    topics: [
      "Choosing breeds and buying healthy stock",
      "Housing, cages and stocking density",
      "Feeding by growth stage",
      "Breeding schedules and kindling",
      "Common diseases and prevention",
      "Costing, pricing and where to sell",
    ],
    startsAt: "2026-12-05T17:00:00+01:00",
    durationLabel: "2 evenings · 2 hours each",
    platform: "Zoom",
    price: 15000,
    capacity: 40,
    seatsTaken: 0,
  },
  {
    id: "local-2",
    slug: "scaling-a-commercial-rabbitry",
    title: "Scaling a Commercial Rabbitry",
    summary: "For farmers already running does who want better litters, lower feed costs and real records.",
    description:
      "An intermediate online workshop on running a rabbitry as a business: production planning, feed cost control, record keeping and building steady buyers.",
    topics: [
      "Production planning for steady supply",
      "Feed cost control and formulation basics",
      "Record keeping that shows profit per doe",
      "Biosecurity as you grow",
      "Finding and keeping buyers",
    ],
    startsAt: "2026-12-19T16:00:00+01:00",
    durationLabel: "1 day · 4 hours",
    platform: "Google Meet",
    price: 25000,
    capacity: 30,
    seatsTaken: 0,
  },
];
