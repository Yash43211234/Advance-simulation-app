
import React, { useEffect, useRef, useState } from "react";

export default function LiveCssTyper() {
  const [cssCode, setCssCode] = useState(`.card {
  padding: 20px;
  border-radius: 12px;
  background: #161b22;
  color: white;
}

.btn {
  padding: 10px 18px;
  background: #21262d;
  color: white;
  border-radius: 8px;
}`);

  const [htmlCode, setHtmlCode] = useState(`
<div class="card">
  <h2>Hello CSS 👋</h2>
  <p>Watch the CSS transform this UI.</p>
  <button class="btn">Click Me</button>
</div>
`);

  const [displayedCSS, setDisplayedCSS] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [speed, setSpeed] = useState(30);

  /* ---------------------------------------
     IFRAME SIZE
  --------------------------------------- */

  const [iframeWidth, setIframeWidth] = useState(100);
  const [iframeHeight, setIframeHeight] = useState(430);
  const [sizeMode, setSizeMode] = useState("desktop");

  const iframeRef = useRef(null);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const cssDisplayRef = useRef(null);

  /* ---------------------------------------
     SIZE PRESETS
  --------------------------------------- */

  const sizePresets = {
    mobile: {
      width: 360,
      height: 640,
    },

    phone: {
      width: 390,
      height: 500,
    },

    tablet: {
      width: 600,
      height: 500,
    },

    desktop: {
      width: 100,
      height: 430,
    },

    shorts: {
      width: 405,
      height: 720,
    },
  };

  const applySizePreset = (mode) => {
    const preset = sizePresets[mode];

    if (!preset) return;

    setSizeMode(mode);

    setIframeWidth(preset.width);
    setIframeHeight(preset.height);
  };

  /* ---------------------------------------
     CLEANUP
  --------------------------------------- */

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  /* ---------------------------------------
     INITIALIZE PREVIEW
  --------------------------------------- */

  const initializePreview = () => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const doc =
      iframe.contentDocument ||
      iframe.contentWindow.document;

    doc.open();

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>

          <style>
            * {
              box-sizing: border-box;
            }

            html {
              margin: 0;
              padding: 0;
              width: 100%;
              min-height: 100%;
            }

            body {
              margin: 0;
              padding: 25px;

              min-height: 100vh;
              width: 100%;

              font-family: Arial, sans-serif;

              background: #0B1020;
              color: #e6edf3;

              overflow: auto;
            }

            button {
              font-family: inherit;
            }

            .simulation-focus {
              position: relative !important;

              outline:
                2px solid #00b2ff !important;

              outline-offset:
                5px !important;

              box-shadow:
                0 0 0 4px rgba(0, 178, 255, 0.12),
                0 0 20px rgba(0, 178, 255, 0.35) !important;

              transition:
                outline 0.2s ease,
                box-shadow 0.2s ease !important;
            }

            .simulation-focus::after {
              content: "●";

              position: absolute;

              top: -12px;
              right: -12px;

              width: 18px;
              height: 18px;

              display: flex;
              align-items: center;
              justify-content: center;

              border-radius: 50%;

              background: #00b2ff;
              color: white;

              font-size: 8px;

              box-shadow:
                0 0 12px rgba(0, 178, 255, 0.7);

              z-index: 999999;
            }
          </style>

          <style id="live-style"></style>

        </head>

        <body>
          ${htmlCode}
        </body>
      </html>
    `);

    doc.close();

    try {
      iframe.contentWindow.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    } catch (error) {
      // Ignore iframe scroll errors.
    }
  };

  /* ---------------------------------------
     GET CURRENT SELECTOR
  --------------------------------------- */

  const getCurrentSelector = (cssText) => {
    const match = cssText.match(
      /([^{}]+)\{[^{}]*$/
    );

    if (!match) return null;

    let selector = match[1].trim();

    selector = selector
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    if (!selector) return null;

    return selector;
  };

  /* ---------------------------------------
     MOVE FOCUS INSIDE IFRAME ONLY
  --------------------------------------- */

  const moveSimulationCursor = (cssText) => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const iframeWindow =
      iframe.contentWindow;

    const doc =
      iframe.contentDocument ||
      iframeWindow.document;

    if (!doc || !iframeWindow) return;

    const previous =
      doc.querySelectorAll(
        ".simulation-focus"
      );

    previous.forEach((element) => {
      element.classList.remove(
        "simulation-focus"
      );
    });

    const selector =
      getCurrentSelector(cssText);

    if (!selector) return;

    let elements = [];

    try {
      elements = Array.from(
        doc.querySelectorAll(selector)
      );
    } catch (error) {
      return;
    }

    if (!elements.length) return;

    elements.forEach((element) => {
      element.classList.add(
        "simulation-focus"
      );
    });

    const target = elements[0];

    if (!target) return;

    /*
      IMPORTANT:
      Scroll only the iframe window.
      Never use target.scrollIntoView().
    */

    try {
      const targetRect =
        target.getBoundingClientRect();

      const currentScrollTop =
        iframeWindow.pageYOffset ||
        doc.documentElement.scrollTop ||
        doc.body.scrollTop ||
        0;

      const currentScrollLeft =
        iframeWindow.pageXOffset ||
        doc.documentElement.scrollLeft ||
        doc.body.scrollLeft ||
        0;

      const targetTop =
        targetRect.top +
        currentScrollTop;

      const targetLeft =
        targetRect.left +
        currentScrollLeft;

      const viewportHeight =
        iframeWindow.innerHeight;

      const viewportWidth =
        iframeWindow.innerWidth;

      const targetHeight =
        targetRect.height;

      const targetWidth =
        targetRect.width;

      const desiredTop =
        targetTop -
        viewportHeight / 2 +
        targetHeight / 2;

      const desiredLeft =
        targetLeft -
        viewportWidth / 2 +
        targetWidth / 2;

      iframeWindow.scrollTo({
        top: Math.max(0, desiredTop),
        left: Math.max(0, desiredLeft),
        behavior: "smooth",
      });
    } catch (error) {
      // Ignore iframe scrolling errors.
    }
  };

  /* ---------------------------------------
     START
  --------------------------------------- */

  const startTyping = () => {
    if (isTyping || !cssCode.trim()) return;

    clearInterval(intervalRef.current);

    initializePreview();

    setDisplayedCSS("");
    setIsTyping(true);

    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const currentIndex =
        indexRef.current;

      if (
        currentIndex >=
        cssCode.length
      ) {
        clearInterval(
          intervalRef.current
        );

        setIsTyping(false);

        return;
      }

      const nextCSS =
        cssCode.slice(
          0,
          currentIndex + 1
        );

      setDisplayedCSS(nextCSS);

      /*
        Apply CSS only inside iframe.
      */

      const iframe =
        iframeRef.current;

      if (iframe) {
        const doc =
          iframe.contentDocument ||
          iframe.contentWindow.document;

        const styleTag =
          doc.getElementById(
            "live-style"
          );

        if (styleTag) {
          styleTag.textContent =
            nextCSS;
        }
      }

      /*
        Focus only inside iframe.
      */

      moveSimulationCursor(
        nextCSS
      );

      /*
        Auto-scroll CSS display,
        not the browser.
      */

      requestAnimationFrame(() => {
        if (cssDisplayRef.current) {
          cssDisplayRef.current.scrollTop =
            cssDisplayRef.current.scrollHeight;
        }
      });

      indexRef.current++;
    }, speed);
  };

  /* ---------------------------------------
     STOP
  --------------------------------------- */

  const stopTyping = () => {
    clearInterval(
      intervalRef.current
    );

    setIsTyping(false);

    removeSimulationCursor();
  };

  /* ---------------------------------------
     REMOVE FOCUS
  --------------------------------------- */

  const removeSimulationCursor = () => {
    const iframe =
      iframeRef.current;

    if (!iframe) return;

    const doc =
      iframe.contentDocument ||
      iframe.contentWindow.document;

    if (!doc) return;

    const elements =
      doc.querySelectorAll(
        ".simulation-focus"
      );

    elements.forEach((element) => {
      element.classList.remove(
        "simulation-focus"
      );
    });
  };

  /* ---------------------------------------
     RESET
  --------------------------------------- */

  const resetTyping = () => {
    clearInterval(
      intervalRef.current
    );

    setDisplayedCSS("");

    setIsTyping(false);

    indexRef.current = 0;

    removeSimulationCursor();

    initializePreview();

    if (cssDisplayRef.current) {
      cssDisplayRef.current.scrollTop = 0;
    }
  };

  /* ---------------------------------------
     SPEED LABEL
  --------------------------------------- */

  const getSpeedLabel = () => {
    if (speed <= 10)
      return "⚡ Very Fast";

    if (speed <= 30)
      return "🚀 Fast";

    if (speed <= 60)
      return "🎯 Normal";

    if (speed <= 100)
      return "🐢 Slow";

    return "🐌 Very Slow";
  };

  /* ---------------------------------------
     IFRAME WIDTH STYLE
  --------------------------------------- */

  const getIframeWidth = () => {
    if (sizeMode === "desktop") {
      return "100%";
    }

    return `${iframeWidth}px`;
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#0d1117",
        color: "#e6edf3",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* ==============================
          HEADER
      ============================== */}

      <div
        style={{
          height: "65px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "#11161d",

          borderBottom:
            "1px solid #30363d",
        }}
      >
        <h1
          style={{
            margin: 0,

            fontSize: "22px",

            color: "#00b2ff",

            letterSpacing:
              "0.5px",
          }}
        >
          🎨 LIVE CSS TYPER
        </h1>
      </div>

      {/* ==============================
          MAIN
      ============================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "60% 40%",

          minHeight: "785px",
        }}
      >
        {/* ==============================
            LEFT
        ============================== */}

        <div
          style={{
            padding: "20px",

            borderRight:
              "1px solid #30363d",

            display: "flex",

            flexDirection:
              "column",

            minWidth: 0,

            overflow: "hidden",
          }}
        >
          {/* PREVIEW HEADER */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              marginBottom: "10px",
            }}
          >
            <h2
              style={{
                margin: 0,

                fontSize: "15px",
              }}
            >
              🔍 Live Preview
            </h2>

            <span
              style={{
                fontSize: "10px",

                color: isTyping
                  ? "#00b2ff"
                  : "#8b949e",
              }}
            >
              {isTyping
                ? "● LIVE"
                : "○ READY"}
            </span>
          </div>

          {/* ==============================
              PREVIEW SIZE CONTROLS
          ============================== */}

          <div
            style={{
              background: "#11161d",

              border:
                "1px solid #30363d",

              borderRadius: "8px",

              padding: "10px",

              marginBottom: "10px",
            }}
          >
            {/* PRESET BUTTONS */}

            <div
              style={{
                display: "flex",

                gap: "6px",

                flexWrap: "wrap",

                marginBottom: "10px",
              }}
            >
              {[
                ["mobile", "📱 Mobile"],
                ["phone", "📱 Phone"],
                ["tablet", "💻 Tablet"],
                ["desktop", "🖥 Desktop"],
                ["shorts", "🎬 Shorts"],
              ].map(
                ([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() =>
                      applySizePreset(
                        mode
                      )
                    }
                    style={{
                      padding:
                        "6px 9px",

                      background:
                        sizeMode === mode
                          ? "#00b2ff"
                          : "#21262d",

                      color:
                        sizeMode === mode
                          ? "#fff"
                          : "#c9d1d9",

                      border:
                        "1px solid #30363d",

                      borderRadius:
                        "5px",

                      fontSize:
                        "10px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {label}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setSizeMode("custom")
                }
                style={{
                  padding:
                    "6px 9px",

                  background:
                    sizeMode ===
                    "custom"
                      ? "#00b2ff"
                      : "#21262d",

                  color:
                    sizeMode ===
                    "custom"
                      ? "#fff"
                      : "#c9d1d9",

                  border:
                    "1px solid #30363d",

                  borderRadius:
                    "5px",

                  fontSize: "10px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                ⚙️ Custom
              </button>
            </div>

            {/* SIZE VALUES */}

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap: "12px",
              }}
            >
              {/* WIDTH */}

              <div>
                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    marginBottom:
                      "4px",

                    fontSize:
                      "10px",

                    color:
                      "#8b949e",
                  }}
                >
                  <span>
                    Width
                  </span>

                  <span
                    style={{
                      color:
                        "#00b2ff",
                    }}
                  >
                    {sizeMode ===
                    "desktop"
                      ? "100%"
                      : `${iframeWidth}px`}
                  </span>
                </div>

                <input
                  type="range"
                  min="280"
                  max="900"
                  value={
                    iframeWidth
                  }
                  onChange={(e) => {
                    setSizeMode(
                      "custom"
                    );

                    setIframeWidth(
                      Number(
                        e.target
                          .value
                      )
                    );
                  }}
                  style={{
                    width: "100%",
                  }}
                />
              </div>

              {/* HEIGHT */}

              <div>
                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    marginBottom:
                      "4px",

                    fontSize:
                      "10px",

                    color:
                      "#8b949e",
                  }}
                >
                  <span>
                    Height
                  </span>

                  <span
                    style={{
                      color:
                        "#00b2ff",
                    }}
                  >
                    {iframeHeight}px
                  </span>
                </div>

                <input
                  type="range"
                  min="250"
                  max="800"
                  value={
                    iframeHeight
                  }
                  onChange={(e) => {
                    setSizeMode(
                      "custom"
                    );

                    setIframeHeight(
                      Number(
                        e.target
                          .value
                      )
                    );
                  }}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==============================
              IFRAME CONTAINER
          ============================== */}

          <div
            style={{
              width: "100%",

              height: "430px",

              flexShrink: 0,

              overflow: "auto",

              display: "flex",

              alignItems:
                "flex-start",

              justifyContent:
                "center",

              background:
                "#080b10",

              border:
                "1px solid #30363d",

              borderRadius: "8px",

              padding: "0",

              boxShadow:
                "inset 0 0 25px rgba(0,0,0,0.35)",
            }}
          >
            <iframe
              ref={iframeRef}
              title="Live CSS Preview"
              scrolling="yes"
              style={{
                width:
                  getIframeWidth(),

                height:
                  `${iframeHeight}px`,

                minWidth:
                  sizeMode ===
                  "desktop"
                    ? "100%"
                    : `${iframeWidth}px`,

                minHeight:
                  `${iframeHeight}px`,

                flexShrink: 0,

                border: "none",

                background:
                  "#2c2c2c",

                display: "block",
              }}
            />
          </div>

          {/* ==============================
              CSS DISPLAY HEADER
          ============================== */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              marginTop: "15px",

              marginBottom: "8px",
            }}
          >
            <h2
              style={{
                margin: "-10px 0" ,

                
              }}
            >
              
            </h2>

            <span
              style={{
                

                color: "#8b949e",
              }}
            >
              
            </span>
          </div>

         
{/* FIXED CSS DISPLAY */}

<div
  ref={cssDisplayRef}
  className="css-display"
  style={{
    width: "100%",

    height: "270px",

    minHeight: "270px",

    maxHeight: "270px",

    background: "#0d1117",

    border: "1px solid #30363d",

    borderRadius: "8px",

    /* 👇 More breathing space for CSS code */
    padding: "20px 0 22px 200px",

    boxSizing: "border-box",

    overflowY: "auto",

    overflowX: "hidden",

    fontFamily:
      "'Fira Code', 'Cascadia Code', Consolas, monospace",

    fontSize: "12px",

    lineHeight: "1.7",

    whiteSpace: "pre-wrap",

    wordBreak: "break-word",

    textAlign: "left",

    boxShadow:
      "inset 0 0 20px rgba(0,0,0,0.25)",

    /* 👇 Smooth scrolling while typing */
    scrollBehavior: "smooth",
  }}
>
  {displayedCSS ? (
    <pre
      style={{
        margin: 0,

        padding: 0,

        color: "#c9d1d9",

        whiteSpace: "pre-wrap",

        wordBreak: "break-word",

        fontFamily:
          "'Fira Code', 'Cascadia Code', Consolas, monospace",

        lineHeight: "1.7",
      }}
    >
      {displayedCSS}
    </pre>
  ) : (
    <div
      style={{
        height: "100%",

        display: "flex",

        alignItems: "left",

        justifyContent: "left",

        color: "#bbcfeb",

        fontSize: "12px",

        textAlign: "center",
      }}
    >
      Your CSS will appear here...
    </div>
  )}

  {isTyping && (
    <span
      style={{
        display: "inline-block",

        width: "6px",

        height: "15px",

        marginLeft: "3px",

        verticalAlign: "middle",

        background: "#00b2ff",

        animation:
          "cssCursorBlink 0.8s infinite",
      }}
    />
  )}
</div>


        </div>

        {/* ==============================
            RIGHT SIDE
        ============================== */}

        <div
          style={{
            padding: "20px",

            background: "#131820",

            display: "flex",

            flexDirection:
              "column",

            gap: "15px",

            minWidth: 0,
          }}
        >
          {/* HEADER */}

          <div>
            <h2
              style={{
                margin: 0,

                fontSize: "16px",

                color: "#00b2ff",
              }}
            >
              🎛 Simulation Controls
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",

                fontSize: "11px",

                color: "#8b949e",
              }}
            >
              Prepare your HTML
              and CSS.
            </p>
          </div>

          {/* HTML */}

          <div>
            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontSize: "12px",

                fontWeight:
                  "bold",

                color: "#c9d1d9",
              }}
            >
              📄 HTML Structure
            </label>

            <textarea
              value={htmlCode}
              onChange={(e) =>
                setHtmlCode(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                height: "180px",

                padding: "12px",

                boxSizing:
                  "border-box",

                fontFamily:
                  "'Fira Code', monospace",

                fontSize: "12px",

                lineHeight: "1.6",

                borderRadius: "7px",

                border:
                  "1px solid #30363d",

                background:
                  "#0d1117",

                color: "#c9d1d9",

                resize: "none",

                overflowY: "auto",

                outline: "none",
              }}
              placeholder="Paste your HTML here..."
            />
          </div>

          {/* CSS */}

          <div>
            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontSize: "12px",

                fontWeight:
                  "bold",

                color: "#c9d1d9",
              }}
            >
              🎨 CSS Source
            </label>

            <textarea
              value={cssCode}
              onChange={(e) =>
                setCssCode(
                  e.target.value
                )
              }
              placeholder={`.card {
  padding: 20px;
  border-radius: 12px;
  background: #161b22;
}

.btn {
  padding: 10px 18px;
  background: #21262d;
}`}
              style={{
                width: "100%",

                height: "300px",

                minHeight: "300px",

                maxHeight: "300px",

                padding: "12px",

                boxSizing:
                  "border-box",

                fontFamily:
                  "'Fira Code', monospace",

                fontSize: "12px",

                lineHeight: "1.6",

                borderRadius: "7px",

                border:
                  "1px solid #30363d",

                background:
                  "#0d1117",

                color: "#c9d1d9",

                resize: "none",

                overflowY: "auto",

                overflowX: "hidden",

                outline: "none",
              }}
            />
          </div>

          {/* SPEED */}

          <div
            style={{
              background: "#0d1117",

              border:
                "1px solid #30363d",

              borderRadius: "8px",

              padding: "12px",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",

                  fontWeight:
                    "bold",
                }}
              >
                ⚡ Typing Speed
              </span>

              <span
                style={{
                  fontSize: "11px",

                  color: "#00b2ff",
                }}
              >
                {getSpeedLabel()}
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="150"
              value={speed}
              onChange={(e) =>
                setSpeed(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              style={{
                width: "100%",

                cursor: "pointer",
              }}
            />

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                marginTop: "4px",

                fontSize: "10px",

                color: "#8b949e",
              }}
            >
              <span>Fast</span>

              <span>
                {speed} ms
              </span>

              <span>Slow</span>
            </div>
          </div>

          {/* START */}

          <button
            onClick={startTyping}
            disabled={isTyping}
            style={{
              width: "100%",

              padding: "12px",

              fontSize: "13px",

              background:
                isTyping
                  ? "#30363d"
                  : "#00b2ff",

              color: "#fff",

              border: "none",

              borderRadius: "7px",

              cursor:
                isTyping
                  ? "not-allowed"
                  : "pointer",

              fontWeight:
                "bold",

              boxShadow:
                isTyping
                  ? "none"
                  : "0 4px 12px rgba(0,178,255,0.25)",
            }}
          >
            {isTyping
              ? "⌨️ Typing CSS..."
              : "▶️ Start Simulation"}
          </button>

          {/* STOP / RESET */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: "8px",
            }}
          >
            <button
              onClick={stopTyping}
              style={{
                padding: "9px",

                background:
                  "#21262d",

                color: "#c9d1d9",

                border:
                  "1px solid #30363d",

                borderRadius: "6px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",

                fontSize: "11px",
              }}
            >
              ⏹ Stop
            </button>

            <button
              onClick={resetTyping}
              style={{
                padding: "9px",

                background:
                  "#21262d",

                color: "#c9d1d9",

                border:
                  "1px solid #30363d",

                borderRadius: "6px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",

                fontSize: "11px",
              }}
            >
              🔄 Reset
            </button>
          </div>

          {/* STATUS */}

          <div
            style={{
              padding: "10px",

              borderRadius: "6px",

              background:
                "#0d1117",

              border:
                "1px solid #21262d",

              fontSize: "10px",

              color: "#8b949e",

              textAlign:
                "center",
            }}
          >
            {isTyping
              ? "CSS is being applied..."
              : "Ready for simulation"}
          </div>
        </div>
      </div>

      {/* LOCAL STYLES */}

      <style>
        {`
          @keyframes cssCursorBlink {
            0%, 45% {
              opacity: 1;
            }

            46%, 100% {
              opacity: 0;
            }
          }

          .css-display::-webkit-scrollbar {
            width: 6px;
          }

          .css-display::-webkit-scrollbar-track {
            background: #0d1117;
          }

          .css-display::-webkit-scrollbar-thumb {
            background: #30363d;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}