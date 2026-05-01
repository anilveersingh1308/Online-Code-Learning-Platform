import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronDown, ChevronUp, Check, X, Lightbulb, Code,
  Eye, EyeOff, Play, Copy, CheckCircle, Trophy, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// ========================
// Code Example Component
// ========================
export const CodeExample = ({ example, index }) => {
  const { theme } = useTheme();
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-500" />
              <CardTitle className="text-lg">{example.title}</CardTitle>
            </div>
            <Badge variant="secondary">{example.language}</Badge>
          </div>
          {example.description && (
            <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative group">
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={theme === 'dark' ? oneDark : oneLight}
              language={example.language || 'python'}
              customStyle={{ margin: 0, borderRadius: 0 }}
            >
              {example.code}
            </SyntaxHighlighter>
          </div>

          {example.expected_output && (
            <div className="border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-between rounded-none h-10"
                onClick={() => setShowOutput(!showOutput)}
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Expected Output
                </span>
                {showOutput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <AnimatePresence>
                {showOutput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-muted/50 p-4 font-mono text-sm overflow-hidden"
                  >
                    <pre className="whitespace-pre-wrap">{example.expected_output}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {example.explanation && (
            <div className="p-4 bg-cyan-500/5 border-t border-border">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{example.explanation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ========================
// Exercise Component
// ========================
export const ExerciseCard = ({ exercise, index }) => {
  const { theme } = useTheme();
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [completed, setCompleted] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    toast.success('Exercise marked as complete! 🎉');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-6"
    >
      <Card className={`overflow-hidden transition-all ${completed ? 'border-green-500/50' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                completed ? 'bg-green-500' : 'bg-cyan-500/10'
              }`}>
                {completed ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="font-bold text-cyan-500">{index + 1}</span>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
                <Badge className={`mt-1 ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Problem Statement */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Problem
            </h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{exercise.problem}</p>
          </div>

          {/* Hints */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-cyan-500 p-0 h-auto"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHints ? 'Hide Hints' : `Show Hints (${exercise.hints.length})`}
                {showHints ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-3 space-y-2">
                      {exercise.hints.map((hint, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Code Area */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Your Solution</h4>
            <Textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Write your solution here..."
              className="font-mono text-sm min-h-[150px]"
            />
          </div>

          {/* Solution */}
          {exercise.solution && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <SyntaxHighlighter
                      style={theme === 'dark' ? oneDark : oneLight}
                      language="python"
                      className="rounded-lg"
                    >
                      {exercise.solution}
                    </SyntaxHighlighter>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <Button
              onClick={handleMarkComplete}
              disabled={completed}
              className={completed ? 'bg-green-500' : ''}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ========================
// Quiz Component
// ========================
export const QuizSection = ({ questions, articleTitle, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId, answerIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(answers);
        setResults(result);
      }
      setSubmitted(true);
      toast.success('Quiz submitted!');
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Quiz: {articleTitle}
        </h3>
        {submitted && results && (
          <Badge className={results.passed ? 'bg-green-500' : 'bg-red-500'}>
            Score: {results.score}%
          </Badge>
        )}
      </div>

      {questions.map((q, index) => (
        <Card key={q.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <span>{q.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {q.options.map((option, optIndex) => {
                const isSelected = answers[q.id] === optIndex;
                const showResult = submitted && results;
                const isCorrect = showResult && results.results?.find(r => r.question_id === q.id)?.correct_answer === optIndex;
                const isWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswerChange(q.id, optIndex)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3
                      ${isSelected && !submitted ? 'border-cyan-500 bg-cyan-500/10' : 'border-border hover:border-muted-foreground/50'}
                      ${isCorrect ? 'border-green-500 bg-green-500/10' : ''}
                      ${isWrong ? 'border-red-500 bg-red-500/10' : ''}
                      ${submitted ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm
                      ${isSelected && !submitted ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-muted-foreground/50'}
                      ${isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
                      ${isWrong ? 'border-red-500 bg-red-500 text-white' : ''}
                    `}>
                      {isCorrect ? <Check className="w-4 h-4" /> : 
                       isWrong ? <X className="w-4 h-4" /> :
                       String.fromCharCode(65 + optIndex)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Show explanation after submission */}
            {submitted && results && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Explanation:</strong>{' '}
                  {results.results?.find(r => r.question_id === q.id)?.explanation || 'No explanation available.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Results Summary */}
      {submitted && results && (
        <Card className={`${results.passed ? 'border-green-500' : 'border-yellow-500'}`}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
                ${results.passed ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {results.passed ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : (
                  <Sparkles className="w-10 h-10 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {results.passed ? 'Congratulations! 🎉' : 'Keep Practicing!'}
              </h3>
              <p className="text-muted-foreground mb-4">
                You got {results.correct_count} out of {results.total_questions} correct ({results.score}%)
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {results.passed
                  ? 'You passed the quiz! Great job understanding this topic.'
                  : 'You need 70% to pass. Review the material and try again.'}
              </p>
              <Button onClick={handleRetry} variant={results.passed ? 'outline' : 'default'}>
                {results.passed ? 'Retake Quiz' : 'Try Again'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length !== questions.length}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </div>
      )}
    </div>
  );
};

// ========================
// Interview Questions Component
// ========================
export const InterviewQuestions = ({ questions }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-500" />
        Interview Questions
      </h3>
      {questions.map((q, index) => (
        <Card key={index} className="overflow-hidden">
          <button
            onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">
                Q{index + 1}
              </span>
              {q.question}
            </span>
            {openQuestion === index ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {openQuestion === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Separator />
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-500 mb-2">Answer:</h4>
                    <p className="text-muted-foreground">{q.answer}</p>
                  </div>
                  {q.follow_up && (
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-500 mb-2">Follow-up Question:</h4>
                      <p className="text-muted-foreground italic">"{q.follow_up}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
};

// ========================
// External Resources Component
// ========================
export const ExternalResourcesList = ({ resources }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'course': return '🎓';
      case 'tutorial': return '📖';
      case 'book': return '📕';
      case 'video': return '🎬';
      case 'reference': return '🔗';
      default: return '🌐';
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Additional Resources</h3>
      <div className="grid gap-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group"
          >
            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
            <div className="flex-1">
              <h4 className="font-medium group-hover:text-cyan-500 transition-colors">{resource.name}</h4>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </div>
            <Badge variant="secondary" className="capitalize">{resource.type}</Badge>
          </a>
        ))}
      </div>
    </div>
  );
};

export default {
  CodeExample,
  ExerciseCard,
  QuizSection,
  InterviewQuestions,
  ExternalResourcesList
};
