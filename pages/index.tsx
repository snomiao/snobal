import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
// Import Tesseract.js library
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
          const lang = "jpn";
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

// Function to read image from clipboard
function readImageFromClipboard() {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .read()
      .then((items) => {
        // Get the first item from clipboard
        const item = items[0];
        console.log(items);
        // Check if the item is an image
        // if (item.types.indexOf('image') === 0) {
        //   // Read the image file
        //   // item.getBlob().then(blob => {
        //   //   // Create a new image element
        //   //   const img = new Image();

        //   //   // Set the source of the image to the blob URL
        //   //   img.src = URL.createObjectURL(blob);

        //   //   // Wait for the image to load
        //   //   img.onload = () => {
        //   //     resolve(img);
        //   //   };

        //   //   // Handle image loading errors
        //   //   img.onerror = (e) => {
        //   //     reject(e);
        //   //   };
        //   // });
        //   // item.getType().then(type => {
        //   //   item.getType().then(type => {
        //   //     item.getType().then(type => {
        //   //       item.getType().then(type => {
        //   //         item.getType().then(type => {
        //   //           item.getType().then(type => {
        //   //             item.getType().then(type => {
        //   //               item.getType().then(type => {
        //   //                 item.getType().then(type => {
        //   //                 });
        //   //               });
        //   //             });
        //   //           });
        //   //         });
        //   //       });
        //   //     });
        //   //   });
        //   // });
        // // } else {
        // //   reject(new Error('Clipboard item is not an image.'));
        // // }
        // }
      })
      .catch((e) => {
        reject(e);
      });
  });
}
