// pages/api/sheets/learning.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";

const sheets = {
  topics: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSwPfAZKp2clwiJi8OAScqs7NrjRRORbOPLGe51ACbk6lsrPEVlobezscw3bbLxIQ7l6HE38HYnjpv/pub?output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLX0cbVp85tIk5tnq1caor9T3noswKXJz4Jkr1MzpPx4hjsOYwr-nPCahLOHehPqpHtfyKQ8L8E0hs/pub?output=csv",
  quizzes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRH_UnPzWaMMkdzMD1igo0tuV17qMtNCMIGs3YqL4RtBkMPuPwoPNij5YvR_srfsPQHi7f-YxJ4H1BU/pub?output=csv",
  tasks: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGAW8da-au-iHwYIVygsJ94KjqWunl4mvr58Q11AJIhXwT4UNyKYjSAzLR1Jom2LRfc4A3rfhXzDDs/pub?output=csv"
};

async function fetchCSV(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();
  return Papa.parse(text, { header: true }).data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topicId } = req.query;
  if (!topicId || typeof topicId !== "string") {
    return res.status(400).json({ error: "Missing topicId" });
  }

  try {
    // Step 1: Get Topic info
    const topics = await fetchCSV(sheets.topics);
    const topic = topics.find((t: any) => t.id === topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const { lessonId, courseId } = topic;

    // Step 2: Get Lesson
    const lessons = await fetchCSV(sheets.lessons);
    const lesson = lessons.find((l: any) => l.id === lessonId);

    // Step 3: Get Quiz
    const quizzes = await fetchCSV(sheets.quizzes);
    const quiz = quizzes.filter((q: any) => q.courseId === courseId && q.topicId === topicId);

    // Step 4: Get Task
    const tasks = await fetchCSV(sheets.tasks);
    const task = tasks.find((t: any) => t.courseId === courseId && t.topicId === topicId);

    res.status(200).json({ video: lesson, quiz, task });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning data" });
  }
}
