import { useState, useEffect } from "react";
import { NOCHE, ALBA, LINO, CIELO, PIEDRA, ALBA_LIGHT, NOCHE_DARK, rgba } from "./theme";
import Horeb from "./Horeb";
import { OUR_FATHER, HAIL_MARY, APOSTLES_CREED } from "./Rosario";

const BG_MAIN = NOCHE;
const GOLD = ALBA;
const GOLD_LIGHT = ALBA_LIGHT;
const CREAM = LINO;
const CREAM_DARK = PIEDRA;
const MUTED = CIELO;
const NAVY = NOCHE;
const NAVY_DARK = NOCHE_DARK;

const SECTIONS = {
  es: ["Oraciones Iniciales", "La Coronilla", "Cierre"],
  en: ["Opening Prayers", "The Chaplet", "Closing"],
};

// Origen de la Coronilla — Diario de Santa Faustina, copiado literal.
// Solo español por ahora, mismo criterio que las meditaciones del Rosario
// (Opción A: sin traducción no oficial hasta contar con texto oficial).
const HISTORY_TEXT = `En 1935, Santa Faustina tuvo la visión de un ángel enviado a castigar una ciudad. Sus oraciones parecían inútiles, hasta que, ante la Santísima Trinidad, escuchó interiormente las palabras que hoy son el corazón de esta oración: "Padre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo... ten misericordia de nosotros y del mundo entero."

Mientras rezaba, el ángel quedó impotente para ejecutar el castigo.

Jesús le reveló después que esta oración no era solo para ella, sino para el mundo entero, y le prometió: "Quien la recite recibirá gran misericordia en la hora de la muerte."

Se reza con un rosario común, y es especialmente propia después de la Comunión, en la Hora de la Misericordia (3:00 p.m., recordando la muerte de Cristo en la cruz), y durante la Novena previa al Domingo de la Divina Misericordia.`;

const SIGN_OF_CROSS = "En el nombre del Padre y del Hijo y del Espíritu Santo. Amén.";
const OFFERING_PRAYER = "Padre Eterno, Te ofrezco el Cuerpo, la Sangre, el Alma y la Divinidad de Tu amadísimo Hijo, Nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.";
const MERCY_INVOCATION = "Por Su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.";
const HOLY_GOD_INVOCATION = "Santo Dios, Santo Fuerte, Santo Inmortal, ten misericordia de nosotros y del mundo entero.";
const FINAL_PRAYER = "Oh Dios Eterno, en quien la misericordia es infinita y el tesoro de compasión inagotable, vuelve a nosotros Tu mirada bondadosa y aumenta Tu misericordia en nosotros, para que en momentos difíciles no nos desesperemos ni nos desalentemos, sino que, con gran confianza, nos sometamos a Tu santa voluntad, que es el Amor y la Misericordia mismos. Amén.";

function buildPages(lang) {
  const opening = [
    { part: 0, stepIndex: 0, stepCount: 4, kind: "opening", title: lang === "es" ? "Señal de la Cruz" : "Sign of the Cross", text: SIGN_OF_CROSS },
    { part: 0, stepIndex: 1, stepCount: 4, kind: "opening", title: lang === "es" ? "Padre Nuestro" : "Our Father", text: OUR_FATHER[lang] },
    { part: 0, stepIndex: 2, stepCount: 4, kind: "opening", title: lang === "es" ? "Ave María" : "Hail Mary", text: HAIL_MARY[lang] },
    { part: 0, stepIndex: 3, stepCount: 4, kind: "opening", title: lang === "es" ? "Credo de los Apóstoles" : "Apostles' Creed", text: APOSTLES_CREED[lang] },
  ];
  const body = [
    { part: 1, stepIndex: 0, stepCount: 2, kind: "single", title: lang === "es" ? "Grano Mayor" : "Large Bead", text: OFFERING_PRAYER },
    { part: 1, stepIndex: 1, stepCount: 2, kind: "beads", counterId: "granos-menores", total: 10, title: lang === "es" ? "10 Granos Menores" : "10 Small Beads", text: MERCY_INVOCATION },
  ];
  const closing = [
    { part: 2, stepIndex: 0, stepCount: 3, kind: "beads", counterId: "invocacion-final", total: 3, title: lang === "es" ? "3 veces" : "3 times", text: HOLY_GOD_INVOCATION },
    { part: 2, stepIndex: 1, stepCount: 3, kind: "final", title: lang === "es" ? "Oración Final" : "Closing Prayer", text: FINAL_PRAYER },
    { part: 2, stepIndex: 2, stepCount: 3, kind: "complete", title: lang === "es" ? "¡Has completado la Coronilla de la Divina Misericordia!" : "You have completed the Chaplet of Divine Mercy!", text: lang === "es" ? "Que la Divina Misericordia cubra al mundo entero." : "May Divine Mercy cover the whole world." },
  ];
  return [...opening, ...body, ...closing];
}

