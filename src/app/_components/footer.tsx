"use client";

import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-12 space-y-4 text-center">
      <Separator className="w-12 mx-auto bg-primary/20 h-1 rounded-full" />
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          &copy; {currentYear} LaVida Health Labs
        </p>
        <p className="text-[11px] font-bold text-muted-foreground/40 leading-relaxed px-8 italic">
          {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
