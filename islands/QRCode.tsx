import { useEffect, useRef } from "preact/hooks";
import { generate } from "npm:lean-qr";
import { JSX } from "preact/jsx-runtime";

export default function QRCode(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const qrCode = generate(globalThis.window.location.origin);

    qrCode.toCanvas(canvasRef.current);
  }, []);

  return (
    <div
      {...props}
      class={`rounded-xl p-2  bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col gap-2 h-56 w-56 ${
        props.class ?? ""
      }`}
    >
      <canvas
        style={"image-rendering: pixelated;"}
        class="bg-white rounded-lg"
        width={256}
        height={256}
        ref={canvasRef}
      >
      </canvas>
    </div>
  );
}
