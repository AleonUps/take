import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const YouTubeSearchInput = z.object({
  query: z.string().min(1).max(200),
  maxResults: z.number().min(1).max(5).default(3),
});

export type YouTubeResult = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  url: string;
};

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "?";
  const h = m[1] ? `${m[1]}:` : "";
  const min = m[2]?.padStart(h ? 2 : 1, "0") ?? "0";
  const sec = m[3]?.padStart(2, "0") ?? "00";
  return `${h}${min}:${sec}`;
}

export const searchYouTube = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => YouTubeSearchInput.parse(input))
  .handler(async ({ data }): Promise<YouTubeResult[]> => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return [];

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${data.maxResults}&q=${encodeURIComponent(data.query + " tutorial lesson")}&key=${apiKey}&videoEmbeddable=true&videoDuration=medium`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const body = await res.json() as {
        items: Array<{
          id: { videoId: string };
          snippet: { title: string; thumbnails: { medium: { url: string } }; channelTitle: string };
        }>;
      };

      const ids = body.items.map((i) => i.id.videoId).join(",");
      let durations: Record<string, string> = {};
      if (ids) {
        const dRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${apiKey}`);
        if (dRes.ok) {
          const dBody = await dRes.json() as {
            items: Array<{ id: string; contentDetails: { duration: string } }>;
          };
          for (const v of dBody.items) {
            durations[v.id] = parseDuration(v.contentDetails.duration);
          }
        }
      }

      return body.items.map((i) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        thumbnail: i.snippet.thumbnails.medium.url,
        duration: durations[i.id.videoId] ?? "?",
        channelTitle: i.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${i.id.videoId}`,
      }));
    } catch {
      return [];
    }
  });
