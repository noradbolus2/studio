
'use server';
/**
 * @fileOverview AI flow to generate an exam-style test series.
 *
 * - generateExamTest - A function that generates a list of questions for a given exam type/subject.
 * - GenerateExamTestInput - The input type for the function.
 * - GenerateExamTestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The main text of the question. Any chemical formulas, reactions, or logical symbols must be represented in plain text (e.g., CH3-CH2-OH, A + B -> C, p AND q). No LaTeX or special formatting.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four distinct answer options, each as a plain text string. Chemical formulas or logical symbols within options must also be plain text.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('A brief explanation for the correct answer.'),
});

const GenerateExamTestInputSchema = z.object({
  examNameOrType: z.string().describe('The name or type of the exam (e.g., "NEET UG", "JEE Main Physics", "Class 10 Science Prelim", "UPSC CSE Prelims GS Paper 1", "NEET SS Cardiology").'),
  subject: z.string().optional().describe('Specific subject for the test, if applicable (e.g., "Physics", "Organic Chemistry", "Indian Polity", "Cardiology").'),
  numQuestions: z.number().min(3).max(200).default(10).describe('The desired number of questions. For major exams, the AI will attempt to generate the standard number of questions for a full test unless a specific (lower) number is requested here.'),
});
export type GenerateExamTestInput = z.infer<typeof GenerateExamTestInputSchema>;

const GenerateExamTestOutputSchema = z.object({
  testTitle: z.string().describe('A suitable title for the generated test (e.g., "NEET UG Physics Mini Mock Test", "JEE Main Full Syllabus Mock Test - Paper 1", "NEET SS Cardiology Mock Test"). This title MUST be generated and included.'),
  questions: z.array(QuestionSchema).describe('An array of generated questions.'),
});
export type GenerateExamTestOutput = z.infer<typeof GenerateExamTestOutputSchema>;

export async function generateExamTest(input: GenerateExamTestInput): Promise<GenerateExamTestOutput> {
  return generateExamTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamTestPrompt',
  input: {schema: GenerateExamTestInputSchema},
  output: {schema: GenerateExamTestOutputSchema},
  prompt: `You are an expert AI Test Generator for Indian students, creating exam-style mock tests.
Your task is to create a test based on the provided exam name/type, subject (if any), and number of questions.
The generated test MUST have a 'testTitle' and a 'questions' array.

CRITICAL INSTRUCTIONS FOR QUESTION QUALITY & EXAM PATTERN (100% ACCURACY REQUIRED):
1.  **Syllabus, Pattern, and Difficulty:** The questions MUST be 100% based on the typical syllabus, question types, marking scheme (implicitly, by ensuring correct answer types), and **difficulty pattern** of the specified exam, reflecting the LATEST known patterns.
2.  **Previous Year Questions (PYQs) Style:** Model questions VERY CLOSELY on the style, difficulty, and topics covered in Previous Year Questions (PYQs) for the specified exam.
    *   Include variations of PYQ-style questions where data/values are changed but the concept and difficulty are identical.
    *   Include some questions that are extremely similar in structure and concept to those found in PYQs.
3.  **Specialized and Super-Specialty Exams (CRITICAL FOR ACCURACY & COMPLEXITY):**
    *   If 'examNameOrType' indicates a highly specialized postgraduate or super-specialty exam (e.g., "NEET SS Cardiology", "NEET SS Oncology", "UPSC CSE Mains Optional Paper - History", "GATE Computer Science - Advanced Algorithms"), the generated questions MUST be of an **EXPERT, SUPER-SPECIALIST DIFFICULTY LEVEL.**
    *   **VERY IMPORTANT: These questions should be LENGTHY and TOUGH.** They often involve **long clinical vignettes**, detailed case scenarios, and may require interpretation of multiple data points (e.g., lab values, imaging findings described in text, ECG interpretations described in text). The cognitive demand should be high, requiring **analytical skills, differential diagnosis, and application of advanced clinical knowledge**, not just factual recall.
    *   **AVOID GENERAL KNOWLEDGE OR FOUNDATIONAL QUESTIONS.** For example:
        *   If "NEET SS Cardiology", questions must be on advanced cardiology topics (e.g., complex interventional procedures, rare cardiomyopathies, advanced electrophysiology, interpretation of complex echocardiograms, latest trial data in cardiology, management of complex arrhythmias, advanced heart failure therapies). DO NOT ask general medicine, MBBS-level physiology, or basic ECG interpretation questions that a general physician might answer. The questions should challenge a *practicing cardiologist or someone completing their DM/MCh in Cardiology*. A typical question would present a detailed patient case with multiple clinical parameters and ask for the most appropriate next step in management or a complex diagnostic conclusion.
        *   If "UPSC CSE Mains Optional - History", questions must require deep analytical and historical interpretation skills on niche topics within the optional syllabus, not just factual recall suitable for GS Paper 1.
    *   The question style, cognitive demand, and specific topics must mirror those found in *actual Previous Year Questions (PYQs)* for that specific super-specialty exam.
    *   The level of detail and nuance expected in the questions and their correct answers should be appropriate for an expert in that specific field.
4.  **Exam-Specific Question Counts & Subject Distribution (Override \`numQuestions\` if necessary for full mocks):**
    *   If 'examNameOrType' indicates a major standardized exam, you MUST attempt to generate the standard number of questions for a full test of that exam/section, and try to maintain subject distribution (if applicable and no specific subject is requested for a sub-part). This takes precedence over \`numQuestions\` unless \`numQuestions\` is very small (e.g., < 10, indicating a mini-sample).
        *   **NEET UG**: 200 questions total (Physics: 50, Chemistry: 50, Botany: 50, Zoology: 50). If 'subject' is specified (e.g., "NEET UG Physics"), generate 50 questions for that subject.
        *   **JEE Main**: 90 questions total (Physics: 30, Chemistry: 30, Maths: 30). If 'subject' is specified (e.g., "JEE Main Chemistry"), generate 30 questions for that subject.
        *   **JEE Advanced**: Typically two papers, each with around 54-60 questions (e.g., 18 Physics, 18 Chemistry, 18 Maths per paper). If "JEE Advanced" is specified without a paper, generate for one paper (e.g., 54 questions total, distributed).
        *   **UPSC CSE Prelims GS Paper 1**: 100 questions.
        *   **NEET SS (e.g., "NEET SS Cardiology", "NEET SS Neurology")**: Typically 100-150 questions. Aim for 100 questions if not otherwise specified by \`numQuestions\` for a full mock. If \`numQuestions\` is specified and is reasonably large (e.g., >50), adhere to it, otherwise aim for 100 for a full mock.
        *   **CAT VARC Section**: 24 questions. **CAT DILR Section**: 20 questions. **CAT QA Section**: 22 questions.
    *   If \`numQuestions\` is provided for these major exams and is *higher* than the standard for a specific part (e.g., requesting 60 physics questions for NEET UG), you can generate up to the requested 'numQuestions' if it makes sense for a practice test, but maintain the exam's difficulty and style.
    *   For other exams or general requests (e.g., "Class 10 Science Prelim", "Physics Practice Test"), or if \`numQuestions\` is for a non-standardized test, adhere to \`numQuestions\` (up to a maximum of 200 questions).
5.  **Answer Options:** Ensure each question has exactly four distinct multiple-choice options.
6.  **Explanation:** Provide a brief, accurate explanation for the correct answer.
7.  **Test Title:** The 'testTitle' field in the output JSON MUST be accurately generated to reflect the exam name/type, subject (if any), and whether it's a full mock or a sample. E.g., "NEET UG Full Syllabus Mock Test - Set 1", "JEE Main Physics Practice Test (30 Questions)".

CONTENT FORMATTING:
- For any chemical formulas, reactions, or logical symbols (like ->, <->, AND, OR, NOT, ~), use only plain text characters. For example, represent 'CH3CH2OH' as is, use '->' for reaction arrows, and 'p AND q' for logical 'p and q'.
- DO NOT use LaTeX, MathML, or any special math/chemical formatting (e.g., avoid '$...$', '\\xrightarrow', '\\frac', superscripts/subscripts that are not standard characters like ² or ₃ if possible. Prefer linear formulas like H2O, CO2).
- All question text and options must be plain text strings suitable for direct display in HTML.
- Each answer option in the 'options' array MUST be a distinct, separate string. Ensure there are exactly four options.

REQUEST DETAILS:
Exam Name/Type: {{{examNameOrType}}}
{{#if subject}}Subject: {{{subject}}}{{/if}}
Requested Number of Questions (Consider this alongside exam patterns): {{{numQuestions}}}

Generate the test title and the array of questions.
Your output MUST be a JSON object matching the GenerateExamTestOutputSchema.

EXAMPLE FULL OUTPUT FORMAT (Illustrative - content will vary based on request):
{
  "testTitle": "NEET UG Full Syllabus Mock Test (Sample)",
  "questions": [
    {
      "questionText": "A 65-year-old male with a history of hypertension and smoking presents with acute onset severe tearing chest pain radiating to the back. On examination, BP is 190/110 mmHg in the right arm and 150/80 mmHg in the left arm. A diastolic murmur is heard at the right sternal border. Chest X-ray shows a widened mediastinum. What is the most likely diagnosis?",
      "options": [
        "Acute Myocardial Infarction",
        "Aortic Dissection",
        "Pulmonary Embolism",
        "Pericarditis"
      ],
      "correctAnswerIndex": 1,
      "explanation": "The presentation of tearing chest pain radiating to the back, differential blood pressure in arms, history of hypertension, and widened mediastinum are classic signs of aortic dissection."
    },
    {
      "questionText": "What is the number of significant figures in 0.002030?",
      "options": ["3", "4", "5", "7"],
      "correctAnswerIndex": 1,
      "explanation": "Leading zeros are not significant. Trailing zeros in the decimal part are significant. So, 2, 0, 3, 0 are significant. There are 4 significant figures."
    }
    // ... more questions based on the exam pattern and numQuestions
  ]
}

Generate the test now, strictly adhering to all instructions, especially regarding exam patterns and question counts.
`,
});

const generateExamTestFlow = ai.defineFlow(
  {
    name: 'generateExamTestFlow',
    inputSchema: GenerateExamTestInputSchema,
    outputSchema: GenerateExamTestOutputSchema,
  },
  async (input) => {
    console.log(`[Genkit Flow - generateExamTestFlow] Starting test generation for: ${input.examNameOrType}, Subject: ${input.subject || 'N/A'}, Requested Qs: ${input.numQuestions}`);
    const {output} = await prompt(input);
    if (!output) {
        console.error("[Genkit Flow - generateExamTestFlow] AI failed to generate the test. Output was null.");
        throw new Error("AI failed to generate the test. Output was null.");
    }
    // Basic validation: Ensure questions array is present and testTitle is present.
    if (!output.testTitle || !Array.isArray(output.questions)) {
        console.error("[Genkit Flow - generateExamTestFlow] AI response missing testTitle or questions array. Output:", JSON.stringify(output));
        throw new Error("AI response did not contain a valid test title or questions array.");
    }
    console.log(`[Genkit Flow - generateExamTestFlow] Test Generation Success: Requested approx ${input.numQuestions} for ${input.examNameOrType} (Subject: ${input.subject || 'N/A'}). AI generated a test titled "${output.testTitle}" with ${output.questions.length} questions.`);
    return output;
  }
);

    

