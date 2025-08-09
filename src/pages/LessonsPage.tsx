// src/pages/LessonsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Papa from "papaparse";

type Lesson = {
  lessonId: string; // from CSV column
  chapterId: string;
  title: string;
  description: string;
  order?: number | string;
  videoUrl?: string;
  imageUrl?: string;
};

export default function LessonsPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLX0cbVp85tIk5tnq1caor9T3noswKXJz4Jkr1MzpPx4hjsOYwr-nPCahLOHehPqpHtfyKQ8L8E0hs/pub?output=csv";

  useEffect(() => {
    if (!chapterId) return;

    setLoading(true);
    setError(null);

    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Lesson[];
        console.log("Raw lessons data:", data);

        // Normalize and filter lessons by chapterId
        const filtered = data
          .filter(
            (lesson) =>
              lesson.chapterId?.toString().trim().toLowerCase() ===
              chapterId.toString().trim().toLowerCase()
          )
          .sort(
            (a, b) =>
              (Number(a.order) || 0) - (Number(b.order) || 0)
          );

        setLessons(filtered);
        setLoading(false);
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setError("Failed to load lessons sheet.");
        setLoading(false);
      },
    });
  }, [chapterId]);

  if (loading) return <p className="text-center py-10">Loading lessons...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Chapters
      </button>

      <h1 className="text-3xl font-bold mb-6">Lessons</h1>

      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons found for this chapter.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.lessonId}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden cursor-pointer border border-white/20 hover:border-blue-400 transition-all"
              onClick={() =>
                navigate(`/topics/${lesson.lessonId}`, {
                  state: { chapterId: lesson.chapterId },
                })
              }
            >
              {lesson.imageUrl && (
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                <p className="text-sm text-gray-300 mt-2">
                  {lesson.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
