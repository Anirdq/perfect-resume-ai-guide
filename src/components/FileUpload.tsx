
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
        console.log('Text file content:', text);
        onFileUpload(text);
        toast.success('Resume uploaded successfully!');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Enhanced mock resume for PDF - in real implementation, you'd use a PDF parsing library
        const mockResumeText = `JOHN SMITH
Senior Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing scalable web applications using modern technologies. 
Proven track record of leading cross-functional teams and delivering high-quality software solutions.

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, Angular, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Django, Spring Boot
• Databases: PostgreSQL, MongoDB, Redis, MySQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins
• Tools: Git, Jira, Figma, Postman

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Solutions Inc. | 2020 - Present
• Led development of microservices architecture serving 100K+ daily active users
• Implemented automated testing strategies, reducing bugs by 40%
• Mentored 5 junior developers and conducted code reviews
• Collaborated with product managers to define technical requirements
• Optimized database queries, improving application performance by 35%

Software Engineer | Digital Innovations LLC | 2018 - 2020
• Built responsive web applications using React and TypeScript
• Developed RESTful APIs and integrated third-party services
• Participated in Agile development processes and sprint planning
• Created comprehensive technical documentation

Junior Developer | StartupCo | 2016 - 2018
• Contributed to full-stack web development projects
• Assisted in database design and optimization
• Supported legacy system maintenance and updates

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2012 - 2016

CERTIFICATIONS
• AWS Certified Solutions Architect
• Google Cloud Professional Developer
• Scrum Master Certification

PROJECTS
• E-commerce Platform: Built scalable online shopping platform using React, Node.js, and PostgreSQL
• Real-time Chat Application: Developed WebSocket-based chat system with Redis pub/sub
• Data Analytics Dashboard: Created interactive dashboard using D3.js and Python Flask`;
        
        console.log('PDF parsed (mock):', mockResumeText.substring(0, 100) + '...');
        onFileUpload(mockResumeText);
        toast.success('PDF uploaded and parsed successfully!');
      } else if (file.type.startsWith('image/')) {
        const mockResumeFromImage = `SARAH JOHNSON
Marketing Manager & Digital Strategy Expert
Email: sarah.johnson@email.com | Phone: (555) 987-6543
Portfolio: sarahjohnson.com | Location: New York, NY

PROFESSIONAL SUMMARY
Results-driven marketing professional with 6+ years of experience in digital marketing, brand management,
and campaign optimization. Expertise in data-driven marketing strategies and cross-channel campaign execution.

CORE COMPETENCIES
• Digital Marketing: SEO/SEM, Social Media Marketing, Email Marketing
• Analytics: Google Analytics, Facebook Ads Manager, HubSpot, Salesforce
• Content Strategy: Content Creation, Copywriting, Brand Messaging
• Project Management: Agile, Scrum, Team Leadership, Budget Management
• Design Tools: Adobe Creative Suite, Canva, Figma

PROFESSIONAL EXPERIENCE

Senior Marketing Manager | GrowthTech Solutions | 2021 - Present
• Managed $500K annual marketing budget across multiple channels
• Increased lead generation by 65% through optimized digital campaigns
• Led rebranding initiative resulting in 40% increase in brand recognition
• Developed and executed go-to-market strategies for 3 product launches
• Built and managed team of 4 marketing specialists

Digital Marketing Specialist | Innovation Marketing Agency | 2019 - 2021
• Executed integrated marketing campaigns for B2B and B2C clients
• Achieved average 25% improvement in client ROI through campaign optimization
• Managed social media accounts with combined following of 50K+
• Created compelling content resulting in 30% increase in engagement rates
• Collaborated with creative team on video and graphic content production

Marketing Coordinator | TechStart Inc. | 2018 - 2019
• Supported marketing operations and campaign execution
• Conducted market research and competitive analysis
• Assisted in event planning and trade show coordination
• Maintained CRM database and lead scoring processes

EDUCATION
Master of Business Administration (MBA) - Marketing Focus
New York University Stern School of Business | 2016 - 2018

Bachelor of Arts in Communications
Columbia University | 2012 - 2016

CERTIFICATIONS & ACHIEVEMENTS
• Google Ads Certified Professional
• HubSpot Inbound Marketing Certification
• Facebook Blueprint Certified
• Hootsuite Social Media Marketing Certified
• Marketing Campaign of the Year Award (2022)

NOTABLE PROJECTS
• Product Launch Campaign: Led 360-degree campaign generating $2M in first quarter sales
• Brand Repositioning: Executed complete rebrand increasing market share by 15%
• Marketing Automation: Implemented lead nurturing system improving conversion by 45%`;

        console.log('Image text extracted (mock):', mockResumeFromImage.substring(0, 100) + '...');
        onFileUpload(mockResumeFromImage);
        toast.success('Image uploaded and text extracted successfully!');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
                <p className="text-sm text-green-600">File uploaded and processed successfully</p>
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
