'use server';
/**
 * @fileOverview An AI agent that simulates fetching PR & Brand Reputation data.
 *
 * - getPrBrandReputationData - A function that returns simulated brand reputation metrics.
 * - PrBrandReputationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrBrandReputationOutputSchema = z.object({
  socialSentiment: z.object({
    score: z.string().describe("A sentiment score out of 10, e.g., '8.7/10'."),
    positiveMentions: z.number().describe("The number of positive social media mentions."),
    negativeMentions: z.number().describe("The number of negative social media mentions."),
  }),
  flaggedReviews: z.array(z.object({
    id: z.string().describe("A unique ID for the review."),
    source: z.enum(["Play Store", "App Store", "Twitter", "Facebook"]).describe("The source of the review."),
    rating: z.number().min(1).max(5).describe("The star rating given."),
    comment: z.string().describe("The user's comment. Should be concise and represent a potential issue."),
  })).length(2, "Generate exactly 2 flagged reviews.").describe("A list of negative reviews that need attention."),
  newsMentions: z.array(z.object({
    id: z.string().describe("A unique ID for the news mention."),
    source: z.string().describe("The news publication or source."),
    headline: z.string().describe("The headline of the news article."),
  })).length(2, "Generate exactly 2 news mentions.").describe("Recent positive news mentions."),
  founderQuotes: z.array(z.object({
      id: z.string(),
      quote: z.string().describe("A short, impactful quote attributed to the founder."),
      source: z.string().describe("The publication or event where the quote appeared.")
  })).length(2, "Generate exactly 2 founder quotes.").describe("Recent quotes from the founder in the media."),
  viralVideos: z.array(z.object({
      id: z.string(),
      title: z.string().describe("The title of the viral video."),
      platform: z.enum(["YouTube", "Instagram Reels", "TikTok"]).describe("The video platform."),
      views: z.string().describe("The number of views, e.g., '1.2M' or '500k'."),
      url: z.string().url().describe("A placeholder URL for the video.")
  })).length(2, "Generate exactly 2 viral videos.").describe("Trending videos related to the company.")
});
export type PrBrandReputationOutput = z.infer<typeof PrBrandReputationOutputSchema>;

export async function getPrBrandReputationData(): Promise<PrBrandReputationOutput> {
  return prBrandReputationFlow();
}

const prompt = ai.definePrompt({
  name: 'prBrandReputationPrompt',
  output: {schema: PrBrandReputationOutputSchema},
  prompt: `You are an AI that monitors brand reputation for a fictional Indian Ed-Tech company called "OSO App".
Your task is to generate a realistic but fictional summary of the current brand reputation metrics.
The company is doing well but has some minor issues to address.

Generate data for the following fields, adhering strictly to the JSON output schema:
- socialSentiment: Generate a positive score, with a realistic number of positive and negative mentions.
- flaggedReviews: Create two distinct, plausible negative reviews from different app stores or social media.
- newsMentions: Create two positive headlines from well-known tech or business publications about OSO App.
- founderQuotes: Create two inspiring but plausible quotes from the founder.
- viralVideos: Create two trending videos about OSO App on different platforms.
`,
});

const prBrandReputationFlow = ai.defineFlow(
  {
    name: 'prBrandReputationFlow',
    outputSchema: PrBrandReputationOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    if (!output) {
      throw new Error("The AI failed to generate PR & Brand reputation data.");
    }
    return output;
  }
);
