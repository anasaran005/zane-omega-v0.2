
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, BookOpen, Award, Download, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Learning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [tasksUnlocked, setTasksUnlocked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const videoLessons = [
    {
      id: 0,
      title: "Clinical Trial Setup and Feasibility",
      videoId: "TXf4mIP5o-E",
      description: "Learn the fundamentals of setting up clinical trials and conducting feasibility assessments."
    },
    {
      id: 1,
      title: "Site Setup",
      videoId: "VzQeLAp1OHs",
      description: "Understanding the process of establishing clinical research sites for trial conduct."
    },
    {
      id: 2,
      title: "What is Site Feasibility?",
      videoId: "3a-AcCWlcrg",
      description: "Comprehensive overview of site feasibility assessment in clinical research."
    },
    {
      id: 3,
      title: "Feasibility Assessment – Key Considerations",
      videoId: "71zNGWWEeBY",
      description: "Critical factors to evaluate when assessing site feasibility for clinical trials."
    },
    {
      id: 4,
      title: "Site Selection Criteria",
      videoId: "v4wH3iqQex0",
      description: "Essential criteria for selecting optimal sites for clinical trial execution."
    }
  ];

  const quizQuestions = [
    {
      question: "What is the main objective of clinical trial feasibility?",
      options: ["To test product quality", "To determine market interest", "To assess whether a site can successfully conduct the trial", "To finalize the protocol"],
      correct: 2
    },
    {
      question: "Which is a key component of site setup?",
      options: ["Marketing strategy", "Site qualification and training", "Product manufacturing", "Regulatory approval"],
      correct: 1
    },
    {
      question: "Site feasibility assessment primarily evaluates what?",
      options: ["Patient population availability", "Site infrastructure capability", "Investigator expertise", "All of the above"],
      correct: 3
    },
    {
      question: "What is a critical consideration in feasibility assessment?",
      options: ["Site location only", "Patient recruitment potential", "Building aesthetics", "Parking availability"],
      correct: 1
    },
    {
      question: "Primary site selection criteria include:",
      options: ["Investigator experience and patient population", "Office size", "Number of staff", "Equipment brand"],
      correct: 0
    }
  ];

  const practicalTasks = [
    {
      id: 1,
      title: "Site Feasibility Form Task",
      description: "Download and complete a site feasibility assessment form for a fictional Phase 2 oncology trial.",
      type: "form"
    },
    {
      id: 2,
      title: "Trial Setup Checklist",
      description: "Create a comprehensive checklist for setting up a Phase 2 Clinical Trial at a new site.",
      type: "checklist"
    },
    {
      id: 3,
      title: "Site Selection Pitch",
      description: "Write a 100-word paragraph explaining why your site should be chosen for a multicenter trial.",
      type: "writing"
    }
  ];

  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleVideoSelect = (videoIndex: number) => {
    setCurrentVideo(videoIndex);
    if (!completedVideos.includes(videoIndex)) {
      setCompletedVideos([...completedVideos, videoIndex]);
      
      if (completedVideos.length + 1 === videoLessons.length) {
        setQuizUnlocked(true);
        toast({
          title: "🎉 All Videos Completed!",
          description: "Practice quiz is now available. Continue to workspace when ready.",
        });
      }
    }
  };

  const handleQuizStart = () => {
    setShowQuiz(true);
    setCurrentQuizQuestion(0);
    setSelectedAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuizQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      let correct = 0;
      selectedAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
          correct++;
        }
      });
      const scorePercentage = (correct / quizQuestions.length) * 100;
      setQuizScore(scorePercentage);
      setQuizCompleted(true);
      setTasksUnlocked(true); // Always unlock tasks regardless of score
      
      toast({
        title: "✅ Practice Quiz Completed!",
        description: "Your workspace is now unlocked. Continue to start hands-on tasks.",
      });
    }
  };

  const handleTaskComplete = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      toast({
        title: "✅ Task Completed!",
        description: "Task submitted successfully. Check your dashboard for updates.",
      });
    }
  };

  const handleStartShift = () => {
    navigate("/shift");
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
    setCurrentQuizQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
  };

  const handleContinueToWorkspace = () => {
    setTasksUnlocked(true);
    setShowQuiz(false);
    toast({
      title: "🚀 Workspace Unlocked",
      description: "Ready to start your hands-on clinical research tasks!",
    });
  };

  if (showQuiz && !quizCompleted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Clinical Research Practice Quiz</span>
                <Badge variant="outline">
                  Question {currentQuizQuestion + 1} of {quizQuestions.length}
                </Badge>
              </CardTitle>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">
                    This quiz is for practice only. Your progress will continue even if you don't get all answers right.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Progress value={((currentQuizQuestion + 1) / quizQuestions.length) * 100} />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {quizQuestions[currentQuizQuestion].question}
                  </h3>
                  
                  <div className="space-y-2">
                    {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswers[currentQuizQuestion] === index ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto p-4"
                        onClick={() => handleAnswerSelect(index)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowQuiz(false)}
                  >
                    Back to Videos
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleContinueToWorkspace}
                    >
                      Skip to Workspace
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                    >
                      {currentQuizQuestion === quizQuestions.length - 1 ? "Complete Quiz" : "Next Question"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Clinical Research Training</h1>
              <p className="text-muted-foreground">Master clinical trial setup, site feasibility, and trial management</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoLessons[currentVideo].videoId}`}
                    title={videoLessons[currentVideo].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-t-lg"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{videoLessons[currentVideo].title}</h2>
                  <p className="text-muted-foreground">{videoLessons[currentVideo].description}</p>
                </div>
              </CardContent>
            </Card>

            {quizCompleted && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Practice Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Your Score:</span>
                      <Badge variant="default">
                        {quizScore}%
                      </Badge>
                    </div>
                    <Progress value={quizScore} />
                    
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Great practice! Your workspace is now ready.</p>
                      <div className="flex gap-2">
                        <Button onClick={handleRetakeQuiz} variant="outline" className="flex-1">
                          Retake Quiz
                        </Button>
                        <Button onClick={handleStartShift} className="flex-1">
                          Start Workplace Simulation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {tasksUnlocked && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Practical Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {practicalTasks.map((task) => (
                      <Card key={task.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            {completedTasks.includes(task.id) && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          <Button 
                            onClick={() => handleTaskComplete(task.id)}
                            disabled={completedTasks.includes(task.id)}
                            size="sm"
                            className="w-full"
                          >
                            {completedTasks.includes(task.id) ? "✅ Completed" : "Complete Task"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videoLessons.map((lesson, index) => (
                    <Button
                      key={lesson.id}
                      variant={currentVideo === index ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleVideoSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        {completedVideos.includes(index) ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <div>
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Lesson {index + 1}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Videos Completed</span>
                      <span>{completedVideos.length}/{videoLessons.length}</span>
                    </div>
                    <Progress value={(completedVideos.length / videoLessons.length) * 100} />
                  </div>

                  {quizUnlocked ? (
                    <Button 
                      onClick={handleQuizStart} 
                      className="w-full"
                      disabled={showQuiz}
                    >
                      {quizCompleted ? "Retake Practice Quiz" : "Take Practice Quiz"}
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Complete All Videos to Unlock Quiz
                    </Button>
                  )}

                  {tasksUnlocked && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tasks Completed</span>
                        <span>{completedTasks.length}/{practicalTasks.length}</span>
                      </div>
                      <Progress value={(completedTasks.length / practicalTasks.length) * 100} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
