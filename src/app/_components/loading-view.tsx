"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useI18n } from "@/lib/i18n";

export function LoadingView() {
  const { t } = useI18n();
  const loadingPlaceholder = PlaceHolderImages.find(
    (img) => img.id === "loading-medical",
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-background shadow-2xl">
          {loadingPlaceholder && (
            <Image
              src={loadingPlaceholder.imageUrl}
              alt="Loading"
              fill
              className="object-cover transition-opacity duration-1000"
              data-ai-hint={loadingPlaceholder.imageHint}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-[2px]">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <p className="text-2xl font-black text-primary animate-bounce">
          {t.home.consulting}
        </p>
        <p className="text-muted-foreground font-medium">
          {t.home.consultSubtext}
        </p>
      </div>
    </div>
  );
}
