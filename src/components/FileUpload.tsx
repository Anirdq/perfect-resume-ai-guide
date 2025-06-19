import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Image, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Set up PDF.js worker with matching version
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setHasError(false);
    
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
      console.log('Starting PDF text extraction...');
      const arrayBuffer = await file.arrayBuffer();
      
      // Use the updated PDF.js API
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/'
      });
      
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
      
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log(`PDF text extraction completed. Total characters: ${fullText.length}`);
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
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
    setHasError(false);
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
      setHasError(false);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(`Failed to extract text from file: ${error.message}`);
      setHasError(true);
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
    <Card className="shadow-sm border-0" aria-live="polite">
      <CardContent className="p-0">
        {uploadedFile ? (
          <div className="p-6 animate-scale-in">
            <div
              className={`flex items-center justify-between p-6 rounded-xl border transition-all
                ${isProcessing ? "bg-blue-50 border-blue-200" : hasError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
              aria-live="polite"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${isProcessing ? "bg-blue-600" : hasError ? "bg-red-600" : "bg-green-600"}`}>
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : hasError ? (
                    <AlertCircle className="h-6 w-6 text-white animate-pulse" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                      {formatFileSize(uploadedFile.size)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-blue-600 font-medium text-sm">{processingStep}</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-green-600 font-medium text-sm">File processed successfully</p>
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
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 m-6 
              flex flex-col gap-6 items-center group focus-within:ring-2 focus-within:ring-blue-400
              ${isDragOver ? "border-blue-400 bg-blue-50" : hasError ? "border-red-400 bg-red-50 animate-shake" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
            `}
            tabIndex={0}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            aria-label="Upload your resume"
          >
            <div className="mx-auto mb-6 w-fit">
              <div className="bg-blue-600 p-4 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                <Upload className={`h-12 w-12 text-white ${isDragOver ? "animate-bounce" : ""}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-row items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                <span>{isDragOver ? "Drop your file here!" : "Upload your resume"}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Info className="w-4 h-4 text-blue-400" aria-label="Help" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      We support PDF, image, and TXT files. Choose what fits best!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-600 max-w-sm mx-auto">
                Drag and drop your PDF, text file, or image here, or click to browse
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Image className="h-3 w-3 mr-1" />
                Images
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <FileText className="h-3 w-3 mr-1" />
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
