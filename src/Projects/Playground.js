
import React from "react";
import LiveCssTyper from "./LiveCssTyper";

export default function Playground() {
  return (
    <div className="playground">
      {/* Header */}
      <header className="playground-header">
        <div>
          <h1>⚡ Code Simulation Lab</h1>
          <p>Interactive CSS visualizer</p>
        </div>
      </header>

      {/* Live CSS Typer */}
      <main className="simulation-area">
        <LiveCssTyper />
      </main>

      {/* Footer */}
      <footer className="playground-footer">
        <span>● Simulation Lab</span>
        <span>CSS Visualizer</span>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .playground {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(
              circle at top left,
              rgba(0, 178, 255, 0.08),
              transparent 30%
            ),
            #080b10;

          color: #e6edf3;
          font-family: Inter, Arial, sans-serif;
          padding: 24px;
        }

        /* =========================
           HEADER
        ========================= */

        .playground-header {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto 20px;

          display: flex;
          align-items: center;

          padding: 18px 22px;

          background: rgba(22, 27, 34, 0.85);
          border: 1px solid #30363d;
          border-radius: 14px;

          backdrop-filter: blur(10px);
        }

        .playground-header h1 {
          margin: 0;
          font-size: 22px;
          color: #00b2ff;
          letter-spacing: 0.3px;
        }

        .playground-header p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #8b949e;
        }

        /* =========================
           SIMULATION
        ========================= */

        .simulation-area {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;

          background: #0d1117;

          border: 1px solid #30363d;
          border-radius: 14px;

          overflow: hidden;

          box-shadow:
            0 15px 45px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.01);
        }

        /* =========================
           FOOTER
        ========================= */

        .playground-footer {
          width: 100%;
          max-width: 1400px;

          margin: 14px auto 0;

          display: flex;
          justify-content: space-between;

          padding: 0 4px;

          font-size: 9px;
          color: #484f58;
        }

        .playground-footer span:first-child {
          color: #00b2ff;
          opacity: 0.65;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 800px) {
          .playground {
            padding: 12px;
          }

          .playground-header {
            padding: 15px;
          }

          .playground-header h1 {
            font-size: 18px;
          }
        }

        @media (max-width: 500px) {
          .playground {
            padding: 8px;
          }

          .playground-header {
            margin-bottom: 10px;
          }

          .playground-header h1 {
            font-size: 17px;
          }

          .playground-footer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}