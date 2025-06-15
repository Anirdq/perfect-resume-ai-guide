
import OpenAI from 'openai';

interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
}

interface ResumeAnalysis {
  atsScore: number;
  keywordMatches: KeywordMatch[];
  suggestions: string[];
}

export class AIResumeService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async analyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI API key not provided');
    }

    try {
      // Extract keywords and analyze match
      const keywordAnalysis = await this.extractKeywords(jobDescription, resume);
      
      // Get optimization suggestions
      const suggestions = await this.getOptimizationSuggestions(resume, jobDescription);
      
      // Calculate ATS score based on keyword matches and other factors
      const atsScore = this.calculateATSScore(keywordAnalysis, resume, jobDescription);

      return {
        atsScore,
        keywordMatches: keywordAnalysis,
        suggestions
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error('Failed to analyze resume with AI');
    }
  }

  async optimizeResume(resume: string, jobDescription: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not provided');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert resume writer and ATS optimization specialist. Your task is to optimize resumes to match job descriptions while maintaining truthfulness and the candidate's authentic experience. 

Guidelines:
- Incorporate relevant keywords from the job description naturally
- Enhance existing experience descriptions with stronger action verbs
- Quantify achievements where possible
- Maintain the original structure and format
- Keep all information truthful and based on the original resume
- Focus on ATS optimization and keyword matching`
          },
          {
            role: "user",
            content: `Please optimize this resume for the following job description. Only enhance and reframe existing information - do not add false information.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please provide the optimized resume:`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content || resume;
    } catch (error) {
      console.error('Resume optimization error:', error);
      throw new Error('Failed to optimize resume with AI');
    }
  }

  private async extractKeywords(jobDescription: string, resume: string): Promise<KeywordMatch[]> {
    const response = await this.openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a keyword extraction specialist for ATS optimization. Extract the most important keywords and skills from job descriptions and check if they appear in resumes."
        },
        {
          role: "user",
          content: `Extract the top 10 most important keywords/skills from this job description and check if they appear in the resume. Classify each keyword's importance as high, medium, or low.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

Return a JSON array of objects with this format:
[{"keyword": "JavaScript", "found": true, "importance": "high"}]`
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Keyword extraction parsing error:', error);
      return [];
    }
  }

  private async getOptimizationSuggestions(resume: string, jobDescription: string): Promise<string[]> {
    const response = await this.openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a resume optimization expert. Provide specific, actionable suggestions to improve ATS compatibility and job match."
        },
        {
          role: "user",
          content: `Analyze this resume against the job description and provide 4-6 specific optimization suggestions.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide suggestions as a JSON array of strings.`
        }
      ],
      max_tokens: 800,
      temperature: 0.2
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Suggestions parsing error:', error);
      return ['Unable to generate suggestions at this time'];
    }
  }

  private calculateATSScore(keywords: KeywordMatch[], resume: string, jobDescription: string): number {
    const totalKeywords = keywords.length;
    if (totalKeywords === 0) return 50;

    const matchedKeywords = keywords.filter(k => k.found);
    const highImportanceMatched = matchedKeywords.filter(k => k.importance === 'high').length;
    const mediumImportanceMatched = matchedKeywords.filter(k => k.importance === 'medium').length;
    const lowImportanceMatched = matchedKeywords.filter(k => k.importance === 'low').length;

    const highImportanceTotal = keywords.filter(k => k.importance === 'high').length;
    const mediumImportanceTotal = keywords.filter(k => k.importance === 'medium').length;
    const lowImportanceTotal = keywords.filter(k => k.importance === 'low').length;

    // Weighted scoring
    let score = 0;
    if (highImportanceTotal > 0) score += (highImportanceMatched / highImportanceTotal) * 50;
    if (mediumImportanceTotal > 0) score += (mediumImportanceMatched / mediumImportanceTotal) * 30;
    if (lowImportanceTotal > 0) score += (lowImportanceMatched / lowImportanceTotal) * 20;

    // Additional factors
    const resumeLength = resume.split(' ').length;
    if (resumeLength < 100) score -= 10; // Too short
    if (resumeLength > 1000) score -= 5; // Too long

    return Math.min(Math.max(Math.round(score), 0), 100);
  }
}
