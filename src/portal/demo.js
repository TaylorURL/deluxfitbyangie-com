/*
 * A filled-in account for the dashboard, for the development server alone.
 *
 * The portal reads everything it shows out of a signed-in account, so there is
 * no way to look at the design of it without one. This is the account the
 * design is looked at with: a coaching client three weeks into a plan, with a
 * session booked, a weight trend, targets set and a conversation open. It is
 * reached at `/portal?demo=1`, it is compiled out of a production build, and
 * nothing in it reaches the network.
 */

const DAY = 86400000

const at = (days, hour = 18) => {
  const date = new Date(Date.now() + days * DAY)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const dateKey = days => new Date(Date.now() + days * DAY).toISOString().slice(0, 10)

export const DEMO_USER = { id: 'demo', email: 'maria@example.com' }

export const DEMO_DATA = {
  loading: false,
  previewLevel: null,
  profile: { id: 'demo', role: 'client', full_name: 'Maria Alvarez', email: 'maria@example.com' },
  entitlements: { hasMembership: true, hasCoaching: true },
  plans: [
    {
      id: 'plan-1',
      title: 'Strength Block 2',
      summary:
        'Four sessions a week. Lower body twice, upper body twice, with the loads rising in three waves across the block.',
      content: {
        weeks: [
          { title: 'Week 1: Base, technique and tempo' },
          { title: 'Week 2: Add load, hold the tempo' },
          { title: 'Week 3: Top sets at RPE 8' },
          { title: 'Week 4: Deload' },
          { title: 'Week 5: Wave two, base' },
          { title: 'Week 6: Wave two, load' },
          { title: 'Week 7: Wave two, top sets' },
          { title: 'Week 8: Test week' },
        ],
      },
      created_at: at(-21),
    },
  ],
  progress: [
    {
      id: 'p9',
      entry_date: dateKey(-1),
      weight: 158.2,
      body_fat: 26.1,
      notes: 'Slept well, strong session.',
    },
    { id: 'p8', entry_date: dateKey(-8), weight: 159.0, body_fat: 26.4, notes: null },
    { id: 'p7', entry_date: dateKey(-15), weight: 160.4, body_fat: 26.9, notes: 'Travel week.' },
    { id: 'p6', entry_date: dateKey(-22), weight: 160.1, body_fat: 27.0, notes: null },
    { id: 'p5', entry_date: dateKey(-29), weight: 161.8, body_fat: 27.4, notes: null },
    { id: 'p4', entry_date: dateKey(-36), weight: 162.5, body_fat: 27.8, notes: null },
    { id: 'p3', entry_date: dateKey(-43), weight: 163.0, body_fat: 28.0, notes: null },
    { id: 'p2', entry_date: dateKey(-50), weight: 164.6, body_fat: 28.3, notes: null },
    { id: 'p1', entry_date: dateKey(-57), weight: 165.0, body_fat: 28.5, notes: 'First entry.' },
  ],
  bookings: [
    {
      id: 'b1',
      service: 'live_program',
      slot_start: at(2, 18),
      status: 'confirmed',
      training_focus: 'Lower body',
    },
    {
      id: 'b2',
      service: 'live_program',
      slot_start: at(4, 18),
      status: 'confirmed',
      training_focus: 'Upper body',
    },
    {
      id: 'b3',
      service: 'live_program',
      slot_start: at(-3, 18),
      status: 'confirmed',
      training_focus: 'Full body',
    },
    {
      id: 'b4',
      service: 'single_session',
      slot_start: at(-10, 7),
      status: 'confirmed',
      training_focus: 'Form and technique',
    },
  ],
  messages: [
    {
      id: 'm1',
      sender: 'client',
      body: 'Top set on the squat felt heavy at 135 today, should I hold it next week?',
      created_at: at(-2, 20),
    },
    {
      id: 'm2',
      sender: 'coach',
      body: 'Hold it at 135 for the first two sets and take the third to 140 if the bar speed is there. Film the third set for me.',
      created_at: at(-1, 9),
    },
  ],
  content: [
    {
      id: 'c1',
      title: 'Back squat: bracing and bar path',
      description: 'The setup, the brace and the first rep, slowed down.',
      category: 'workout',
      media_type: 'video',
      access_level: 'membership',
      program: 'Strength Block 2',
      week: 3,
      day: 1,
      url: '#',
    },
    {
      id: 'c2',
      title: 'Romanian deadlift tempo',
      description: 'Three seconds down, one second up.',
      category: 'workout',
      media_type: 'video',
      access_level: 'membership',
      program: 'Strength Block 2',
      week: 3,
      day: 2,
      url: '#',
    },
    {
      id: 'c3',
      title: 'Protein across the day',
      description: 'Why the total matters less than the spread.',
      category: 'nutrition',
      media_type: 'article',
      access_level: 'coaching',
      url: '#',
    },
  ],
  nutrition: {
    calorie_target: 1950,
    protein_g: 150,
    carbs_g: 190,
    fat_g: 65,
    meal_structure: [
      { meal: 'Breakfast', suggestion: 'Eggs, oats and fruit' },
      { meal: 'Lunch', suggestion: 'Chicken, rice and greens' },
      { meal: 'Dinner', suggestion: 'Fish or lean beef with potatoes and vegetables' },
    ],
    resources: [],
    notes: 'Protein first at every meal. Water before coffee.',
  },
  nutritionError: null,
  reloadProgress: async () => {},
  reloadMessages: async () => {},
}
