import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Papa from "papaparse";

/* Google Sheet CSV (published) */
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTye6Ry0sBC0YGaUhiZRw_rlAZWvZKewHEm3CRYNobgX0qfThH2722xmPZcL_RYd6w5E5c0wBaEALuO/pub?output=csv";

const FALLBACK_IMAGE = "https://via.placeholder.com/640x360?text=No+Image";

/* normalize any string for ID comparison:
   - remove BOM / NBSP
   - trim, toLowerCase
   - replace sequences of non-alnum/- with single -
   - strip leading/trailing dashes
*/
const normalizeId = (v: any) => {
  if (!v && v !== 0) return "";
  let s = String(v);
  // remove BOM and non-breaking spaces and control chars
  s = s.replace(/\uFEFF/g, "").replace(/\u00A0/g, " ").replace(/[\u0000-\u001F\u007F]/g, "");
  s = s.trim().toLowerCase();
  // strip surrounding quotes if they exist
  if (/^".*"$/.test(s)) s = s.replace(/^"(.*)"$/, "$1");
  // replace anything not a-z0-9- with dash, collapse multiple dashes
  s = s.replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
  s = s.replace(/^-+|-+$/g, "");
  return s;
};

/* map candidate header names to canonical field names */
const guessHeaderKey = (rowKeys: string[], candidates: string[]) => {
  const map = rowKeys.reduce<Record<string, string>>((acc, key) => {
    const k = key.toLowerCase().replace(/\ufeff/g, "").replace(/[^a-z0-9]/g, "");
    acc[k] = key;
    return acc;
  }, {});

  for (const candidate of candidates) {
    const k = candidate.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (map[k]) return map[k];
  }
  return undefined;
};

interface Chapter {
  rawCourseId: string; // original text from CSV
  courseId: string; // normalized
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  order: number;
  imageUrl: string;
}

