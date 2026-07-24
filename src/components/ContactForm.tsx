"use client";

import { useState, type FormEvent } from "react";

const CONTACT_EMAIL = "shravanchk@gmail.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Sharpmonk contact form — ${name || "no name"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-4 rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]/90">Name</span>
          <input
            required
            type="text"
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]/90">Email</span>
          <input
            required
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--foreground)]/90">Message</span>
        <textarea
          required
          rows={5}
          className="field-input resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
        />
      </label>

      <button type="submit" className="btn-glow self-start rounded-full px-6 py-2.5 text-sm font-semibold">
        Send message
      </button>

      {sent && (
        <p className="reveal text-sm text-[var(--positive)]">
          Opening your email client with the message pre-filled — hit send there to deliver it.
        </p>
      )}

      <p className="text-muted text-xs leading-relaxed">
        This form opens your email client via a <code>mailto:</code> link —
        Sharpmonk is a static site with no backend, so nothing you type here
        is stored or transmitted until you actually send the email.
      </p>
    </form>
  );
}
