import React, { useState, useRef } from "react";
import axios from "axios";
import { generatePDF } from "./utils/pdfGenerator";
import "./App.css";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ─── Inject keyframe animations once ─────────────────────────────────────────
const ANIM_CSS = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
if (!document.getElementById("pia-anim")) {
  const tag = document.createElement("style");
  tag.id = "pia-anim";
  tag.textContent = ANIM_CSS;
  document.head.appendChild(tag);
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           "#f5f2ed",
  card:         "#ffffff",
  border:       "#ddd6cc",
  borderMaroon: "#7a1c2e",
  maroon:       "#7a1c2e",
  maroonDark:   "#4f0f1c",
  text:         "#2c1a1f",
  muted:        "#8a7a72",
  white:        "#ffffff",
  blueJeans:    "#445C70",
  blueJeansLt:  "#d6e3ed",
  butterYellow: "#F0CC7F",
  butterDark:   "#c9a030",
  sunOrange:    "#DD8B5C",
  sunOrangeDk:  "#b8622e",
  softGreen:    "#738262",
  softGreenLt:  "#e8ede4",
  cadmiumOrange:"#FF9369",
  cadmiumDark:  "#e06030",
  sweetTaffy:   "#E9C9D8",
  spaBlue:      "#D1E1E0",
  gleamGreen:   "#C1D2A7",
};

const FONT_BODY = "'Trebuchet MS', 'Gill Sans', 'Century Gothic', sans-serif";
const FONT_MONO = "'Consolas', 'Lucida Console', monospace";

// ─── Stat card icons & accent colours ────────────────────────────────────────
const STAT_META = [
  { icon: "📋", color: C.blueJeans  },
  { icon: "⭐", color: C.butterDark },
  { icon: "😊", color: C.softGreen  },
  { icon: "⚠️", color: C.maroon     },
];

