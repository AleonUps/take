import { ExternalLink } from "lucide-react";

type FreeCourseLink = {
  title: string;
  platform: string;
  url: string;
  description: string;
};

function getFreeCourseLinks(topic: string): FreeCourseLink[] {
  const encoded = encodeURIComponent(topic);
  return [
    {
      title: `${topic}`,
      platform: "Khan Academy",
      url: `https://www.khanacademy.org/search?page_search_query=${encoded}`,
      description: "Free structured lessons with practice exercises",
    },
    {
      title: `${topic}`,
      platform: "freeCodeCamp",
      url: `https://www.freecodecamp.org/news/search/?query=${encoded}`,
      description: "Free coding and tech tutorials",
    },
    {
      title: `${topic}`,
      platform: "MIT OCW",
      url: `https://ocw.mit.edu/search/?d=CourseHome&s=department_course_numbers_sort_cascadingasc&q=${encoded}`,
      description: "Free MIT university course materials",
    },
    {
      title: `${topic}`,
      platform: "Coursera",
      url: `https://www.coursera.org/search?query=${encoded}&productType=Course&price=Free`,
      description: "Free university courses from top schools",
    },
    {
      title: `${topic}`,
      platform: "YouTube",
      url: `https://www.youtube.com/results?search_query=${encoded}+lesson+tutorial`,
      description: "Free video tutorials and lectures",
    },
  ];
}

export function FreeCoursesSection({ topic }: { topic: string }) {
  const links = getFreeCourseLinks(topic);
  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Free Resources</p>
      <div className="flex flex-wrap gap-1.5">
        {links.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-oracle/40 transition-all"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  );
}
