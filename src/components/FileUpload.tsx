
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Image, Loader2 } from 'lucide-react';
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
    
    try {
      let extractedText = '';

      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        extractedText = await file.text();
        toast.success('Text file processed successfully!');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
        toast.success('PDF text extracted successfully!');
      } else if (file.type.startsWith('image/')) {
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
    if (!uploadedFile) return <FileText className="h-6 w-6 text-cyan-400" />;
    
    if (uploadedFile.type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-cyan-400" />;
    }
    return <FileText className="h-6 w-6 text-cyan-400" />;
  };

  const getProcessingMessage = () => {
    if (!uploadedFile) return '';
    
    if (uploadedFile.type.startsWith('image/')) {
      return 'Extracting text using OCR...';
    } else if (uploadedFile.type === 'application/pdf') {
      return 'Extracting text from PDF...';
    }
    return 'Processing file...';
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-cyan-500/30 shadow-2xl">
      <CardContent className="p-8">
        {uploadedFile ? (
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  getFileIcon()
                )}
              </div>
              <div>
                <p className="font-semibold text-cyan-100 text-lg">{uploadedFile.name}</p>
                <p className="text-cyan-300">
                  {isProcessing ? getProcessingMessage() : 'File processed successfully'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeFile} 
              disabled={isProcessing}
              className="text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                : 'border-gray-600 hover:border-cyan-500/50 hover:bg-cyan-500/5'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl mx-auto mb-6 w-fit shadow-lg shadow-cyan-500/25">
              <Upload className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Upload your resume
            </h3>
            <p className="text-gray-300 mb-4 text-lg">
              Drag and drop your PDF, text file, or image here, or click to browse
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Supports PDF text extraction and OCR for images
            </p>
            <input
              type="file"
              accept=".pdf,.txt,image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button 
              asChild 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
            >
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
