import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Tesseract from "tesseract.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("...");
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onPaste = (evt: ClipboardEvent) => {
      if (document.activeElement === canvas) return; // not focused
      const dT = evt.clipboardData;
      const items = [...(dT?.items ?? [])];
      console.log(items);
      items.map((item) => {
        console.log(item);
        if (!item.type.startsWith("image")) {
          toast.error("Error: cannot read file that is not image");
          return;
        }
        const blob = item.getAsFile();
        if (!blob) return;
        console.log(item);
        // const blob = item.getAsFile (item.type);
        const img = new Image();
        img.onload = function () {
          // just for debug
          const w = 500;
          const h = img.height * (w / img.width);
          canvas.width = w; //img.width;
          canvas.height = h; //img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("ctx not found");
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
        };
        img.src = URL.createObjectURL(blob);
        {
          const lang = "eng+jpn";
          setText("loading");
          Tesseract.recognize(img, lang)
            .then(async (job) => {
              console.log(job);
              const diff1 = "①".charCodeAt(0) - "1".charCodeAt(0);
              const diff2 = "⑩".charCodeAt(0) - "0".charCodeAt(0);
              const diff3 = "⑳".charCodeAt(0) - "0".charCodeAt(0);
              const text = job.data.text
                .replace(/[①-⑨]/g, (ch) =>
                  String.fromCharCode(ch.charCodeAt(0) - diff1)
                )
                .replace(
                  /[⑩-⑲]/g,
                  (ch) => "1" + String.fromCharCode(ch.charCodeAt(0) - diff2)
                )
                .replace(
                  /[⑳]/g,
                  (ch) => "2" + String.fromCharCode(ch.charCodeAt(0) - diff3)
                );
              setText(text);
              await navigator.clipboard.writeText(text);
            })
            .catch((error) => {
              console.log(error);
            });

          // const ctx = canvas.getContext();
          // ctx?.putImageData(new ImageData(new Uint8ClampedArray.from(blob)));
        }
      });
    };
    document.body.addEventListener("paste", onPaste);
    return () => document.body.removeEventListener("paste", onPaste);
  });
  return (
    <div>
      <h1>Paste images here to recognize to text</h1>
      <pre tabIndex={0} onClick={() => navigator.clipboard.writeText(text)}>
        {text}
      </pre>
      <div className="w-[500px] h-[500px]">
        <canvas tabIndex={0} ref={canvasRef} className="hidden" />
      </div>
      <button className="btn btn-primary">{"Retry"}</button>
    </div>
  );
}
