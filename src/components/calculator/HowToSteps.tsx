export type HowToStep = { name: string; text: string };

type Props = {
  /** schema.org HowTo name, e.g. "How to use the Life Insurance Needs Calculator" */
  name: string;
  steps: HowToStep[];
  description?: string;
  /** ISO-8601 duration, e.g. "PT1M" */
  totalTime?: string;
  heading?: string;
};

/** Renders a visible numbered "how to use" list AND emits matching
 *  schema.org HowTo JSON-LD so the steps are eligible for rich results. */
export default function HowToSteps({
  name,
  steps,
  description,
  totalTime = "PT1M",
  heading = "How to use this calculator",
}: Props) {
  if (!steps.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <section aria-label={heading}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.name} className="glass-card flex gap-3 rounded-xl p-4">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] font-mono text-sm font-semibold text-[var(--accent)]"
            >
              {index + 1}
            </span>
            <div>
              <p className="font-medium text-[var(--foreground)]/95">{step.name}</p>
              <p className="text-muted mt-0.5 text-sm leading-relaxed">{step.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
