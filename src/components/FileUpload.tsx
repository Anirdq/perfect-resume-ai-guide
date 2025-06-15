import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Image, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface FileUploadProps {
  onFileUpload: (text: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text.trim();
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error('Failed to extract text from image');
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('File uploaded:', file.name, 'Type:', file.type);
    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingStep('Initializing...');
    
    try {
      let extractedText = '';

      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        setProcessingStep('Reading text file...');
        extractedText = await file.text();
        toast.success('Text file processed successfully!');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setProcessingStep('Extracting text from PDF...');
        extractedText = await extractTextFromPDF(file);
        toast.success('PDF text extracted successfully!');
      } else if (file.type.startsWith('image/')) {
        setProcessingStep('Running OCR on image...');
        extractedText = await extractTextFromImage(file);
        toast.success('Image text extracted using OCR!');
      }

      console.log('Extracted text length:', extractedText.length);
      console.log('Text preview:', extractedText.substring(0, 200) + '...');
      onFileUpload(extractedText);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to extract text from file. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
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
    onFileUpload('');
    toast.success('File removed');
  };

  const getFileIcon = () => {
    if (!uploadedFile) return <FileText className="h-6 w-6 text-white" />;
    
    if (uploadedFile.type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-white" />;
    }
    return <FileText className="h-6 w-6 text-white" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        {uploadedFile ? (
          <div className="p-8">
            <div className="flex items-center justify-between p-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl border border-cyan-500/20 backdrop-blur-sm relative overflow-hidden">
              {/* Success/Processing Animation Background */}
              <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 ${
                isProcessing 
                  ? 'from-blue-500/5 to-cyan-500/5' 
                  : 'from-emerald-500/5 to-green-500/5'
              }`}></div>
              
              <div className="flex items-center space-x-6 relative z-10">
                <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                  isProcessing 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/25'
                }`}>
                  {isProcessing ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-xl text-white">{uploadedFile.name}</h3>
                    <Badge className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1">
                      {formatFileSize(uploadedFile.size)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-cyan-300 font-medium">{processingStep}</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <p className="text-emerald-300 font-medium">File processed successfully</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removeFile} 
                disabled={isProcessing}
                className="text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 rounded-xl p-3 relative z-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 m-8 relative overflow-hidden group ${
              isDragOver
                ? 'border-cyan-400/60 bg-cyan-500/10 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                : 'border-gray-600/50 hover:border-cyan-500/40 hover:bg-cyan-500/5'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className={`mx-auto mb-8 w-fit transition-all duration-500 ${
                isDragOver ? 'scale-110 rotate-12' : 'group-hover:scale-105'
              }`}>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-2xl shadow-cyan-500/25 relative">
                  <Upload className={`h-16 w-16 text-white transition-transform duration-300 ${
                    isDragOver ? 'animate-bounce' : ''
                  }`} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {isDragOver ? 'Drop your file here!' : 'Upload your resume'}
                  </h3>
                  <p className="text-gray-300 text-xl leading-relaxed max-w-md mx-auto">
                    Drag and drop your PDF, text file, or image here, or click to browse
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-2 text-sm">
                    <FileText className="h-3 w-3 mr-1.5" />
                    PDF Support
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 px-3 py-2 text-sm">
                    <Image className="h-3 w-3 mr-1.5" />
                    OCR Ready
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 px-3 py-2 text-sm">
                    <AlertCircle className="h-3 w-3 mr-1.5" />
                    Text Files
                  </Badge>
                </div>
                
                <input
                  type="file"
                  accept=".pdf,.txt,image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center">
                      <Upload className="h-5 w-5 mr-3" />
                      Choose File
                    </span>
                  </label>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
