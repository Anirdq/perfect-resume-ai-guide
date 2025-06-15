
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight, Brain, Sparkles, Bot } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Futuristic Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/25">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  AI Resume Optimizer
                </h1>
                <p className="text-gray-300 text-lg">Next-generation resume optimization powered by AI</p>
              </div>
            </div>
            {analysis && (
              <Button
                variant="outline"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center space-x-2 bg-gray-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white mb-1">ATS Optimized</h3>
                <p className="text-gray-300">Beat applicant tracking systems</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/20 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white mb-1">AI Powered</h3>
                <p className="text-gray-300">GPT-4 powered optimization</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white mb-1">Smart Analysis</h3>
                <p className="text-gray-300">Advanced keyword matching</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-8">
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
            
            <FileUpload onFileUpload={handleFileUpload} />
            
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Your Resume ({resume.length} characters)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your current resume text here or upload a file above..."
                  value={resume}
                  onChange={handleResumeChange}
                  className="min-h-[200px] resize-none bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder:text-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-emerald-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    Job Description
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description you're applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeWithAI}
              disabled={!resume || !jobDescription || isAnalyzing || !apiKey}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-3" />
                  Optimize My Resume with AI
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {analysis ? (
              <>
                {/* ATS Score */}
                <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-emerald-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-3 text-white">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                          AI-Powered ATS Score
                        </span>
                      </span>
                      <Badge 
                        variant={analysis.atsScore >= 70 ? "default" : "destructive"} 
                        className={`text-lg px-4 py-2 font-bold ${
                          analysis.atsScore >= 70 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                        }`}
                      >
                        {analysis.atsScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysis.atsScore} className="h-4 bg-gray-700/50" />
                    <p className="text-gray-300 mt-3 text-sm">
                      {analysis.atsScore >= 80 ? 'Excellent! Your resume is well-optimized for ATS.' :
                       analysis.atsScore >= 70 ? 'Good score! Some improvements can boost your chances.' :
                       'Needs improvement. Follow the AI suggestions below.'}
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
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-600/30 shadow-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-2xl mb-6">
                    <Brain className="h-16 w-16 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready for AI Analysis?</h3>
                  <p className="text-gray-300 text-center max-w-md leading-relaxed">
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
