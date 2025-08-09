// src/pages/LearningDynamic.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, BookOpen, Award, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * === CONFIG: paste your published CSV URLs here ===
 * (publish each sheet: File -> Share -> Publish to web -> CSV)
 * NOTE: fixed the accidental leading space in lessons URL
 */
const CSV_COURSES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHJkGW9UB9pRFxIRyVY2hcJ4JpceNmeql4ohME38GkLtFTIvwT_Zs9s0IGY2MGBfTjymbd8f1-M2W_/pub?output=csv";
const CSV_LESSONS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLX0cbVp85tIk5tnq1caor9T3noswKXJz4Jkr1MzpPx4hjsOYwr-nPCahLOHehPqpHtfyKQ8L8E0hs/pub?output=csv";
const CSV_QUIZZES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRH_UnPzWaMMkdzMD1igo0tuV17qMtNCMIGs3YqL4RtBkMPuPwoPNij5YvR_srfsPQHi7f-YxJ4H1BU/pub?output=csv";
const CSV_TASKS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGAW8da-au-iHwYIVygsJ94KjqWunl4mvr58Q11AJIhXwT4UNyKYjSAzLR1Jom2LRfc4A3rfhXzDDs/pub?output=csv";

/* ---------------- types ---------------- */
type Course = { id: string; title: string; description?: string };
type Lesson = {
  courseid: string;
  id: string;
  title: string;
  description?: string;
  order?: number;
  videourl?: string;
  imageurl?: string;
};
type QuizQ = { courseid: string; id: string; question: string; options: string[]; correct: number };
type Task = { courseid: string; id: string; title: string; description?: string; type?: string };

/* ---------------- helpers ---------------- */
// Basic CSV row parser that supports quoted fields
function parseCsv(text: string) {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim() === "") continue;
    const matches = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g);
    if (!matches) continue;
    const cols = matches.map((m) => {
      let cell = m.replace(/,$/, "");
      cell = cell.trim();
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1).replace(/""/g, '"');
      }
      return cell;
    });
    rows.push(cols);
  }
  return rows;
}

// convert many youtube formats to embed
function convertToEmbed(raw?: string) {
  if (!raw) return "";
  const url = raw.trim();
  if (!url) return "";
  if (url.includes("/embed/") || url.includes("youtube-nocookie.com")) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      const list = u.searchParams.get("list");
      return list ? `https://www.youtube.com/embed/${id}?list=${list}` : `https://www.youtube.com/embed/${id}`;
    }
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      const list = u.searchParams.get("list");
      if (v) return list ? `https://www.youtube.com/embed/${v}?list=${list}` : `https://www.youtube.com/embed/${v}`;
      if (u.pathname.includes("/playlist") && list) return `https://www.youtube.com/embed?listType=playlist&list=${list}`;
    }
    const matchV = url.match(/[?&]v=([^&]+)/);
    if (matchV) return `https://www.youtube.com/embed/${matchV[1]}`;
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  } catch {
    const matchV = url.match(/[?&]v=([^&]+)/);
    if (matchV) return `https://www.youtube.com/embed/${matchV[1]}`;
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  }
}

// normalize CSV headers to camelCase: "Course Id" -> courseid
function headerToCamel(h: string) {
  return h
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part, i) => {
      const clean = part.replace(/[^a-zA-Z0-9]/g, "");
      return i === 0 ? clean.toLowerCase() : clean[0].toUpperCase() + clean.slice(1).toLowerCase();
    })
    .join("");
}

