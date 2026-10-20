import type { Metadata } from "next";
import OpenShared from "@/components/OpenShared";

export const metadata: Metadata = {
  title: "Sharpmonk में खोलें",
  robots: { index: false, follow: false },
};

export default function OpenPage() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Sharpmonk में खोलें</h1>
      <OpenShared />
    </main>
  );
}
