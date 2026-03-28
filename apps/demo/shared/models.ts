export type ChatModelOption = {
  label: string;
  value: string;
  icon: string;
};

export const OPENAI_ICON = "i-simple-icons-openai";
export const ANTHROPIC_ICON = "i-simple-icons-anthropic";
export const GEMINI_ICON = "i-simple-icons-googlegemini";

export const ALLOWED_CHAT_MODELS: ChatModelOption[] = [
  {
    label: "GPT-5.4 nano",
    value: "openai/gpt-5.4-nano",
    icon: OPENAI_ICON,
  },
  {
    label: "GPT-5.3-Codex",
    value: "openai/gpt-5.3-codex",
    icon: OPENAI_ICON,
  },
  {
    label: "Claude Opus 4.6",
    value: "anthropic/claude-opus-4.6",
    icon: ANTHROPIC_ICON,
  },
  {
    label: "Gemini 3 Flash",
    value: "google/gemini-3-flash",
    icon: GEMINI_ICON,
  },
];

export function isAllowedChatModel(model: string): boolean {
  return ALLOWED_CHAT_MODELS.some((option) => option.value === model);
}
