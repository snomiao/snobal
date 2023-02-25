import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Tesseract from "tesseract.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("; ");
  const [loading, setLoading] = useState(0);
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
        const file = item.getAsFile();
        if (!file) return;
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
        img.src = URL.createObjectURL(file);
        {
          const lang = "eng+jpn";
          setLoading((loading) => loading + 1);
          toast("Image pasted! processing");
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
                )
                .replace(/ /g, "")
                .replace(/\n\n/g, "\n")
                .replace(
                  /(.*?)(\+?[¥\\yYvV])([\d,]+)(?:・_)?(\n.*?\n|\n)(\d\d\d\d)\/(\d\d)\/(\d\d)/g,
                  (_, pos, signal, money, noteLine, yyyy, MM, dd) => {
                    const sign = signal.startsWith("+") ? 1 : -1;
                    const cost = -sign * Number(money.replace(/,/, ""));
                    const notes = (noteLine as string)
                      .trim()
                      .replace(/( )[E風回](.*?駅)/, (_, s, cho) => s + cho);
                    const payee = notes.match("交通機関")
                      ? "交通機関"
                      : "UNKNOWN";
                    const s = [
                      `${yyyy}-${MM}-${dd} * "${payee}" "${pos} ${notes}"`,
                      cost < 0 &&
                        `   Equity:Receivable:Assets:SuicaXR ${cost.toFixed(
                          2
                        )} JPY`,
                      `   Assets:SuicaXR ${(-cost).toFixed(2)} JPY`,
                      cost > 0 && `   Expenses:Commute ${cost.toFixed(2)} JPY`,
                    ]
                      .filter(Boolean)
                      .join("\n");
                    return lineReversed(s);
                  }
                )
                .replace(/(.*\n)+/, lineReversed)
                .replace(/(.*\n)+/, (e) => `\n; img: ${file.name}\n${e}`);
              setText((t) => {
                const newText = [t, text].filter(Boolean).join("\n");
                navigator.clipboard.writeText(newText);
                return newText;
              });
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading((loading) => loading - 1);
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
      {!!loading && <div>⏳ Processing: {loading}</div>}
      <div className="flex flex-row">
        <textarea
          tabIndex={0}
          onDoubleClick={async () => {
            await navigator.clipboard.writeText(text);
            toast.success("text copied");
          }}
          className="w-[500px] h-[80em]"
          style={{ width: "500px" }}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <div className="w-[500px] h-[500px]">
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
function lineReversed(s: string): string {
  return s.split("\n").reverse().join("\n");
}
