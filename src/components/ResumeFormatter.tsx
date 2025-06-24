
import React from 'react';

interface ResumeFormatterProps {
  resumeText: string;
  style: 'modern' | 'classic' | 'minimal' | 'executive';
}

export const ResumeFormatter = ({ resumeText, style }: ResumeFormatterProps) => {
  const getStyleClasses = () => {
    switch (style) {
      case 'modern':
        return {
          container: 'bg-white p-8 shadow-sm border-l-4 border-blue-500',
          text: 'text-gray-800 leading-relaxed font-sans',
          lineHeight: 'leading-6'
        };
      case 'classic':
        return {
          container: 'bg-white p-8 shadow-sm border border-gray-200',
          text: 'text-gray-800 leading-relaxed font-serif',
          lineHeight: 'leading-6'
        };
      case 'minimal':
        return {
          container: 'bg-white p-8 shadow-none',
          text: 'text-gray-700 leading-relaxed font-light',
          lineHeight: 'leading-6'
        };
      case 'executive':
        return {
          container: 'bg-white p-8 shadow-sm border-2 border-gray-800',
          text: 'text-gray-800 leading-relaxed font-medium',
          lineHeight: 'leading-6'
        };
      default:
        return {
          container: 'bg-white p-8 shadow-sm',
          text: 'text-gray-800 leading-relaxed',
          lineHeight: 'leading-6'
        };
    }
  };

  const styleClasses = getStyleClasses();

  // Preserve the original formatting by splitting into lines and maintaining structure
  const formatLine = (line: string, index: number) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines but preserve spacing
    if (!trimmedLine) {
      return <div key={index} className="h-3"></div>;
    }
    
    // Detect section headers (all caps or title case followed by colon/line)
    if (trimmedLine.match(/^[A-Z][A-Z\s]{3,}:?\s*$/) || 
        trimmedLine.match(/^[A-Z][a-zA-Z\s]+:?\s*$/) && trimmedLine.length < 50) {
      return (
        <div key={index} className="mt-6 mb-3">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1">
            {trimmedLine.replace(':', '')}
          </h3>
        </div>
      );
    }
    
    // Detect bullet points
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      return (
        <div key={index} className="flex items-start mb-2 ml-4">
          <span className="text-blue-600 font-bold mr-2 mt-1">•</span>
          <span className={styleClasses.text}>{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    }
    
    // Regular text lines
    return (
      <p key={index} className={`${styleClasses.text} mb-2 ${styleClasses.lineHeight}`}>
        {trimmedLine}
      </p>
    );
  };

  const lines = resumeText.split('\n');

  return (
    <div className={`${styleClasses.container} max-w-4xl mx-auto min-h-[600px]`}>
      <div className="space-y-1">
        {lines.map((line, index) => formatLine(line, index))}
      </div>
    </div>
  );
};
