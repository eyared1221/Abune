"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-6">
      <div className="max-w-md rounded-3xl border border-[#eadfca] bg-white p-8 text-center shadow-[0_18px_50px_rgba(32,46,92,0.10)]">
        <h1 className="text-2xl font-extrabold text-[#243453]">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-[#6e7b96]">
          {error.message || "The page could not be loaded."}
        </p>
        <button
          className="mt-6 rounded-full bg-[#123d91] px-5 py-2.5 text-sm font-semibold text-white"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
