import { CARD, ALBA, ALBA_LIGHT, LINO, NOCHE_DARK } from "./theme";

const BG_CARD = CARD;
const GOLD = ALBA;
const GOLD_LIGHT = ALBA_LIGHT;
const CREAM = LINO;
const NAVY_DARK = NOCHE_DARK;

export default function ComingSoon({ icon, title, description, badge }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "20px 10px" }}>
      <div style={{ background: BG_CARD, border: `1.5px solid ${GOLD}55`, borderRadius: 20, padding: "40px 28px", maxWidth: 340, width: "100%" }}>
        <div style={{ marginBottom: 18 }}>{icon}</div>
        <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 14 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.7, fontFamily: "'Work Sans', sans-serif", marginBottom: 18 }}>
          {description}
        </div>
        <span style={{ display: "inline-block", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, fontSize: 11, fontWeight: "bold", padding: "6px 16px", borderRadius: 20, letterSpacing: 0.5 }}>
          {badge}
        </span>
      </div>
    </div>
  );
}
