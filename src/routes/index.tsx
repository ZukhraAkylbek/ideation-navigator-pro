import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BriefCard } from "@/components/BriefCard";
import { generateBrief, type Brief } from "@/lib/cofounder.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ИИ-кофаундер — стартап-бриф из одной идеи" },
      {
        name: "description",
        content:
          "Опишите идею — ИИ-кофаундер соберёт проблему и JTBD, оценку рынка TAM/SAM/SOM, аудиторию, монетизацию, MVP и план запуска.",
      },
      { property: "og:title", content: "ИИ-кофаундер — стартап-бриф из одной идеи" },
      {
        property: "og:description",
        content:
          "Проблема, рынок, аудитория, монетизация, MVP и roadmap — структурированная карточка проекта за минуту.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const EXAMPLES = [
  "Приложение, которое помогает студентам фокусироваться",
  "Маркетплейс аренды музыкального оборудования",
  "ИИ-ассистент для нутрициологов и их клиентов",
];

function Index() {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const run = useServerFn(generateBrief);

  const mutation = useMutation({
    mutationFn: (value: string) => run({ data: { idea: value } }),
    onSuccess: (data) => setBrief(data as Brief),
    onError: (error: Error) => toast.error(error.message),
  });

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 5) {
      toast.error("Опишите идею чуть подробнее");
      return;
    }
    setSubmitted(trimmed);
    mutation.mutate(trimmed);
  };

  if (brief) {
    return (
      <main className="min-h-screen pt-10">
        <BriefCard
          brief={brief}
          idea={submitted}
          onReset={() => {
            setBrief(null);
            setIdea("");
            mutation.reset();
          }}
        />
      </main>
    );
  }

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> ИИ-кофаундер
        </span>
        <h1 className="mt-6 text-4xl font-bold sm:text-6xl">
          Идея → <span className="text-gradient">стартап-бриф</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Опишите идею одной фразой. Получите проблему и JTBD, оценку рынка, аудиторию,
          монетизацию, MVP и план запуска — в одной карточке проекта.
        </p>

        <form
          className="surface-card mt-10 p-4 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            submit(idea);
          }}
        >
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Хочу приложение, которое помогает студентам фокусироваться…"
            rows={4}
            disabled={mutation.isPending}
            className="resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Анализ занимает ~20 секунд</span>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Анализирую идею…
                </>
              ) : (
                <>
                  Создать бриф <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              type="button"
              disabled={mutation.isPending}
              onClick={() => {
                setIdea(e);
                submit(e);
              }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-50"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
