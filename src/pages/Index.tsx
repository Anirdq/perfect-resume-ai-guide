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
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Futuristic overlays */}
      <div className="blend-overlay-cyan"></div>
      <div className="blend-overlay-violet"></div>
      <div className="blend-future-lines"></div>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-indigo-600/20 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-4 md:px-8">
          <div className="flex items-center">
            <BrandLogo size={34} />
            <span className="font-extrabold text-2xl text-glow tracking-tight select-none">ResumeAI</span>
          </div>
          <nav className="hidden md:flex gap-8 text-lg font-semibold text-indigo-100/95">
            <a href="#features" className="hover:text-cyan-200 transition underline-offset-4 hover:underline">Features</a>
            <a href="#how-it-works" className="hover:text-fuchsia-200 transition underline-offset-4 hover:underline">How It Works</a>
            <a href="/pricing" className="hover:text-blue-300 transition underline-offset-4 hover:underline">Pricing</a>
          </nav>
          <Button className="ml-1 px-7 py-2 rounded-full font-bold shadow-fancy bg-gradient-to-tr from-fuchsia-500 to-cyan-400 text-white cta-glow text-lg tracking-tight">
            Try Free
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="py-24 md:py-32 relative z-10 text-center flex flex-col gap-2">
        <div className="max-w-4xl mx-auto">
          <BrandLogo size={64} />
          <h1 className="mt-4 text-6xl md:text-8xl font-black text-glow tracking-tighter leading-tight drop-shadow-xl animate-fade-in">
            AI Resume Optimization<br />
            <span className="bg-gradient-to-r from-blue-200 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">for Modern Job Seekers</span>
          </h1>
          <p className="mt-8 text-2xl md:text-3xl max-w-2xl mx-auto text-zinc-200/90 font-extralight tracking-wide">
            Transform your resume using AI, get expert-level advice, and make it through any ATS with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <Badge className="bg-gradient-to-tr from-cyan-400/40 to-fuchsia-500/20 text-cyan-100 shadow-lg py-2 px-4 text-lg rounded-full border-0">ATS Proof</Badge>
            <Badge className="bg-gradient-to-bl from-fuchsia-400/40 to-blue-500/15 text-fuchsia-100 shadow-lg py-2 px-4 text-lg rounded-full border-0">AI Powered</Badge>
            <Badge className="bg-gradient-to-bl from-blue-300/10 to-fuchsia-300/10 text-blue-100 shadow-lg py-2 px-4 text-lg rounded-full border-0">Expert Approved</Badge>
          </div>
          <div className="mt-12">
            <Button className="cta-glow rounded-full px-10 py-4 text-xl font-bold tracking-tight">
              Get Started – Free
            </Button>
          </div>
        </div>
      </section>

      {/* BLENDED FUTURISTIC FEATURE SECTION */}
      <section className="section-future relative z-20 mb-20 py-14 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-glow text-center pb-8">Why ResumeAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card className="card-glass card-gradient-border hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mt-8 mb-5">
              <div className="bg-gradient-to-br from-cyan-500 to-fuchsia-400 p-5 rounded-full shadow-xl ring-4 ring-cyan-400/10">
                <Target className="h-11 w-11 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-cyan-100 mb-3 text-center">ATS Optimization</h3>
            <p className="text-indigo-100/80 mb-8 px-6 font-light text-center">
              Intelligent keyword matching, upfront ATS scoring, and best-in-class formatting recommendations.
            </p>
          </Card>
          <Card className="card-glass card-gradient-border hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mt-8 mb-5">
              <div className="bg-gradient-to-br from-fuchsia-400 to-blue-600 p-5 rounded-full shadow-xl ring-4 ring-fuchsia-400/10">
                <Bot className="h-11 w-11 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-fuchsia-100 mb-3 text-center">AI Analysis</h3>
            <p className="text-indigo-100/80 mb-8 px-6 font-light text-center">
              GPT-powered insights provide actionable improvement points, language upgrades, and high-level strategy.
            </p>
          </Card>
          <Card className="card-glass card-gradient-border hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mt-8 mb-5">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-5 rounded-full shadow-xl ring-4 ring-blue-400/10">
                <Sparkles className="h-11 w-11 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-blue-100 mb-3 text-center">Smart Matching</h3>
            <p className="text-indigo-100/80 mb-8 px-6 font-light text-center">
              Instantly compare your resume to job descriptions and highlight your most relevant strengths.
            </p>
          </Card>
        </div>
      </section>
      {/* Main Application Workflow */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-14">
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
