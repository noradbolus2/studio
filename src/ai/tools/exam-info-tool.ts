'use server';
/**
 * @fileOverview A Genkit tool for fetching information about competitive exams.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock database of exam information
const examDatabase: Record<string, { pattern: string; syllabus_overview: string; eligibility: string }> = {
  'neet ug': {
    pattern: 'Total 200 MCQs (180 to be attempted). Physics: 50 Qs, Chemistry: 50 Qs, Botany: 50 Qs, Zoology: 50 Qs. Marking: +4 for correct, -1 for incorrect.',
    syllabus_overview: 'Covers the full syllabus of Physics, Chemistry, and Biology (Botany & Zoology) from Classes 11 and 12 (NCERT focused).',
    eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks for General category.',
  },
  'jee main': {
    pattern: 'Two papers. Paper 1 (B.E./B.Tech) has MCQs and Numerical Value Questions in Physics, Chemistry, and Maths. Total 90 questions (30 per subject). Marking: +4 for correct, -1 for incorrect MCQs.',
    syllabus_overview: 'Based on topics covered in Classes 11 and 12 for Physics, Chemistry, and Mathematics.',
    eligibility: 'Must have passed 10+2 with Physics and Mathematics as compulsory subjects along with Chemistry/Biotechnology/Biology.',
  },
  'upsc cse': {
    pattern: 'Three stages: Prelims (2 objective papers - GS & CSAT), Mains (9 descriptive papers), and Interview. Prelims GS Paper 1 has 100 questions for 200 marks.',
    syllabus_overview: 'Vast syllabus covering History, Geography, Polity, Economy, Science & Tech, Environment, and Current Affairs for Prelims GS. CSAT is a qualifying paper.',
    eligibility: 'Must hold a degree from any recognized university. Age limit and number of attempts vary based on category.',
  },
  'cat': {
    pattern: 'Computer-based test with three sections: Verbal Ability and Reading Comprehension (VARC), Data Interpretation and Logical Reasoning (DILR), and Quantitative Ability (QA). Total 66 questions.',
    syllabus_overview: 'No defined syllabus, but tests general aptitude, verbal skills, logical reasoning, and mathematical ability up to the Class 10 level.',
    eligibility: 'Must hold a Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
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
