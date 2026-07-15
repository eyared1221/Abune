import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf4e8] p-6">
      <div className="max-w-md rounded-2xl border border-[#ddcfb5] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#405377]">
          Access denied
        </h1>

        <p className="mt-3 text-[#687591]">
          You do not have permission to access this
          portal.
        </p>

        <Link
          className="mt-6 inline-flex rounded-lg bg-[#b48831] px-5 py-2.5 font-semibold text-white"
          href="/login"
        >
          Return to login
        </Link>
      </div>
    </main>
  );
}