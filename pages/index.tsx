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
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("ctx not found");
            return;
          }
          ctx.drawImage(img, 0, 0);
          // const base64 = canvas.toDataURL("image/png");
          // console.log(base64); // base64-encoded image string
          // ctx.clip = base64;
        };
        img.src = URL.createObjectURL(blob);
        {
          const lang = "jpn+eng";

          setText('loading');
          Tesseract.recognize(img, lang)
            .then((job) => {
              console.log(job);
              setText(job.data.text);
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
    <>
      <h1>Paste images here to recognize</h1>
      <canvas tabIndex={0} ref={canvasRef} className="w-[500px] h-[500px]" />

      <pre>{text}</pre>
      <button className="btn btn-primary">{"Retry"}</button>
    </>
  );
}