// Progreso en curso, persistido igual que el Rosario — misma razón (una
// interrupción de sesión mata el estado en memoria) y mismo anclaje de
// fecha a America/Bogota. Clave propia para no chocar con la del Rosario.
const CORONILLA_PROGRESS_KEY = "lumora_coronilla_progress_v1";

function todayDateKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
}

function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(CORONILLA_PROGRESS_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.date !== todayDateKey()) return null;
    if (!(saved.pageIndex > 0)) return null;
    return saved;
  } catch {
    return null;
  }
}

function describeSavedPage(page, lang) {
  if (page.part === 0) return lang === "es" ? "las oraciones iniciales" : "the opening prayers";
  if (page.part === 1) return lang === "es" ? "la Coronilla" : "the Chaplet";
  return lang === "es" ? "el cierre" : "the closing";
}

export default function Coronilla({ lang = "es", onHome }) {
  const [savedProgress] = useState(() => loadSavedProgress());
  const [showResumePrompt, setShowResumePrompt] = useState(!!savedProgress);
  const [showHistory, setShowHistory] = useState(!savedProgress);
  const [pageIndex, setPageIndex] = useState(0);
  const [counts, setCounts] = useState({});
  const partTitles = SECTIONS[lang];
  const pages = buildPages(lang);
  const page = pages[pageIndex];

  const goNext = () => setPageIndex(p => Math.min(pages.length - 1, p + 1));
  const goPrev = () => setPageIndex(p => Math.max(0, p - 1));
  const goRestart = () => { setCounts({}); setPageIndex(0); };

  const handleBeadTap = (counterId, total) => {
    const current = counts[counterId] || 0;
    if (current >= total) return;
    if (navigator.vibrate) navigator.vibrate(50);
    const next = current + 1;
    setCounts(prev => ({ ...prev, [counterId]: next }));
    if (next === total) {
      setTimeout(goNext, 400);
    }
  };

  const isComplete = page.kind === "complete";

  // Guarda el progreso mientras se reza; se limpia al terminar. No escribe
  // durante la pantalla de historia ni mientras se espera la decisión de
  // retomar, para no pisar el progreso guardado con el estado inicial.
  useEffect(() => {
    if (showResumePrompt || showHistory) return;
    if (isComplete) {
      localStorage.removeItem(CORONILLA_PROGRESS_KEY);
      return;
    }
    localStorage.setItem(CORONILLA_PROGRESS_KEY, JSON.stringify({ date: todayDateKey(), pageIndex, counts }));
  }, [pageIndex, counts, isComplete, showResumePrompt, showHistory]);

  const handleResume = () => {
    if (!savedProgress) return;
    setPageIndex(savedProgress.pageIndex);
    setCounts(savedProgress.counts || {});
    setShowResumePrompt(false);
    setShowHistory(false);
  };

  const handleStartFresh = () => {
    localStorage.removeItem(CORONILLA_PROGRESS_KEY);
    setShowResumePrompt(false);
    setShowHistory(true);
  };

  if (showResumePrompt && savedProgress) {
    const savedPage = pages[savedProgress.pageIndex] || pages[0];
    return (
      <div style={{ position: "relative", background: BG_MAIN, color: CREAM, minHeight: "100vh", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ width: 300, height: 500, borderRadius: "50%", background: rgba(GOLD, 0.08), filter: "blur(60px)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 340 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Horeb size={40} />
          </div>
          <div style={{ fontSize: 19, lineHeight: 1.6, color: CREAM, fontFamily: "'Cormorant', serif", fontWeight: "bold", marginBottom: 32 }}>
            {lang === "es" ? "Dejaste la Coronilla en" : "You left the Chaplet at"} {describeSavedPage(savedPage, lang)}.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={handleResume}
              style={{ padding: "13px 28px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, border: "none", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif", boxShadow: `0 0 24px ${GOLD}55` }}
            >
              {lang === "es" ? "Continuar" : "Continue"}
            </button>
            <button
              onClick={handleStartFresh}
              style={{ padding: "13px 28px", background: NAVY_DARK, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 24, fontSize: 15, cursor: "pointer", fontFamily: "'Cormorant', serif" }}
            >
              {lang === "es" ? "Empezar de nuevo" : "Start over"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div style={{ position: "relative", background: BG_MAIN, color: CREAM, minHeight: "100vh", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ width: 300, height: 500, borderRadius: "50%", background: rgba(GOLD, 0.14), filter: "blur(60px)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Horeb size={40} />
          </div>
          <div style={{ fontSize: 20, fontWeight: "bold", fontFamily: "'Cormorant', serif", color: GOLD, marginBottom: 20 }}>
            {lang === "es" ? "Coronilla de la Divina Misericordia" : "Chaplet of Divine Mercy"}
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.85, color: CREAM, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap", textAlign: "left" }}>
            {HISTORY_TEXT}
          </div>
          <button
            onClick={() => setShowHistory(false)}
            style={{ marginTop: 32, padding: "13px 32px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, border: "none", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif", boxShadow: `0 0 24px ${GOLD}55` }}
          >
            {lang === "es" ? "Comenzar a rezar" : "Begin praying"}
          </button>
          <div>
            <button
              onClick={() => onHome && onHome()}
              style={{ marginTop: 16, background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}
            >
              ← {lang === "es" ? "Inicio" : "Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", background: BG_MAIN, color: CREAM, padding: "20px 20px 90px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {/* Resplandor de fondo */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ width: 300, height: 500, borderRadius: "50%", background: rgba(GOLD, 0.06), filter: "blur(60px)", transition: "background 0.4s ease" }} />
      </div>

      {/* Barra de progreso */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 6, marginBottom: 12 }}>
        {partTitles.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= page.part ? GOLD : CREAM_DARK, transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Contenido central */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 350px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflowY: "auto" }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          {isComplete ? (
            <div>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 18 }}>
                <line x1="12" y1="2" x2="12" y2="22" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="6" y1="8" x2="18" y2="8" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cormorant', serif", color: GOLD, marginBottom: 12 }}>
                {page.title}
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.7, color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>
                {page.text}
              </div>
              <button
                onClick={goRestart}
                style={{ marginTop: 24, padding: "13px 28px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, border: "none", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif", boxShadow: `0 0 24px ${GOLD}55` }}
              >
                {lang === "es" ? "Rezar de nuevo" : "Pray again"}
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cormorant', serif", marginBottom: page.text ? 18 : 0 }}>
                {page.title}
              </div>

              {page.kind === "beads" ? (
                <>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: CREAM, fontFamily: "'Work Sans', sans-serif", fontStyle: "italic", marginBottom: 24 }}>
                    {page.text}
                  </div>
                  {(() => {
                    const count = counts[page.counterId] || 0;
                    const progress = count / page.total;
                    // "La luz que crece" — mismo cálculo que el Rosario.
                    const fillAlpha = 0.55 + progress * 0.45;
                    const glowBlur = 14 + progress * 26;
                    const glowAlpha = 0.3 + progress * 0.5;
                    const ringRadius = 104;
                    const beadSize = 14;
                    return (
                      <div style={{ position: "relative", width: 240, height: 240, margin: "0 auto" }}>
                        {Array.from({ length: page.total }).map((_, i) => {
                          const angle = (2 * Math.PI * i) / page.total - Math.PI / 2;
                          const x = 120 + ringRadius * Math.cos(angle) - beadSize / 2;
                          const y = 120 + ringRadius * Math.sin(angle) - beadSize / 2;
                          const filled = i < count;
                          return (
                            <div key={i} style={{
                              position: "absolute", left: x, top: y,
                              width: beadSize, height: beadSize, borderRadius: "50%",
                              background: GOLD,
                              opacity: filled ? 1 : 0.22,
                              transition: "opacity 0.4s ease",
                            }} />
                          );
                        })}
                        <button
                          onClick={() => handleBeadTap(page.counterId, page.total)}
                          style={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                            width: 140, height: 140, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${rgba(GOLD, fillAlpha)}, ${rgba(GOLD_LIGHT, fillAlpha)})`,
                            boxShadow: `0 0 ${glowBlur}px ${rgba(GOLD, glowAlpha)}, 0 0 ${glowBlur * 2}px ${rgba(GOLD, glowAlpha * 0.4)}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", userSelect: "none",
                            border: "none", outline: "none", padding: 0, WebkitTapHighlightColor: "transparent",
                            transition: "background 0.4s ease, box-shadow 0.4s ease",
                          }}
                        >
                          <span style={{ fontSize: 46, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cormorant', serif" }}>
                            {count}
                          </span>
                        </button>
                      </div>
                    );
                  })()}
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 14 }}>
                    {lang === "es" ? "Toca el círculo para contar" : "Tap the circle to count"}
                  </div>
                </>
              ) : page.text ? (
                <div style={{ fontSize: 18, lineHeight: 1.8, color: CREAM, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                  {page.text}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div style={{ position: "fixed", zIndex: 1, bottom: 20, left: 0, right: 0, padding: "0 16px", boxSizing: "border-box" }}>
        {isComplete ? (
          <div style={{ display: "flex", justifyContent: "center", maxWidth: 400, margin: "0 auto" }}>
            <button
              onClick={() => onHome && onHome()}
              title={lang === "es" ? "Inicio" : "Home"}
              style={{ width: 48, height: 48, padding: 0, background: NAVY, border: `1px solid ${GOLD}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 11 L12 3 L22 11" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <rect x="4" y="11" width="16" height="10" rx="1" stroke={GOLD} strokeWidth="1.5"/>
                <rect x="9.5" y="15" width="5" height="6" fill={GOLD} rx="0.5"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
            <button
              onClick={goPrev}
              disabled={pageIndex === 0}
              style={{ flex: 1, padding: "12px", background: NAVY_DARK, color: pageIndex === 0 ? CREAM_DARK : CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === 0 ? "default" : "pointer", fontFamily: "'Cormorant', serif", opacity: pageIndex === 0 ? 0.5 : 1 }}
            >
              ← {lang === "es" ? "Anterior" : "Previous"}
            </button>
            <button
              onClick={() => onHome && onHome()}
              title={lang === "es" ? "Inicio" : "Home"}
              style={{ flex: "0 0 48px", width: 48, padding: 0, background: NAVY, border: `1px solid ${GOLD}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 11 L12 3 L22 11" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <rect x="4" y="11" width="16" height="10" rx="1" stroke={GOLD} strokeWidth="1.5"/>
                <rect x="9.5" y="15" width="5" height="6" fill={GOLD} rx="0.5"/>
              </svg>
            </button>
            <button
              onClick={goNext}
              disabled={pageIndex === pages.length - 1}
              style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === pages.length - 1 ? "default" : "pointer", fontFamily: "'Cormorant', serif", opacity: pageIndex === pages.length - 1 ? 0.5 : 1 }}
            >
              {lang === "es" ? "Siguiente" : "Next"} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
