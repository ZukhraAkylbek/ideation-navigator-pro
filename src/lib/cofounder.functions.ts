import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const briefSchema = z.object({
  productName: z.string(),
  tagline: z.string(),
  problem: z.object({
    statement: z.string(),
    jobToBeDone: z.string(),
    painPoints: z.array(z.string()),
  }),
  market: z.object({
    tam: z.string(),
    sam: z.string(),
    som: z.string(),
    reasoning: z.string(),
  }),
  audience: z.object({
    segments: z.array(z.object({ name: z.string(), description: z.string() })),
    valueProposition: z.string(),
  }),
  monetization: z.array(
    z.object({ model: z.string(), description: z.string(), potential: z.string() }),
  ),
  mvpFeatures: z.array(
    z.object({ title: z.string(), description: z.string(), priority: z.string() }),
  ),
  roadmap: z.array(
    z.object({ step: z.string(), timeframe: z.string(), description: z.string() }),
  ),
  risks: z.array(z.string()),
});

export type Brief = z.infer<typeof briefSchema>;

export const generateBrief = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ idea: z.string().min(5).max(2000) }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI не настроен: отсутствует ключ API.");

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        output: Output.object({ schema: briefSchema }),
        system:
          "Ты опытный технический ко-фаундер и венчурный аналитик. Отвечай ВСЕГДА на русском языке. " +
          "Будь конкретным: цифры рынка с единицами ($ млрд/млн) и кратким обоснованием, реалистичные фичи MVP, " +
          "чёткие шаги запуска. Без воды и клише. priority: 'Must have' | 'Should have' | 'Nice to have'.",
        prompt: `Идея пользователя: "${data.idea}"\n\nСоставь полный стартап-бриф: проблема и JTBD, TAM/SAM/SOM, аудитория и ценностное предложение, модели монетизации (3-4), ключевые функции MVP (5-7), план следующих шагов (4-6), риски (3).`,
      });
      return result.output;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("429")) throw new Error("Слишком много запросов. Попробуйте через минуту.");
      if (message.includes("402")) throw new Error("Закончились AI-кредиты воркспейса. Пополните баланс в Lovable.");
      throw new Error(`Не удалось сгенерировать бриф: ${message}`);
    }
  });