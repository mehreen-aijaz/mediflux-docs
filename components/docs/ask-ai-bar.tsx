"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isDocsPathname, resolveDocsPathname } from "@/lib/docs-pathname";
import { ArrowUp, Check, ChevronUp } from "lucide-react";
import { BsClaude, BsPerplexity } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMobileBottomBars } from "@/lib/mobile-bottom-bars-context";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  AI_MODELS,
  buildDocQuestionPrompt,
  getAiModelUrl,
  type AiModelId,
} from "@/lib/ai-models";
import { absoluteDocsMarkdownUrl } from "@/lib/site";

const MODEL_STORAGE_KEY = "mediflux-docs-ai-model";

function ChatGptIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function ModelIcon({ model, className }: { model: AiModelId; className?: string }) {
  switch (model) {
    case "chatgpt":
      return <ChatGptIcon className={className} />;
    case "claude":
      return <BsClaude className={className} aria-hidden />;
    case "perplexity":
      return <BsPerplexity className={className} aria-hidden />;
  }
}

function isAiModelId(value: string): value is AiModelId {
  return value === "chatgpt" || value === "claude" || value === "perplexity";
}

export function AskAiBar() {
  const pathname = usePathname();
  const docsPathname = resolveDocsPathname(pathname);
  const isDocsPage = isDocsPathname(pathname);
  const { barsVisible, revealMobile, pinBars, unpinBars } = useMobileBottomBars();
  const isXl = useMediaQuery("(min-width: 1280px)");
  const unpinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [model, setModel] = useState<AiModelId>("chatgpt");
  const [question, setQuestion] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [desktopHoverPeek, setDesktopHoverPeek] = useState(false);
  const expanded =
    barsVisible || pickerOpen || (isXl && desktopHoverPeek);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MODEL_STORAGE_KEY);
      if (stored && isAiModelId(stored)) setModel(stored);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isXl) setDesktopHoverPeek(false);
  }, [isXl]);

  useEffect(() => {
    if (!barsVisible) setDesktopHoverPeek(false);
  }, [barsVisible]);

  const selectModel = useCallback((id: AiModelId) => {
    setModel(id);
    setPickerOpen(false);
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, id);
    } catch {}
  }, []);

  const send = useCallback(() => {
    const trimmed = question.trim();
    if (!trimmed || typeof window === "undefined") return;

    const markdownUrl = absoluteDocsMarkdownUrl(
      docsPathname,
      window.location.origin
    );
    const prompt = buildDocQuestionPrompt(markdownUrl, trimmed);
    const url = getAiModelUrl(model, prompt);

    window.open(url, "_blank", "noopener,noreferrer");
    setQuestion("");
  }, [docsPathname, model, question]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  const revealMobileBars = useCallback(() => {
    setDesktopHoverPeek(false);
    revealMobile();
  }, [revealMobile]);

  const handleInputFocus = useCallback(() => {
    if (unpinTimerRef.current) {
      clearTimeout(unpinTimerRef.current);
      unpinTimerRef.current = null;
    }
    pinBars();
  }, [pinBars]);

  const handleInputBlur = useCallback(() => {
    unpinTimerRef.current = setTimeout(() => {
      unpinBars();
      unpinTimerRef.current = null;
    }, 200);
  }, [unpinBars]);

  useEffect(() => {
    return () => {
      if (unpinTimerRef.current) clearTimeout(unpinTimerRef.current);
    };
  }, []);

  if (!isDocsPage) return null;

  const selected = AI_MODELS.find((m) => m.id === model)!;
  const canSend = question.trim().length > 0;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex justify-center",
        "pb-[env(safe-area-inset-bottom,0px)]",
        "pointer-events-none"
      )}
    >
      <div className="relative w-full max-w-xl px-4">
        {!expanded && (
          <>
            <div
              className="absolute inset-x-4 bottom-0 z-20 hidden h-5 overflow-hidden pointer-events-auto xl:block"
              onMouseEnter={() => setDesktopHoverPeek(true)}
              onMouseLeave={() => setDesktopHoverPeek(false)}
              aria-hidden
            />

            <div className="absolute inset-x-4 bottom-0 z-20 h-8 overflow-visible pointer-events-none xl:hidden">
              <button
                type="button"
                onPointerUp={(e) => {
                  if (e.pointerType === "mouse" && e.button !== 0) return;
                  e.preventDefault();
                  e.stopPropagation();
                  revealMobileBars();
                }}
                aria-label={`Show ${selected.label} prompt and page contents`}
                className={cn(
                  "pointer-events-auto absolute bottom-0 left-1/2 flex h-7 w-16 -translate-x-1/2",
                  "touch-manipulation items-center justify-center rounded-t-xl border-2 border-border",
                  "bg-background/95 text-muted-foreground shadow-sm backdrop-blur-sm",
                  "transition-colors active:bg-accent active:text-foreground cursor-pointer hover:bg-accent/80 hover:text-foreground group transition-all duration-200 hover:h-10 shadow-lg"
                )}
              >
                <ChevronUp className="size-5 group-hover:-translate-y-1.5 transition-transform duration-200" aria-hidden />
              </button>
            </div>
          </>
        )}

        <div
          className={cn(
            "transition-transform duration-300 ease-out",
            expanded
              ? "translate-y-0 pointer-events-auto mb-4 max-xl:mb-[3.5rem] xl:mb-6"
              : [
                  "max-xl:translate-y-full max-xl:pointer-events-none",
                  "xl:translate-y-[calc(100%-0.75rem)] xl:pointer-events-none",
                ]
          )}
        >
        <div
          className={cn(
            "flex items-center gap-1.5",
            "rounded-2xl border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur-sm",
            "sm:gap-2 sm:p-2"
          )}
        >
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`Ask ${selected.label}. Choose model`}
                aria-expanded={pickerOpen}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-0.5 rounded-xl px-2",
                  "text-muted-foreground transition-colors",
                  "hover:bg-accent hover:text-foreground",
                  "data-[state=open]:bg-accent data-[state=open]:text-foreground"
                )}
              >
                <ModelIcon model={model} className="size-4" />
                <ChevronUp
                  className={cn(
                    "size-3.5 shrink-0 transition-transform duration-200",
                    pickerOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="top"
              sideOffset={8}
              className="w-52 p-1.5"
            >
              <p className="px-2 pb-1 pt-0.5 text-xs font-medium text-muted-foreground">
                Ask with
              </p>
              {AI_MODELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectModel(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                    "hover:bg-accent",
                    item.id === model && "bg-accent/60"
                  )}
                >
                  <ModelIcon model={item.id} className="size-4 shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.id === model && (
                    <Check className="size-3.5 text-primary" aria-hidden />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={selected.placeholder}
            aria-label={selected.placeholder}
            className={cn(
              "min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none",
              "placeholder:text-muted-foreground"
            )}
          />

          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            aria-label={`Send question to ${selected.label}`}
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              canSend
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
