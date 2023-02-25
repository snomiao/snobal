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
          ctx.drawImage(img, 0, 0,500, img.height*(500/img.width));
          // const base64 = canvas.toDataURL("image/png");
          // console.log(base64); // base64-encoded image string
          // ctx.clip = base64;
        };
        img.src = URL.createObjectURL(blob);
        {
          const lang = "jpn+eng";
          setText("loading");
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
      <div className="w-[500px] h-[500px]">
        <canvas tabIndex={0} ref={canvasRef} />
      </div>
    
      <pre>{text}</pre>
      <button className="btn btn-primary">{"Retry"}</button>
      <div className='ocr_page' id='page_1' title='image "unknown"; bbox 0 0 1242 2688; ppageno 0; scan_res 70 70'>
 <div className='ocr_carea' id='block_1_1' title="bbox 57 55 1232 2637">
  <p className='ocr_par' id='par_1_1' lang='eng' title="bbox 57 55 1190 395">
   <span className='ocr_line' id='line_1_1' title="bbox 57 55 1190 95; baseline 0 -2; x_size 69; x_descenders 15; x_ascenders 18">
    <span className='ocrx_word' id='word_1_1' title='bbox 57 57 182 92; x_wconf 91'>22:24</span>
    <span className='ocrx_word' id='word_1_2' title='bbox 207 59 251 92; x_wconf 85'>&amp;</span>
    <span className='ocrx_word' id='word_1_3' title='bbox 983 64 1032 95; x_wconf 24' lang='jpn'>言</span>
    <span className='ocrx_word' id='word_1_4' title='bbox 1050 56 1097 91; x_wconf 65'>T</span>
    <span className='ocrx_word' id='word_1_5' title='bbox 1135 55 1190 93; x_wconf 59'>%)</span>
   </span>
   <span className='ocr_line' id='line_1_2' title="bbox 62 178 1175 243; baseline -0.001 -11; x_size 62.687046; x_descenders 9.687047; x_ascenders 17.666668">
    <span className='ocrx_word' id='word_1_6' title='bbox 62 188 105 232; x_wconf 96' lang='jpn'>完</span>
    <span className='ocrx_word' id='word_1_7' title='bbox 124 190 150 231; x_wconf 91' lang='jpn'>了</span>
    <span className='ocrx_word' id='word_1_8' title='bbox 1110 178 1175 243; x_wconf 56'>D)</span>
   </span>
   <span className='ocr_line' id='line_1_3' title="bbox 982 365 1177 395; baseline 0.01 -2; x_size 26.021038; x_descenders 4.0210385; x_ascenders 7.3333335">
    <span className='ocrx_word' id='word_1_9' title='bbox 982 368 1073 393; x_wconf 56'>AT</span>
    <span className='ocrx_word' id='word_1_10' title='bbox 1147 365 1177 395; x_wconf 51'>o=</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_2' lang='eng' title="bbox 48 286 1232 1493">
   <span className='ocr_line' id='line_1_4' title="bbox 1225 286 1232 755; baseline 0 289; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_11' title='bbox 1225 286 1232 755; x_wconf 93'><em>|</em></span>
   </span>
   <span className='ocr_line' id='line_1_5' title="bbox 80 1142 1163 1285; baseline 0 0; x_size 151.39513; x_descenders 23.395132; x_ascenders 42.666668">
    <span className='ocrx_word' id='word_1_12' title='bbox 80 1142 164 1186; x_wconf 81'>v</span>
    <span className='ocrx_word' id='word_1_13' title='bbox 873 1153 993 1313; x_wconf 44' lang='jpn'>デ</span>
    <span className='ocrx_word' id='word_1_14' title='bbox 993 1157 1033 1285; x_wconf 60' lang='jpn'>ャ</span>
    <span className='ocrx_word' id='word_1_15' title='bbox 1033 1153 1073 1313; x_wconf 85' lang='jpn'>ー</span>
    <span className='ocrx_word' id='word_1_16' title='bbox 1073 1153 1103 1313; x_wconf 77' lang='jpn'>ジ</span>
    <span className='ocrx_word' id='word_1_17' title='bbox 1133 1153 1163 1313; x_wconf 61' lang='jpn'>)</span>
   </span>
   <span className='ocr_line' id='line_1_6' title="bbox 81 1220 360 1295; baseline 0.004 -13; x_size 73.332016; x_descenders 11.332018; x_ascenders 20.666668">
    <span className='ocrx_word' id='word_1_18' title='bbox 81 1220 360 1295; x_wconf 91'>¥2,573</span>
   </span>
   <span className='ocr_line' id='line_1_7' title="bbox 57 1437 418 1493; baseline -0.003 0; x_size 65.052597; x_descenders 10.052596; x_ascenders 18.333334">
    <span className='ocrx_word' id='word_1_19' title='bbox 57 1437 418 1493; x_wconf 89' lang='jpn'>最</span>
    <span className='ocrx_word' id='word_1_20' title='bbox 167 1432 231 1505; x_wconf 91' lang='jpn'>近</span>
    <span className='ocrx_word' id='word_1_21' title='bbox 230 1432 259 1505; x_wconf 96' lang='jpn'>の</span>
    <span className='ocrx_word' id='word_1_22' title='bbox 258 1432 314 1505; x_wconf 95' lang='jpn'>ご</span>
    <span className='ocrx_word' id='word_1_23' title='bbox 313 1432 377 1505; x_wconf 96' lang='jpn'>利</span>
    <span className='ocrx_word' id='word_1_24' title='bbox 376 1432 423 1505; x_wconf 95' lang='jpn'>用</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_3' lang='jpn' title="bbox 87 1554 1077 1704">
   <span className='ocr_line' id='line_1_8' title="bbox 260 1554 1077 1599; baseline -0.006 0; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_25' title='bbox 260 1554 305 1599; x_wconf 95'>新</span>
    <span className='ocrx_word' id='word_1_26' title='bbox 328 1554 350 1599; x_wconf 96'>杉</span>
    <span className='ocrx_word' id='word_1_27' title='bbox 372 1557 396 1598; x_wconf 96'>田</span>
    <span className='ocrx_word' id='word_1_28' title='bbox 420 1556 447 1598; x_wconf 96'>駅</span>
    <span className='ocrx_word' id='word_1_29' title='bbox 962 1558 1077 1595; x_wconf 92'>\④⑦③</span>
   </span>
   <span className='ocr_line' id='line_1_9' title="bbox 87 1569 681 1704; baseline 0.003 -45; x_size 180; x_descenders 45; x_ascenders 45">
    <span className='ocrx_word' id='word_1_30' title='bbox 87 1569 222 1704; x_wconf 64'>團</span>
    <span className='ocrx_word' id='word_1_31' title='bbox 261 1623 681 1660; x_wconf 1'>・</span>
    <span className='ocrx_word' id='word_1_32' title='bbox 576 1520 683 1708; x_wconf 37'>…</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_4' lang='jpn' title="bbox 262 1683 420 1720">
   <span className='ocr_line' id='line_1_10' title="bbox 262 1683 420 1720; baseline 0.019 -3; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_33' title='bbox 262 1686 278 1717; x_wconf 96'>③</span>
    <span className='ocrx_word' id='word_1_34' title='bbox 314 1683 357 1720; x_wconf 96'>時</span>
    <span className='ocrx_word' id='word_1_35' title='bbox 358 1685 377 1719; x_wconf 94'>間</span>
    <span className='ocrx_word' id='word_1_36' title='bbox 398 1683 420 1720; x_wconf 96'>前</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_5' lang='jpn' title="bbox 87 1775 1078 1932">
   <span className='ocr_line' id='line_1_11' title="bbox 260 1775 1078 1839; baseline -0.005 -12; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_37' title='bbox 260 1783 304 1826; x_wconf 82'>レ</span>
    <span className='ocrx_word' id='word_1_38' title='bbox 306 1782 340 1827; x_wconf 3'>y</span>
    <span className='ocrx_word' id='word_1_39' title='bbox 354 1783 364 1826; x_wconf 33'>お</span>
    <span className='ocrx_word' id='word_1_40' title='bbox 364 1782 396 1826; x_wconf 87'>:</span>
    <span className='ocrx_word' id='word_1_41' title='bbox 396 1775 424 1839; x_wconf 42'>お</span>
    <span className='ocrx_word' id='word_1_42' title='bbox 424 1782 495 1827; x_wconf 60'>ヨ</span>
    <span className='ocrx_word' id='word_1_43' title='bbox 962 1786 1078 1824; x_wconf 92' lang='eng'>¥367</span>
   </span>
   <span className='ocr_line' id='line_1_12' title="bbox 87 1797 724 1932; baseline 0.002 -44; x_size 43.762657; x_descenders 6.7626557; x_ascenders 12.333334">
    <span className='ocrx_word' id='word_1_44' title='bbox 87 1797 222 1932; x_wconf 91' lang='eng'>.</span>
    <span className='ocrx_word' id='word_1_45' title='bbox 260 1851 503 1888; x_wconf 95'>屏</span>
    <span className='ocrx_word' id='word_1_46' title='bbox 321 1844 370 1896; x_wconf 96'>風</span>
    <span className='ocrx_word' id='word_1_47' title='bbox 369 1844 422 1896; x_wconf 96'>浦</span>
    <span className='ocrx_word' id='word_1_48' title='bbox 421 1844 464 1896; x_wconf 96'>駅</span>
    <span className='ocrx_word' id='word_1_49' title='bbox 464 1844 484 1896; x_wconf 95'>か</span>
    <span className='ocrx_word' id='word_1_50' title='bbox 483 1844 503 1896; x_wconf 95'>ら</span>
    <span className='ocrx_word' id='word_1_51' title='bbox 524 1871 545 1874; x_wconf 93'>-</span>
    <span className='ocrx_word' id='word_1_52' title='bbox 571 1851 598 1888; x_wconf 93'>交</span>
    <span className='ocrx_word' id='word_1_53' title='bbox 620 1851 655 1889; x_wconf 95'>通</span>
    <span className='ocrx_word' id='word_1_54' title='bbox 665 1851 683 1888; x_wconf 87'>機</span>
    <span className='ocrx_word' id='word_1_55' title='bbox 704 1852 724 1888; x_wconf 92'>関</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_6' lang='jpn' title="bbox 261 1911 440 1948">
   <span className='ocr_line' id='line_1_13' title="bbox 261 1911 440 1948; baseline 0.017 -3; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_56' title='bbox 261 1914 302 1945; x_wconf 93'>①③</span>
    <span className='ocrx_word' id='word_1_57' title='bbox 333 1911 377 1948; x_wconf 96'>時</span>
    <span className='ocrx_word' id='word_1_58' title='bbox 377 1913 397 1947; x_wconf 96'>間</span>
    <span className='ocrx_word' id='word_1_59' title='bbox 417 1911 440 1948; x_wconf 96'>前</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_7' lang='jpn' title="bbox 87 2003 1078 2160">
   <span className='ocr_line' id='line_1_14' title="bbox 255 2003 1078 2068; baseline -0.005 -12.98; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_60' title='bbox 255 2003 276 2068; x_wconf 14'>I</span>
    <span className='ocrx_word' id='word_1_61' title='bbox 275 2012 303 2055; x_wconf 39'>ほ</span>
    <span className='ocrx_word' id='word_1_62' title='bbox 315 2012 352 2054; x_wconf 71'>手</span>
    <span className='ocrx_word' id='word_1_63' title='bbox 364 2010 399 2055; x_wconf 65'>胆</span>
    <span className='ocrx_word' id='word_1_64' title='bbox 402 2012 430 2054; x_wconf 67'>手</span>
    <span className='ocrx_word' id='word_1_65' title='bbox 429 2003 450 2068; x_wconf 21'>打</span>
    <span className='ocrx_word' id='word_1_66' title='bbox 962 2014 1078 2052; x_wconf 92' lang='eng'>¥367</span>
   </span>
   <span className='ocr_line' id='line_1_15' title="bbox 87 2025 766 2160; baseline 0.003 -45; x_size 42.57988; x_descenders 6.5798817; x_ascenders 12">
    <span className='ocrx_word' id='word_1_67' title='bbox 87 2025 222 2160; x_wconf 91' lang='eng'>.</span>
    <span className='ocrx_word' id='word_1_68' title='bbox 261 2080 297 2115; x_wconf 96'>大</span>
    <span className='ocrx_word' id='word_1_69' title='bbox 320 2079 353 2116; x_wconf 96'>森</span>
    <span className='ocrx_word' id='word_1_70' title='bbox 365 2079 414 2116; x_wconf 96'>海</span>
    <span className='ocrx_word' id='word_1_71' title='bbox 429 2081 465 2116; x_wconf 95'>岸</span>
    <span className='ocrx_word' id='word_1_72' title='bbox 472 2081 507 2113; x_wconf 95'>駅</span>
    <span className='ocrx_word' id='word_1_73' title='bbox 508 2074 525 2125; x_wconf 96'>か</span>
    <span className='ocrx_word' id='word_1_74' title='bbox 524 2082 545 2113; x_wconf 96'>ら</span>
    <span className='ocrx_word' id='word_1_75' title='bbox 566 2099 588 2102; x_wconf 95'>-</span>
    <span className='ocrx_word' id='word_1_76' title='bbox 617 2079 640 2116; x_wconf 95'>交</span>
    <span className='ocrx_word' id='word_1_77' title='bbox 661 2080 699 2116; x_wconf 96'>通</span>
    <span className='ocrx_word' id='word_1_78' title='bbox 706 2079 726 2116; x_wconf 93'>機</span>
    <span className='ocrx_word' id='word_1_79' title='bbox 744 2080 766 2116; x_wconf 93'>関</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_8' lang='jpn' title="bbox 262 2141 490 2181">
   <span className='ocr_line' id='line_1_16' title="bbox 262 2141 490 2181; baseline 0 -8; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_80' title='bbox 262 2141 490 2181; x_wconf 91'>⑳②③/0②/①⑤</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_9' lang='jpn' title="bbox 87 2231 1078 2388">
   <span className='ocr_line' id='line_1_17' title="bbox 260 2231 1078 2295; baseline -0.005 -12; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_81' title='bbox 260 2239 292 2282; x_wconf 83'>レ</span>
    <span className='ocrx_word' id='word_1_82' title='bbox 292 2231 316 2295; x_wconf 42'>ま</span>
    <span className='ocrx_word' id='word_1_83' title='bbox 316 2238 344 2283; x_wconf 36'>y</span>
    <span className='ocrx_word' id='word_1_84' title='bbox 354 2239 364 2282; x_wconf 74'>あ</span>
    <span className='ocrx_word' id='word_1_85' title='bbox 364 2238 396 2282; x_wconf 89'>:</span>
    <span className='ocrx_word' id='word_1_86' title='bbox 396 2231 424 2295; x_wconf 36'>お</span>
    <span className='ocrx_word' id='word_1_87' title='bbox 424 2238 495 2283; x_wconf 62'>ヨ</span>
    <span className='ocrx_word' id='word_1_88' title='bbox 962 2242 1078 2280; x_wconf 92' lang='eng'>¥367</span>
   </span>
   <span className='ocr_line' id='line_1_18' title="bbox 87 2253 724 2388; baseline 0.002 -44; x_size 43.762657; x_descenders 6.7626557; x_ascenders 12.333334">
    <span className='ocrx_word' id='word_1_89' title='bbox 87 2253 222 2388; x_wconf 91' lang='eng'>.</span>
    <span className='ocrx_word' id='word_1_90' title='bbox 260 2307 503 2344; x_wconf 95'>屏</span>
    <span className='ocrx_word' id='word_1_91' title='bbox 321 2300 370 2352; x_wconf 96'>風</span>
    <span className='ocrx_word' id='word_1_92' title='bbox 369 2300 422 2352; x_wconf 96'>浦</span>
    <span className='ocrx_word' id='word_1_93' title='bbox 421 2300 464 2352; x_wconf 96'>駅</span>
    <span className='ocrx_word' id='word_1_94' title='bbox 464 2300 484 2352; x_wconf 95'>か</span>
    <span className='ocrx_word' id='word_1_95' title='bbox 483 2300 503 2352; x_wconf 95'>ら</span>
    <span className='ocrx_word' id='word_1_96' title='bbox 524 2327 545 2330; x_wconf 93'>-</span>
    <span className='ocrx_word' id='word_1_97' title='bbox 571 2307 598 2344; x_wconf 95'>交</span>
    <span className='ocrx_word' id='word_1_98' title='bbox 620 2307 655 2345; x_wconf 95'>通</span>
    <span className='ocrx_word' id='word_1_99' title='bbox 665 2307 683 2344; x_wconf 87'>機</span>
    <span className='ocrx_word' id='word_1_100' title='bbox 704 2308 724 2344; x_wconf 93'>関</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_10' lang='jpn' title="bbox 262 2369 490 2409">
   <span className='ocr_line' id='line_1_19' title="bbox 262 2369 490 2409; baseline 0 -8; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_101' title='bbox 262 2369 490 2409; x_wconf 91'>⑳②③/0②/①⑤</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_11' lang='jpn' title="bbox 87 2459 1078 2616">
   <span className='ocr_line' id='line_1_20' title="bbox 255 2459 1078 2524; baseline -0.005 -12.98; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_102' title='bbox 255 2459 276 2524; x_wconf 14'>I</span>
    <span className='ocrx_word' id='word_1_103' title='bbox 275 2468 303 2511; x_wconf 41'>ほ</span>
    <span className='ocrx_word' id='word_1_104' title='bbox 315 2468 352 2510; x_wconf 74'>手</span>
    <span className='ocrx_word' id='word_1_105' title='bbox 368 2466 399 2511; x_wconf 69'>胃</span>
    <span className='ocrx_word' id='word_1_106' title='bbox 402 2468 434 2510; x_wconf 65'>手</span>
    <span className='ocrx_word' id='word_1_107' title='bbox 433 2459 450 2524; x_wconf 25'>打</span>
    <span className='ocrx_word' id='word_1_108' title='bbox 962 2470 1078 2508; x_wconf 92' lang='eng'>¥367</span>
   </span>
   <span className='ocr_line' id='line_1_21' title="bbox 87 2481 766 2616; baseline 0.003 -45; x_size 42.57988; x_descenders 6.5798817; x_ascenders 12">
    <span className='ocrx_word' id='word_1_109' title='bbox 87 2481 222 2616; x_wconf 91' lang='eng'>.</span>
    <span className='ocrx_word' id='word_1_110' title='bbox 261 2536 297 2571; x_wconf 96'>大</span>
    <span className='ocrx_word' id='word_1_111' title='bbox 320 2535 353 2572; x_wconf 96'>森</span>
    <span className='ocrx_word' id='word_1_112' title='bbox 365 2535 414 2572; x_wconf 96'>海</span>
    <span className='ocrx_word' id='word_1_113' title='bbox 429 2537 465 2572; x_wconf 94'>岸</span>
    <span className='ocrx_word' id='word_1_114' title='bbox 472 2537 507 2569; x_wconf 95'>駅</span>
    <span className='ocrx_word' id='word_1_115' title='bbox 508 2530 525 2581; x_wconf 96'>か</span>
    <span className='ocrx_word' id='word_1_116' title='bbox 524 2538 545 2569; x_wconf 96'>ら</span>
    <span className='ocrx_word' id='word_1_117' title='bbox 566 2555 588 2558; x_wconf 95'>-</span>
    <span className='ocrx_word' id='word_1_118' title='bbox 617 2535 640 2572; x_wconf 95'>交</span>
    <span className='ocrx_word' id='word_1_119' title='bbox 661 2536 699 2572; x_wconf 96'>通</span>
    <span className='ocrx_word' id='word_1_120' title='bbox 706 2535 726 2572; x_wconf 93'>機</span>
    <span className='ocrx_word' id='word_1_121' title='bbox 744 2536 766 2572; x_wconf 93'>関</span>
   </span>
  </p>

  <p className='ocr_par' id='par_1_12' lang='eng' title="bbox 262 2597 499 2637">
   <span className='ocr_line' id='line_1_22' title="bbox 262 2597 499 2637; baseline 0.004 -8; x_size 56.21875; x_descenders 8.6875; x_ascenders 15.84375">
    <span className='ocrx_word' id='word_1_122' title='bbox 262 2597 499 2637; x_wconf 92'>2023/02/09</span>
   </span>
  </p>
 </div>
</div>

    </>
  );
}
