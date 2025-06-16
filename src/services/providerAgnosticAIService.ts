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

type Provider = "gemini" | "groq" | "openai" | "mock";

export class ProviderAgnosticAIResumeService {
  // Prefers: Gemini (free) → Groq (fast, free) → OpenAI (paid) → Mock (fallback)
  private providers: Provider[] = ["gemini", "groq", "openai", "mock"];

  async analyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    let firstError: any = null;
    for (const provider of this.providers) {
      try {
        return await this.callProviderAnalyze(provider, resume, jobDescription);
      } catch (err) {
        if (!firstError) firstError = err;
        console.log(`Provider ${provider} failed, trying next...`, err);
        // Try next provider
      }
    }
    throw firstError || new Error('All AI providers failed');
  }

  async optimizeResume(resume: string, jobDescription: string): Promise<string> {
    let firstError: any = null;
    for (const provider of this.providers) {
      try {
        return await this.callProviderOptimize(provider, resume, jobDescription);
      } catch (err) {
        if (!firstError) firstError = err;
        console.log(`Provider ${provider} failed for optimization, trying next...`, err);
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
      case "mock":
        return await this.mockAnalyzeResume(resume, jobDescription);
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
      case "mock":
        return await this.mockOptimizeResume(resume, jobDescription);
    }
  }

  // === Gemini Implementation (Google's Free AI) ===
  private async geminiAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("Gemini API key not configured");
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract keywords and analyze
    const analysisPrompt = `Analyze this resume against the job description and provide a detailed ATS analysis.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return a JSON response with this exact structure:
{
  "keywordMatches": [{"keyword": "JavaScript", "found": true, "importance": "high"}],
  "suggestions": ["Add more quantifiable achievements", "Include relevant certifications"]
}

Focus on the top 10 most important keywords from the job description.`;

    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text();

    let parsedData;
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch (e) {
      throw new Error('Failed to parse Gemini response');
    }

    const keywordMatches: KeywordMatch[] = parsedData.keywordMatches || [];
    const suggestions: string[] = parsedData.suggestions || [];
    const atsScore = this.calculateATSScore(keywordMatches, resume, jobDescription);

    return { atsScore, keywordMatches, suggestions };
  }

  private async geminiOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("Gemini API key not configured");
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const optimizePrompt = `Optimize this resume for the given job description. Enhance keywords, improve formatting, and make it more ATS-friendly while keeping all information truthful.

ORIGINAL RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return only the optimized resume text, no additional commentary.`;

    const result = await model.generateContent(optimizePrompt);
    const response = await result.response;
    return response.text();
  }

  // === Groq Implementation (Fast & Free) ===
  private async groqAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("Groq API key not configured");
    }

    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume analyzer. Return only valid JSON responses."
        },
        {
          role: "user",
          content: `Analyze this resume against the job description. Extract the top 10 keywords and provide optimization suggestions.

RESUME: ${resume}

JOB DESCRIPTION: ${jobDescription}

Return JSON: {"keywordMatches": [{"keyword": "React", "found": true, "importance": "high"}], "suggestions": ["suggestion1", "suggestion2"]}`
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.1,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from Groq');

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      throw new Error('Failed to parse Groq response');
    }

    const keywordMatches: KeywordMatch[] = parsedData.keywordMatches || [];
    const suggestions: string[] = parsedData.suggestions || [];
    const atsScore = this.calculateATSScore(keywordMatches, resume, jobDescription);

    return { atsScore, keywordMatches, suggestions };
  }

  private async groqOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("Groq API key not configured");
    }

    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume optimizer. Enhance resumes for ATS compatibility while keeping all information truthful."
        },
        {
          role: "user",
          content: `Optimize this resume for the job description. Improve keywords, formatting, and ATS compatibility:

RESUME: ${resume}

JOB DESCRIPTION: ${jobDescription}

Return only the optimized resume text.`
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || resume;
  }

  // === OpenAI Implementation (Existing code) ===
  private async openaiAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: openaiKey,
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
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: openaiKey,
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

  // === Mock Implementation (Enhanced for better variety) ===
  private async mockAnalyzeResume(resume: string, jobDescription: string): Promise<ResumeAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract actual keywords from job description
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const resumeWords = resume.toLowerCase().split(/\s+/);
    
    // Common technical keywords to look for
    const techKeywords = ['javascript', 'react', 'typescript', 'node', 'python', 'sql', 'git', 'aws', 'docker', 'agile', 'html', 'css', 'api', 'database', 'testing', 'ci/cd', 'mongodb', 'express', 'angular', 'vue'];
    
    // Find keywords that appear in job description
    const foundJobKeywords = techKeywords.filter(keyword => 
      jobWords.some(word => word.includes(keyword))
    );
    
    // Create keyword matches based on actual content
    const keywordMatches: KeywordMatch[] = foundJobKeywords.slice(0, 10).map(keyword => ({
      keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      found: resumeWords.some(word => word.includes(keyword)),
      importance: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
    }));

    const foundMatches = keywordMatches.filter(k => k.found).length;
    const atsScore = Math.min(Math.max(Math.round((foundMatches / keywordMatches.length) * 100 + Math.random() * 20), 45), 95);

    // Generate contextual suggestions based on content
    const suggestions = [];
    if (!resume.includes('$') && !resume.includes('%')) {
      suggestions.push("Add quantifiable achievements with numbers, percentages, or dollar amounts");
    }
    if (!jobWords.some(word => resumeWords.includes(word))) {
      suggestions.push("Include more keywords from the job description");
    }
    if (resume.length < 200) {
      suggestions.push("Expand your experience descriptions with more details");
    }
    suggestions.push("Use strong action verbs to start each bullet point");
    suggestions.push("Ensure your contact information is clearly visible at the top");
    
    return {
      atsScore,
      keywordMatches,
      suggestions: suggestions.slice(0, 4 + Math.floor(Math.random() * 2))
    };
  }

  private async mockOptimizeResume(resume: string, jobDescription: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract keywords from job description for enhancement
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const techKeywords = ['javascript', 'react', 'typescript', 'node', 'python', 'sql', 'git', 'aws', 'docker', 'agile'];
    const relevantKeywords = techKeywords.filter(keyword => 
      jobWords.some(word => word.includes(keyword))
    );
    
    // Create a more personalized optimization based on input
    let optimizedResume = resume;
    
    // If resume is very short, create a basic structure
    if (resume.length < 100) {
      const keywordList = relevantKeywords.slice(0, 5).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
      
      optimizedResume = `PROFESSIONAL SUMMARY
Results-driven professional with expertise in ${keywordList}. Proven track record of delivering high-quality solutions and collaborating effectively with cross-functional teams.

TECHNICAL SKILLS
• ${relevantKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
• Strong problem-solving and analytical thinking capabilities
• Excellent communication and collaboration skills

EXPERIENCE
• Developed and maintained applications using modern technologies
• Collaborated with stakeholders to define and implement project requirements
• Implemented best practices resulting in improved efficiency and code quality
• Led cross-functional teams to deliver innovative solutions on time

EDUCATION & CERTIFICATIONS
• Continuous learning and professional development focus
• Industry-relevant certifications and training programs`;
    } else {
      // Enhance existing resume
      const lines = resume.split('\n');
      const enhancedLines = lines.map(line => {
        // Enhance bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          if (!line.toLowerCase().includes('led') && !line.toLowerCase().includes('managed') && !line.toLowerCase().includes('developed')) {
            return line.replace(/^(\s*[•-]\s*)/, '$1Effectively ');
          }
        }
        return line;
      });
      
      // Add relevant keywords section if missing
      if (!resume.toLowerCase().includes('skills') && relevantKeywords.length > 0) {
        const skillsSection = `\nTECHNICAL SKILLS\n• ${relevantKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}\n`;
        enhancedLines.splice(2, 0, skillsSection);
      }
      
      optimizedResume = enhancedLines.join('\n');
    }
    
    return optimizedResume;
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
