
'use server';
/**
 * @fileOverview AI-powered college prediction flow.
 *
 * - predictColleges - A function that suggests colleges based on student inputs.
 * - CollegePredictorInput - The input type for the predictColleges function.
 * - CollegePredictorOutput - The return type for the predictColleges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollegePredictorInputSchema = z.object({
  percentage12th: z.number().min(0).max(100).describe('Percentage marks obtained in 12th standard/grade.'),
  jeeRank: z.number().min(0).optional().describe('JEE (Joint Entrance Examination) rank, if applicable.'),
  budget: z.number().min(0).describe('Approximate annual budget for college fees in INR.'),
  preferredLocation: z.string().optional().describe('Preferred city or state for college.'),
  preferredCourses: z.array(z.string()).optional().describe('List of preferred courses (e.g., Computer Science, Mechanical Engineering).')
});
export type CollegePredictorInput = z.infer<typeof CollegePredictorInputSchema>;

const CollegeSchema = z.object({
  name: z.string().describe('Name of the college/university.'),
  location: z.string().describe('City and State of the college.'),
  coursesOffered: z.array(z.string()).describe('Relevant courses offered that match preferences.'),
  estimatedAnnualFee: z.string().describe('Estimated annual fee range in INR (e.g., "INR 1,50,000 - 2,00,000").'),
  admissionChance: z.enum(["High", "Medium", "Low", "Very Low"]).describe('Likelihood of admission based on provided data.'),
  remarks: z.string().optional().describe('Brief remarks or highlights about the college.'),
});

const CollegePredictorOutputSchema = z.object({
  suggestions: z.array(CollegeSchema).describe('A list of suggested colleges.'),
  disclaimer: z.string().describe('A disclaimer stating that suggestions are AI-generated and for informational purposes only.'),
});
export type CollegePredictorOutput = z.infer<typeof CollegePredictorOutputSchema>;

export async function predictColleges(input: CollegePredictorInput): Promise<CollegePredictorOutput> {
  return collegePredictorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'collegePredictorPrompt',
  input: {schema: CollegePredictorInputSchema},
  output: {schema: CollegePredictorOutputSchema},
  prompt: `You are an expert AI college admission counselor for students in India.
Your goal is to provide realistic and helpful college suggestions based on the student's academic profile, budget, and preferences.

**CRITICAL ADMISSION LOGIC:**
1.  **Entrance Exams are Key:** You MUST understand that for most professional courses in India (like Engineering, Medical), admission is primarily based on national or state-level entrance exams, not just 12th percentage.
2.  **Medical (MBBS/BDS):** If the user's preferred course is "MBBS", "BDS", or medical, admission to Indian colleges is **impossible** without a good NEET score. Since the user hasn't provided a NEET score, you should not suggest Indian medical colleges. Instead, you can suggest colleges abroad (e.g., in Russia, Georgia, Bangladesh) that are popular among Indian students, but you must clearly state in the remarks why you are suggesting foreign universities (e.g., "Suggested as no NEET score was provided, which is mandatory for Indian medical colleges.").
3.  **Engineering (B.Tech/B.E.):** For engineering courses, a JEE rank is crucial for top colleges (NITs, IIITs). If the \`jeeRank\` is not provided, you should focus on state-level universities or private colleges which may have their own entrance exams (like VITEEE, SRMJEEE) or accept students based on 12th marks. Your remarks for these colleges MUST mention the required entrance exam (e.g., "Admission through state's CET" or "Considers 12th marks for admission").
4.  **Other Courses:** For courses like B.Com, B.A., etc., admission is often based on 12th marks or university-specific tests like CUET. Factor this into your suggestions.

Student's Profile:
- 12th Percentage: {{{percentage12th}}}%
{{#if jeeRank}}- JEE Rank: {{{jeeRank}}}{{/if}}
- Annual Budget: INR {{{budget}}}
{{#if preferredLocation}}- Preferred Location: {{{preferredLocation}}}{{/if}}
{{#if preferredCourses}}- Preferred Courses: {{#each preferredCourses}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Based on the profile and the critical logic above, provide a list of 3-5 college suggestions. For each college, include:
- Name
- Location (City, State)
- Relevant courses offered (matching student's preference if provided, otherwise general good courses)
- Estimated Annual Fee (as a range, e.g., "INR 1,00,000 - 1,50,000")
- Admission Chance (High, Medium, Low, Very Low) - Be realistic. For Indian medical colleges, chance is "Very Low" without a NEET score.
- Brief remarks (IMPORTANT: Explain the admission criteria, e.g., "Requires NEET score", "Admission via VITEEE", "Considers 12th marks").

IMPORTANT: The final output MUST be a JSON object matching the CollegePredictorOutputSchema.
Include a disclaimer: "These suggestions are AI-generated and for informational purposes only. Please verify all details with official college sources."

Example of a single college object in the suggestions array:
{
  "name": "Vellore Institute of Technology (VIT)",
  "location": "Vellore, Tamil Nadu",
  "coursesOffered": ["Computer Science", "Electronics Engineering", "Mechanical Engineering"],
  "estimatedAnnualFee": "INR 2,00,000 - 4,00,000",
  "admissionChance": "Medium",
  "remarks": "Admission is through the VITEEE entrance exam, 12th percentage is mainly for eligibility."
}

Generate the suggestions now.
`,
});

const collegePredictorFlow = ai.defineFlow(
  {
    name: 'collegePredictorFlow',
    inputSchema: CollegePredictorInputSchema,
    outputSchema: CollegePredictorOutputSchema,
  },
  async (input) => {
    // Potentially, you could add logic here to fetch real-time data from a database of colleges
    // to augment or verify the AI's suggestions if you had such a database.
    // For now, we rely purely on the LLM's knowledge and the provided prompt structure.

    const {output} = await prompt(input);

    if (!output) {
      return {
        suggestions: [],
        disclaimer: "Could not generate suggestions at this time. The AI might be unavailable or the request was unclear. Please try again."
      };
    }
    // Ensure disclaimer is always present
    if (!output.disclaimer) {
        output.disclaimer = "These suggestions are AI-generated and for informational purposes only. Please verify all details with official college sources.";
    }

    return output;
  }
);
