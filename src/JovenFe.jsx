import { useState } from "react";

const BG_MAIN = "#0A0F1E";
const BG_CARD = "#111827";
const GOLD = "#C9A84C";
const CREAM = "#FAF5ED";
const CREAM_DARK = "#2A3A5A";
const MUTED = "#8A9BB5";
const NAVY = "#1B2A4A";

export default function JovenFe({ lang = "es", onBack }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [pressedCard, setPressedCard] = useState(null);

  const cards = [
    {
      id: "retos",
      title: lang === "es" ? "Retos de Fe" : "Faith Challenges",
      desc: lang === "es" ? "30 días con Cristo" : "30 days with Christ",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="10" stroke={GOLD} strokeWidth="1.5"/>
          <path d="M9 13.5 L11.8 16.3 L17.2 10" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "testimonios",
      title: lang === "es" ? "Testimonios" : "Testimonies",
      desc: lang === "es" ? "Comparte tu historia" : "Share your story",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M4 6.5 C4 5.1 5.1 4 6.5 4 H19.5 C20.9 4 22 5.1 22 6.5 V15 C22 16.4 20.9 17.5 19.5 17.5 H10 L5.5 21.5 V17.5 H6.5 C5.1 17.5 4 16.4 4 15 Z" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "quiz",
      title: lang === "es" ? "Quiz Bíblico" : "Bible Quiz",
      desc: lang === "es" ? "Pon a prueba tu fe" : "Put your faith to the test",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M9.5 9.5 C9.5 7.6 11 6.2 13 6.2 C15 6.2 16.5 7.6 16.5 9.3 C16.5 11.8 13 11.6 13 14.5" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="13" cy="18.5" r="1.1" fill={GOLD}/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
      <button
        onClick={() => onBack && onBack()}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "'Cinzel', serif" }}
      >
        ← {lang === "es" ? "Volver" : "Back"}
      </button>

      <div>
        {cards.map((c) => (
          <div
            key={c.id}
            onClick={() => {}}
            onPointerEnter={() => setHoveredCard(c.id)}
            onPointerLeave={() => { setHoveredCard(null); setPressedCard(null); }}
            onPointerDown={() => setPressedCard(c.id)}
            onPointerUp={() => setPressedCard(null)}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: BG_CARD,
              border: `1.5px solid ${(hoveredCard === c.id || pressedCard === c.id) ? GOLD : CREAM_DARK}`,
              borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer",
              transition: "border-color 0.15s ease",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 12, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{c.desc}</div>
            </div>
            <div style={{ color: GOLD, fontSize: 26, fontWeight: 300, flexShrink: 0 }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
