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

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lessonId } = req.query;

  if (!NOTION_TOKEN || !DATABASE_ID) {
    return res.status(500).json({ error: "Missing Notion API credentials" });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          property: "lessonId",
          rich_text: {
            equals: lessonId,
          },
        },
        sorts: [
          {
            property: "order",
            direction: "ascending",
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    const topics: TopicRow[] = data.results.map((page: any) => {
      const props = page.properties;
      return {
        courseId: props.courseId?.rich_text?.[0]?.plain_text || "",
        chapterId: props.chapterId?.rich_text?.[0]?.plain_text || "",
        lessonId: props.lessonId?.rich_text?.[0]?.plain_text || "",
        topicId: props.topicId?.rich_text?.[0]?.plain_text || "",
        title: props.title?.title?.[0]?.plain_text || "",
        description: props.description?.rich_text?.[0]?.plain_text || "",
        videoUrl: props.videoUrl?.url || "",
        order: props.order?.number || null,
        imageUrl: props.imageUrl?.url || "",
      };
    });

    return res.status(200).json(topics);
  } catch (error) {
    console.error("Notion API error:", error);
    return res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
