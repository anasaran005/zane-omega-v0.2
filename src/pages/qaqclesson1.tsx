import { useEffect, useState } from "react";

/**
 * Your published CSV Google Sheet URL (pub?output=csv)
 */
const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7NjEIy78MENc7KabR0lcP41mfMDruXSVFVAwEJLH5MTMu-ryAl0pRyu2-kUDB_nDas1gwpSUrMF7H/pub?output=csv";

type Collection = {
  id: string;
  title: string;
  description?: string;
  order?: number;
  imageUrl?: string;
  videoUrl?: string; // will hold the converted embed URL
};

/**
 * Convert many YouTube URL formats into an embed-friendly URL.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEOID[&list=PLAYLIST]
 * - https://youtu.be/VIDEOID[?list=PLAYLIST]
 * - playlist-only: https://www.youtube.com/playlist?list=PLAYLISTID
 * - already-embed: https://www.youtube.com/embed/VIDEOID
 */
function convertToEmbed(raw: string | undefined): string {
  if (!raw) return "";

  const url = raw.trim();
  // quick guard: if it already looks like an embed, return as-is
  if (url.includes("/embed/") || url.includes("youtube-nocookie.com")) return url;

  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    // youtu.be short link
    if (host.includes("youtu.be")) {
      const id = u.pathname.slice(1); // remove leading '/'
      const list = u.searchParams.get("list");
      return list ? `https://www.youtube.com/embed/${id}?list=${list}` : `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com domain
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      const list = u.searchParams.get("list");

      // watch?v=VIDEOID
      if (v) {
        return list ? `https://www.youtube.com/embed/${v}?list=${list}` : `https://www.youtube.com/embed/${v}`;
      }

      // playlist-only
      if (u.pathname.includes("/playlist") && list) {
        // embed playlist
        return `https://www.youtube.com/embed?listType=playlist&list=${list}`;
      }

      // if path already /embed/... (caught above) or other path — fallback
    }

    // Fallback: attempt regex extraction for v or youtu.be
    const matchV = url.match(/[?&]v=([^&]+)/);
    if (matchV && matchV[1]) return `https://www.youtube.com/embed/${matchV[1]}`;
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    // final fallback: return original URL (may not play)
    return url;
  } catch (e) {
    // If URL parsing fails, attempt simple regex fallback
    const matchV = url.match(/[?&]v=([^&]+)/);
    if (matchV && matchV[1]) return `https://www.youtube.com/embed/${matchV[1]}`;
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  }
}

export default function QAQCLesson1() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(GOOGLE_SHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        // parse CSV in a forgiving way
        const rawRows = csv
          .trim()
          .split(/\r?\n/)
          .map((r) => r.split(",").map((c) => c.trim()));

        if (rawRows.length === 0) {
          setCollections([]);
          setLoading(false);
          return;
        }

        const headers = rawRows.shift()!.map((h) => h.trim());

        const data = rawRows
          .map((row) => {
            const obj: any = {};
            headers.forEach((h, i) => {
              obj[h] = row[i] ?? "";
            });

            // convert order to number if present
            obj.order = obj.order ? Number(obj.order) || 0 : 0;

            // convert video url to embed form
            obj.videoUrl = convertToEmbed(obj.videoUrl);

            return obj as Collection;
          })
          .filter((c) => c.id && c.title) // ignore incomplete rows
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setCollections(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching sheet:", e);
        setErr(String(e));
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading lessons…</div>;
  if (err) return <div className="p-4 text-red-500">Error loading lessons: {err}</div>;
  if (collections.length === 0) return <div className="p-4">No lessons found in sheet.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">QA/QC Lesson 1</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {collections.map((c) => (
          <div key={c.id} className="rounded border p-4 shadow-sm">
            {c.imageUrl && (
              <img src={c.imageUrl} alt={c.title} className="mb-3 w-full h-40 object-cover rounded" />
            )}

            <h3 className="font-semibold text-lg">{c.title}</h3>
            {c.description && <p className="text-sm text-muted-foreground mt-1 mb-3">{c.description}</p>}

            {c.videoUrl ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={c.videoUrl}
                  title={c.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                ></iframe>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No video URL provided.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
