import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export default function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneApp()) return;

    const showTimer = window.setTimeout(() => setVisible(true), 600);
    const hideTimer = window.setTimeout(() => setVisible(false), 5600);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleScroll = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("scroll", handleScroll, { once: true, passive: true });

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setVisible(false);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice.catch(() => null);
    setInstallPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-3 z-[70] w-[92%] max-w-xl -translate-x-1/2 rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <img
          src="/icon-192.png"
          alt=""
          className="h-9 w-9"
          width={36}
          height={36}
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Install Pelek Properties
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Open faster from your home screen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-secondary px-3 text-xs font-semibold text-accent-foreground hover:opacity-90"
        >
          <Download className="h-3.5 w-3.5" />
          Install App
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss install prompt"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