export default function ChaptersPage() {
  const { courseId: routeCourseIdRaw } = useParams<{ courseId?: string }>();
  const routeCourseId = (routeCourseIdRaw ?? "").trim();
  const normalizedRouteId = normalizeId(routeCourseId);
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawRowsCount, setRawRowsCount] = useState<number>(0);
  const [sampleCourseIds, setSampleCourseIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setChapters([]);
    setRawRowsCount(0);
    setSampleCourseIds([]);

    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = Array.isArray(results.data) ? (results.data as any[]) : [];
          console.log("PapaParse raw rows:", rows.slice(0, 10));
          setRawRowsCount(rows.length);

          // figure out header keys from first row (robust)
          const first = rows[0] || {};
          const rowKeys = Object.keys(first);
          // candidate lists
          const courseCandidates = ["courseId", "course", "course_id", "course id"];
          const chapterCandidates = ["chapterId", "chapter", "chapter_id", "chapter id"];
          const titleCandidates = ["chapterTitle", "title", "chapter_title", "chapter title"];
          const descCandidates = ["chapterDescription", "description", "chapter_description", "chapter description"];
          const orderCandidates = ["order", "position", "sort", "seq"];
          const imageCandidates = ["imageUrl", "image", "image_url", "image url", "thumbnail"];

          const keyMap = {
            courseKey: guessHeaderKey(rowKeys, courseCandidates),
            chapterKey: guessHeaderKey(rowKeys, chapterCandidates),
            titleKey: guessHeaderKey(rowKeys, titleCandidates),
            descKey: guessHeaderKey(rowKeys, descCandidates),
            orderKey: guessHeaderKey(rowKeys, orderCandidates),
            imageKey: guessHeaderKey(rowKeys, imageCandidates),
          };

          console.log("Detected key map:", keyMap);

          const normalizedRows: Chapter[] = rows
            .filter((r) => {
              // drop rows that are totally empty (all values blank)
              if (!r || typeof r !== "object") return false;
              return Object.values(r).some((v) => (v ?? "").toString().trim().length > 0);
            })
            .map((r: any) => {
              const rawCourse = keyMap.courseKey ? r[keyMap.courseKey] : r["courseId"] ?? r["course"] ?? "";
              const rawChapterId = keyMap.chapterKey ? r[keyMap.chapterKey] : r["chapterId"] ?? r["chapter"] ?? "";
              const rawTitle = keyMap.titleKey ? r[keyMap.titleKey] : r["chapterTitle"] ?? r["title"] ?? "";
              const rawDesc = keyMap.descKey ? r[keyMap.descKey] : r["chapterDescription"] ?? r["description"] ?? "";
              const rawOrder = keyMap.orderKey ? r[keyMap.orderKey] : r["order"] ?? "";
              const rawImage = keyMap.imageKey ? r[keyMap.imageKey] : r["imageUrl"] ?? r["image"] ?? "";

              const normalizedCourse = normalizeId(rawCourse);
              return {
                rawCourseId: String(rawCourse ?? ""),
                courseId: normalizedCourse,
                chapterId: String(rawChapterId ?? "").trim() || `chap-${Math.random().toString(36).slice(2, 8)}`,
                chapterTitle: String(rawTitle ?? "").trim() || "Untitled Chapter",
                chapterDescription: String(rawDesc ?? "").trim() || "",
                order: Number(String(rawOrder ?? "").replace(/[^0-9-]/g, "")) || 9999,
                imageUrl: String(rawImage ?? "").trim() || FALLBACK_IMAGE,
              } as Chapter;
            });

          // collect a sample list for debug/UI
          setSampleCourseIds([...new Set(normalizedRows.map((r) => r.courseId))].slice(0, 12));

          // matching: allow prefix/suffix and contains as fallback
          const filtered = normalizedRows.filter((ch) => {
            if (!ch.courseId) return false;
            const csvCourse = ch.courseId;
            if (!normalizedRouteId) return false;
            const route = normalizedRouteId;
            const matches =
              csvCourse === route ||
              csvCourse.startsWith(route) ||
              route.startsWith(csvCourse) ||
              csvCourse.includes(route) ||
              route.includes(csvCourse);
            return matches;
          });

          const sorted = filtered.sort((a, b) => a.order - b.order);
          console.log("Normalized rows:", normalizedRows.slice(0, 8));
          console.log("Filtered matches:", sorted);
          setChapters(sorted);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing/processing CSV:", err);
          setError("Error processing sheet data. Open console for details.");
          setLoading(false);
        }
      },
      error: (err) => {
        console.error("PapaParse failure:", err);
        setError("Failed to fetch chapter sheet.");
        setLoading(false);
      },
    });
  }, [routeCourseId, normalizedRouteId]);

  const handleChapterClick = (chapterId: string) => {
    navigate(`/learning/${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Course Chapters</h1>

      <p className="text-sm text-gray-300 text-center mb-4">
        Route courseId: <span className="font-medium text-white">{routeCourseId || "(none)"}</span>{" "}
        — Normalized: <span className="text-yellow-300">{normalizedRouteId || "(empty)"}</span>{" "}
        — Raw rows: <span className="text-yellow-300">{rawRowsCount}</span>
      </p>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-300">Loading chapters…</div>
        </div>
      )}

      {!loading && !!error && (
        <div className="text-center text-red-400 py-4">
          {error}
          <div className="text-xs text-gray-400 mt-2">Check console for detailed logs.</div>
        </div>
      )}

      {!loading && !error && chapters.length === 0 && (
        <div className="max-w-2xl mx-auto text-center mt-8 text-gray-300">
          <div>No chapters found for this course.</div>

          <div className="mt-4 text-left text-xs text-gray-400">
            <div className="mb-2">Debug hints (visible to you):</div>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Route normalized id: <span className="text-white">{normalizedRouteId || "(empty)"}</span>
              </li>
              <li>
                First sample course ids from sheet (normalized):{" "}
                <span className="text-yellow-300">{sampleCourseIds.join(", ") || "—"}</span>
              </li>
              <li>Matching is forgiving (prefix/suffix/includes). If none match, normalize your route or sheet id.</li>
            </ul>
          </div>

          <div className="mt-4">
            <button
              className="px-4 py-2 bg-yellow-500 text-black rounded-md"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {!loading && !error && chapters.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.chapterId || `${index}`}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.36 }}
              onClick={() => handleChapterClick(chapter.chapterId)}
            >
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={chapter.imageUrl || FALLBACK_IMAGE}
                  alt={chapter.chapterTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE)}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500" />
              </div>

              <div className="p-5">
                <h2 className="text-lg md:text-xl font-semibold text-white truncate group-hover:text-yellow-400 transition">
                  {chapter.chapterTitle}
                </h2>
                <p className="text-gray-300 mt-3 text-sm line-clamp-4">{chapter.chapterDescription}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">Order #{chapter.order}</span>
                  <button
                    className="text-xs bg-yellow-400 text-black px-3 py-1 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterClick(chapter.chapterId);
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
