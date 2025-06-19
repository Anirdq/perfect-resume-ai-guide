
export const generateOptimizedResumeStructure = (originalResume: string, jobDescription: string, aiSuggestions: string[]): string => {
  // This is a template structure that the AI can use to format resumes consistently
  const template = `
[CANDIDATE NAME]
[Phone] | [Email] | [Location] | [LinkedIn] | [Portfolio]

PROFESSIONAL SUMMARY
[2-3 sentences highlighting relevant experience, key skills, and value proposition tailored to the job]

TECHNICAL SKILLS
• Programming Languages: [Relevant languages from job description]
• Frameworks/Libraries: [Relevant frameworks]
• Tools & Technologies: [Relevant tools]
• Other: [Additional relevant skills]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company Name] | [Location] | [Dates]
• [Quantified achievement using action verbs and metrics]
• [Achievement highlighting relevant skills for target role]
• [Achievement demonstrating impact and results]

[Previous Job Title] | [Previous Company] | [Location] | [Dates]
• [Achievement with quantifiable results]
• [Achievement showing progression and growth]

EDUCATION
[Degree] in [Field] | [University] | [Year]
[Relevant coursework, honors, GPA if 3.5+]

PROJECTS
[Project Name] | [Technologies] | [Date]
• [Brief description emphasizing relevant technologies and impact]
• [Key achievement or technology implemented]

CERTIFICATIONS
• [Relevant certification] - [Organization] - [Date]
  `;

  return template;
};

export const formatResumeForATS = (resumeContent: string): string => {
  // Clean up formatting for ATS compatibility
  return resumeContent
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/\t/g, '    ') // Replace tabs with spaces
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
    .trim();
};
