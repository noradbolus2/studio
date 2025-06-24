
'use server';
/**
 * @fileOverview OSO CodeMate AI Agent to generate and manage app features.
 *
 * - runCodeMate - A function that takes a development instruction and returns a plan.
 * - CodeMateInput - The input type for the runCodeMate function.
 * - CodeMateOutput - The return type for the runCodeMate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeMateInputSchema = z.object({
  instruction: z.string().describe('The feature request or bug fix instruction from the developer.'),
});
export type CodeMateInput = z.infer<typeof CodeMateInputSchema>;

const CodeChangeSchema = z.object({
  filePath: z.string().describe('The full path to the file that needs to be created or modified.'),
  code: z.string().describe('The complete code content for the file.'),
  status: z.enum(['created', 'modified', 'deleted']).describe('The status of the file modification.'),
});

const CodeMateOutputSchema = z.object({
  explanation: z.string().describe("A summary of the changes to be made."),
  codeChanges: z.array(CodeChangeSchema).describe("An array of code changes for different files."),
  firestoreRulesUpdate: z.string().optional().describe("Suggested Firestore security rules updates, if any."),
  testLogs: z.string().describe("Mock test logs simulating a test run on the generated code."),
});
export type CodeMateOutput = z.infer<typeof CodeMateOutputSchema>;

export async function runCodeMate(input: CodeMateInput): Promise<CodeMateOutput> {
  return codeMateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeMatePrompt',
  input: {schema: CodeMateInputSchema},
  output: {schema: CodeMateOutputSchema},
  prompt: `You are CodeMate AI, a self-coding AI agent embedded within the OSO Firebase education app project.
Your purpose is to understand feature requests and generate a complete plan for implementation, including code, testing logs, and security rules.

**Your Core Role:**
When a user gives a feature request (e.g., "Add a 'Cancel Order' button in the vendor app"), you MUST:
1.  **Analyze Request:** Understand the user's intent.
2.  **Read Project Context (Simulated):** Mentally review the existing Firebase project structure. The tech stack is React, Next.js, Tailwind CSS, ShadCN UI components, TypeScript, and Genkit for AI.
3.  **Generate Code:** Write the necessary code for the new feature. This includes UI components (React/TSX), backend logic (Firebase Functions simulated as Genkit flows), etc. The generated code should be complete and ready to be placed in a file.
4.  **Suggest Firestore Rules:** If the feature involves database interaction, suggest necessary updates to Firestore security rules.
5.  **Simulate Testing:** Generate mock test logs as if you ran the new code through the Firebase Emulator Suite. The logs should reflect success or plausible failures.
6.  **Format Output:** Structure your entire response as a single JSON object matching the provided output schema.

**Developer Instruction:**
"{{{instruction}}}"

**Example Output for "Add a dark mode toggle":**
{
  "explanation": "I will add a dark mode toggle button to the main layout. This involves creating a theme provider, updating the tailwind config, and adding a button component to toggle the theme.",
  "codeChanges": [
    {
      "filePath": "src/components/core/ThemeProvider.tsx",
      "code": "/* ... theme provider code here ... */",
      "status": "created"
    },
    {
      "filePath": "src/app/layout.tsx",
      "code": "/* ... layout code wrapped with ThemeProvider ... */",
      "status": "modified"
    }
  ],
  "firestoreRulesUpdate": "No update needed for this feature.",
  "testLogs": "▶️ Starting Firebase Emulator Suite...\\n✅ UI Component Test: DarkModeToggle renders correctly.\\n✅ State Management Test: Theme state toggles between 'light' and 'dark'.\\n✅ LocalStorage Test: Theme preference is saved and retrieved correctly.\\n\\nPASS: All tests completed successfully."
}

Now, generate the plan for the developer's instruction.
`,
});

const codeMateFlow = ai.defineFlow(
  {
    name: 'codeMateFlow',
    inputSchema: CodeMateInputSchema,
    outputSchema: CodeMateOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("CodeMate could not generate a plan for this request. Please try rephrasing.");
    }
    return output;
  }
);
