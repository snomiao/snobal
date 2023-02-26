import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Tesseract from "tesseract.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("; ");
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onPaste = async (evt: ClipboardEvent) => {
      if (document.activeElement === canvas) return; // not focused
      const dT = evt.clipboardData;
      const items = [...(dT?.items ?? [])];
      // console.log(items);
      await Promise.all(
        items.map(async (item) => {
          console.log(item);
          if (!item.type.startsWith("image")) {
            // toast.error("Error: cannot read file that is not image");
            return;
          }
          const file = item.getAsFile();
          if (!file) return;
          console.log(item);
          // const blob = item.getAsFile (item.type);
          const img = new Image();
          img.onload = function () {
            // just for debug
            const w = img.width; // 500;
            const h = img.height; // img.height * (w / img.width);
            canvas.width = w; //img.width;
            canvas.height = h; //img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, w, h);
          };
          img.src = URL.createObjectURL(file);
          {
            const lang = "eng+jpn+chi_sim";
            setLoading((loading) => loading + 1);
            toast.success("Image pasted! processing");
            const job = await Tesseract.recognize(img, lang)
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading((loading) => loading - 1);
              });
            if (!job) return; //error

            // extract hocr document

            const hocr = job.data.hocr;
            if (hocr) {
              const doc = new DOMParser().parseFromString(hocr, "text/html");
              const sections = [...doc.querySelectorAll("span")]
                .filter((s) => s.innerText.trim())
                .map((span) => ({
                  text: span.innerText.trim(),
                  ...[
                    span.title
                      ?.match(/bbox (-?\d+) (-?\d+) (-?\d+) (-?\d+)/)
                      ?.slice(1)
                      .map(Number) as [number, number, number, number],
                  ]
                    .flatMap((e) => (e ? [e] : []))
                    .map(([x, y, x1, y1]) => ({
                      x,
                      y,
                      w: x1 - x,
                      h: y1 - y,
                    }))[0],
                })); // flatMap

              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              sections.map(({ text, h, w, x, y }) => {
                ctx.fillText(text, x, y + h);
                ctx.strokeRect(x, y, w, h);
              });
            }
            // extract text
            const text = job.data.text;
            setText((t) => {
              const newText = [
                t,
                text.replace(/(.*\n)+/, (e) => `\n; img: ${file.name}\n${e}`),
              ]
                .filter(Boolean)
                .join("\n");
              navigator.clipboard.writeText(newText);
              return newText;
            });

            // const ctx = canvas.getContext();
            // ctx?.putImageData(new ImageData(new Uint8ClampedArray.from(blob)));
          }
        })
      );
    };
    document.body.addEventListener("paste", onPaste);
    return () => document.body.removeEventListener("paste", onPaste);
  });
  return (
    <div className="h-[100vh]">
      <header className="flex-0">
        <h1 className="text-lg">Paste images here to recognize to text</h1>
        {!!loading && <div>⏳ Processing: {loading}</div>}
      </header>
      <main className="flex flex-row justify-evenly">
        <div className="flex-1">
          <canvas ref={canvasRef} className="flex-1 w-full" />
        </div>
        <textarea
          tabIndex={0}
          // onDoubleClick={async () => {
          //   await navigator.clipboard.writeText(text);
          //   toast.success("text copied");
          // }}
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <pre
          className="flex-1"
          onClick={async () => {
            await navigator.clipboard.writeText(suicaXrBeanParse(text));
            toast.success("text copied");
          }}
        >
          {suicaXrBeanParse(text)}
        </pre>
      </main>
      <Toaster />
    </div>
  );
}
function suicaXrBeanParse(rawText: string) {
  const preprocessedText = textPreprocess(rawText);
  const text = preprocessedText
    .replace(
      /(.*?)(\+?[¥\\yYvV])([\d,]+)(?:・_|>)?(\n.*?\n|\n)(\d\d\d\d-\d\d-\d\d)/g,
      (_, pos, signal, money, noteLine, yyyyMMdd) => {
        const sign = signal.startsWith("+") ? 1 : -1;
        const cost = -sign * Number(money.replace(/,/, ""));
        const payee = noteLine.match("-交通機関") ? "交通機関" : "UNKNOWN";
        const notes = [
          (noteLine as string)
            .trim()
            .replace(/^[E風回.](.*?駅)/, (_, cho) => cho)
            .replace(/-交通機関$/, ""),
          pos,
        ]
          .filter(Boolean)
          .join(" ");
        const s = [
          `${yyyyMMdd} * "${payee}" "${notes}"`,
          cost < 0 &&
            `   Equity:Receivable:Assets:SuicaXR ${cost.toFixed(2)} JPY`,
          `   Assets:SuicaXR ${(-cost).toFixed(2)} JPY`,
          cost > 0 && `   Expenses:Commute ${cost.toFixed(2)} JPY`,
        ]
          .filter(Boolean)
          .join("\n");
        return lineReversed(s);
      }
    )
    .replace(/(.*\n)+/, lineReversed);
  return text;
}

function textPreprocess(rawText: string) {
  const diff1 = "①".charCodeAt(0) - "1".charCodeAt(0);
  const diff2 = "⑩".charCodeAt(0) - "0".charCodeAt(0);
  const diff3 = "⑳".charCodeAt(0) - "0".charCodeAt(0);
  const preprocessedText = rawText
    .replace(/[①-⑨]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - diff1))
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
      /(\d\d\d\d)\/(\d\d)\/(\d\d)/g,
      (_, yyyy, MM, dd) => `${yyyy}-${MM}-${dd}`
    );
  return preprocessedText;
}

function lineReversed(s: string): string {
  return s.split("\n").reverse().join("\n");
}