export default function LearningDynamic() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const routeParams = useParams() as any;
  const courseidFromRoute = routeParams.courseid || "Quality-Assurance-Quality-Control";
  const courseid = courseidFromRoute;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizQs, setQuizQs] = useState<QuizQ[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // progress stored in localStorage under key `lms_progress_${courseid}`
  const storageKey = `lms_progress_${courseid}`;
  const savedProgress = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  }, [courseid]);

  const [currentVideo, setCurrentVideo] = useState<number>(Number(savedProgress.currentVideo || 0));
  const [completedVideos, setCompletedVideos] = useState<number[]>(savedProgress.completedVideos || []);
  const [quizUnlocked, setQuizUnlocked] = useState<boolean>(savedProgress.quizUnlocked || false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(savedProgress.quizCompleted || false);
  const [quizScore, setQuizScore] = useState<number>(savedProgress.quizScore || 0);
  const [tasksUnlocked, setTasksUnlocked] = useState<boolean>(savedProgress.tasksUnlocked || false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(savedProgress.completedTasks || []);

  // quiz UI state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    setErr(null);

    Promise.all([
      fetch(CSV_COURSES_URL).then((r) => r.text()).catch(() => ""),
      fetch(CSV_LESSONS_URL).then((r) => r.text()).catch(() => ""),
      fetch(CSV_QUIZZES_URL).then((r) => r.text()).catch(() => ""),
      fetch(CSV_TASKS_URL).then((r) => r.text()).catch(() => "")
    ])
      .then(([coursesCsv, lessonsCsv, quizzesCsv, tasksCsv]) => {
        try {
          // debug raw CSV sizes
          console.log("csv lengths:", {
            coursesCsv: coursesCsv.length,
            lessonsCsv: lessonsCsv.length,
            quizzesCsv: quizzesCsv.length,
            tasksCsv: tasksCsv.length
          });

          // Generic parser that returns headers (camel) and rows as objects
          function parseToObjects(csvText: string) {
            if (!csvText) return { headers: [], items: [] as Record<string, string>[] };
            const rows = parseCsv(csvText);
            if (rows.length === 0) return { headers: [], items: [] as Record<string, string>[] };
            const rawHeader = rows.shift()!;
            const headers = rawHeader.map((h) => headerToCamel(h || ""));
            const items = rows.map((row) => {
              const obj: Record<string, string> = {};
              row.forEach((cell, i) => {
                const key = headers[i] || `col${i}`;
                obj[key] = cell ?? "";
              });
              return obj;
            });
            return { headers, items };
          }

          // COURSES
          const parsedCourses = parseToObjects(coursesCsv);
          console.log("parsed course headers:", parsedCourses.headers);
          console.log("parsed course sample:", parsedCourses.items.slice(0, 3));
          const allCourses = parsedCourses.items.map((r) => ({
            id: r.id ?? r.courseid ?? r.courseid ?? "",
            title: r.title ?? "",
            description: r.description ?? ""
          }));
          const foundCourse = allCourses.find((c) => String(c.id) === String(courseid)) || null;
          setCourse(foundCourse);

          // LESSONS
          const parsedLessons = parseToObjects(lessonsCsv);
          console.log("parsed lessons headers:", parsedLessons.headers);
          console.log("parsed lessons sample:", parsedLessons.items.slice(0, 10));
          const allLessonsRaw = parsedLessons.items.map((r) => ({
            courseid: r.courseid ?? r.courseid ?? r.course ?? "",
            id: r.id ?? "",
            title: r.title ?? "",
            description: r.description ?? "",
            order: r.order ? Number(r.order) : 0,
            videourl: convertToEmbed(r.videourl ?? r.v ?? r.video ?? ""),
            imageurl: r.imageurl ?? r.imageurl ?? r.image ?? ""
          }));
          const filteredLessons = allLessonsRaw.filter((l) => String(l.courseid) === String(courseid));
          const normalizedLessons = filteredLessons.sort((a, b) => (a.order || 0) - (b.order || 0));
          console.log("final lessons:", normalizedLessons);
          setLessons(normalizedLessons);

          // QUIZZES
          const parsedQuizzes = parseToObjects(quizzesCsv);
          console.log("parsed quizzes headers:", parsedQuizzes.headers);
          console.log("parsed quizzes sample:", parsedQuizzes.items.slice(0, 10));
          const allQuizzes = parsedQuizzes.items
            .map((r) => ({
              courseid: r.courseid ?? r.courseid ?? r.course ?? "",
              id: r.id ?? "",
              question: r.question ?? "",
              options: (r.options ?? r.opts ?? "").split("|").map((s) => s.trim()).filter(Boolean),
              correct: r.correct ? Number(r.correct) : 0
            }))
            .filter((q) => String(q.courseid) === String(courseid));
          console.log("final quizzes:", allQuizzes);
          setQuizQs(allQuizzes);

          // TASKS
          const parsedTasks = parseToObjects(tasksCsv);
          console.log("parsed tasks headers:", parsedTasks.headers);
          console.log("parsed tasks sample:", parsedTasks.items.slice(0, 10));
          const allTasks = parsedTasks.items
            .map((r) => ({
              courseid: r.courseid ?? r.courseid ?? r.course ?? "",
              id: r.id ?? "",
              title: r.title ?? "",
              description: r.description ?? "",
              type: r.type ?? ""
            }))
            .filter((t) => String(t.courseid) === String(courseid));
          console.log("final tasks:", allTasks);
          setTasks(allTasks);

          setLoading(false);
        } catch (e: any) {
          console.error("parse error:", e);
          setErr("Failed to parse CSVs");
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error("fetch error:", e);
        setErr("Network error fetching CSVs");
        setLoading(false);
      });
  }, [courseid]);

  // persist progress on change
  useEffect(() => {
    const obj = {
      currentVideo,
      completedVideos,
      quizUnlocked,
      quizCompleted,
      quizScore,
      tasksUnlocked,
      completedTasks
    };
    localStorage.setItem(storageKey, JSON.stringify(obj));
  }, [currentVideo, completedVideos, quizUnlocked, quizCompleted, quizScore, tasksUnlocked, completedTasks, storageKey]);

  // handlers
  const handleVideoSelect = (index: number) => {
    setCurrentVideo(index);
    if (!completedVideos.includes(index)) {
      const next = [...completedVideos, index];
      setCompletedVideos(next);
      if (next.length === lessons.length) {
        setQuizUnlocked(true);
        toast({ title: "🎉 All Videos Completed!", description: "Practice quiz unlocked." });
      }
    }
  };

  const handleQuizStart = () => {
    setShowQuiz(true);
    setCurrentQuizQuestion(0);
    setSelectedAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const arr = [...selectedAnswers];
    arr[currentQuizQuestion] = answerIndex;
    setSelectedAnswers(arr);
  };

  const handleNextQuestion = () => {
    if (currentQuizQuestion < quizQs.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // finish quiz
      let correct = 0;
      quizQs.forEach((q, i) => {
        if (selectedAnswers[i] === q.correct) correct++;
      });
      const scorePct = quizQs.length ? Math.round((correct / quizQs.length) * 100) : 0;
      setQuizScore(scorePct);
      setQuizCompleted(true);
      setTasksUnlocked(true);
      setShowQuiz(false);
      toast({ title: "✅ Quiz Completed", description: `Score: ${scorePct}% — Workspace unlocked.` });
    }
  };

  const handleTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      const next = [...completedTasks, taskId];
      setCompletedTasks(next);
      toast({ title: "✅ Task Completed", description: "Task submitted." });
    }
  };

  // UI states
  if (loading) return <div className="p-6">Loading course…</div>;
  if (err) return <div className="p-6 text-red-500">Error: {err}</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  // render
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/course/${courseid}/chapters`)}>
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* main */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-center">
              <div style={{ width: "960px", aspectRatio: "16/9" }}>
                <iframe
                  src={lessons[currentVideo]?.videourl}
                  title={lessons[currentVideo]?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-t-lg"
                />
              </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{lessons[currentVideo]?.title}</h2>
                <p className="text-muted-foreground">{lessons[currentVideo]?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* quiz results */}
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
                    <Badge variant="default">{quizScore}%</Badge>
                  </div>
                  <Progress value={quizScore} />
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Workspace unlocked.</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowQuiz(false);
                          setQuizCompleted(false);
                          setSelectedAnswers([]);
                        }}
                      >
                        Retake Quiz
                      </Button>
                      <Button onClick={() => navigate(`/shift?courseId=${encodeURIComponent(courseid)}`)}>Start Workplace Simulation</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* tasks */}
          {tasksUnlocked && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Practical Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((t) => (
                    <Card key={t.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{t.title}</h3>
                          {completedTasks.includes(t.id) && <CheckCircle className="h-5 w-5 text-success" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                        <Button onClick={() => navigate(`/shift?courseId=${encodeURIComponent(courseid)}&taskId=${encodeURIComponent(t.id)}`)}
                        disabled={completedTasks.includes(t.id)}
                        size="sm"
                        className="w-full"
                        >
                          {completedTasks.includes(t.id) ? "✅ Completed" : "Complete Task"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <Button key={lesson.id} variant={currentVideo === idx ? "default" : "ghost"} className="w-full justify-start text-left h-auto p-3" onClick={() => handleVideoSelect(idx)}>
                    <div className="flex items-center gap-3">
                      {completedVideos.includes(idx) ? <CheckCircle className="h-4 w-4 text-success" /> : <Play className="h-4 w-4" />}
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">Lesson {idx + 1}</div>
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
                    <span>
                      {completedVideos.length}/{lessons.length}
                    </span>
                  </div>
                  <Progress value={(lessons.length ? (completedVideos.length / lessons.length) * 100 : 0)} />
                </div>

                {quizUnlocked ? (
                  <Button onClick={handleQuizStart} className="w-full" disabled={showQuiz}>
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
                      <span>
                        {completedTasks.length}/{tasks.length}
                      </span>
                    </div>
                    <Progress value={(tasks.length ? (completedTasks.length / tasks.length) * 100 : 0)} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* quiz modal-ish page */}
      {showQuiz && !quizCompleted && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Practice Quiz</span>
                  <Badge variant="outline">
                    Question {currentQuizQuestion + 1} / {quizQs.length}
                  </Badge>
                </CardTitle>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <p className="text-blue-800 font-medium">This quiz is for practice only — your progress still counts.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={((currentQuizQuestion + 1) / Math.max(1, quizQs.length)) * 100} />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{quizQs[currentQuizQuestion]?.question}</h3>
                  <div className="space-y-2 mt-3">
                    {quizQs[currentQuizQuestion]?.options.map((opt, i) => (
                      <Button key={i} variant={selectedAnswers[currentQuizQuestion] === i ? "default" : "outline"} className="w-full justify-start" onClick={() => handleAnswerSelect(i)}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setShowQuiz(false)}>
                    Back to Videos
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowQuiz(false);
                        setTasksUnlocked(true);
                      }}
                    >
                      Skip to Workspace
                    </Button>
                    <Button onClick={handleNextQuestion}>{currentQuizQuestion === quizQs.length - 1 ? "Complete Quiz" : "Next"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
