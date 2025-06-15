import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight, Brain, Sparkles, Bot, Users, Shield, Rocket, Menu } from 'lucide-react';
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

  const handleFileUpload = useCallback((text: string) => {
    console.log('Index component received file upload text:', text.substring(0, 100) + '...');
    console.log('Setting resume state to:', text.length, 'characters');
    setResume(text);
  }, []);

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newResume = e.target.value;
    console.log('Manual resume change:', newResume.length, 'characters');
    setResume(newResume);
  };

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

    console.log('Starting AI analysis with resume length:', resume.length);
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
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
                <p className="text-xs text-gray-500">Professional Resume Optimization</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
              {analysis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </Button>
              )}
            </nav>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Optimize Your Resume with
              <span className="text-blue-600"> AI Technology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Beat ATS systems and land your dream job with our AI-powered resume optimization platform. 
              Get professional insights and personalized improvements in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                ATS Optimized
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                AI Powered
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-semibold">
                <Users className="h-4 w-4 mr-2" />
                Expert Approved
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Section */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ResumeAI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI technology analyzes your resume against job requirements and provides actionable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-sm">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS Optimization</h3>
                <p className="text-gray-600">
                  Ensure your resume passes through Applicant Tracking Systems with intelligent keyword optimization.
                </p>
              </div>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-sm">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Get detailed insights powered by advanced AI that understands recruitment best practices.
                </p>
              </div>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-sm">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Matching</h3>
                <p className="text-gray-600">
                  Match your skills and experience with job requirements for maximum impact.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Main Application Section */}
        <section id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-lg text-gray-600">
              Upload your resume, add the job description, and let our AI do the magic.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-8">
              <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
              
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <span>Upload Your Resume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handleFileUpload} />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span>Your Resume</span>
                      <p className="text-sm text-gray-500 font-normal mt-1">
                        {resume.length} characters
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your current resume text here or upload a file above..."
                    value={resume}
                    onChange={handleResumeChange}
                    className="min-h-[200px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing Your Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Optimize My Resume
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
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
                        <Badge 
                          variant={analysis.atsScore >= 70 ? "default" : "destructive"} 
                          className={`text-2xl px-4 py-2 font-bold ${
                            analysis.atsScore >= 70 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {analysis.atsScore}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={analysis.atsScore} className="h-3" />
                      <p className="text-gray-600">
                        {analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized for ATS systems.' :
                         analysis.atsScore >= 70 ? '👍 Good score! Some improvements can boost your chances further.' :
                         '⚠️ Needs improvement. Follow the AI suggestions below to optimize.'}
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
                              <Badge 
                                variant={keyword.importance === 'high' ? 'destructive' : keyword.importance === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {keyword.importance}
                              </Badge>
                              {keyword.found ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-red-400"></div>
                              )}
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

                  <EditableResume 
                    initialResume={optimizedResume}
                    onSave={handleOptimizedResumeSave}
                  />

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
                      Set up your OpenAI API key, upload your resume, and add the job description to get started with AI-powered optimization.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
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
