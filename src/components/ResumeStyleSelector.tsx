
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Eye } from 'lucide-react';

interface ResumeStyleSelectorProps {
  selectedStyle: 'modern' | 'classic' | 'minimal' | 'executive';
  onStyleChange: (style: 'modern' | 'classic' | 'minimal' | 'executive') => void;
}

export const ResumeStyleSelector = ({ selectedStyle, onStyleChange }: ResumeStyleSelectorProps) => {
  const styles = [
    {
      id: 'modern' as const,
      name: 'Modern',
      description: 'Clean design with blue accents and modern typography',
      preview: 'Blue accents, gradient background'
    },
    {
      id: 'classic' as const,
      name: 'Classic',
      description: 'Traditional professional look with serif fonts',
      preview: 'Serif fonts, traditional layout'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: 'Clean, minimalist design with subtle styling',
      preview: 'Light typography, minimal borders'
    },
    {
      id: 'executive' as const,
      name: 'Executive',
      description: 'Bold, professional design for senior positions',
      preview: 'Bold headers, strong borders'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <span>Resume Style</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant={selectedStyle === style.id ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange(style.id)}
              className="h-auto p-3 flex flex-col items-start space-y-1"
            >
              <div className="font-medium">{style.name}</div>
              <div className="text-xs text-left opacity-70">{style.preview}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
