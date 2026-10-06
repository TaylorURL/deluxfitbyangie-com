/**
 * The macro calculator Angie coaches by: Mifflin-St Jeor for the resting
 * number, an activity multiplier for the day, a goal adjustment on top, then
 * protein by body weight, fat as a share of calories and carbs as the rest.
 *
 * It only ever proposes. The coach panel shows the result to Angie, she keeps
 * or changes it, and the client sees nothing until she publishes it. Anything
 * on the review list below gets no proposal at all, so those numbers start
 * from her rather than from the formula.
 */

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
}

export const GOAL_FACTORS = {
  fat_loss: 0.85,
  maintenance: 1.0,
  muscle_gain: 1.1,
}

const PROTEIN_G_PER_KG = 1.8
const FAT_SHARE = 0.25
const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 }

/** Below this a client is reviewed by hand rather than given numbers. */
export const LOW_BMI = 18.5
/** Under this age a client is reviewed by hand rather than given numbers. */
export const ADULT_AGE = 18

export const LB_PER_KG = 2.2046226218
export const CM_PER_IN = 2.54

export const poundsToKg = pounds => Number(pounds) / LB_PER_KG
export const feetInchesToCm = (feet, inches) =>
  (Number(feet || 0) * 12 + Number(inches || 0)) * CM_PER_IN
export const kgToPounds = kg => Number(kg) * LB_PER_KG
export const cmToFeetInches = cm => {
  const totalInches = Math.round(Number(cm) / CM_PER_IN)
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 }
}

export const bmi = (weightKg, heightCm) => {
  const meters = Number(heightCm) / 100
  return meters > 0 ? Number(weightKg) / (meters * meters) : null
}

/** Mifflin-St Jeor resting energy, in kcal a day. */
export function restingCalories({ sex, age, weightKg, heightCm }) {
  const base = 10 * Number(weightKg) + 6.25 * Number(heightCm) - 5 * Number(age)
  return sex === 'male' ? base + 5 : base - 161
}

/**
 * Why an intake goes to Angie by hand, as a list of reason keys. An empty list
 * means the formula may propose numbers.
 */
export function reviewReasons(intake) {
  const reasons = []
  if (intake.pregnantOrBreastfeeding) reasons.push('pregnancy')
  if (Number(intake.age) < ADULT_AGE) reasons.push('minor')
  const index = bmi(intake.weightKg, intake.heightCm)
  if (index != null && index < LOW_BMI) reasons.push('lowBmi')
  if (String(intake.medicalConditions ?? '').trim()) reasons.push('medical')
  return reasons
}

/**
 * The full working for one intake: the steps, the proposed targets, and the
 * reasons it needs review. `targets` is null whenever `reasons` is not empty.
 */
export function calculateMacros(intake) {
  const reasons = reviewReasons(intake)
  const bmr = restingCalories(intake)
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[intake.activity] ?? ACTIVITY_MULTIPLIERS.sedentary)
  const goalCalories = tdee * (GOAL_FACTORS[intake.goal] ?? 1)
  const index = bmi(intake.weightKg, intake.heightCm)

  if (reasons.length > 0) {
    return { bmi: index, bmr, tdee, reasons, targets: null }
  }

  const calories = Math.round(goalCalories)
  const proteinG = Math.round(Number(intake.weightKg) * PROTEIN_G_PER_KG)
  const fatG = Math.round((calories * FAT_SHARE) / KCAL_PER_G.fat)
  const carbsG = Math.max(
    0,
    Math.round(
      (calories - proteinG * KCAL_PER_G.protein - fatG * KCAL_PER_G.fat) / KCAL_PER_G.carbs
    )
  )

  return {
    bmi: index,
    bmr,
    tdee,
    reasons,
    targets: { calories, proteinG, carbsG, fatG },
  }
}

/** A stored `macro_intakes` row in the shape the calculator reads. */
export const intakeFromRow = row => ({
  sex: row.sex,
  age: Number(row.age),
  weightKg: Number(row.weight_kg),
  heightCm: Number(row.height_cm),
  activity: row.activity,
  goal: row.goal,
  pregnantOrBreastfeeding: Boolean(row.pregnant_or_breastfeeding),
  medicalConditions: row.medical_conditions ?? '',
})
