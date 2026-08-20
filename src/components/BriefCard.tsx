import {
  Target,
  Globe2,
  Users,
  Coins,
  Boxes,
  Map,
  AlertTriangle,
  Download,
  Copy,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import type { Brief } from "@/lib/cofounder.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card p-6 ${className}`}>
      <header className="mb-4 flex items-start gap-3">
        <span className="rounded-lg bg-secondary p-2 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

function briefToMarkdown(b: Brief, idea: string) {
  return `# ${b.productName}\n_${b.tagline}_\n\n**Идея:** ${idea}\n\n## Проблема и JTBD\n${b.problem.statement}\n\n**Job-To-Be-Done:** ${b.problem.jobToBeDone}\n\n${b.problem.painPoints.map((p) => `- ${p}`).join("\n")}\n\n## Рынок\n- TAM: ${b.market.tam}\n- SAM: ${b.market.sam}\n- SOM: ${b.market.som}\n\n${b.market.reasoning}\n\n## Аудитория\n${b.audience.segments.map((s) => `- **${s.name}** — ${s.description}`).join("\n")}\n\n**Ценностное предложение:** ${b.audience.valueProposition}\n\n## Монетизация\n${b.monetization.map((m) => `- **${m.model}** (${m.potential}) — ${m.description}`).join("\n")}\n\n## MVP\n${b.mvpFeatures.map((f) => `- **${f.title}** [${f.priority}] — ${f.description}`).join("\n")}\n\n## Следующие шаги\n${b.roadmap.map((r, i) => `${i + 1}. **${r.step}** (${r.timeframe}) — ${r.description}`).join("\n")}\n\n## Риски\n${b.risks.map((r) => `- ${r}`).join("\n")}\n`;
}

export function BriefCard({
  brief,
  idea,
  onReset,
}: {
  brief: Brief;
  idea: string;
  onReset: () => void;
}) {
  const markdown = () => briefToMarkdown(brief, idea);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown());
    toast.success("Карточка скопирована в буфер обмена");
  };

  const download = () => {
    const blob = new Blob([markdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.productName.replace(/\s+/g, "-").toLowerCase()}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Файл сохранён");
  };

  const market = [
    { label: "TAM", value: brief.market.tam, hint: "Весь рынок" },
    { label: "SAM", value: brief.market.sam, hint: "Доступный рынок" },
    { label: "SOM", value: brief.market.som, hint: "Реалистичная доля" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-24">
      <div className="surface-card hero-bg overflow-hidden p-8">
        <Badge variant="secondary" className="mb-4">
          Карточка проекта
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">{brief.productName}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{brief.tagline}</p>
        <p className="mt-4 border-l-2 border-primary/60 pl-3 text-sm text-muted-foreground italic">
          {idea}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={download}>
            <Download className="size-4" /> Экспорт в Markdown
          </Button>
          <Button variant="secondary" onClick={copy}>
            <Copy className="size-4" /> Скопировать
          </Button>
          <Button variant="ghost" onClick={onReset}>
            <RefreshCw className="size-4" /> Новая идея
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section icon={Target} title="Проблема и JTBD" subtitle="Что именно болит у пользователя">
          <p className="text-sm leading-relaxed">{brief.problem.statement}</p>
          <p className="mt-4 rounded-lg bg-secondary p-3 text-sm">
            <span className="font-semibold text-primary">Job-To-Be-Done: </span>
            {brief.problem.jobToBeDone}
          </p>
          <ul className="mt-4 space-y-2">
            {brief.problem.painPoints.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Globe2} title="Оценка рынка" subtitle="TAM / SAM / SOM">
          <div className="grid grid-cols-3 gap-3">
            {market.map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-secondary/60 p-3">
                <div className="text-xs font-semibold tracking-wider text-primary">{m.label}</div>
                <div className="mt-1 font-display text-lg font-semibold">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.hint}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {brief.market.reasoning}
          </p>
        </Section>

        <Section icon={Users} title="Аудитория и ценность" subtitle="Кому и зачем">
          <div className="space-y-3">
            {brief.audience.segments.map((s) => (
              <div key={s.name} className="rounded-lg border border-border p-3">
                <div className="font-semibold">{s.name}</div>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-secondary p-3 text-sm">
            <span className="font-semibold text-accent">Ценностное предложение: </span>
            {brief.audience.valueProposition}
          </p>
        </Section>

        <Section icon={Coins} title="Монетизация" subtitle="Как продукт зарабатывает">
          <div className="space-y-3">
            {brief.monetization.map((m) => (
              <div key={m.model} className="rounded-lg border border-border p-3">
                <div className="font-semibold">{m.model}</div>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                <p className="mt-2 text-xs text-accent">Потенциал: {m.potential}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={Boxes}
          title="Ключевые функции MVP"
          subtitle="Минимум, который проверит гипотезу"
          className="md:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {brief.mvpFeatures.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{f.title}</span>
                  <Badge variant="secondary">{f.priority}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={Map}
          title="План следующих шагов"
          subtitle="Дорожная карта запуска"
          className="md:col-span-2"
        >
          <ol className="relative space-y-5 border-l border-border pl-6">
            {brief.roadmap.map((r, i) => (
              <li key={r.step}>
                <span className="absolute -left-3 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{r.step}</span>
                  <Badge variant="outline">{r.timeframe}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section icon={AlertTriangle} title="Риски" subtitle="О чём стоит подумать заранее" className="md:col-span-2">
          <ul className="grid gap-2 sm:grid-cols-3">
            {brief.risks.map((r) => (
              <li key={r} className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                {r}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}