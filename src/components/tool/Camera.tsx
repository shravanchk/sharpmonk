"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";
import { useStrings } from "@/components/LangProvider";
import { GUIDES, type Guide } from "@/lib/imageEngine";

type Facing = "user" | "environment";

export type CameraSpec = {
  /** "user" for a photo of yourself, "environment" for paper. */
  facing: Facing;
  /** Width ÷ height of the frame shown, the output's proportions. */
  aspect: number;
  /** The face oval, as on the crop. */
  guide?: Guide;
};

/**
 * "Use camera": a live viewfinder at the output's proportions, with the face
 * oval for photos, so people frame the shot as they take it rather than
 * cropping afterwards. What's inside the frame becomes the image, at the
 * camera's full resolution. Without camera access (an old browser, or an
 * in-app browser that blocks it) it falls back to the phone's own camera app.
 */
export function CameraButton({ spec, onFile, className = "" }: { spec: CameraSpec; onFile: (f: File) => void; className?: string }) {
  const s = useStrings();
  const [open, setOpen] = useState(false);
  const fallback = useRef<HTMLInputElement>(null);

  const start = () => {
    // Undefined outside a secure context and in some in-app browsers.
    if (typeof navigator.mediaDevices?.getUserMedia === "function") setOpen(true);
    else fallback.current?.click();
  };

  return (
    <>
      <button type="button" onClick={start} className={`btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm ${className}`}>
        <Icon name="camera" size={16} /> {s.camera.use}
      </button>
      <input
        ref={fallback}
        type="file"
        accept="image/*"
        capture={spec.facing}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {open &&
        createPortal(
          <Viewfinder
            spec={spec}
            onClose={() => setOpen(false)}
            onCapture={(f) => {
              setOpen(false);
              onFile(f);
            }}
          />,
          document.body,
        )}
    </>
  );
}

function Viewfinder({ spec, onCapture, onClose }: { spec: CameraSpec; onCapture: (f: File) => void; onClose: () => void }) {
  const s = useStrings();
  const video = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<Facing>(spec.facing);
  const [state, setState] = useState<"starting" | "live" | "denied">("starting");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1920 } },
          audio: false,
        });
        if (cancelled || !video.current) return;
        video.current.srcObject = stream;
        await video.current.play();
        if (!cancelled) setState("live");
      } catch {
        if (!cancelled) setState("denied");
      }
    })();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

  // The viewfinder owns the screen: no page scroll behind it, Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.removeProperty("overflow");
    };
  }, [onClose]);

  const capture = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    // The frame shows the video "cover"-cropped to the output's proportions;
    // take exactly that region.
    const vw = v.videoWidth;
    const vh = v.videoHeight;
    const wider = vw / vh > spec.aspect;
    const w = wider ? Math.round(vh * spec.aspect) : vw;
    const h = wider ? vh : Math.round(vw / spec.aspect);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(v, (vw - w) / 2, (vh - h) / 2, w, h, 0, 0, w, h);
    c.toBlob((b) => b && onCapture(new File([b], "camera.jpg", { type: "image/jpeg" })), "image/jpeg", 0.95);
  };

  const g = spec.guide ? GUIDES[spec.guide] : null;
  // A selfie preview is mirrored, as every camera app does; the photo isn't.
  const mirrored = facing === "user";

  return (
    <div role="dialog" aria-modal="true" aria-label={s.camera.title} className="fixed inset-0 z-[100] flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <span className="text-sm font-medium">{s.camera.title}</span>
        <button type="button" onClick={onClose} aria-label={s.camera.close} className="flex size-10 items-center justify-center rounded-full bg-white/10">
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <div
          className="relative max-h-full overflow-hidden rounded-xl bg-neutral-900"
          style={{ aspectRatio: `${spec.aspect}`, width: `min(100%, calc((100dvh - 15rem) * ${spec.aspect}))` }}
        >
          <video
            ref={video}
            playsInline
            muted
            className="absolute inset-0 size-full object-cover"
            style={mirrored ? { transform: "scaleX(-1)" } : undefined}
          />
          {g && state === "live" && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
              <ellipse {...g} fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {state !== "live" && (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
              {state === "starting" ? s.camera.starting : s.camera.denied}
            </p>
          )}
        </div>
      </div>

      <p className="px-6 pt-3 text-center text-xs leading-relaxed text-white/70">{spec.guide ? s.camera.tipFace : s.camera.tipPaper}</p>

      <div className="flex items-center justify-center gap-10 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <span className="size-12" />
        <button
          type="button"
          onClick={capture}
          disabled={state !== "live"}
          aria-label={s.camera.capture}
          className="flex size-18 items-center justify-center rounded-full border-4 border-white disabled:opacity-40"
        >
          <span className="size-14 rounded-full bg-white" />
        </button>
        <button
          type="button"
          onClick={() => {
            setState("starting");
            setFacing((f) => (f === "user" ? "environment" : "user"));
          }}
          aria-label={s.camera.flip}
          className="flex size-12 items-center justify-center rounded-full bg-white/10"
        >
          <Icon name="rotate" size={20} />
        </button>
      </div>
    </div>
  );
}
