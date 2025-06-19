import GlassNavbar from "@/components/GlassNavbar";
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight, Brain, Sparkles, Bot, Users, Shield, Rocket, Menu, Info } from 'lucide-react';
import { toast } from 'sonner';
import { FileUpload } from '@/components/FileUpload';
import { EditableResume } from '@/components/EditableResume';
import { ExportOptions } from '@/components/ExportOptions';
import { ProviderAgnosticAIResumeService } from "@/services/providerAgnosticAIService";
import { StepIndicator } from "@/components/StepIndicator";
import { ConfirmOptimizeModal } from "@/components/ConfirmOptimizeModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TextProcessor } from '@/utils/textProcessor';

const steps = [
  {
    title: "Upload Resume",
    tooltip: "PDF, text, or image files accepted.",
    description: "Drag & drop, browse, or paste your resume here.",
  },
  {
    title: "Preview & Edit",
    tooltip: "Review and tweak your resume before optimization.",
    description: "Real-time preview. Make edits if needed.",
  },
  {
    title: "Optimize",
    tooltip: "AI will rewrite & suggest improvements tailored to your job.",
    description: "See ATS score and instant recommendations!",
  }
];

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [aiService] = useState(() => new ProviderAgnosticAIResumeService());
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileUpload = useCallback((text: string) => {
    console.log('Index component received file upload text:', text.substring(0, 100) + '...');
    
    // Process the text for better analysis
    const processed = TextProcessor.processText(text);
    const summary = TextProcessor.generateProcessingSummary(processed);
    
    console.log('Text processing summary:', summary);
    console.log('Setting resume state to:', processed.cleanedText.length, 'characters');
    
    setResume(processed.cleanedText);
    setCurrentStep(1);
    
    // Show processing summary
    toast.success('Resume uploaded and enhanced!', {
      description: `Processed ${processed.statistics.wordCount} words with ${processed.statistics.sectionsFound} sections detected.`
    });
  }, []);

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newResume = e.target.value;
    console.log('Manual resume change:', newResume.length, 'characters');
    setResume(newResume);
    if (e.target.value.length > 0 && currentStep < 1) setCurrentStep(1);
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleNext = () => {
    if (currentStep === 0 && !resume) {
      toast.error("Please upload your resume.");
      return;
    }
    if (currentStep === 1 && (!resume || resume.length < 50)) {
      toast.error("Resume looks too short!");
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const analyzeWithAI = async () => {
    if (!resume) {
      toast.error("Please upload a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please add a job description to optimize your resume");
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting AI analysis with resume length:', resume.length, 'and job description length:', jobDescription.length);
      
      const [analysisResult, optimizedResumeResult] = await Promise.all([
        aiService.analyzeResume(resume, jobDescription), 
        aiService.optimizeResume(resume, jobDescription)
      ]);
      
      console.log('AI analysis completed successfully', analysisResult);
      setAnalysis(analysisResult);
      setOptimizedResume(optimizedResumeResult);
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error(`AI analysis failed: ${error.message || 'Please try again later'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizedResumeSave = (newResume: string) => {
    setOptimizedResume(newResume);
    toast.success('Resume changes saved!');
  };

  const handleStartOptimization = () => {
    if (!jobDescription.trim()) {
      toast.error("Please add a job description first");
      return;
    }
    setShowConfirm(true);
  };

  const confirmOptimize = async () => {
    setShowConfirm(false);
    await analyzeWithAI();
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlassNavbar />
      <div className="pt-20 px-2 pb-8 max-w-4xl mx-auto flex flex-col">
        <div className="mt-10">
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>
        <div className="flex flex-col gap-8">
          {/* Step 1: Upload */}
          {currentStep === 0 && (
            <div className="bg-white rounded-2xl py-8 px-4 shadow-md animate-fade-in">
              <FileUpload onFileUpload={handleFileUpload} />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow hover-scale"
                  aria-label="Next: Review Resume"
                  disabled={!resume}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Preview/Edit */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-md py-6 px-4 flex flex-col">
                <label className="font-bold flex items-center gap-2 mb-2">
                  <span>Your Resume</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Info className="w-4 h-4 text-blue-400" aria-label="Help" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Make edits or additions to your uploaded resume below.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <Textarea
                  aria-label="Edit your resume"
                  placeholder="Paste your current resume text here or upload a file above..."
                  value={resume}
                  onChange={handleResumeChange}
                  className="min-h-[220px] font-mono resize-none mb-2"
                />
                <div className="flex flex-row justify-between items-center text-sm text-gray-400 pt-1">
                  <span>{resume.length} characters</span>
                  {resume.length ? (
                    <span className="text-green-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" /> Ready
                    </span>
                  ) : null}
                </div>
              </div>
              
              {/* Job Description Input */}
              <div className="bg-white rounded-2xl shadow-md py-6 px-4 flex flex-col">
                <label className="font-bold flex items-center gap-2 mb-2">
                  <span>Job Description</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Info className="w-4 h-4 text-blue-400" aria-label="Help" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Paste the job description you're applying for to get targeted optimization.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <Textarea
                  aria-label="Job description"
                  placeholder="Paste the job description here to optimize your resume for this specific role..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  className="min-h-[220px] resize-none mb-2"
                />
                <div className="flex flex-row justify-between items-center text-sm text-gray-400 pt-1">
                  <span>{jobDescription.length} characters</span>
                  {jobDescription.length ? (
                    <span className="text-green-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" /> Ready
                    </span>
                  ) : null}
                </div>
                
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow hover-scale"
                  onClick={handleStartOptimization}
                  disabled={!resume || !jobDescription.trim() || isAnalyzing}
                  aria-label="Proceed to Optimization"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" /> Optimize My Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Optimization Results */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              {analysis ? (
                <>
                  <Card className="shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-600 p-2 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span>ATS Compatibility Score</span>
                            <p className="text-sm text-gray-500 font-normal mt-1">
                              AI-powered analysis
                            </p>
                          </div>
                        </div>
                        <Badge variant={analysis.atsScore >= 70 ? "default" : "destructive"} className={`text-2xl px-4 py-2 font-bold ${analysis.atsScore >= 70 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                          {analysis.atsScore}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={analysis.atsScore} className="h-3" />
                      <p className="text-gray-600">
                        {analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized for ATS systems.' : analysis.atsScore >= 70 ? '👍 Good score! Some improvements can boost your chances further.' : '⚠️ Needs improvement. Follow the AI suggestions below to optimize.'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="bg-yellow-500 p-2 rounded-lg">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <span>Keyword Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.keywordMatches.map((keyword, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{keyword.keyword}</span>
                            <div className="flex items-center space-x-3">
                              <Badge variant={keyword.importance === 'high' ? 'destructive' : keyword.importance === 'medium' ? 'default' : 'secondary'} className="text-xs">
                                {keyword.importance}
                              </Badge>
                              {keyword.found ? <CheckCircle className="h-5 w-5 text-green-500" /> : <div className="h-5 w-5 rounded-full border-2 border-red-400"></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <span>AI Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <div className="bg-blue-600 rounded-full p-1 mt-1">
                              <div className="h-2 w-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <EditableResume initialResume={optimizedResume} onSave={handleOptimizedResumeSave} />

                  <ExportOptions resumeText={optimizedResume} />

                  {showComparison && (
                    <Card className="shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="bg-purple-600 p-2 rounded-lg">
                            <ArrowLeftRight className="h-5 w-5 text-white" />
                          </div>
                          <span>Before & After Comparison</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Original Resume</span>
                            </h4>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-h-60 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                                {resume}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>AI-Optimized Resume</span>
                            </h4>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg max-h-60 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                                {optimizedResume}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="shadow-sm border-0">
                  <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-gray-100 p-8 rounded-full mb-6">
                      <Brain className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Optimize?</h3>
                    <p className="text-gray-600 max-w-md">
                      Upload your resume and add the job description to get started with AI-powered optimization.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Confirmation Modal */}
        <ConfirmOptimizeModal
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmOptimize}
          loading={isAnalyzing}
        />
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ResumeAI</h3>
                <p className="text-sm text-gray-400">Professional Resume Optimization</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ResumeAI. Powered by advanced AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
