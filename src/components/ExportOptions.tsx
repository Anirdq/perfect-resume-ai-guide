
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Copy, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface ExportOptionsProps {
  resumeText: string;
}

export const ExportOptions = ({ resumeText }: ExportOptionsProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resumeText);
      toast.success('Resume copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const exportAsPDF = () => {
    // Simple PDF export using print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 40px; 
              color: #333;
            }
            pre { 
              white-space: pre-wrap; 
              font-family: Arial, sans-serif; 
              font-size: 12px;
            }
            @media print {
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <pre>${resumeText}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success('Resume ready for PDF export! Use your browser\'s print function to save as PDF.');
    }
  };

  const exportAsText = () => {
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimized-resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Resume exported as text file!');
  };

  const exportAsWord = () => {
    // For Word export, we'll create a simple HTML document that can be opened in Word
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Resume</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <pre>${resumeText}</pre>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimized-resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Resume exported as Word document!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-blue-600" />
          <span>Export Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Text</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsPDF}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Print/PDF</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsText}
            className="flex items-center space-x-2"
          >
            <Clipboard className="h-4 w-4" />
            <span>Text File</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsWord}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Word Doc</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
