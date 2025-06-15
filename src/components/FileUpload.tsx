
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
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.txt')
    )) {
      handleFileUpload(file);
    } else {
      toast.error('Please upload a PDF, text file, or image (JPG, PNG, etc.)');
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    console.log('File uploaded:', file.name, 'Type:', file.type);
    setUploadedFile(file);
    
    try {
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        const text = await file.text();
        console.log('Text file content extracted, calling onFileUpload with:', text.substring(0, 100) + '...');
        onFileUpload(text);
        toast.success('Resume uploaded successfully!');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Note: This is mock data for PDF files
        // In a real application, you would use a PDF parsing library like pdf-parse or PDF.js
        toast.info('PDF uploaded - Using sample resume data (PDF parsing not implemented)');
        
        const sampleResumeText = `[SAMPLE RESUME DATA - Your uploaded PDF: ${file.name}]

ALEX RODRIGUEZ
Full Stack Developer
Email: alex.rodriguez@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/alexrodriguez | Location: Austin, TX

PROFESSIONAL SUMMARY
Experienced full-stack developer with 5+ years building scalable web applications. 
Passionate about clean code, user experience, and modern development practices.

TECHNICAL SKILLS
• Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Next.js, Vue.js, HTML5, CSS3
• Backend: Node.js, Express, FastAPI, Spring Boot
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Google Cloud, Docker, Kubernetes
• Tools: Git, Jenkins, Jira, Figma

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer | InnovateTech Solutions | 2021 - Present
• Led development of customer portal serving 50K+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored 3 junior developers on best practices
• Built RESTful APIs and microservices architecture

Full Stack Developer | WebCraft Agency | 2019 - 2021
• Developed responsive web applications for diverse clients
• Integrated third-party APIs and payment systems
• Optimized application performance and database queries
• Collaborated with designers on UI/UX implementation

EDUCATION
Bachelor of Science in Computer Science
University of Texas at Austin | 2015 - 2019

CERTIFICATIONS
• AWS Certified Developer Associate
• React Developer Certification
• Google Cloud Professional Developer`;
        
        console.log('PDF sample content provided, calling onFileUpload');
        onFileUpload(sampleResumeText);
      } else if (file.type.startsWith('image/')) {
        // Note: This is mock data for image files
        // In a real application, you would use OCR services like Tesseract.js or cloud OCR APIs
        toast.info('Image uploaded - Using sample resume data (OCR not implemented)');
        
        const sampleImageResumeText = `[SAMPLE RESUME DATA - Your uploaded image: ${file.name}]

MARIA GONZALEZ
UX/UI Designer
Email: maria.gonzalez@email.com | Phone: (555) 987-6543
Portfolio: mariagonzalez.design | Location: San Francisco, CA

PROFESSIONAL SUMMARY
Creative UX/UI designer with 4+ years of experience creating user-centered digital experiences.
Skilled in design systems, prototyping, and user research methodologies.

CORE SKILLS
• Design Tools: Figma, Sketch, Adobe Creative Suite, Principle
• Prototyping: InVision, Framer, Axure RP
• User Research: Usability Testing, Interviews, Surveys
• Front-end: HTML, CSS, JavaScript basics
• Methodologies: Design Thinking, Agile, Lean UX

PROFESSIONAL EXPERIENCE

Senior UX Designer | DesignForward Inc. | 2022 - Present
• Lead UX design for B2B SaaS platform with 100K+ users
• Conducted user research resulting in 40% increase in user satisfaction
• Established design system reducing design-to-development time by 30%
• Collaborated with product managers and engineers on feature development

UX Designer | Creative Solutions | 2020 - 2022
• Designed mobile and web applications for startup clients
• Created wireframes, prototypes, and user journey maps
• Performed A/B testing to optimize conversion rates
• Mentored junior designers and design interns

EDUCATION
Bachelor of Fine Arts in Graphic Design
California College of the Arts | 2016 - 2020

CERTIFICATIONS
• Google UX Design Certificate
• Nielsen Norman Group UX Certification
• Adobe Certified Expert`;

        console.log('Image sample content provided, calling onFileUpload');
        onFileUpload(sampleImageResumeText);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected from input:', file.name);
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    console.log('Removing file and clearing resume text');
    setUploadedFile(null);
    onFileUpload(''); // Clear the resume text
    toast.success('File removed');
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
                <p className="text-sm text-green-600">
                  {uploadedFile.type === 'text/plain' || uploadedFile.name.toLowerCase().endsWith('.txt') 
                    ? 'File uploaded and processed successfully'
                    : 'Sample resume data loaded (actual file parsing not implemented)'
                  }
                </p>
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
            <p className="text-xs text-gray-400 mb-4">
              Note: PDF and image files will show sample data (actual parsing not implemented)
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
