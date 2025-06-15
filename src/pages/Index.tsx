import { useState } from 'react';
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

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const mockAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      atsScore: 78,
      keywordMatches: [
        { keyword: 'JavaScript', found: true, importance: 'high' },
        { keyword: 'React', found: true, importance: 'high' },
        { keyword: 'Node.js', found: false, importance: 'medium' },
        { keyword: 'TypeScript', found: true, importance: 'medium' },
        { keyword: 'API Development', found: false, importance: 'high' },
        { keyword: 'Agile', found: true, importance: 'low' },
      ],
      suggestions: [
        'Add "Node.js" experience to match job requirements',
        'Include "API Development" in your technical skills',
        'Quantify your achievements with specific metrics',
        'Use more action verbs like "developed", "implemented", "optimized"'
      ]
    };

    const mockOptimizedResume = `JOHN DOE
Senior Frontend Developer

EXPERIENCE
• Developed and maintained React applications serving 10,000+ users
• Implemented responsive web designs using JavaScript and TypeScript
• Collaborated with cross-functional teams in Agile environment
• Built RESTful API integrations to enhance user experience

SKILLS
• JavaScript, React, TypeScript, Node.js
• API Development, REST APIs
• HTML5, CSS3, Responsive Design
• Git, Agile Methodologies`;
    
    setAnalysis(mockAnalysis);
    setOptimizedResume(mockOptimizedResume);
    setIsAnalyzing(false);
    toast.success('Resume analysis completed!');
  };

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
              <h3 className="font-semibold text-gray-900">AI Powered</h3>
              <p className="text-sm text-gray-600">Smart keyword matching</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Instant Results</h3>
              <p className="text-sm text-gray-600">Get optimized resume in seconds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
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
              onClick={mockAnalyze}
              disabled={!resume || !jobDescription || isAnalyzing}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize My Resume
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
                        <span>ATS Compatibility Score</span>
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
                       'Needs improvement. Follow the suggestions below.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Keyword Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span>Keyword Analysis</span>
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

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Optimization Suggestions</span>
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

                {/* Optimized Resume with Real-time Editing */}
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
                        <span>Before & After Comparison</span>
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
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">Optimized Resume</h4>
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
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Optimize?</h3>
                  <p className="text-gray-500 text-center">
                    Upload or paste your resume and job description to get AI-powered optimization suggestions.
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
