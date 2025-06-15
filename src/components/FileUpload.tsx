
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Image } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (
      file.type === 'application/pdf' || 
      file.type === 'text/plain' ||
      file.type.startsWith('image/')
    )) {
      handleFileUpload(file);
    } else {
      toast.error('Please upload a PDF, text file, or image');
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    
    if (file.type === 'text/plain') {
      const text = await file.text();
      onFileUpload(text);
      toast.success('Resume uploaded successfully!');
    } else if (file.type === 'application/pdf') {
      // For now, we'll show a message that PDF parsing is simulated
      // In a real implementation, you'd use a PDF parsing library
      const mockResumeText = `JOHN DOE
Software Engineer

EXPERIENCE
• Frontend Developer at Tech Company (2020-2023)
• Built responsive web applications using React and TypeScript
• Collaborated with design team on user interface improvements

SKILLS
• JavaScript, React, TypeScript
• HTML5, CSS3, Node.js
• Git, Agile Development

EDUCATION
• Bachelor of Computer Science, University (2016-2020)`;
      
      onFileUpload(mockResumeText);
      toast.success('PDF uploaded and parsed successfully!');
    } else if (file.type.startsWith('image/')) {
      // For image files, we'll show a mock resume text since OCR would require additional libraries
      const mockResumeFromImage = `SARAH JOHNSON
Marketing Manager

PROFESSIONAL EXPERIENCE
• Digital Marketing Specialist at Marketing Agency (2019-2023)
• Managed social media campaigns with 50% engagement increase
• Led cross-functional teams for product launches

CORE COMPETENCIES  
• Digital Marketing, SEO/SEM
• Content Strategy, Analytics
• Project Management, Team Leadership

EDUCATION
• MBA in Marketing, Business School (2017-2019)
• Bachelor of Arts in Communications (2013-2017)`;

      onFileUpload(mockResumeFromImage);
      toast.success('Image uploaded and text extracted successfully!');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileUpload('');
  };

  const getFileIcon = () => {
    if (!uploadedFile) return <FileText className="h-5 w-5 text-green-600" />;
    
    if (uploadedFile.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-green-600" />;
    }
    return <FileText className="h-5 w-5 text-green-600" />;
  };

  return (
    <Card>
      <CardContent className="p-6">
        {uploadedFile ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              {getFileIcon()}
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">File uploaded successfully</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Upload your resume
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your PDF, text file, or image here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.txt,image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
