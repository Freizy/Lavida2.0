"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
};

export function ErrorBoundary({ children, fallbackTitle, fallbackMessage }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error) => {
    console.error("[LaVida ErrorBoundary]", err);
    setError(err);
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">
          {fallbackTitle || "Something went wrong"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {fallbackMessage ||
            "An unexpected error occurred. Please try refreshing the page."}
        </p>
        <Button
          onClick={() => {
            setHasError(false);
            setError(null);
            window.location.reload();
          }}
          className="rounded-full"
        >
          Reload Page
        </Button>
      </div>
    );
  }

  return <ErrorCatcher onError={handleError}>{children}</ErrorCatcher>;
}

type ErrorCatcherProps = {
  children: React.ReactNode;
  onError: (error: Error) => void;
};

class ErrorCatcher extends React.Component<ErrorCatcherProps> {
  constructor(props: ErrorCatcherProps) {
    super(props);
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}
