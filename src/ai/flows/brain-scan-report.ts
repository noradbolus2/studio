
'use server';

/**
 * @fileOverview OSO Brain Scan feature to assess clarity, attention span, and stress level.
 *
 * - generateBrainFitnessReport - A function that generates the brain fitness report.
 * - BrainScanInput - The input type for the generateBrainFitnessReport function.
 * - BrainScanOutput - The return type for the generateBrainFitnessReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainScanInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  clarityScore: z.number().min(0).max(100).describe('Student clarity score (0-100). A high score means the student feels clear and understands concepts well.'),
  attentionSpanScore: z.number().min(0).max(100).describe('Student attention span or focus score (0-100). A high score indicates good concentration.'),
  stressLevelScore: z.number().min(0).max(100).describe('Student stress level score (0-100). A high score indicates high stress levels.'),
  studyHours: z.number().describe('Number of hours spent studying per week.'),
  sleepHours: z.number().describe('Number of hours spent sleeping per night.'),
});
export type BrainScanInput = z.infer<typeof BrainScanInputSchema>;

const BrainScanOutputSchema = z.object({
  brainFitnessScore: z.number().min(0).max(100).describe("A single, overall 'Brain Fitness Score' calculated from the inputs. A higher score is better. It should be a weighted average where stress has a negative impact."),
  reportSummary: z.string().describe('A personalized, encouraging summary of the brain fitness report in a friendly, mentor-like tone. Mention the key findings in a positive light.'),
  recommendations: z.array(z.object({
    id: z.string(),
    textEn: z.string(),
    textHi: z.string(),
  })).length(3).describe('An array of exactly 3 personalized, actionable recommendations for the student in English and Hindi. Base them on the lowest scores. For example, if stress is high, suggest a relaxation technique. If study hours are low, suggest a planning method.'),
  dailyMotivationEn: z.string().describe("A short, punchy motivational line in English."),
  dailyMotivationHi: z.string().describe("The same motivational line translated into simple Hindi."),
});
export type BrainScanOutput = z.infer<typeof BrainScanOutputSchema>;

export async function generateBrainFitnessReport(input: BrainScanInput): Promise<BrainScanOutput> {
  return brainScanFlow(input);
}

const brainScanPrompt = ai.definePrompt({
  name: 'brainScanPrompt',
  input: {schema: BrainScanInputSchema},
  output: {schema: BrainScanOutputSchema},
  prompt: `You are an expert AI performance coach for students.
  
  Your task is to analyze a student's self-reported data and generate a comprehensive, encouraging, and actionable "Brain Fitness Report".

  **Student's Data:**
  - Name: {{{studentName}}}
  - Clarity Score: {{{clarityScore}}}/100 (How well they understand topics)
  - Attention/Focus Score: {{{attentionSpanScore}}}/100 (How well they can concentrate)
  - Stress Level: {{{stressLevelScore}}}/100 (0 is low stress, 100 is high stress)
  - Weekly Study Hours: {{{studyHours}}}
  - Nightly Sleep Hours: {{{sleepHours}}}

  **Your Generation Steps:**
  1.  **Calculate Brain Fitness Score:** Compute a single 'brainFitnessScore' out of 100. This should be a weighted average. Give positive weight to Clarity and Attention, and negative weight to Stress. For example, you can use a formula like: \`(clarityScore * 0.4) + (attentionSpanScore * 0.4) + ((100 - stressLevelScore) * 0.2)\`.
  2.  **Write Report Summary:** Create a personalized, encouraging summary (2-3 sentences). Start by addressing the student. Highlight their strengths first (the highest scores) before gently mentioning areas for improvement (the lowest scores). The tone should be like a supportive mentor.
  3.  **Generate Recommendations:** Provide exactly 3 actionable, simple recommendations. Each recommendation should have an English ('textEn') and a simple Hindi ('textHi') version.
      *   If stress is the highest score (>60), the top recommendation MUST be about stress management (e.g., "Try a 5-minute mindfulness exercise before studying.").
      *   If attention is the lowest score (<50), a recommendation should be about focus (e.g., "Use the Pomodoro Technique: 25 mins study, 5 mins break.").
      *   If study hours are low (<20) and scores are low, suggest a planning technique.
      *   If sleep is low (<7), a recommendation MUST be about improving sleep hygiene.
  4.  **Create Daily Motivation:** Write one short, punchy, motivational line in English ('dailyMotivationEn') and its simple Hindi translation ('dailyMotivationHi').

  Format your entire output as a single JSON object matching the provided schema.
  `,
});

const brainScanFlow = ai.defineFlow(
  {
    name: 'brainScanFlow',
    inputSchema: BrainScanInputSchema,
    outputSchema: BrainScanOutputSchema,
  },
  async input => {
    const {output} = await brainScanPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate a brain scan report.");
    }
    return output;
  }
);

    