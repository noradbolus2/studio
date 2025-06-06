
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
Consider factors like 12th percentage, JEE rank (if provided), budget, preferred location, and courses.

Student's Profile:
- 12th Percentage: {{{percentage12th}}}%
{{#if jeeRank}}- JEE Rank: {{{jeeRank}}}{{/if}}
- Annual Budget: INR {{{budget}}}
{{#if preferredLocation}}- Preferred Location: {{{preferredLocation}}}{{/if}}
{{#if preferredCourses}}- Preferred Courses: {{#each preferredCourses}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Provide a list of 3-5 college suggestions. For each college, include:
- Name
- Location (City, State)
- Relevant courses offered (matching student's preference if provided, otherwise general good courses)
- Estimated Annual Fee (as a range, e.g., "INR 1,00,000 - 1,50,000")
- Admission Chance (High, Medium, Low, Very Low) - Be realistic based on the inputs.
- Brief remarks (optional, e.g., "Good for CSE", "Emerging institute").

IMPORTANT: The final output MUST be a JSON object matching the CollegePredictorOutputSchema.
Include a disclaimer: "These suggestions are AI-generated and for informational purposes only. Please verify all details with official college sources."

Example of a single college object in the suggestions array:
{
  "name": "Example Engineering College",
  "location": "Pune, Maharashtra",
  "coursesOffered": ["Computer Science", "Electronics Engineering"],
  "estimatedAnnualFee": "INR 1,20,000 - 1,80,000",
  "admissionChance": "Medium",
  "remarks": "Known for good placements in IT."
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

