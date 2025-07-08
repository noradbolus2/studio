
'use server';
/**
 * @fileOverview A Genkit tool for fetching information about competitive exams.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock database of exam information with updated patterns for 2025
const examDatabase: Record<string, { pattern: string; syllabus_overview: string; eligibility: string }> = {
  'neet ug': {
    pattern: "For 2025, the NEET (UG) exam features a total of 180 compulsory multiple-choice questions from Physics, Chemistry, and Biology (Botany & Zoology). The total marks are 720, and the duration is 3 hours and 20 minutes. Each subject (Physics, Chemistry, Botany, Zoology) has 45 questions. The marking scheme is +4 for a correct answer and -1 for an incorrect answer.",
    syllabus_overview: 'Covers the full syllabus of Physics, Chemistry, and Biology (Botany & Zoology) from Classes 11 and 12 (NCERT focused).',
    eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks for General category.',
  },
  'jee main': {
    pattern: 'For 2025, the JEE Main Paper 1 (B.E./B.Tech) pattern is held online across multiple sessions. It includes 90 questions in total (30 each for Physics, Chemistry, and Mathematics). Each subject is divided into 20 Multiple-Choice Questions (MCQs) and 10 Numerical Value Questions, out of which any 5 must be attempted. Marking scheme: +4 for correct, -1 for incorrect. The total marks are 300.',
    syllabus_overview: 'Based on topics covered in Classes 11 and 12 for Physics, Chemistry, and Mathematics.',
    eligibility: 'Must have passed 10+2 with Physics and Mathematics as compulsory subjects along with Chemistry/Biotechnology/Biology.',
  },
  'upsc cse': {
    pattern: 'The UPSC CSE Prelims 2025 pattern has two objective papers. Paper I (General Studies) has 100 questions for 200 marks (negative marking of 1/3rd). Paper II (CSAT) is a qualifying paper with 80 questions for 200 marks (also with 1/3rd negative marking), requiring 33% to pass. This is followed by the Mains examination and Personality Test.',
    syllabus_overview: 'Vast syllabus covering History, Geography, Polity, Economy, Science & Tech, Environment, and Current Affairs for Prelims GS. CSAT tests comprehension, reasoning, and numeracy.',
    eligibility: 'Must hold a degree from any recognized university. Age limit and number of attempts vary based on category.',
  },
  'cat': {
    pattern: 'The CAT 2024/2025 pattern is a 2-hour (120 minutes) computer-based test with 66 questions. It is divided into three 40-minute sections: VARC (24 questions), DILR (20 questions), and QA (22 questions). The marking scheme is +3 for correct answers and -1 for incorrect MCQs. No negative marking for TITA questions.',
    syllabus_overview: 'Tests general aptitude, verbal skills, logical reasoning, and mathematical ability up to the Class 10-12 level. There is no defined syllabus.',
    eligibility: 'Must hold a Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
  },
  'clat': {
    pattern: 'The CLAT UG 2025 pattern is an offline, comprehension-based test with 120 questions to be answered in 2 hours (120 minutes). The marking scheme is +1 for a correct answer and a penalty of -0.25 for an incorrect answer. The five sections are: English Language, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
    syllabus_overview: 'Focuses on reading comprehension, critical reasoning, and analytical skills rather than prior knowledge.',
    eligibility: 'Must have passed 10+2 or equivalent with at least 45% marks for General category.',
  },
  'ssc cgl': {
    pattern: 'The SSC CGL 2025 Tier-I exam is a qualifying, 60-minute computer-based test. It has 100 questions for 200 marks from four sections: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. Negative marking of 0.50 marks for each wrong answer. Tier-II has multiple papers for different posts.',
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
