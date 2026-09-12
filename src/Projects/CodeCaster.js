
import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

export default function CodeCaster() {
  const [inputCode, setInputCode] = useState(`function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");`);

  const [displayedCode, setDisplayedCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const codeBoxRef = useRef(null);

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // --------------------------------------------------
  // SYNTAX HIGHLIGHTING
  // --------------------------------------------------

  useEffect(() => {
    Prism.highlightAll();
  }, [displayedCode]);

  // --------------------------------------------------
  // START TYPING
  // --------------------------------------------------

  const startTyping = () => {
    if (isPlaying || !inputCode.trim()) return;

    clearInterval(intervalRef.current);

    setDisplayedCode("");
    setIsPlaying(true);

    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const currentIndex = indexRef.current;

      if (currentIndex >= inputCode.length) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        return;
      }

      const nextCode = inputCode.substring(0, currentIndex + 1);

      setDisplayedCode(nextCode);

      // Auto-scroll
      requestAnimationFrame(() => {
        if (codeBoxRef.current) {
          codeBoxRef.current.scrollTop =
            codeBoxRef.current.scrollHeight;
        }
      });

      indexRef.current++;
    }, speed);
  };

  // --------------------------------------------------
  // STOP
  // --------------------------------------------------

  const stopTyping = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const resetTyping = () => {
    clearInterval(intervalRef.current);

    setDisplayedCode("");
    setIsPlaying(false);

    indexRef.current = 0;

    if (codeBoxRef.current) {
      codeBoxRef.current.scrollTop = 0;
    }
  };

  // --------------------------------------------------
  // SPEED LABEL
  // --------------------------------------------------

  const getSpeedLabel = () => {
    if (speed <= 10) return "⚡ Very Fast";
    if (speed <= 30) return "🚀 Fast";
    if (speed <= 70) return "🎯 Normal";
    if (speed <= 120) return "🐢 Slow";

    return "🐌 Very Slow";
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0d1117",
        padding: "25px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "#e6edf3",
      }}
    >
      {/* MAIN CONTAINER */}

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          minHeight: "850px",
          margin: "0 auto",
          background: "#161b22",
          borderRadius: "14px",
          border: "1px solid #30363d",
          boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            height: "65px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #30363d",
            background: "#11161d",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#00b2ff",
              letterSpacing: "0.5px",
            }}
          >
            🚀 CODE CASTER
          </h1>
        </div>

        {/* TWO COLUMN LAYOUT */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60% 40%",
            minHeight: "785px",
          }}
        >
          {/* =====================================================
              LEFT SIDE — CODE SIMULATION
          ====================================================== */}

          <div
            style={{
              padding: "20px",
              borderRight: "1px solid #30363d",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {/* OUTPUT HEADER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                💻 Code Simulation
              </h2>

              <span
                style={{
                  fontSize: "11px",
                  color: isPlaying ? "#00b2ff" : "#8b949e",
                }}
              >
                {isPlaying ? "● TYPING" : "○ READY"}
              </span>
            </div>

            {/* CODE WINDOW */}

            <div
              ref={codeBoxRef}
              style={{
                flex: 1,
                minHeight: "600px",
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                overflow: "auto",
                position: "relative",
                boxShadow: "inset 0 0 25px rgba(0,0,0,0.3)",
              }}
            >
              <pre
                className="line-numbers"
                style={{
                  margin: 0,
                  padding: "20px",
                  minHeight: "100%",
                  boxSizing: "border-box",
                  fontFamily:
                    "'Fira Code', 'Cascadia Code', Consolas, monospace",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code className="language-javascript">
                  {displayedCode}
                </code>

                {/* TYPING CURSOR */}

                {isPlaying && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "7px",
                      height: "18px",
                      background: "#00b2ff",
                      marginLeft: "2px",
                      verticalAlign: "middle",
                      animation: "codeCursorBlink 0.8s infinite",
                    }}
                  />
                )}
              </pre>

              {/* EMPTY STATE */}

              {!displayedCode && !isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#484f58",
                    fontSize: "13px",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  Press ▶ Start to begin the simulation
                </div>
              )}
            </div>

            {/* PROGRESS */}

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#8b949e",
              }}
            >
              <span>
                Characters: {displayedCode.length}
              </span>

              <span>
                {inputCode.length > 0
                  ? Math.round(
                      (displayedCode.length / inputCode.length) * 100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE — CONTROLS
          ====================================================== */}

          <div
            style={{
              padding: "20px",
              background: "#131820",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              minWidth: 0,
            }}
          >
            {/* CONTROL HEADER */}

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
                  margin: "5px 0 0",
                  fontSize: "11px",
                  color: "#8b949e",
                }}
              >
                Prepare your JavaScript and start the animation.
              </p>
            </div>

            {/* SOURCE CODE */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                flex: 1,
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#c9d1d9",
                }}
              >
                📄 Source Code
              </label>

              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={`function greet(name) {
  console.log("Hello", name);
}

greet("World");`}
                style={{
                  flex: 1,
                  minHeight: "450px",
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  fontFamily:
                    "'Fira Code', 'Cascadia Code', Consolas, monospace",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  borderRadius: "7px",
                  border: "1px solid #30363d",
                  background: "#0d1117",
                  color: "#c9d1d9",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>

            {/* SPEED */}

            <div
              style={{
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
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
                  setSpeed(Number(e.target.value))
                }
                style={{
                  width: "100%",
                  cursor: "pointer",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "#8b949e",
                }}
              >
                <span>Fast</span>

                <span>{speed} ms</span>

                <span>Slow</span>
              </div>
            </div>

            {/* START */}

            <button
              onClick={startTyping}
              disabled={isPlaying}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "13px",
                background: isPlaying ? "#30363d" : "#00b2ff",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                cursor: isPlaying
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "bold",
                boxShadow: isPlaying
                  ? "none"
                  : "0 4px 12px rgba(0,178,255,0.25)",
              }}
            >
              {isPlaying
                ? "⌨️ Typing..."
                : "▶️ Start Simulation"}
            </button>

            {/* STOP + RESET */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <button
                onClick={stopTyping}
                style={{
                  padding: "9px",
                  background: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "11px",
                }}
              >
                ⏹ Stop
              </button>

              <button
                onClick={resetTyping}
                style={{
                  padding: "9px",
                  background: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
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
                background: "#0d1117",
                border: "1px solid #21262d",
                fontSize: "10px",
                color: "#8b949e",
                textAlign: "center",
              }}
            >
              {isPlaying
                ? "JavaScript is being typed..."
                : "Ready for simulation"}
            </div>
          </div>
        </div>
      </div>

      {/* CURSOR ANIMATION */}

      <style>
        {`
          @keyframes codeCursorBlink {
            0%, 45% {
              opacity: 1;
            }

            46%, 100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}