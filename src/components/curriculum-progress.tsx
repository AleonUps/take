import { CheckCircle2, Circle } from "lucide-react";
import { toggleTopicComplete, type CurriculumSubject } from "@/lib/curriculum";

export function CurriculumProgress({ subjects, onToggle }: { subjects: CurriculumSubject[]; onToggle?: (topicId: string, completed: boolean) => void }) {
  const total = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completed = subjects.reduce((acc, s) => acc + s.topics.filter((t) => t.completed).length, 0);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Curriculum Progress</p>
        <span className="text-sm font-semibold text-oracle">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-oracle to-oracle-light transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-4 space-y-3">
        {subjects.map((subj) => (
          <div key={subj.subject}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: subj.color }} />
              <span className="text-xs font-medium" style={{ color: subj.color }}>{subj.subject}</span>
              <span className="text-[10px] text-muted-foreground">{subj.topics.filter((t) => t.completed).length}/{subj.topics.length}</span>
            </div>
            <div className="ml-4 space-y-1">
              {subj.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    const result = toggleTopicComplete("", topic.id);
                    onToggle?.(topic.id, result);
                  }}
                  className="flex items-center gap-2 w-full text-left rounded-md px-2 py-1 text-xs hover:bg-surface-2/60 transition-colors"
                >
                  {topic.completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span className={topic.completed ? "line-through text-muted-foreground" : "text-foreground/80"}>
                    {topic.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
