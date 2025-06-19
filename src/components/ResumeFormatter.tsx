
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResumeFormatterProps {
  resumeText: string;
  style: 'modern' | 'classic' | 'minimal' | 'executive';
}

export const ResumeFormatter = ({ resumeText, style }: ResumeFormatterProps) => {
  const parseResumeText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const sections: { [key: string]: string[] } = {};
    let currentSection = 'header';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detect section headers
      if (trimmedLine.match(/^(PROFESSIONAL SUMMARY|SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS)/i)) {
        currentSection = trimmedLine.toLowerCase().replace(/[^a-z]/g, '');
        sections[currentSection] = [];
      } else if (trimmedLine) {
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        sections[currentSection].push(trimmedLine);
      }
    }
    
    return sections;
  };

  const sections = parseResumeText(resumeText);

  const getStyleClasses = () => {
    switch (style) {
      case 'modern':
        return {
          container: 'bg-gradient-to-br from-white to-gray-50 border-l-4 border-blue-500',
          header: 'text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4',
          sectionHeader: 'text-lg font-semibold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg mb-3 border-l-4 border-blue-500',
          text: 'text-gray-700 leading-relaxed',
          bullet: 'text-blue-500'
        };
      case 'classic':
        return {
          container: 'bg-white border border-gray-300',
          header: 'text-2xl font-serif font-bold text-gray-900 border-b border-gray-400 pb-2 mb-4',
          sectionHeader: 'text-lg font-serif font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1',
          text: 'text-gray-700 leading-relaxed font-serif',
          bullet: 'text-gray-600'
        };
      case 'minimal':
        return {
          container: 'bg-white border-none shadow-none',
          header: 'text-2xl font-light text-gray-900 mb-6',
          sectionHeader: 'text-base font-medium text-gray-800 uppercase tracking-wider mb-3',
          text: 'text-gray-600 leading-relaxed font-light',
          bullet: 'text-gray-400'
        };
      case 'executive':
        return {
          container: 'bg-white border-2 border-gray-800',
          header: 'text-3xl font-bold text-gray-900 mb-4',
          sectionHeader: 'text-xl font-bold text-gray-800 bg-gray-100 px-4 py-2 mb-4',
          text: 'text-gray-700 leading-relaxed',
          bullet: 'text-gray-800'
        };
      default:
        return {
          container: 'bg-white',
          header: 'text-2xl font-bold text-gray-900 mb-4',
          sectionHeader: 'text-lg font-semibold text-gray-800 mb-3',
          text: 'text-gray-700 leading-relaxed',
          bullet: 'text-gray-600'
        };
    }
  };

  const styleClasses = getStyleClasses();

  const renderSection = (sectionKey: string, content: string[]) => {
    if (!content || content.length === 0) return null;

    const sectionTitle = sectionKey.replace(/([a-z])([a-z])/g, '$1 $2').toUpperCase();
    
    return (
      <div key={sectionKey} className="mb-6">
        <h3 className={styleClasses.sectionHeader}>
          {sectionTitle}
        </h3>
        <div className="space-y-2">
          {content.map((line, index) => (
            <div key={index} className={`${styleClasses.text} ${line.startsWith('•') || line.startsWith('-') ? 'ml-4' : ''}`}>
              {line.startsWith('•') || line.startsWith('-') ? (
                <div className="flex items-start space-x-2">
                  <span className={`${styleClasses.bullet} font-bold`}>•</span>
                  <span>{line.substring(1).trim()}</span>
                </div>
              ) : (
                <p className={line.includes('|') || line.match(/\d{4}/) ? 'font-medium' : ''}>{line}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={`${styleClasses.container} p-8 max-w-4xl mx-auto`}>
      {sections.header && (
        <div className="mb-8">
          <div className={styleClasses.header}>
            {sections.header[0]}
          </div>
          {sections.header.slice(1).map((line, index) => (
            <p key={index} className={`${styleClasses.text} text-center`}>{line}</p>
          ))}
        </div>
      )}
      
      {Object.entries(sections).filter(([key]) => key !== 'header').map(([sectionKey, content]) => 
        renderSection(sectionKey, content)
      )}
    </Card>
  );
};
