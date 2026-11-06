import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./hooks";

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  wobble: number;
  phase: number;
  life: number;
}

interface FryerCamProps {
  open: boolean;
}

/**
 * A tiny particle system of rising oil bubbles, drawn into a round porthole.
 * - Simmers hard while the shop is open, barely moves when it's closed.
 * - Click / tap to drop a "chip" in and watch it fizz.
 * - Pauses itself when scrolled off-screen or when the tab is hidden.
 */
const FryerCam = ({ open }: FryerCamProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const bubbles: Bubble[] = [];
    let frame = 0;
    let visible = true;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x = Math.random() * w, y = h + 6, burst = false) => {
      const r = burst ? 1.5 + Math.random() * 5 : 1 + Math.random() * (openRef.current ? 6 : 3);
      bubbles.push({
        x,
        y,
        r,
        vy: (burst ? 40 : 18) + Math.random() * (openRef.current ? 60 : 14) + r * 4,
        wobble: 4 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        life: 1,
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Wavering surface sheen
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(255,236,170,0.28)");
      grad.addColorStop(0.5, "rgba(255,210,120,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 6) {
        ctx.lineTo(x, h * 0.18 + Math.sin(x / 14 + t / 600) * 3 + Math.sin(x / 31 - t / 900) * 4);
      }
      ctx.lineTo(w, 0);
      ctx.fill();

      for (const b of bubbles) {
        const x = b.x + Math.sin(b.phase + t / 300) * b.wobble * 0.15;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 244, 205, ${0.18 * b.life})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255, 250, 230, ${0.75 * b.life})`;
        ctx.stroke();
        // specular dot
        ctx.beginPath();
        ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, Math.max(0.6, b.r * 0.22), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * b.life})`;
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const rate = openRef.current ? 55 : 6; // bubbles per second
      const expected = rate * dt;
      for (let i = 0; i < Math.floor(expected) + (Math.random() < expected % 1 ? 1 : 0); i++) spawn();

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.vy * dt;
        b.vy *= 1 + dt * 0.6; // accelerate as they rise
        if (b.y < h * 0.2) b.life -= dt * 4; // pop near the surface
        if (b.life <= 0 || b.y < -10) bubbles.splice(i, 1);
      }

      draw(now);
      if (visible) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame && visible) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();

    if (reduced) {
      // A single still frame of gently bubbling oil.
      for (let i = 0; i < 26; i++) spawn(Math.random() * w, h * 0.25 + Math.random() * h * 0.7);
      draw(0);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      if (visible) start();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPoke = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 28; i++) spawn(x + (Math.random() - 0.5) * 30, y + Math.random() * 20, true);
    };
    canvas.addEventListener("pointerdown", onPoke);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    start();
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPoke);
    };
  }, [reduced]);

  return (
    <div className="cm-fryer" aria-hidden="true" title="Fryer cam — tap to drop a chip in">
      <svg className="cm-fryer__ring" viewBox="0 0 100 100">
        <defs>
          <path id="cm-fryer-circle" d="M50,50 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href="#cm-fryer-circle">
            Live fryer cam ✦ Woodridge QLD ✦ cooked to order ✦ since forever ✦
          </textPath>
        </text>
      </svg>
      <div className="cm-fryer__glass" data-open={open}>
        <canvas ref={canvasRef} style={{ cursor: "pointer" }} />
        <div className="cm-fryer__glint" />
      </div>
    </div>
  );
};

export default FryerCam;
