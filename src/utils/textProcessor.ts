
export interface ProcessedText {
  originalText: string;
  cleanedText: string;
  sections: {
    [key: string]: string[];
  };
  keywords: string[];
  statistics: {
    wordCount: number;
    characterCount: number;
    lineCount: number;
    sectionsFound: number;
  };
}

export class TextProcessor {
  private static readonly SECTION_PATTERNS = [
    /^(PROFESSIONAL\s+SUMMARY|SUMMARY|OBJECTIVE|CAREER\s+OBJECTIVE)/i,
    /^(WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT)/i,
    /^(EDUCATION|ACADEMIC\s+BACKGROUND)/i,
    /^(SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES)/i,
    /^(PROJECTS|PERSONAL\s+PROJECTS|KEY\s+PROJECTS)/i,
    /^(CERTIFICATIONS|CERTIFICATES|LICENSES)/i,
    /^(ACHIEVEMENTS|ACCOMPLISHMENTS|AWARDS)/i,
    /^(LANGUAGES|FOREIGN\s+LANGUAGES)/i,
    /^(VOLUNTEER|VOLUNTEER\s+EXPERIENCE)/i,
    /^(PUBLICATIONS|RESEARCH)/i
  ];

  private static readonly COMMON_KEYWORDS = [
    // Technical Skills
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node',
    'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'agile', 'scrum', 'ci/cd', 'api', 'rest', 'graphql', 'microservices',
    
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'project management', 'collaboration', 'mentoring', 'training',
    
    // Business
    'strategy', 'planning', 'budget', 'revenue', 'growth', 'optimization',
    'efficiency', 'quality', 'customer', 'stakeholder', 'business development'
  ];

  static processText(text: string): ProcessedText {
    console.log('Processing text with enhanced analysis...');
    
    // Initial cleaning
    const cleanedText = this.cleanText(text);
    
    // Extract sections
    const sections = this.extractSections(cleanedText);
    
    // Extract keywords
    const keywords = this.extractKeywords(cleanedText);
    
    // Calculate statistics
    const statistics = this.calculateStatistics(cleanedText, sections);
    
    console.log('Text processing completed:', statistics);
    
    return {
      originalText: text,
      cleanedText,
      sections,
      keywords,
      statistics
    };
  }

  private static cleanText(text: string): string {
    return text
      // Normalize whitespace
      .replace(/[\r\n]+/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      
      // Fix broken words and hyphenation
      .replace(/([a-z])-\s*\n\s*([a-z])/gi, '$1$2')
      .replace(/([a-z])-\s+([a-z])/gi, '$1$2')
      
      // Fix contact information
      .replace(/(\w+)\s*@\s*(\w+\.\w+)/g, '$1@$2')
      .replace(/(\(?\d{3}\)?)\s*[-.\s]*(\d{3})\s*[-.\s]*(\d{4})/g, '$1-$2-$3')
      .replace(/(https?:\/\/)\s+/g, '$1')
      
      // Standardize section headers
      .replace(/\b(PROFESSIONAL\s+SUMMARY|CAREER\s+SUMMARY)\b/gi, 'PROFESSIONAL SUMMARY')
      .replace(/\b(WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EMPLOYMENT\s+HISTORY)\b/gi, 'EXPERIENCE')
      .replace(/\b(TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES)\b/gi, 'SKILLS')
      .replace(/\b(ACADEMIC\s+BACKGROUND)\b/gi, 'EDUCATION')
      
      // Clean up bullet points
      .replace(/[•▪▫◦‣⁃]/g, '•')
      .replace(/^\s*[-*]\s+/gm, '• ')
      
      // Remove excessive newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private static extractSections(text: string): { [key: string]: string[] } {
    const sections: { [key: string]: string[] } = {};
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentSection = 'header';
    let currentContent: string[] = [];
    
    for (const line of lines) {
      // Check if this line is a section header
      const sectionMatch = this.SECTION_PATTERNS.find(pattern => pattern.test(line));
      
      if (sectionMatch) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = [...currentContent];
        }
        
        // Start new section
        currentSection = line.toLowerCase().replace(/[^a-z]/g, '');
        currentContent = [];
      } else if (line) {
        currentContent.push(line);
      }
    }
    
    // Save the last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent;
    }
    
    return sections;
  }

  private static extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const foundKeywords = this.COMMON_KEYWORDS.filter(keyword => {
      const keywordWords = keyword.split(/\s+/);
      if (keywordWords.length === 1) {
        return words.includes(keyword);
      } else {
        return text.toLowerCase().includes(keyword);
      }
    });
    
    // Also extract capitalized words that might be technologies or companies
    const capitalizedWords = text.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
    const uniqueCapitalized = [...new Set(capitalizedWords)]
      .filter(word => word.length > 2 && word.length < 20)
      .slice(0, 10);
    
    return [...new Set([...foundKeywords, ...uniqueCapitalized.map(w => w.toLowerCase())])];
  }

  private static calculateStatistics(text: string, sections: { [key: string]: string[] }) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    return {
      wordCount: words.length,
      characterCount: text.length,
      lineCount: lines.length,
      sectionsFound: Object.keys(sections).length
    };
  }

  static generateProcessingSummary(processed: ProcessedText): string {
    const { statistics, sections, keywords } = processed;
    
    return `
📄 Document Analysis Summary:
• ${statistics.wordCount} words, ${statistics.characterCount} characters
• ${statistics.sectionsFound} sections identified
• ${keywords.length} relevant keywords found

📋 Sections Detected:
${Object.keys(sections).map(section => `• ${section.toUpperCase()}`).join('\n')}

🔑 Key Terms Identified:
${keywords.slice(0, 10).join(', ')}${keywords.length > 10 ? '...' : ''}
    `.trim();
  }
}
