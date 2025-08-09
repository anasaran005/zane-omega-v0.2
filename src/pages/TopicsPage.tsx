// src/pages/TopicsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

type Topic = {
  courseId?: string;
  chapterId?: string;
  lessonId: string;
  topicId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  order?: number;
};

export default function TopicsPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    let isActive = true;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSwPfAZKp2clwiJi8OAScqs7NrjRRORbOPLGe51ACbk6lsrPEVlobezscw3bbLxIQ7l6HE38HYnjpv/pub?output=csv";

    const url = `/api/sheets/topics?sheetUrl=${encodeURIComponent(sheetUrl)}&lessonId=${encodeURIComponent(
      lessonId
    )}`;

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const raw: any = await res.json();

        const arr = Array.isArray(raw) ? raw : [];
        const normalized: Topic[] = arr.map((it) => ({
          courseId: it.courseId ?? it.courseid ?? "",
          chapterId: it.chapterId ?? it.chapterid ?? "",
          lessonId: it.lessonId ?? it.lessonid ?? "",
          topicId: it.topicId ?? it.topicid ?? "",
          title: it.title ?? it.Title ?? "",
          description: it.description ?? it.desc ?? "",
          videoUrl: it.videoUrl ?? it.videourl ?? "",
          order:
            it.order === undefined || it.order === null || it.order === ""
              ? null
              : Number(it.order),
        }));

        if (!isActive) return;
        setTopics(normalized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (err: any) {
        if (err && (err.name === "AbortError" || err.code === "ERR_ABORTED")) {
          return;
        }
        console.error(err);
        if (isActive) setError("Could not load topics. Check your API or sheet mapping.");
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [lessonId]);

  const chapterIdFromState = (location.state as any)?.chapterId as string | undefined;

  function handleBack() {
    if (chapterIdFromState) navigate(`/lessons/${chapterIdFromState}`);
    else navigate(-1);
  }

  function goToLearn(topic: Topic) {
    navigate(`/learn/${topic.topicId}`, { state: { lessonId: topic.lessonId } });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
            aria-label="Back to lessons"
          >
            ← Back
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-semibold">Topics</h1>
          <p className="text-sm text-muted-foreground">Pick a video to start learning</p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow-sm border">
              <div className="h-36 bg-gray-100 rounded-md mb-3" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
      )}

      {!loading && topics && topics.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No topics found for this lesson.</div>
      )}

      {!loading && topics && topics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <motion.article
              key={topic.topicId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, translateY: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="group bg-white rounded-2xl p-4 shadow-lg border hover:shadow-2xl cursor-pointer"
              onClick={() => goToLearn(topic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToLearn(topic);
              }}
            >
              <div className="relative overflow-hidden rounded-xl">
                <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md mb-3">
                      <Play className="w-6 h-6" />
                    </div>
                    <div className="text-sm text-muted-foreground">Video</div>
                  </div>
                </div>

                <motion.div
                  className="absolute inset-0 bg-black/6 opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.06 }}
                  transition={{ duration: 0.18 }}
                  aria-hidden
                />
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-semibold line-clamp-2">{topic.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{topic.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Lesson: {topic.lessonId}</div>
                <div className="text-xs font-medium">{topic.order ? `Part ${topic.order}` : ""}</div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Tip: use keyboard (Enter) to open topic.</div>
        <div>
          <button
            onClick={() => navigate(`/course/${topics?.[0]?.courseId ?? ""}`)}
            className="px-4 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            Back to course
          </button>
        </div>
      </div>
    </div>
  );
}
