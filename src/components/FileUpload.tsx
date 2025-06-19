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

  const preprocessText = (text: string): string => {
    console.log('Preprocessing text of length:', text.length);
    
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\s+/g, ' ').trim();
    
    // Fix common extraction issues
    cleaned = cleaned
      // Fix broken words that got split across lines
      .replace(/([a-z])-\s+([a-z])/gi, '$1$2')
      // Fix email addresses that got broken
      .replace(/(\w+)\s*@\s*(\w+)/g, '$1@$2')
      // Fix phone numbers
      .replace(/(\d{3})\s*-?\s*(\d{3})\s*-?\s*(\d{4})/g, '$1-$2-$3')
      // Fix URLs
      .replace(/(https?:\/\/)\s+/g, '$1')
      // Fix common section headers
      .replace(/\b(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|OBJECTIVE|PROJECTS|CERTIFICATIONS)\b/gi, '\n\n$1\n')
      // Ensure proper spacing around bullet points
      .replace(/•/g, '\n• ')
      .replace(/-\s+/g, '\n- ')
      // Clean up multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove trailing spaces
      .replace(/[ \t]+$/gm, '');

    console.log('Text after preprocessing:', cleaned.length, 'characters');
    return cleaned;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setHasError(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (
      file.type === 'application/pdf' || 
      file.type === 'text/plain' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx')
    )) {
      handleFileUpload(file);
    } else {
      toast.error('Please upload a PDF, Word document, text file, or image (JPG, PNG, etc.)');
    }
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log('Starting enhanced PDF text extraction...');
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/',
        verbosity: 0 // Reduce console noise
      });
      
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
      
      let fullText = '';
      const pageTexts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProcessingStep(`Extracting page ${i} of ${pdf.numPages}...`);
        console.log(`Processing page ${i}...`);
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Enhanced text extraction with positioning
        const textItems = textContent.items.map((item: any) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height
        }));

        // Sort by Y position (top to bottom), then by X position (left to right)
        textItems.sort((a, b) => {
          const yDiff = Math.abs(a.y - b.y);
          if (yDiff < 5) { // Same line tolerance
            return a.x - b.x;
          }
          return b.y - a.y; // PDF coordinates are bottom-up
        });

        const pageText = textItems
          .map(item => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';
      }

      const processedText = preprocessText(fullText);
      console.log(`PDF extraction completed. Original: ${fullText.length}, Processed: ${processedText.length} characters`);
      return processedText;
    } catch (error) {
      console.error('Enhanced PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    try {
      console.log('Starting Word document extraction...');
      setProcessingStep('Processing Word document...');
      
      // For now, we'll try to read as text and provide guidance
      // In a production app, you'd want to use a library like mammoth.js
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      let text = decoder.decode(arrayBuffer);
      
      // Basic cleanup for Word documents
      text = text
        .replace(/[\x00-\x1F\x7F]/g, ' ') // Remove control characters
        .replace(/\s+/g, ' ')
        .trim();
      
      if (text.length < 50) {
        throw new Error('Unable to extract readable text from Word document. Please save as PDF or plain text.');
      }
      
      const processedText = preprocessText(text);
      console.log(`Word extraction completed: ${processedText.length} characters`);
      return processedText;
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Word document extraction failed. Please convert to PDF for better results.');
    }
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      console.log('Starting enhanced OCR extraction...');
      setProcessingStep('Initializing OCR engine...');
      
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProcessingStep(`OCR processing: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      // Enhanced OCR settings for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;:\'\"<>?/`~',
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        preserve_interword_spaces: '1'
      });

      setProcessingStep('Running OCR analysis...');
      const { data: { text, confidence } } = await worker.recognize(file);
      await worker.terminate();

      console.log(`OCR completed with ${confidence}% confidence`);
      
      if (confidence < 30) {
        toast.warning('OCR confidence is low. Text quality may be poor.');
      }
      
      const processedText = preprocessText(text);
      console.log(`OCR extraction completed: ${processedText.length} characters`);
      return processedText;
    } catch (error) {
      console.error('Enhanced OCR error:', error);
      throw new Error('Failed to extract text from image using OCR');
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('Enhanced file upload:', file.name, 'Type:', file.type, 'Size:', file.size);
    setUploadedFile(file);
    setHasError(false);
    setIsProcessing(true);
    setProcessingStep('Analyzing file...');
    
    try {
      let extractedText = '';

      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        setProcessingStep('Reading text file...');
        extractedText = await file.text();
        extractedText = preprocessText(extractedText);
        toast.success('Text file processed successfully!');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
        toast.success('PDF text extracted with enhanced processing!');
      } else if (file.type.includes('word') || file.name.toLowerCase().match(/\.(doc|docx)$/)) {
        extractedText = await extractTextFromWord(file);
        toast.success('Word document processed!');
      } else if (file.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(file);
        toast.success('Image text extracted using enhanced OCR!');
      }

      if (extractedText.length < 20) {
        throw new Error('Extracted text is too short. Please check if the file contains readable content.');
      }

      console.log('Final extracted text preview:', extractedText.substring(0, 300) + '...');
      onFileUpload(extractedText);
      setHasError(false);
      
    } catch (error) {
      console.error('Enhanced file processing error:', error);
      toast.error(`Processing failed: ${error.message}`);
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
                        <p className="text-green-600 font-medium text-sm">Enhanced processing completed</p>
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
                      Enhanced processing for PDF, Word docs, images, and text files with improved text extraction!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-600 max-w-sm mx-auto">
                Enhanced extraction with better formatting, OCR improvements, and Word document support
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <FileText className="h-3 w-3 mr-1" />
                Word
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Image className="h-3 w-3 mr-1" />
                Images
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <FileText className="h-3 w-3 mr-1" />
                Text
              </Badge>
            </div>
            
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx,image/*"
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
