"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md text-center space-y-6">
        <div className="mx-auto bg-red-50 p-3 rounded-full w-fit">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Something went wrong!</h2>
          <p className="text-sm text-slate-500">
            {error.message || "We encountered an issue loading the dashboard."}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload Page
          </Button>
          <Button
            onClick={() => reset()}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
