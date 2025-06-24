'use server';
/**
 * @fileOverview A Genkit tool for fetching information about competitive exams.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock database of exam information with updated patterns for 2025
const examDatabase: Record<string, { pattern: string; syllabus_overview: string; eligibility: string }> = {
  'neet ug': {
    pattern: 'Based on the latest 2025 guidelines, the NEET UG exam consists of 180 questions to be attempted out of a total of 200 questions provided. This structure gives students internal choices. The total time is 3 hours 20 minutes. The breakdown is: Physics, Chemistry, Botany, and Zoology each have two sections. Section A has 35 compulsory questions. Section B has 15 questions, of which students must attempt any 10. This makes for 45 attempted questions per subject. The marking scheme is +4 for a correct answer and -1 for an incorrect answer.',
    syllabus_overview: 'Covers the full syllabus of Physics, Chemistry, and Biology (Botany & Zoology) from Classes 11 and 12 (NCERT focused).',
    eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English. Minimum 50% aggregate marks for General category.',
  },
  'jee main': {
    pattern: 'The 2025 pattern for Paper 1 (B.E./B.Tech) consists of 90 questions (30 each for Physics, Chemistry, Maths), held online in multiple sessions (typically Jan & April). Each subject has 20 MCQs and 10 Numerical Value Questions (attempt any 5). Marking: +4 for correct, -1 for incorrect (for both MCQs and answered Numerical questions). Total Marks: 300.',
    syllabus_overview: 'Based on topics covered in Classes 11 and 12 for Physics, Chemistry, and Mathematics.',
    eligibility: 'Must have passed 10+2 with Physics and Mathematics as compulsory subjects along with Chemistry/Biotechnology/Biology.',
  },
  'upsc cse': {
    pattern: 'The 2025 Prelims pattern has 2 objective papers. Paper I (General Studies) has 100 questions for 200 marks (negative marking of 1/3rd). Paper II (CSAT) has 80 questions for 200 marks and is qualifying with 33% marks (negative marking of 1/3rd). This is followed by 9 descriptive papers in Mains and a final Interview/Personality Test.',
    syllabus_overview: 'Vast syllabus covering History, Geography, Polity, Economy, Science & Tech, Environment, and Current Affairs for Prelims GS. CSAT tests comprehension, reasoning, and basic numeracy.',
    eligibility: 'Must hold a degree from any recognized university. Age limit and number of attempts vary based on category.',
  },
  'cat': {
    pattern: 'The recent pattern for CAT 2024/2025 is a computer-based test with 66 questions over 120 minutes, split into three 40-minute sections: VARC (24 Qs), DILR (20 Qs), and QA (22 Qs). Marking is +3 for correct answers and -1 for incorrect MCQs. No negative marking for TITA (Type In The Answer) questions. The exact pattern can have minor yearly variations, but this structure is stable.',
    syllabus_overview: 'No defined syllabus, but tests general aptitude, verbal skills, logical reasoning, and mathematical ability up to the Class 10-12 level.',
    eligibility: 'Must hold a Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
  },
  'clat': {
    pattern: 'The updated 2025 UG pattern is an offline, comprehension-based test with 120 questions for 120 marks over 2 hours. Marking: +1 for correct, -0.25 for incorrect. The five sections are: English Language, Current Affairs (including General Knowledge), Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
    syllabus_overview: 'Focuses on reading comprehension, critical reasoning, and analytical skills rather than prior knowledge.',
    eligibility: 'Must have passed 10+2 or equivalent with at least 45% marks for General category.',
  },
  'ssc cgl': {
    pattern: 'The 2025 Tier-I is a qualifying online exam with 100 questions (200 marks total) in 60 minutes. It has four sections: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension. A negative marking of 0.50 marks applies. Tier-II pattern was revised and now has multiple papers with different sections and computer knowledge tests, varying by post.',
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
