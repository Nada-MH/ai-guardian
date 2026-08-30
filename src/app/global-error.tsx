'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-white">Application Global Error</h2>
          <p className="text-xs text-slate-400">
            {error?.message || 'A global execution error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
