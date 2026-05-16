import { Leaf, AlertCircle, CheckCircle2, BookOpen } from "lucide-react";
import { environmentalDatabase, topicCategories } from "@/data/environmentalDatabase";
import ImpactCalculator from "./ImpactCalculator";

interface TopicViewProps {
  topicId: string | null;
  onSelectTopic: (id: string) => void;
  onOpenSidebar: () => void;
}

const urgencyStyles: Record<string, string> = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-ocean/10 text-ocean border-ocean/20",
  high: "bg-sunset/10 text-sunset border-sunset/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const TopicView = ({ topicId, onSelectTopic, onOpenSidebar }: TopicViewProps) => {
  const topic = topicId ? environmentalDatabase[topicId] : null;

  const featured = topicCategories
    .flatMap((c) => Object.entries(c.topics).map(([id, name]) => ({ id, name, category: c.name })))
    .filter((t) => environmentalDatabase[t.id])
    .slice(0, 6);

  if (!topic) {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <header className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-forest flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              TB Environmental Intelligence
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore a curated database of environmental topics, urgency levels, and actionable
              solutions. Pick a topic to dive in.
            </p>
            <button
              onClick={onOpenSidebar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-forest text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <BookOpen className="w-4 h-4" />
              Browse all topics
            </button>
          </header>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Featured topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featured.map((t) => {
                const data = environmentalDatabase[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTopic(t.id)}
                    className="text-left p-4 rounded-xl glass hover:bg-muted/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-foreground">{data.title}</span>
                      <span
                        className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${urgencyStyles[data.urgency]}`}
                      >
                        {data.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.category}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Impact calculator</h2>
            <ImpactCalculator />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{topic.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">Environmental knowledge base</p>
          </div>
          <span
            className={`text-xs uppercase tracking-wide px-3 py-1 rounded-full border ${urgencyStyles[topic.urgency]} flex items-center gap-1.5`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {topic.urgency}
          </span>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Recommended solutions
          </h2>
          <ul className="space-y-2">
            {topic.solutions.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onOpenSidebar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-foreground hover:bg-muted/40 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Browse other topics
        </button>
      </div>
    </div>
  );
};

export default TopicView;