// ─── Section header icons ─────────────────────────────────────────────────────
const SECTION_ICONS = {
  "Summary":            "📊",
  "Detected Issues":    "🚨",
  "Distribution":       "📈",
  "Recognition":        "🏆",
  "AI Recommendations": "🤖",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: "100vh",
    background: C.bg,
    backgroundImage:
      "radial-gradient(ellipse at 15% 10%, rgba(68,92,112,0.07) 0%, transparent 50%), " +
      "radial-gradient(ellipse at 85% 90%, rgba(115,130,98,0.06) 0%, transparent 50%)",
    padding: "40px 20px",
    fontFamily: FONT_BODY,
    color: C.text,
  },
  wrapper: { maxWidth: "1120px", margin: "0 auto" },

  // ── Header (untouched) ──────────────────────────────────────────────────────
  header:      { textAlign: "center", marginBottom: "40px" },
  eyebrow: {
    display: "inline-block", fontSize: "11px",
    fontFamily: FONT_MONO, letterSpacing: "4px",
    textTransform: "uppercase", color: C.maroon,
    borderTop: `1px solid ${C.borderMaroon}`,
    borderBottom: `1px solid ${C.borderMaroon}`,
    padding: "5px 18px", marginBottom: "16px",
  },
  title: {
    fontSize: "clamp(28px, 5vw, 44px)", fontWeight: "700",
    color: C.maroonDark, letterSpacing: "-0.5px",
    margin: "0 0 10px", lineHeight: 1.15,
  },
  titleAccent: { color: C.maroon },
  subtitle: {
    fontSize: "14px", color: C.muted,
    fontFamily: FONT_MONO, letterSpacing: "1px",
  },
  divider: {
    width: "60px", height: "2px",
    background: `linear-gradient(90deg, transparent, ${C.maroon}, transparent)`,
    margin: "20px auto 0", border: "none",
  },

  // ── Upload drop zone ────────────────────────────────────────────────────────
  uploadZone: {
    background: C.card,
    border: `2px dashed ${C.border}`,
    borderRadius: "12px",
    padding: "44px 36px 32px",
    textAlign: "center",
    marginBottom: "32px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 2px 14px rgba(68,92,112,0.08)",
    transition: "border-color 0.2s ease, background 0.2s ease",
    cursor: "pointer",
  },
  uploadZoneDrag: {
    borderColor: C.cadmiumOrange,
    background: "#fff8f5",
  },
  uploadAccentBar: {
    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
    background: `linear-gradient(90deg, ${C.blueJeans}, ${C.cadmiumOrange}, ${C.sunOrange})`,
  },
  uploadIcon:  { fontSize: "40px", display: "block", marginBottom: "12px" },
  uploadTitle: { fontSize: "16px", fontWeight: "700", color: C.text, margin: "0 0 6px" },
  uploadSub:   { fontSize: "13px", color: C.muted,   margin: "0 0 20px" },
  browseBtn: {
    display: "inline-block",
    background: C.blueJeansLt,
    color: C.blueJeans,
    border: `1px solid rgba(68,92,112,0.3)`,
    borderRadius: "6px",
    padding: "8px 22px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  uploadFileName: {
    marginTop: "12px",
    fontSize: "13px",
    color: C.softGreen,
    fontFamily: FONT_MONO,
    fontWeight: "600",
  },
  hiddenInput: { display: "none" },

  // ── Analyze button ──────────────────────────────────────────────────────────
  btnAnalyze: {
    marginTop: "20px",
    background: C.cadmiumOrange,
    color: C.white,
    border: "none",
    padding: "13px 40px",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: FONT_MONO,
    fontSize: "12px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontWeight: "700",
    transition: "all 0.25s ease",
    boxShadow: "0 3px 10px rgba(255,147,105,0.35)",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  spinner: {
    width: "14px", height: "14px",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: C.white,
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
    display: "inline-block",
    flexShrink: 0,
  },

  // ── Section header ──────────────────────────────────────────────────────────
  sectionRow: {
    display: "flex", alignItems: "center",
    gap: "10px", marginBottom: "16px",
  },
  sectionIcon:  { fontSize: "16px", lineHeight: 1, flexShrink: 0 },
  sectionTitle: {
    fontSize: "11px", fontFamily: FONT_MONO,
    letterSpacing: "3px", textTransform: "uppercase",
    color: C.blueJeans, margin: 0,
    whiteSpace: "nowrap", fontWeight: "700",
  },
  sectionLine: {
    flex: 1, height: "2px",
    background: `linear-gradient(90deg, ${C.gleamGreen}, transparent)`,
    borderRadius: "2px",
  },

  // ── Stat cards ──────────────────────────────────────────────────────────────
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px", marginBottom: "32px",
  },
  statCard: {
    background: C.blueJeansLt,
    border: `1px solid rgba(68,92,112,0.2)`,
    borderRadius: "10px",
    padding: "20px 20px 20px 24px",
    position: "relative", overflow: "hidden",
    boxShadow: "0 2px 10px rgba(68,92,112,0.10)",
  },
  statCorner: {
    position: "absolute", top: 0, left: 0,
    width: "4px", height: "100%",
    background: `linear-gradient(180deg, ${C.blueJeans}, transparent)`,
    borderRadius: "10px 0 0 10px",
  },
  statIcon:  { fontSize: "22px", display: "block", marginBottom: "10px" },
  statLabel: {
    fontSize: "10px", fontFamily: FONT_MONO,
    letterSpacing: "2px", textTransform: "uppercase",
    color: C.blueJeans, display: "block", marginBottom: "6px",
  },
  statValue: {
    fontSize: "22px", fontWeight: "700",
    color: C.maroonDark, lineHeight: 1.2, margin: 0,
  },

  // ── Issues ──────────────────────────────────────────────────────────────────
  issuesPanel: {
    background: C.sweetTaffy,
    border: `1px solid rgba(122,28,46,0.18)`,
    borderLeft: `4px solid ${C.maroon}`,
    borderRadius: "10px",
    padding: "22px 24px", marginBottom: "32px",
    boxShadow: "0 2px 10px rgba(233,201,216,0.4)",
  },
  issueRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "9px 0", borderBottom: `1px solid rgba(122,28,46,0.12)`,
    fontSize: "14px",
  },
  issueBadge: {
    background: "rgba(122,28,46,0.12)", color: C.maroon,
    fontSize: "11px", padding: "2px 12px",
    borderRadius: "20px", fontFamily: FONT_MONO, fontWeight: "700",
  },

  // ── Charts ──────────────────────────────────────────────────────────────────
  chartGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "20px", marginBottom: "32px",
  },
  chartCard: {
    background: C.spaBlue,
    border: `1px solid rgba(68,92,112,0.18)`,
    borderRadius: "10px", padding: "22px 20px",
    boxShadow: "0 2px 10px rgba(68,92,112,0.10)",
  },
  chartTitle: {
    fontSize: "10px", fontFamily: FONT_MONO,
    letterSpacing: "2px", textTransform: "uppercase",
    color: C.blueJeans, marginBottom: "18px", fontWeight: "700",
  },

  // ── Best product ─────────────────────────────────────────────────────────────
  bestPanel: {
    background: C.butterYellow,
    border: `1px solid ${C.butterDark}`,
    borderTop: `4px solid ${C.butterDark}`,
    borderRadius: "10px", padding: "28px 24px",
    textAlign: "center", marginBottom: "32px",
    boxShadow: "0 3px 14px rgba(201,160,48,0.25)",
  },
  bestLabel: {
    fontSize: "10px", fontFamily: FONT_MONO,
    letterSpacing: "3px", textTransform: "uppercase",
    color: "#7a5800", display: "block", marginBottom: "12px", fontWeight: "700",
  },
  bestValue: {
    fontSize: "26px", fontWeight: "700",
    color: "#4a3200", letterSpacing: "-0.3px", margin: 0,
  },

  // ── Recommendations ──────────────────────────────────────────────────────────
  recsPanel: {
    background: C.softGreenLt,
    border: `1px solid rgba(115,130,98,0.25)`,
    borderLeft: `4px solid ${C.softGreen}`,
    borderRadius: "10px", padding: "22px 24px",
    marginBottom: "32px",
    boxShadow: "0 2px 10px rgba(115,130,98,0.12)",
  },
  recRow: {
    display: "flex", alignItems: "flex-start",
    gap: "12px", padding: "9px 0",
    borderBottom: `1px solid rgba(115,130,98,0.20)`,
    fontSize: "14px", lineHeight: 1.6,
  },
  recBullet: {
    color: C.softGreen, fontSize: "20px",
    lineHeight: 1, flexShrink: 0, fontWeight: "700",
  },

  // ── Download ─────────────────────────────────────────────────────────────────
  downloadPanel: {
    textAlign: "center", padding: "28px",
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  downloadLabel: {
    fontSize: "10px", fontFamily: FONT_MONO,
    letterSpacing: "3px", textTransform: "uppercase",
    color: C.muted, display: "block", marginBottom: "16px",
  },
  btnDownload: {
    background: C.sunOrange, color: C.white, border: "none",
    padding: "13px 40px", borderRadius: "6px", cursor: "pointer",
    fontFamily: FONT_MONO, fontSize: "12px", letterSpacing: "3px",
    textTransform: "uppercase", fontWeight: "700",
    transition: "all 0.25s ease",
    boxShadow: "0 3px 12px rgba(221,139,92,0.40)",
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    textAlign: "center", marginTop: "40px",
    fontSize: "11px", fontFamily: FONT_MONO,
    color: C.muted, letterSpacing: "2px", textTransform: "uppercase",
  },
};

