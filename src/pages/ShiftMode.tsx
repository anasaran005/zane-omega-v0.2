// src/pages/ShiftMode.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Paste your tasks CSV url here (same as in LearningDynamic)
 */
const CSV_TASKS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGAW8da-au-iHwYIVygsJ94KjqWunl4mvr58Q11AJIhXwT4UNyKYjSAzLR1Jom2LRfc4A3rfhXzDDs/pub?output=csv";

/* small CSV parser (same as LearningDynamic) */
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

/* normalize header to camelCase (same logic as LearningDynamic) */
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

export default function ShiftMode() {
  const toast = useToast().toast;
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const courseId = params.get("courseId") || "";
  const taskIdParam = params.get("taskId") || "";

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(CSV_TASKS_URL)
      .then((r) => r.text())
      .then((csv) => {
        const rows = parseCsv(csv);
        if (rows.length === 0) {
          setTasks([]);
          setLoading(false);
          return;
        }
        const headers = rows.shift()!.map((h) => headerToCamel(h || ""));
        const items = rows.map((row) => {
          const obj: Record<string, string> = {};
          row.forEach((cell, i) => {
            obj[headers[i] || `col${i}`] = cell ?? "";
          });
          return obj;
        });
        // filter by courseId
        const courseTasks = items.filter(
          (it) => String((it.courseId ?? it.courseid ?? it.course) || "") === String(courseId)
        ).map(it => ({
          id: it.id ?? it.taskId ?? String(Math.random()),
          title: it.title ?? "",
          description: it.description ?? "",
          type: it.type ?? ""
        }));
        setTasks(courseTasks);

        // if a specific taskId provided, select it
        if (taskIdParam) {
          const found = courseTasks.find((t) => String(t.id) === String(taskIdParam));
          if (found) setTask(found);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("ShiftMode fetch tasks error", e);
        setLoading(false);
      });
  }, [courseId, taskIdParam]);

  // get/save progress in same localStorage key used by LearningDynamic
  const storageKey = `lms_progress_${courseId}`;

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  }
  function writeProgress(obj: any) {
    localStorage.setItem(storageKey, JSON.stringify(obj));
  }

  const markTaskComplete = (taskIdToComplete: string) => {
    const progress = readProgress();
    const completed: string[] = progress.completedTasks || [];
    if (!completed.includes(taskIdToComplete)) {
      const next = [...completed, taskIdToComplete];
      progress.completedTasks = next;
      writeProgress(progress);
      toast({
        title: "✅ Task completed",
        description: "Task marked complete and synced to course progress.",
      });
      // update local state
      setTasks((prev) => prev.map((t) => (t.id === taskIdToComplete ? { ...t } : t)));
      // go back to course page so user can see updated progress
      setTimeout(() => navigate(`/learning/${encodeURIComponent(courseId)}`), 800);
    } else {
      toast({
        title: "Already completed",
        description: "This task is already marked complete.",
      });
    }
  };

  if (loading) return <div className="p-6">Loading workspace…</div>;

  // if a single task was opened
  if (task) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{task.title}</h1>
            <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{task.description}</p>

              {/* Here you can extend: upload area, form fields, checklists, etc. */}
              <div className="space-y-2">
                <p className="text-sm">Type: <strong>{task.type}</strong></p>
                <Button onClick={() => markTaskComplete(task.id)} className="mt-4">Mark Task Complete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // show task list for the course when no taskId provided
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Workspace — {courseId}</h1>
          <Button variant="outline" onClick={() => navigate(`/learning/${encodeURIComponent(courseId)}`)}>Back to Course</Button>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No tasks found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No tasks are available for this course.</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((t) => (
            <Card key={t.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate(`/shift?courseId=${encodeURIComponent(courseId)}&taskId=${encodeURIComponent(t.id)}`)} size="sm">Open</Button>
                  <Button onClick={() => markTaskComplete(t.id)} size="sm" variant="outline">Mark Complete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
