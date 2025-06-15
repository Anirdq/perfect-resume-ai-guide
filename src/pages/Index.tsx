import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { FileUpload } from '@/components/FileUpload';
import { EditableResume } from '@/components/EditableResume';
import { ExportOptions } from '@/components/ExportOptions';
import { AIResumeService } from '@/services/aiResumeService';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [aiService, setAiService] = useState<AIResumeService | null>(null);

  const handleApiKeySet = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    setAiService(new AIResumeService(key));
  }, []);

  const analyzeWithAI = async () => {
    if (!aiService) {
      toast.error('Please set up your OpenAI API key first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Run analysis and optimization in parallel
      const [analysisResult, optimizedResumeResult] = await Promise.all([
        aiService.analyzeResume(resume, jobDescription),
        aiService.optimizeResume(resume, jobDescription)
      ]);

      setAnalysis(analysisResult);
      setOptimizedResume(optimizedResumeResult);
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('AI analysis failed. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initialize AI service if API key exists
  useState(() => {
    if (apiKey) {
      setAiService(new AIResumeService(apiKey));
    }
  });

  const handleOptimizedResumeSave = (newResume: string) => {
    setOptimizedResume(newResume);
    toast.success('Resume changes saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Optimizer</h1>
                <p className="text-gray-600">Tailor your resume for any job with AI-powered optimization</p>
              </div>
            </div>
            {analysis && (
              <Button
                variant="outline"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center space-x-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">ATS Optimized</h3>
              <p className="text-sm text-gray-600">Beat applicant tracking systems</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Zap className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Real AI Powered</h3>
              <p className="text-sm text-gray-600">GPT-4 powered optimization</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
              <p className="text-sm text-gray-600">Advanced keyword matching</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
            
            <FileUpload onFileUpload={setResume} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Your Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your current resume text here or upload a file above..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Job Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description you're applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeWithAI}
              disabled={!resume || !jobDescription || isAnalyzing || !apiKey}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize My Resume with AI
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* ATS Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>AI-Powered ATS Score</span>
                      </span>
                      <Badge variant={analysis.atsScore >= 70 ? "default" : "destructive"} className="text-lg px-3 py-1">
                        {analysis.atsScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysis.atsScore} className="h-3" />
                    <p className="text-sm text-gray-600 mt-2">
                      {analysis.atsScore >= 80 ? 'Excellent! Your resume is well-optimized for ATS.' :
                       analysis.atsScore >= 70 ? 'Good score! Some improvements can boost your chances.' :
                       'Needs improvement. Follow the AI suggestions below.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Keyword Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span>AI Keyword Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.keywordMatches.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{keyword.keyword}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant={keyword.importance === 'high' ? 'destructive' : keyword.importance === 'medium' ? 'default' : 'secondary'}>
                              {keyword.importance}
                            </Badge>
                            {keyword.found ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-red-300"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>AI Optimization Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* AI-Optimized Resume with Real-time Editing */}
                <EditableResume 
                  initialResume={optimizedResume}
                  onSave={handleOptimizedResumeSave}
                />

                {/* Export Options */}
                <ExportOptions resumeText={optimizedResume} />

                {/* Side-by-side Comparison */}
                {showComparison && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ArrowLeftRight className="h-5 w-5 text-purple-600" />
                        <span>AI Before & After Comparison</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">Original Resume</h4>
                          <div className="bg-red-50 p-3 rounded border border-red-200 max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                              {resume}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">AI-Optimized Resume</h4>
                          <div className="bg-green-50 p-3 rounded border border-green-200 max-h-60 overflow-y-auto">
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
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for AI Analysis?</h3>
                  <p className="text-gray-500 text-center">
                    Set up your OpenAI API key, then upload your resume and job description for AI-powered optimization.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