// ─── Chart defaults ───────────────────────────────────────────────────────────
const chartOptions = {
  plugins: { legend: { labels: { color: C.blueJeans, font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: C.blueJeans }, grid: { color: "rgba(68,92,112,0.08)" } },
    y: { ticks: { color: C.blueJeans }, grid: { color: "rgba(68,92,112,0.08)" } },
  },
};
const pieOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: C.blueJeans, font: { size: 11 }, padding: 16 },
    },
  },
};

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────
function FadeIn({ delay = 0, children }) {
  return (
    <div style={{
      animation: "fadeSlideUp 0.45s ease both",
      animationDelay: `${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <div style={S.sectionRow}>
      <span style={S.sectionIcon}>{SECTION_ICONS[label] || "•"}</span>
      <p style={S.sectionTitle}>{label}</p>
      <div style={S.sectionLine} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [file, setFile]         = useState(null);
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [hover, setHover]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef                = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const uploadFile = async () => {
    if (!file || loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  const ratingData = {
    labels: Object.keys(data?.rating_distribution || {}),
    datasets: [{
      label: "Ratings",
      data: Object.values(data?.rating_distribution || {}),
      backgroundColor: C.blueJeans,
      borderRadius: 4,
    }],
  };

  const sentimentData = {
    labels: Object.keys(data?.sentiment_distribution || {}),
    datasets: [{
      data: Object.values(data?.sentiment_distribution || {}),
      backgroundColor: [C.softGreen, C.butterYellow, C.sunOrange],
      borderWidth: 0,
    }],
  };

  return (
    <div style={S.root}>
      <div style={S.wrapper}>

        {/* ── Header (unchanged) ── */}
        <header style={S.header}>
          <span style={S.eyebrow}>Analytics Dashboard</span>
          <h1 style={S.title}>
            Product Insight <span style={S.titleAccent}>Analyzer</span>
          </h1>
          <p style={S.subtitle}>Upload · Analyze · Decide</p>
          <hr style={S.divider} />
        </header>

        {/* ── Custom upload drop zone ── */}
        <div
          style={{ ...S.uploadZone, ...(dragging ? S.uploadZoneDrag : {}) }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div style={S.uploadAccentBar} />

          <span style={S.uploadIcon}>{dragging ? "🎯" : "📂"}</span>
          <p style={S.uploadTitle}>
            {dragging ? "Release to drop your file!" : "Drag & drop your dataset here"}
          </p>
          <p style={S.uploadSub}>or click to browse &nbsp;·&nbsp; CSV, Excel supported</p>

          <span style={S.browseBtn}>Browse File</span>

          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            style={S.hiddenInput}
            onClick={(e) => e.stopPropagation()}
          />

          {file && (
            <p style={S.uploadFileName}>✓ &nbsp;{file.name}</p>
          )}

          <br />
          <button
            onClick={(e) => { e.stopPropagation(); uploadFile(); }}
            disabled={loading || !file}
            style={{
              ...S.btnAnalyze,
              ...(hover === "analyze" && !loading
                ? { background: C.cadmiumDark }
                : {}),
              ...(loading || !file
                ? { opacity: 0.65, cursor: "not-allowed" }
                : {}),
            }}
            onMouseEnter={() => setHover("analyze")}
            onMouseLeave={() => setHover(null)}
          >
            {loading && <span style={S.spinner} />}
            {loading ? "Analyzing…" : "Analyze Dataset"}
          </button>
        </div>

        {/* ── Results with staggered fade-ins ── */}
        {data && (
          <>
            {data.dataset_summary && (
              <FadeIn delay={0}>
                <SectionHeader label="Summary" />
                <div style={S.summaryGrid}>
                  {[
                    { title: "Total Reviews",    value: data.dataset_summary.total_reviews },
                    { title: "Average Rating",   value: `${data.dataset_summary.average_rating} ★` },
                    { title: "Positive Reviews", value: `${data.dataset_summary.positive_percent}%` },
                    { title: "Top Issue",        value: data.dataset_summary.top_issue },
                  ].map((item, i) => (
                    <div key={i} style={S.statCard}>
                      <div style={S.statCorner} />
                      <span style={{ ...S.statIcon, color: STAT_META[i].color }}>
                        {STAT_META[i].icon}
                      </span>
                      <span style={S.statLabel}>{item.title}</span>
                      <p style={S.statValue}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            <FadeIn delay={80}>
              <SectionHeader label="Detected Issues" />
              <div style={S.issuesPanel}>
                {data.issues.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      ...S.issueRow,
                      ...(i === data.issues.length - 1 ? { borderBottom: "none" } : {}),
                    }}
                  >
                    <span>{item.issue}</span>
                    <span style={S.issueBadge}>{item.count}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <SectionHeader label="Distribution" />
              <div style={S.chartGrid}>
                <div style={S.chartCard}>
                  <p style={S.chartTitle}>Rating Distribution</p>
                  <Bar data={ratingData} options={chartOptions} />
                </div>
                <div style={S.chartCard}>
                  <p style={S.chartTitle}>Sentiment Distribution</p>
                  <Pie data={sentimentData} options={pieOptions} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <SectionHeader label="Recognition" />
              <div style={S.bestPanel}>
                <span style={S.bestLabel}>🏆 Best Performing Product</span>
                <p style={S.bestValue}>{data.best_product}</p>
              </div>
            </FadeIn>

            <FadeIn delay={320}>
              <SectionHeader label="AI Recommendations" />
              <div style={S.recsPanel}>
                {data.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      ...S.recRow,
                      ...(i === data.recommendations.length - 1 ? { borderBottom: "none" } : {}),
                    }}
                  >
                    <span style={S.recBullet}>›</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div style={S.downloadPanel}>
                <span style={S.downloadLabel}>Export Report</span>
                <button
                  onClick={() => generatePDF(data, "Dataset")}
                  style={{
                    ...S.btnDownload,
                    ...(hover === "pdf" ? { background: C.sunOrangeDk } : {}),
                  }}
                  onMouseEnter={() => setHover("pdf")}
                  onMouseLeave={() => setHover(null)}
                >
                  📄 &nbsp;Download PDF Report
                </button>
              </div>
            </FadeIn>
          </>
        )}

        <p style={S.footer}>
          Product Insight Analyzer &nbsp;·&nbsp; Powered by AI
        </p>

      </div>
    </div>
  );
}

export default App;