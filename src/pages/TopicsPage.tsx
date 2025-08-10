// src/pages/TopicsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  imageUrl?: string;
  subTopics?: string;
  tasks?: string;
  hours?: number;
};

export default function TopicsPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Your Google Sheets CSV URL
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSwPfAZKp2clwiJi8OAScqs7NrjRRORbOPLGe51ACbk6lsrPEVlobezscw3bbLxIQ7l6HE38HYnjpv/pub?output=csv";

  useEffect(() => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);

    // Using fetch instead of PapaParse to avoid import issues
    fetch(sheetUrl)
      .then(response => response.text())
      .then(csvText => {
        // Simple CSV parsing
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            data.push(row);
          }
        }

        console.log("Raw topics data:", data);
        console.log("Headers:", headers);

        // Normalize the data to match your expected format
        const normalizedTopics: Topic[] = data
          .map((row: any) => ({
            courseId: row["Course ID"] || row.courseId || "",
            chapterId: row["Chapter ID"] || row.chapterId || "", 
            lessonId: row["Lesson ID"] || row.lessonId || "",
            topicId: row["Topic ID"] || row.topicId || "",
            title: row["Topic Title"] || row.title || "",
            description: row["Description"] || row.description || "",
            videoUrl: row["Video URL"] || row.videoUrl || "",
            order: parseInt(row["Order"] || row.order || "0"),
            imageUrl: row["Image URL"] || row.imageUrl || "",
            subTopics: row["Sub Topics"] || row.subTopics || "",
            tasks: row["Tasks"] || row.tasks || "", 
            hours: parseInt(row["Hours"] || row.hours || "0"),
          }))
          .filter((topic) => 
            topic.lessonId?.toString().trim().toLowerCase() === 
            lessonId?.toString().trim().toLowerCase()
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log("Filtered topics:", normalizedTopics);
        setTopics(normalizedTopics);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load topics sheet.");
        setLoading(false);
      });
  }, [lessonId]);

  const chapterIdFromState = (location.state as any)?.chapterId as string | undefined;

  function handleBack() {
    if (chapterIdFromState) navigate(`/lessons/${chapterIdFromState}`);
    else navigate(-1);
  }

  function goToLearn(topic: Topic) {
    navigate(`/learn/${topic.topicId}`, { state: { lessonId: topic.lessonId } });
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold">Topics</h1>
            <p className="text-sm text-gray-600">Pick a video to start learning</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow border animate-pulse">
              <div className="h-36 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold">Topics</h1>
          </div>
        </div>
        <div className="bg-red-50 text-red-800 p-4 rounded border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold">Topics</h1>
          </div>
        </div>
        <div className="text-center py-20 text-gray-600">
          No topics found for this lesson.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1 rounded border text-sm hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold">Topics</h1>
          <p className="text-sm text-gray-600">Pick a video to start learning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div
            key={topic.topicId}
            className="group bg-white rounded-lg p-4 shadow-lg border hover:shadow-xl cursor-pointer transition-all duration-200 hover:scale-105"
            onClick={() => goToLearn(topic)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToLearn(topic);
              }
            }}
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              {topic.imageUrl ? (
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-2">
                      <Play className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-500">Video</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{topic.title}</h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{topic.description}</p>
              
              {topic.hours > 0 && (
                <div className="text-xs text-blue-600 font-medium mb-2">
                  Duration: {topic.hours}h
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Lesson: {topic.lessonId}</span>
              {topic.order > 0 && <span>Part {topic.order}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tip: use keyboard (Enter) to open topic.
        </div>
        <div>
          <button
            onClick={() => navigate(`/course/${topics[0]?.courseId ?? ""}`)}
            className="px-4 py-2 rounded border hover:bg-gray-100 text-sm"
          >
            Back to course
          </button>
        </div>
      </div>
    </div>
  );
}
