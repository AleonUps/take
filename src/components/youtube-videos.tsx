import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { searchYouTube, type YouTubeResult } from "@/lib/youtube.server";
import { Play, ExternalLink } from "lucide-react";

export function VideoCard({ video }: { video: YouTubeResult }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass card-hover flex gap-3 rounded-xl p-3 transition-all hover:border-oracle/30"
    >
      <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg">
        <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <Play className="h-5 w-5 text-white" />
        </div>
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] text-white">{video.duration}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium line-clamp-2 text-foreground">{video.title}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{video.channelTitle}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
    </a>
  );
}

export function YouTubeSection({ topic, countryName }: { topic: string; countryName?: string }) {
  const ytFn = useServerFn(searchYouTube);
  const query = countryName ? `${topic} ${countryName}` : topic;
  const { data: videos, isLoading } = useQuery({
    queryKey: ["youtube", query],
    queryFn: async () => {
      const result = await ytFn({ data: { query, maxResults: 3 } });
      return result as YouTubeResult[];
    },
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="mt-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg shimmer" />
        ))}
      </div>
    );
  }

  if (!videos?.length) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Related Videos</p>
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}
