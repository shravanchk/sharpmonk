import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Sharpmonk",
  description: "Get in touch with the Sharpmonk team — questions, feedback, and bug reports welcome.",
};

export default function ContactPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
          Contact
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="text-muted mt-4 leading-relaxed">
          Found a bug in the calculator, have a feature idea, or a question
          about how an estimate was calculated? Send a message below.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
