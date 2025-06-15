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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="card-glass shadow-glass">
      <CardContent className="p-0">
        {uploadedFile ? (
          <div className="p-7">
            <div className="flex items-center justify-between p-7 bg-gradient-to-tr from-cyan-900/25 via-slate-700/15 to-blue-900/30 rounded-2xl border border-cyan-600/20 shadow-fancy">
              <div className="flex items-center space-x-5">
                <div className={`p-3 rounded-2xl shadow-md ${
                  isProcessing 
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-green-500'
                }`}>
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-100 text-lg">{uploadedFile.name}</h3>
                    <Badge className="bg-cyan-700/60 text-cyan-200 text-xs border-cyan-500/30 px-2 py-1 rounded-lg">
                      {formatFileSize(uploadedFile.size)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-blue-400 font-medium text-sm">{processingStep}</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <p className="text-green-300 font-medium text-sm">File processed successfully</p>
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
                className="text-zinc-400 hover:text-fuchsia-500 hover:bg-fuchsia-900/20 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-300 m-6 
              ${isDragOver
                ? 'border-cyan-400/80 bg-gradient-to-br from-cyan-900/40 to-fuchsia-800/20 shadow-glass shadow-cyan-400/20'
                : 'border-cyan-700/30 bg-black/35 hover:border-fuchsia-300/50 hover:bg-fuchsia-900/5 shadow-xl'
            }
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="mx-auto mb-7 w-fit">
              <div className="bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-5 rounded-2xl shadow-xl">
                <Upload className={`h-14 w-14 text-white ${isDragOver ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className={`text-3xl font-black ${isDragOver ? 'text-cyan-200' : 'text-fuchsia-200'} mb-2 transition-all duration-200`}>
                  {isDragOver ? 'Drop your file here!' : 'Upload your resume'}
                </h3>
                <p className="text-gray-200 max-w-sm mx-auto font-light text-lg">
                  Drag and drop your PDF, text file, or image here, or click to browse
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-cyan-800/60 text-cyan-200 border-cyan-400/30 px-3 py-0.5 text-md">
                  <FileText className="h-4 w-4 mr-1" /> PDF
                </Badge>
                <Badge className="bg-green-800/60 text-green-200 border-green-500/30 px-3 py-0.5 text-md">
                  <Image className="h-4 w-4 mr-1" /> Images
                </Badge>
                <Badge className="bg-fuchsia-800/60 text-fuchsia-200 border-fuchsia-500/30 px-3 py-0.5 text-md">
                  <FileText className="h-4 w-4 mr-1" /> Text Files
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
                className="cta-glow bg-gradient-to-tr from-fuchsia-500 to-cyan-400 hover:bg-cyan-700 text-white px-7 py-2 rounded-full font-bold"
              >
                <label htmlFor="file-upload" className="cursor-pointer select-none">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose File
                </label>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
