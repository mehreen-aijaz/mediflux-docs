export type AiModelId = "chatgpt" | "claude" | "perplexity";

export interface AiModel {
  id: AiModelId;
  label: string;
  placeholder: string;
}

export const AI_MODELS: AiModel[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    placeholder: "Ask ChatGPT about this page...",
  },
  {
    id: "claude",
    label: "Claude",
    placeholder: "Ask Claude about this page...",
  },
  {
    id: "perplexity",
    label: "Perplexity",
    placeholder: "Ask Perplexity about this page...",
  },
];

export function buildDocQuestionPrompt(markdownUrl: string, question: string) {
  const trimmed = question.trim();
  const intro = `Read the MediFlux docs page at ${markdownUrl}, then answer my questions using only that page.`;

  if (!trimmed) return intro;
  return `${intro}\n\nQuestion: ${trimmed}`;
}

export function getAiModelUrl(model: AiModelId, prompt: string) {
  switch (model) {
    case "chatgpt":
      return `https://chatgpt.com/?${new URLSearchParams({
        prompt,
        hints: "search",
      })}`;
    case "claude":
      return `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`;
    case "perplexity":
      return `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`;
  }
}
