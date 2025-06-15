import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, CheckCircle, TrendingUp, Zap, Star, ArrowLeftRight, Brain, Sparkles, Bot, Users, Shield, Rocket, Menu, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FileUpload } from '@/components/FileUpload';
import { EditableResume } from '@/components/EditableResume';
import { ExportOptions } from '@/components/ExportOptions';
import { AIResumeService } from '@/services/aiResumeService';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { BrandLogo } from '@/components/BrandLogo';

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
    <div className="min-h-screen bg-gradient-to-br from-[#04182E] via-[#110941] to-[#00080F] relative overflow-x-hidden">
      {/* SaaS Hero Background Effects */}
      <div className="pointer-events-none absolute -z-10 top-0 left-0 w-full h-[110vh]">
        <div className="absolute left-1/2 -translate-x-1/2 top-[-8rem] w-[800px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-fuchsia-500/20 blur-[100px] rounded-full opacity-70 animate-fade-in"></div>
        <div className="absolute left-0 -top-60 w-1/2 h-80 bg-cyan-500/10 blur-2xl rounded-full"></div>
        <div className="absolute right-0 top-1/3 w-1/3 h-72 bg-fuchsia-500/10 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.017\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'2\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>
      
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto py-3 px-4 md:px-8">
          <div className="flex items-center">
            <BrandLogo size={32} />
            <span className="font-bold text-lg md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 tracking-tighter select-none">ResumeAI</span>
          </div>
          <nav className="hidden md:flex gap-7 text-sm font-semibold text-zinc-200">
            <a href="#features" className="hover:text-cyan-300 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-300 transition">How It Works</a>
            <a href="#pricing" className="hover:text-cyan-300 transition">Pricing</a>
          </nav>
          <Button className="ml-1 bg-gradient-to-tr from-fuchsia-600 to-cyan-500 text-white rounded-xl font-bold shadow-xl shadow-fuchsia-400/10 px-6 py-2 hover:scale-105 hover:brightness-110 transition-transform duration-200">
            Try Free
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="py-20 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <BrandLogo size={54} />
          <h1 className="mt-4 text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent tracking-tight leading-tight drop-shadow-xl animate-fade-in">
            AI Resume Optimization<br />
            for Modern Job Seekers
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-2xl mx-auto text-gray-200/90 font-light">
            Transform your resume using AI, get expert-level advice, and make it through any ATS with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Badge className="bg-gradient-to-tr from-cyan-500/30 to-fuchsia-500/10 text-cyan-200 shadow">ATS Proof</Badge>
            <Badge className="bg-gradient-to-bl from-fuchsia-400/30 to-cyan-600/10 text-fuchsia-200 shadow">AI Powered</Badge>
            <Badge className="bg-gradient-to-bl from-blue-300/10 to-fuchsia-500/5 text-blue-200 shadow">Expert Approved</Badge>
          </div>
          <div className="mt-10">
            <Button className="bg-gradient-to-r from-cyan-500 via-fuchsia-400 to-blue-600 text-white py-4 px-10 rounded-2xl text-lg font-bold shadow-lg shadow-fuchsia-400/10 hover:scale-105 transition-transform duration-200">
              Get Started – Free
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        {/* Features */}
        <section id="features" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-cyan-900/40 to-slate-800/20 backdrop-blur-lg hover:shadow-cyan-600/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mt-6 mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-fuchsia-400 p-4 rounded-full shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-cyan-200 mb-2">ATS Optimization</h3>
              <p className="text-gray-300 mb-7 px-4">
                Intelligent keyword matching, upfront ATS scoring, and best-in-class formatting recommendations.
              </p>
            </Card>
            <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-fuchsia-800/20 to-cyan-700/20 backdrop-blur-lg hover:shadow-fuchsia-400/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mt-6 mb-4">
                <div className="bg-gradient-to-br from-fuchsia-400 to-blue-600 p-4 rounded-full shadow-lg">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-fuchsia-200 mb-2">AI Analysis</h3>
              <p className="text-gray-300 mb-7 px-4">
                GPT-powered insights provide actionable improvement points, language upgrades, and high-level strategy.
              </p>
            </Card>
            <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-slate-900/30 to-blue-950/10 backdrop-blur-lg hover:shadow-blue-400/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mt-6 mb-4">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-full shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-200 mb-2">Smart Matching</h3>
              <p className="text-gray-300 mb-7 px-4">
                Instantly compare your resume to job descriptions and highlight your most relevant strengths.
              </p>
            </Card>
          </div>
        </section>

        {/* Main Application Workflow */}
        <section id="how-it-works" className="mb-20">
          <div className="mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-fuchsia-400 drop-shadow-sm mb-4">Get Your Resume AI-Optimized in 3 Steps</h2>
            <p className="mb-12 text-gray-400 max-w-2xl mx-auto font-medium">Upload your resume, target the job you want, and let our AI update and upgrade your profile in minutes.</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 place-items-stretch">
            {/* Inputs */}
            <div className="flex flex-col gap-10">
              <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
              <Card className="rounded-3xl bg-black/60 backdrop-blur-2xl border-0 shadow-2xl shadow-cyan-400/10 p-0 group">
                <CardHeader className="flex flex-row items-center px-8 pt-8 pb-4 gap-5 border-0">
                  <BrandLogo size={24} />
                  <span className="text-lg font-bold text-cyan-300 tracking-tight">1. Upload Your Resume</span>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <FileUpload onFileUpload={handleFileUpload}/>
                </CardContent>
              </Card>
              <Card className="rounded-2xl bg-black/50 border-0 shadow-xl shadow-fuchsia-400/10 p-0">
                <CardHeader className="flex flex-row items-center gap-4 px-8 pt-8 pb-4">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <div>
                    <span className="font-bold text-cyan-200 text-lg">Your Resume</span>
                    <p className="text-gray-500 text-xs font-normal mt-1">{resume.length} characters</p>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Textarea
                    placeholder="Paste your current resume text here or upload above..."
                    value={resume}
                    onChange={handleResumeChange}
                    className="min-h-[180px] bg-zinc-900/40 border-cyan-800/30 text-zinc-100 rounded-xl shadow-inner"
                  />
                </CardContent>
              </Card>
              <Card className="rounded-2xl bg-black/50 border-0 shadow-xl shadow-blue-400/10 p-0">
                <CardHeader className="flex flex-row items-center gap-4 px-8 pt-8 pb-4">
                  <Target className="h-6 w-6 text-green-400" />
                  <span className="font-bold text-green-200 text-lg">Job Description</span>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Textarea
                    placeholder="Paste the job description you're applying for..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[180px] bg-zinc-900/40 border-emerald-800/30 text-zinc-100 rounded-xl shadow-inner"
                  />
                </CardContent>
              </Card>
              <Button
                onClick={analyzeWithAI}
                disabled={!resume || !jobDescription || isAnalyzing || !apiKey}
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-blue-700 hover:scale-[1.04] hover:shadow-lg font-bold text-lg text-white py-5 rounded-2xl shadow-lg shadow-fuchsia-400/20 mt-3 group transition-all"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-pulse blur-sm opacity-30 group-hover:opacity-60 pointer-events-none"></span>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    Optimize My Resume!
                  </>
                )}
              </Button>
            </div>
            {/* Results */}
            <div className="flex flex-col gap-10">
              {analysis ? (
                <>
                  {/* ATS Score */}
                  <Card className="rounded-2xl bg-black/50 border-0 shadow-xl shadow-cyan-300/10">
                    <CardHeader className="flex flex-row justify-between items-center px-8 pt-8 pb-4">
                      <span className="flex gap-4 items-center text-white">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <span className="font-bold text-green-300 text-lg">ATS Compatibility</span>
                      </span>
                      <Badge 
                        variant={analysis.atsScore >= 70 ? "default" : "destructive"} 
                        className={`text-xl px-6 py-2 font-bold rounded-xl ${
                          analysis.atsScore >= 70
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                        }`}
                      >
                        {analysis.atsScore}%
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2 px-8 pb-8">
                      <Progress value={analysis.atsScore} className="h-3" />
                      <p className="text-gray-300 mt-2">
                        {analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized for ATS.' :
                          analysis.atsScore >= 70 ? '👍 Good! A few tweaks can get you to the top.' :
                          '⚠️ Needs improvement. Apply the tips below to stand out.'}
                      </p>
                    </CardContent>
                  </Card>
                  {/* Keyword Analysis */}
                  <Card className="rounded-2xl bg-black/40 border-0 shadow shadow-green-400/10">
                    <CardHeader className="flex flex-row items-center gap-3 px-8 pt-8 pb-4">
                      <Star className="h-6 w-6 text-yellow-300" />
                      <span className="font-bold text-yellow-200 text-lg">Keyword Fit</span>
                    </CardHeader>
                    <CardContent className="space-y-2 px-8 pb-8">
                      <div className="space-y-2">
                        {analysis.keywordMatches.map((keyword, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-black/40 px-4 py-2 rounded shadow-inner font-medium text-gray-200">
                            <span>{keyword.keyword}</span>
                            <span className="flex gap-2 items-center">
                              <Badge variant={
                                keyword.importance === 'high'
                                  ? 'destructive'
                                  : keyword.importance === 'medium'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {keyword.importance}
                              </Badge>
                              {keyword.found
                                ? <CheckCircle className="w-5 h-5 text-green-400" />
                                : <div className="h-5 w-5 rounded-full border-2 border-red-400"></div>
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Recommendations */}
                  <Card className="rounded-2xl bg-black/40 border-0 shadow shadow-blue-400/10">
                    <CardHeader className="flex flex-row items-center gap-3 px-8 pt-8 pb-4">
                      <TrendingUp className="h-6 w-6 text-blue-300" />
                      <span className="font-bold text-blue-200 text-lg">AI Recommendations</span>
                    </CardHeader>
                    <CardContent className="space-y-2 px-8 pb-8">
                      <ul className="space-y-3">
                        {analysis.suggestions.map((s, idx) => (
                          <li key={idx} className="flex gap-3 bg-gradient-to-r from-cyan-900/30 to-transparent px-4 py-2 rounded-lg text-cyan-100/90">
                            <div className="bg-cyan-500/20 rounded-full w-2 h-2 mt-2"></div>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  {/* Optimized Resume Editor */}
                  <EditableResume 
                    initialResume={optimizedResume}
                    onSave={handleOptimizedResumeSave}
                  />
                  <ExportOptions resumeText={optimizedResume} />
                  {showComparison && (
                    <Card className="rounded-2xl bg-black/50 border-0 shadow-blue-300/10 shadow mt-4">
                      <CardHeader className="flex flex-row items-center gap-3 px-8 pt-8 pb-4">
                        <ArrowLeftRight className="h-6 w-6 text-fuchsia-300" />
                        <span className="font-bold text-fuchsia-200 text-lg">Before & After Comparison</span>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-8">
                        <div>
                          <h4 className="font-semibold text-gray-400 mb-3 flex gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div>Original Resume</h4>
                          <div className="bg-zinc-900/50 border border-red-300/10 p-4 rounded-lg max-h-44 overflow-y-auto shadow-md">
                            <pre className="whitespace-pre-wrap text-xs text-gray-200 font-mono">{resume}</pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-400 mb-3 flex gap-2"><div className="w-3 h-3 bg-green-400 rounded-full"></div>AI-Optimized Resume</h4>
                          <div className="bg-zinc-900/50 border border-green-300/10 p-4 rounded-lg max-h-44 overflow-y-auto shadow-md">
                            <pre className="whitespace-pre-wrap text-xs text-gray-200 font-mono">{optimizedResume}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="rounded-2xl bg-gradient-to-br from-cyan-800/10 to-fuchsia-900/5 shadow-xl shadow-cyan-500/5 border-0 flex flex-col items-center justify-center py-24 text-center">
                  <div className="bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-8 rounded-full mb-6">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-cyan-100 mb-2">
                    Ready to Upgrade Your Resume?
                  </h3>
                  <p className="text-gray-300 max-w-md">
                    Set up your OpenAI API key, upload your resume, and add the job description to get your AI-powered boost!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-black/80 border-t border-cyan-400/10 py-10 mt-14">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center">
            <BrandLogo size={28} />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 tracking-tight">ResumeAI</span>
            <span className="text-zinc-400 ml-3 font-light text-sm">
              &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
            </span>
          </div>
          <div className="text-zinc-500 text-xs">
            Powered by OpenAI &amp; 💎 SaaS-class Design
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
