"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const STORAGE_KEY = "tk_cookie_consent";

export function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="container-tk">
        <div className="card flex flex-col items-start gap-4 border-gold/20 bg-ink-card/95 p-5 shadow-2xl backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-neutral-300">
              {t.cookie.text}{" "}
              <Link href="/datenschutz" className="text-gold underline hover:text-gold-light">
                {t.cookie.more}
              </Link>
            </p>
          </div>
          <button onClick={accept} className="btn-gold w-full shrink-0 sm:w-auto">
            {t.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
