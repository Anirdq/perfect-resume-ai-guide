
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit3, Eye, Save } from 'lucide-react';
import { ResumeFormatter } from './ResumeFormatter';
import { ResumeStyleSelector } from './ResumeStyleSelector';

interface EditableResumeProps {
  initialResume: string;
  onSave: (resume: string) => void;
}

export const EditableResume = ({ initialResume, onSave }: EditableResumeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeText, setResumeText] = useState(initialResume);
  const [selectedStyle, setSelectedStyle] = useState<'modern' | 'classic' | 'minimal' | 'executive'>('modern');

  const handleSave = () => {
    onSave(resumeText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setResumeText(initialResume);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ResumeStyleSelector 
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />
      
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span>Optimized Resume</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
                placeholder="Edit your optimized resume here..."
              />
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[400px]">
              <ResumeFormatter resumeText={resumeText} style={selectedStyle} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
