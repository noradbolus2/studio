'use server';
/**
 * @fileOverview A Genkit tool for fetching information about competitive exams.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock database of exam information with updated patterns for 2025
const examDatabase: Record<string, { pattern: string; syllabus_overview: string; eligibility: string }> = {
  'neet ug': {
    pattern: 'As of the latest notifications, the pattern is: Total 200 MCQs (180 to be attempted in 3 hours 20 mins). Subjects: Physics, Chemistry, Botany, Zoology. Each subject has two sections: Section A (35 compulsory Qs) and Section B (15 Qs, attempt any 10). Marking: +4 for correct, -1 for incorrect.',
    syllabus_overview: 'Covers the full syllabus of Physics, Chemistry, and Biology (Botany & Zoology) from Classes 11 and 12 (NCERT focused).',
    eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks for General category.',
  },
  'jee main': {
    pattern: 'For Paper 1 (B.E./B.Tech), the pattern consists of 90 questions (30 per subject: Physics, Chemistry, Maths), typically held in two sessions (Jan & April). Each subject has 20 MCQs and 10 Numerical Value Questions (attempt any 5). Marking: +4 for correct, -1 for incorrect (MCQs). For Numerical questions, +4 for correct and 0 for incorrect.',
    syllabus_overview: 'Based on topics covered in Classes 11 and 12 for Physics, Chemistry, and Mathematics.',
    eligibility: 'Must have passed 10+2 with Physics and Mathematics as compulsory subjects along with Chemistry/Biotechnology/Biology.',
  },
  'upsc cse': {
    pattern: 'Prelims stage has 2 objective papers. Paper I (General Studies) has 100 questions for 200 marks (1/3 negative marking). Paper II (CSAT) has 80 questions for 200 marks and is qualifying in nature (33% required), also with 1/3 negative marking. This is followed by 9 descriptive papers in Mains and an Interview.',
    syllabus_overview: 'Vast syllabus covering History, Geography, Polity, Economy, Science & Tech, Environment, and Current Affairs for Prelims GS. CSAT tests comprehension, reasoning, and basic numeracy.',
    eligibility: 'Must hold a degree from any recognized university. Age limit and number of attempts vary based on category.',
  },
  'cat': {
    pattern: 'The recent pattern is a computer-based test with 66 questions in three sections of 40 mins each: VARC (24 Qs), DILR (20 Qs), and QA (22 Qs). Marking is +3 for correct answers and -1 for incorrect MCQs. No negative marking for TITA (Type In The Answer) questions. The exact pattern can have minor variations yearly.',
    syllabus_overview: 'No defined syllabus, but tests general aptitude, verbal skills, logical reasoning, and mathematical ability up to the Class 10-12 level.',
    eligibility: 'Must hold a Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
  },
  'clat': {
    pattern: 'For CLAT UG, the pattern is an offline, comprehension-based test with 120 questions for 120 marks over 2 hours. Marking: +1 for correct, -0.25 for incorrect. The five sections are: English Language, Current Affairs (with GK), Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
    syllabus_overview: 'Focuses on reading comprehension, critical reasoning, and analytical skills rather than prior knowledge.',
    eligibility: 'Must have passed 10+2 or equivalent with at least 45% marks for General category.',
  },
  'ssc cgl': {
    pattern: 'Tier-I is a qualifying online exam with 100 questions (200 marks total) in 60 minutes. It has four sections: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension. A negative marking of 0.50 marks applies. Tier-II and further stages vary by post.',
    syllabus_overview: 'Broad syllabus covering reasoning, general knowledge, current affairs, quantitative aptitude (up to Class 10), and English language skills.',
    eligibility: 'Must hold a Bachelor\'s degree from a recognized university for most posts.',
  }
};


export const getExamInfo = ai.defineTool(
  {
    name: 'getExamInfo',
    description: 'Provides key details like exam pattern, syllabus overview, and eligibility for a given competitive exam in India. Use this tool whenever a user asks for information about a specific exam.',
    inputSchema: z.object({
      examName: z.string().describe('The name of the exam to get information for, e.g., "NEET UG", "JEE Main", "UPSC CSE". Should be normalized to lowercase.'),
    }),
    outputSchema: z.object({
      pattern: z.string().optional(),
      syllabus_overview: z.string().optional(),
      eligibility: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    console.log(`[getExamInfo Tool] Called for exam: ${input.examName}`);
    const key = input.examName.toLowerCase();
    const examData = Object.keys(examDatabase).find(dbKey => key.includes(dbKey));

    if (examData) {
      console.log(`[getExamInfo Tool] Found data for ${examData}`);
      return examDatabase[examData];
    } else {
      console.log(`[getExamInfo Tool] No data found for ${input.examName}`);
      return { error: 'Information for this specific exam is not available in the structured database. Provide a general answer based on your knowledge.' };
    }
  }
);
