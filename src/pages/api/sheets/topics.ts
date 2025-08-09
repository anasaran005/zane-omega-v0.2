// pages/api/sheets/topics.ts
import type { NextApiRequest, NextApiResponse } from "next";

type TopicRow = {
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  topicId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  order?: number | null;
  imageUrl?: string;
};

/**
 * Minimal CSV parser that supports quoted fields with commas/newlines.
 */
function parseCSV(csv: string): string[][] {
  // Normalize newlines
  csv = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped quote
        field += '"';
        i++; // skip next
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n") {
        current.push(field);
        rows.push(current);
        current = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }

  // push last field if any
  if (field !== "" || inQuotes || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  // Remove possible trailing empty row (common when file ends with newline)
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }

  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // You provided this publish-to-web CSV URL — default used if caller doesn't pass sheetUrl.
    const defaultCsvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSwPfAZKp2clwiJi8OAScqs7NrjRRORbOPLGe51ACbk6lsrPEVlobezscw3bbLxIQ7l6HE38HYnjpv/pub?output=csv";

    const { lessonId, sheetUrl } = req.query;
    const csvUrl = typeof sheetUrl === "string" && sheetUrl.length ? sheetUrl : defaultCsvUrl;

    if (!csvUrl) return res.status(400).json({ error: "No sheetUrl provided." });

    const r = await fetch(csvUrl);
    if (!r.ok) return res.status(502).json({ error: `Failed to fetch sheet: ${r.status}` });
    const text = await r.text();

    // strip BOM if present
    const cleaned = text.replace(/^\uFEFF/, "");
    const rows = parseCSV(cleaned);
    if (!rows || rows.length === 0) return res.status(200).json([]);

    const header = rows[0].map((h) => (h || "").trim());
    const dataRows = rows.slice(1);

    const items: TopicRow[] = dataRows.map((r) => {
      const obj: any = {};
      header.forEach((col, i) => {
        const key = col || `col${i}`;
        obj[key] = r[i] ?? "";
      });
      if (obj.order !== undefined && obj.order !== "") {
        const n = Number(obj.order);
        obj.order = Number.isNaN(n) ? null : n;
      } else {
        obj.order = null;
      }
      return obj as TopicRow;
    });

    const filtered = lessonId ? items.filter((it) => String(it.lessonId) === String(lessonId)) : items;

    // optional: sort by order if present
    filtered.sort((a, b) => {
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      return ao - bo;
    });

    return res.status(200).json(filtered);
  } catch (err: any) {
    console.error("topics api error:", err);
    return res.status(500).json({ error: err?.message ?? "unknown" });
  }
}
