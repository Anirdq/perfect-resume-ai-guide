
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
          text: 'text-gray-800 font-sans',
        };
      case 'classic':
        return {
          container: 'bg-white p-8 shadow-sm border border-gray-200',
          text: 'text-gray-800 font-serif',
        };
      case 'minimal':
        return {
          container: 'bg-white p-8 shadow-none',
          text: 'text-gray-700 font-light',
        };
      case 'executive':
        return {
          container: 'bg-white p-8 shadow-sm border-2 border-gray-800',
          text: 'text-gray-800 font-medium',
        };
      default:
        return {
          container: 'bg-white p-8 shadow-sm',
          text: 'text-gray-800',
        };
    }
  };

  const styleClasses = getStyleClasses();

  return (
    <div className={`${styleClasses.container} max-w-4xl mx-auto min-h-[600px]`}>
      <pre className={`${styleClasses.text} whitespace-pre-wrap leading-relaxed text-sm`}>
        {resumeText}
      </pre>
    </div>
  );
};
