
'use server';
/**
 * @fileOverview A Genkit tool for fetching information about competitive exams.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock database of exam information with updated patterns for 2025
const examDatabase: Record<string, { pattern: string; syllabus_overview: string; eligibility: string }> = {
  'neet ug': {
    pattern: "The NEET (UG) 2025 exam pattern has reverted to the pre-COVID format, with a total of 180 compulsory questions, eliminating the optional questions from Section B. The exam duration remains 3 hours (180 minutes), and the question paper consists of three sections: Physics, Chemistry, and Biology (Botany and Zoology).\nMode: Offline (Pen and Paper Based Test)\nDuration: 3 hours (180 minutes)\nTotal Questions: 180 (all compulsory)\nSubjects: Physics, Chemistry, and Biology (Botany and Zoology)\nQuestion Type: Multiple Choice Questions (MCQs)\nMarking Scheme: +4 for each correct answer, -1 for each incorrect answer\nSections: Physics and Chemistry each have 45 questions, while Biology has 90 questions (45 from Botany and 45 from Zoology)\nOptional Questions: There are no optional questions; all 180 questions are compulsory.",
    syllabus_overview: 'Covers the full syllabus of Physics, Chemistry, and Biology (Botany & Zoology) from Classes 11 and 12 (NCERT focused).',
    eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks for General category.',
  },
  'jee main': {
    pattern: 'For 2025, the JEE Main Paper 1 (B.E./B.Tech) pattern remains consistent, held online across multiple sessions. It includes 90 questions in total (30 each for Physics, Chemistry, and Mathematics). Each subject is divided into 20 Multiple-Choice Questions (MCQs) and 10 Numerical Value Questions, out of which any 5 must be attempted. Marking scheme: +4 for correct answers, -1 for incorrect answers for both MCQs and the attempted numerical questions. The total marks are 300.',
    syllabus_overview: 'Based on topics covered in Classes 11 and 12 for Physics, Chemistry, and Mathematics.',
    eligibility: 'Must have passed 10+2 with Physics and Mathematics as compulsory subjects along with Chemistry/Biotechnology/Biology.',
  },
  'upsc cse': {
    pattern: 'The UPSC CSE Prelims 2025 pattern continues with two objective papers. Paper I (General Studies) contains 100 questions for a total of 200 marks, with a negative marking of one-third for wrong answers. Paper II (CSAT) is a qualifying paper with 80 questions for 200 marks (also with 1/3rd negative marking), requiring a minimum of 33% to pass. This is followed by the extensive Mains examination and the final Personality Test.',
    syllabus_overview: 'Vast syllabus covering History, Geography, Polity, Economy, Science & Tech, Environment, and Current Affairs for Prelims GS. CSAT tests comprehension, reasoning, and basic numeracy.',
    eligibility: 'Must hold a degree from any recognized university. Age limit and number of attempts vary based on category.',
  },
  'cat': {
    pattern: 'The CAT 2024/2025 pattern is expected to continue as a 2-hour (120 minutes) computer-based test. It comprises 66 questions divided into three 40-minute sections: VARC (Verbal Ability and Reading Comprehension) with 24 questions, DILR (Data Interpretation & Logical Reasoning) with 20 questions, and QA (Quantitative Ability) with 22 questions. The marking scheme is +3 for correct answers and -1 for incorrect MCQs. There is no negative marking for TITA (Type In The Answer) questions.',
    syllabus_overview: 'No defined syllabus, but tests general aptitude, verbal skills, logical reasoning, and mathematical ability up to the Class 10-12 level.',
    eligibility: 'Must hold a Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
  },
  'clat': {
    pattern: 'The CLAT UG 2025 pattern, as per the recent update, is an offline, comprehension-based test featuring 120 questions to be answered in 2 hours (120 minutes). The marking scheme is +1 for a correct answer and a penalty of -0.25 for an incorrect answer. The five sections are: English Language, Current Affairs (including General Knowledge), Legal Reasoning, Logical Reasoning, and Quantitative Techniques, all focusing on passage-based questions.',
    syllabus_overview: 'Focuses on reading comprehension, critical reasoning, and analytical skills rather than prior knowledge.',
    eligibility: 'Must have passed 10+2 or equivalent with at least 45% marks for General category.',
  },
  'ssc cgl': {
    pattern: 'The SSC CGL 2025 Tier-I exam is a qualifying, computer-based test lasting 60 minutes. It includes 100 questions for 200 marks, divided into four sections: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. A negative marking of 0.50 marks is applied for each wrong answer. The Tier-II pattern has been revised and now involves multiple papers with different sections, including computer knowledge tests, depending on the specific post.',
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
