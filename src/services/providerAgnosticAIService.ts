/**
 * Central AI Resume Service for SaaS:
 * Attempts Gemini (free) → Groq (fast, free) → OpenAI (last-resort, paid).
 * All secrets/API keys must be set in environment variables (not user input).
 */

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

type Provider = "gemini" | "groq" | "openai";

export class ProviderAgnosticAIResumeService {
  // Prefers: Gemini → Groq → OpenAI
  private providers: Provider[] = ["gemini", "groq", "openai"];

  /**
   * Analyze Resume: smart fallback across providers
   */
  async analyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    let firstError: any = null;
    for (const provider of this.providers) {
      try {
        return await this.callProviderAnalyze(provider, resume, jobDescription);
      } catch (err) {
        if (!firstError) firstError = err;
        // Try next provider
      }
    }
    throw firstError || new Error('All AI providers failed');
  }

  /**
   * Optimize Resume: smart fallback
   */
  async optimizeResume(resume: string, jobDescription: string): Promise<string> {
    let firstError: any = null;
    for (const provider of this.providers) {
      try {
        return await this.callProviderOptimize(provider, resume, jobDescription);
      } catch (err) {
        if (!firstError) firstError = err;
        // Try next provider
      }
    }
    throw firstError || new Error('All AI providers failed');
  }

  // ==== PER-PROVIDER IMPLEMENTATIONS ====
  private async callProviderAnalyze(provider: Provider, resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    switch (provider) {
      case "gemini":
        return await this.geminiAnalyzeResume(resume, jobDescription);
      case "groq":
        return await this.groqAnalyzeResume(resume, jobDescription);
      case "openai":
        return await this.openaiAnalyzeResume(resume, jobDescription);
    }
  }
  private async callProviderOptimize(provider: Provider, resume: string, jobDescription: string): Promise<string> {
    switch (provider) {
      case "gemini":
        return await this.geminiOptimizeResume(resume, jobDescription);
      case "groq":
        return await this.groqOptimizeResume(resume, jobDescription);
      case "openai":
        return await this.openaiOptimizeResume(resume, jobDescription);
    }
  }

  // === Gemini Implementation ===
  private async geminiAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    // Sample Gemini REST API call stub (replace with working implementation as needed)
    // See: https://ai.google.dev/gemini-api/docs/get-started/rest
    // throw new Error("Gemini integration not yet set up"); // REMOVE when real code is added

    // Example: You'd fetch with a valid Gemini API key from env/server
    // For now, simulate:
    throw new Error("Gemini integration not yet implemented");
  }
  private async geminiOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    throw new Error("Gemini integration not yet implemented");
  }

  // === Groq Implementation ===
  private async groqAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    // Simulate or add real Groq call. See: https://groq.com/docs
    throw new Error("Groq integration not yet implemented");
  }
  private async groqOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    throw new Error("Groq integration not yet implemented");
  }

  // === OpenAI fallback ===
  private async openaiAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    // Require that the OPENAI_API_KEY is set in env variable on the server (not user provided!)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY, // must be set as an environment/server variable
      dangerouslyAllowBrowser: true,
    });

    // -- Extract keywords
    const extractRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    let keywordMatches: KeywordMatch[] = [];
    try {
      keywordMatches = JSON.parse(extractRes.choices[0]?.message?.content || '[]');
    } catch (e) {
      keywordMatches = [];
    }

    // -- Optimization suggestions
    const suggRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(suggRes.choices[0]?.message?.content || '[]');
    } catch (e) {
      suggestions = ['Unable to generate suggestions at this time'];
    }

    // -- ATS Score
    const atsScore = this.calculateATSScore(keywordMatches, resume, jobDescription);

    return {
      atsScore,
      keywordMatches,
      suggestions
    };
  }

  private async openaiOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
  }

  // === ATS Scoring (unchanged utility) ===
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
