
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight, Brain, Sparkles, Bot, Users, Shield, Rocket } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

      {/* Enhanced Header */}
      <div className="bg-black/30 backdrop-blur-2xl border-b border-cyan-500/10 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6 text-center lg:text-left">
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-2xl shadow-2xl shadow-cyan-500/25 relative">
                  <Brain className="h-12 w-12 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
                  AI Resume Optimizer
                </h1>
                <p className="text-gray-300 text-xl lg:text-2xl font-light max-w-2xl leading-relaxed">
                  Transform your resume with cutting-edge AI technology. Get past ATS systems and land your dream job.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1.5 text-sm font-medium">
                    <Shield className="h-3 w-3 mr-1.5" />
                    ATS Optimized
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5 text-sm font-medium">
                    <Rocket className="h-3 w-3 mr-1.5" />
                    AI Powered
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-3 py-1.5 text-sm font-medium">
                    <Users className="h-3 w-3 mr-1.5" />
                    Expert Approved
                  </Badge>
                </div>
              </div>
            </div>
            {analysis && (
              <Button
                variant="outline"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center space-x-3 bg-gray-800/30 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-200 transition-all duration-300 px-6 py-3 rounded-xl backdrop-blur-sm"
              >
                <ArrowLeftRight className="h-5 w-5" />
                <span className="font-medium">{showComparison ? 'Hide' : 'Show'} Comparison</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Enhanced Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl p-8 rounded-3xl border border-cyan-500/10 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 hover:border-cyan-500/30">
            <div className="flex items-start space-x-5">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white group-hover:text-cyan-300 transition-colors">ATS Optimized</h3>
                <p className="text-gray-300 leading-relaxed">Beat applicant tracking systems with intelligent keyword optimization and formatting.</p>
              </div>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl p-8 rounded-3xl border border-emerald-500/10 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 hover:border-emerald-500/30">
            <div className="flex items-start space-x-5">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white group-hover:text-emerald-300 transition-colors">AI Powered</h3>
                <p className="text-gray-300 leading-relaxed">Harness GPT-4's intelligence for professional resume enhancement and optimization.</p>
              </div>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:border-purple-500/30">
            <div className="flex items-start space-x-5">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white group-hover:text-purple-300 transition-colors">Smart Analysis</h3>
                <p className="text-gray-300 leading-relaxed">Advanced keyword matching and comprehensive resume scoring algorithms.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Enhanced Input Section */}
          <div className="space-y-10">
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
            
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1"></div>
                <span className="text-cyan-300 font-medium text-sm uppercase tracking-wider">Upload Resume</span>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1"></div>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
            
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-cyan-500/10 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-4 text-white">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/25">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent text-xl font-semibold">
                      Your Resume
                    </span>
                    <p className="text-gray-400 text-sm font-normal mt-1">
                      {resume.length} characters • Ready for optimization
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your current resume text here or upload a file above..."
                  value={resume}
                  onChange={handleResumeChange}
                  className="min-h-[250px] resize-none bg-gray-900/30 border-gray-600/30 text-gray-100 placeholder:text-gray-500 focus:border-cyan-500/40 focus:ring-cyan-500/20 rounded-xl transition-all duration-300"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-emerald-500/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-4 text-white">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg shadow-emerald-500/25">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent text-xl font-semibold">
                      Job Description
                    </span>
                    <p className="text-gray-400 text-sm font-normal mt-1">
                      Target position requirements
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description you're applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[250px] resize-none bg-gray-900/30 border-gray-600/30 text-gray-100 placeholder:text-gray-500 focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl transition-all duration-300"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeWithAI}
              disabled={!resume || !jobDescription || isAnalyzing || !apiKey}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-6 px-10 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-6 w-6 mr-4" />
                  Optimize My Resume with AI
                </>
              )}
            </Button>
          </div>

          {/* Enhanced Results Section */}
          <div className="space-y-10">
            {analysis ? (
              <>
                {/* Enhanced ATS Score */}
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-4 text-white">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg shadow-emerald-500/25">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent text-xl font-semibold">
                            ATS Score
                          </span>
                          <p className="text-gray-400 text-sm font-normal mt-1">
                            AI-powered compatibility analysis
                          </p>
                        </div>
                      </span>
                      <Badge 
                        variant={analysis.atsScore >= 70 ? "default" : "destructive"} 
                        className={`text-2xl px-6 py-3 font-bold rounded-xl shadow-lg ${
                          analysis.atsScore >= 70 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/25' 
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/25'
                        }`}
                      >
                        {analysis.atsScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={analysis.atsScore} className="h-6 bg-gray-800/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/25"
                        style={{ width: `${analysis.atsScore}%` }}
                      ></div>
                    </Progress>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized for ATS systems.' :
                       analysis.atsScore >= 70 ? '👍 Good score! Some improvements can boost your chances further.' :
                       '⚠️ Needs improvement. Follow the AI suggestions below to optimize.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Keyword Analysis */}
                <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-yellow-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-white">
                      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        AI Keyword Analysis
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.keywordMatches.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-900/40 rounded-xl border border-gray-700/50">
                          <span className="font-medium text-gray-100">{keyword.keyword}</span>
                          <div className="flex items-center space-x-3">
                            <Badge variant={keyword.importance === 'high' ? 'destructive' : keyword.importance === 'medium' ? 'default' : 'secondary'}>
                              {keyword.importance}
                            </Badge>
                            {keyword.found ? (
                              <CheckCircle className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-red-400"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-blue-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-white">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        AI Optimization Suggestions
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-3 p-3 bg-gray-900/40 rounded-xl border border-gray-700/50">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1.5 mt-1">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-gray-200 leading-relaxed">{suggestion}</span>
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
                  <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-white">
                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                          <ArrowLeftRight className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                          AI Before & After Comparison
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-3 flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Original Resume</span>
                          </h4>
                          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono leading-relaxed">
                              {resume}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-3 flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span>AI-Optimized Resume</span>
                          </h4>
                          <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono leading-relaxed">
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
              <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-gray-600/20 shadow-2xl">
                <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-8">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-8 rounded-3xl backdrop-blur-sm">
                      <Brain className="h-20 w-20 text-cyan-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <h3 className="text-3xl font-bold text-white">Ready for AI Magic?</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Set up your OpenAI API key, then upload your resume and job description for 
                      <span className="text-cyan-400 font-semibold"> AI-powered optimization</span>.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span>Waiting for your input...</span>
                  </div>
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
