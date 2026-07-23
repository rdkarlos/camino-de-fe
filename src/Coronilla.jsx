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

// Fuente de verdad: texto completo aportado por Carlos, copiado literal,
// carácter por carácter, sin reformular (20/23 jul 2026). La reconstrucción
// corrigió dos huecos de la versión anterior: solo tenía una década en vez
// de cinco, y una versión corta de las oraciones de apertura.
const SIGN_OF_CROSS = "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.";

// Oración de Santa Faustina por los pecadores (Diario, 72) — partida en dos
// pantallas por su extensión; la segunda es la continuación directa de la
// primera, no una oración distinta.
const FAUSTINA_PRAYER_1 = "Oh Jesús, Verdad eterna, nuestra Vida, te invoco y te ruego tu misericordia por los pobres pecadores. Oh dulcísimo Corazón de mi Señor, lleno de piedad y misericordia insondable, te suplico por los pobres pecadores. Oh Sagrado Corazón, Fuente de Misericordia de la que brotan rayos de gracias inconcebibles sobre toda la raza humana, te ruego luz para los pobres pecadores. Oh Jesús, recuerda tu propia y amarga Pasión y no permitas la pérdida de las almas redimidas a tan alto precio tu preciosísima Sangre. Oh Jesús, cuando considero el gran precio de tu Sangre, me regocijo en su inmensidad, pues una sola gota habría bastado para la salvación de todos los pecadores. Aunque el pecado es un abismo de maldad e ingratitud, el precio pagado por nosotros jamás podrá ser igualado. Por lo tanto, que cada alma confíe en la Pasión del Señor y ponga su esperanza en su misericordia. Dios no negará su misericordia a nadie. El cielo y la tierra pueden cambiar, pero la misericordia de Dios nunca se agotará. ¡Oh, qué inmensa alegría arde en mi corazón cuando contemplo Tu incomprensible bondad, oh Jesús! Deseo llevar a todos los pecadores a Tus pies para que glorifiquen Tu misericordia por los siglos de los siglos.";
const FAUSTINA_PRAYER_2 = "Expiraste, Jesús, pero la fuente de la vida brotó para las almas, y el océano de la misericordia se abrió para el mundo entero. Oh Fuente de Vida, insondable Misericordia Divina, envuelve al mundo entero y derrama Tu gracia sobre nosotros.";

const BLOOD_WATER_PRAYER = "¡Oh Sangre y Agua, que brotaste del Corazón de Jesús como fuente de misericordia para nosotros, en Ti confío!";

// Grano Mayor y Granos Menores — texto corregido con la fuente completa;
// difiere del que había antes (ver conversación: "como propiciación" →
// "en expiación", "Por Su dolorosa Pasión" → "Por los méritos de su
// dolorosa Pasión", entre otros).
const OFFERING_PRAYER = "Padre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu Amadísimo Hijo, Nuestro Señor Jesucristo, en expiación por nuestros pecados y los del mundo entero.";
const MERCY_INVOCATION = "Por los méritos de su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.";

const HOLY_GOD_INVOCATION = "Santo Dios, Santo Fuerte, Santo Inmortal, ten misericordia de nosotros y del mundo entero.";

// Dos oraciones finales, ambas siempre visibles (no opcionales) — mismo
// criterio que ya regía la única oración final anterior. Texto corregido
// con la fuente completa; la fuente no incluye "Amén." en la primera, así
// que no se agrega (copia literal, sin reformular).
const FINAL_PRAYER_1 = "Dios eterno, en quien la misericordia es infinita y el tesoro de la compasión inagotable, míranos con bondad y aumenta tu misericordia en nosotros, para que en los momentos difíciles no desesperemos ni nos desanimemos, sino que con gran confianza nos sometamos a tu santa voluntad, que es Amor y Misericordia misma.";
const FINAL_PRAYER_2 = "Oh Dios sumamente misericordioso, Bondad infinita, hoy toda la humanidad clama desde el abismo de su miseria a tu misericordia, a tu compasión, oh Dios; y es con su poderosa voz de miseria que clama. ¡Dios misericordioso, no rechaces la oración de los exiliados de esta tierra! Oh Señor, Bondad más allá de nuestro entendimiento, que conoces nuestra miseria de principio a fin, y sabes que por nuestro propio poder no podemos ascender a ti, te imploramos: anticípate a nosotros con tu gracia y sigue aumentando tu misericordia en nosotros, para que podamos cumplir fielmente tu santa voluntad durante toda nuestra vida y en la hora de la muerte. Que la omnipotencia de tu misericordia nos proteja de los dardos de los enemigos de nuestra salvación, para que, confiados como hijos tuyos, esperemos tu venida final, ese día que solo tú conoces. Y esperamos obtener todo lo que Jesús nos prometió, a pesar de toda nuestra miseria. Porque Jesús es nuestra esperanza: por su corazón misericordioso, como por una puerta abierta, pasamos al cielo.";

const TOTAL_DECADES = 5;

// Oraciones de apertura: Señal de la Cruz, Santa Faustina (2 pantallas),
// Oh Sangre y Agua ×3, Padre Nuestro, Ave María, Credo — en ese orden,
// entre la Señal de la Cruz y las 5 décadas.
function buildOpeningPages(lang) {
  const stepCount = 7;
  return [
    { part: 0, stepIndex: 0, stepCount, kind: "opening", title: lang === "es" ? "Señal de la Cruz" : "Sign of the Cross", text: SIGN_OF_CROSS },
    { part: 0, stepIndex: 1, stepCount, kind: "opening", title: lang === "es" ? "Oración de Santa Faustina" : "St. Faustina's Prayer", text: FAUSTINA_PRAYER_1 },
    { part: 0, stepIndex: 2, stepCount, kind: "opening", title: lang === "es" ? "Oración de Santa Faustina (continuación)" : "St. Faustina's Prayer (continued)", text: FAUSTINA_PRAYER_2 },
    { part: 0, stepIndex: 3, stepCount, kind: "beads", counterId: "sangre-agua", total: 3, title: lang === "es" ? "Oh Sangre y Agua" : "O Blood and Water", text: BLOOD_WATER_PRAYER },
    { part: 0, stepIndex: 4, stepCount, kind: "opening", title: lang === "es" ? "Padre Nuestro" : "Our Father", text: OUR_FATHER[lang] },
    { part: 0, stepIndex: 5, stepCount, kind: "opening", title: lang === "es" ? "Ave María" : "Hail Mary", text: HAIL_MARY[lang] },
    { part: 0, stepIndex: 6, stepCount, kind: "opening", title: lang === "es" ? "Credo de los Apóstoles" : "Apostles' Creed", text: APOSTLES_CREED[lang] },
  ];
}

// 5 décadas — misma arquitectura que Rosario.jsx usa para sus 5 misterios:
// mismo anillo de cuentas ("beads"), mismo patrón de repetición. A
// diferencia de los misterios (que dependen del día de la semana), las
// décadas de la Coronilla son siempre las mismas 5, en el mismo orden.
function buildDecadePages(lang) {
  const stepCount = TOTAL_DECADES * 2;
  const pages = [];
  for (let d = 0; d < TOTAL_DECADES; d++) {
    pages.push({ part: 1, stepIndex: d * 2, stepCount, decadeIndex: d, kind: "single", title: lang === "es" ? "Grano Mayor" : "Large Bead", text: OFFERING_PRAYER });
    pages.push({ part: 1, stepIndex: d * 2 + 1, stepCount, decadeIndex: d, kind: "beads", counterId: `granos-menores-${d}`, total: 10, title: lang === "es" ? "10 Granos Menores" : "10 Small Beads", text: MERCY_INVOCATION });
  }
  return pages;
}

function buildClosingPages(lang) {
  return [
    { part: 2, stepIndex: 0, stepCount: 4, kind: "beads", counterId: "santo-dios", total: 3, title: lang === "es" ? "3 veces" : "3 times", text: HOLY_GOD_INVOCATION },
    { part: 2, stepIndex: 1, stepCount: 4, kind: "final", title: lang === "es" ? "Primera Oración Final" : "First Closing Prayer", text: FINAL_PRAYER_1 },
    { part: 2, stepIndex: 2, stepCount: 4, kind: "final", title: lang === "es" ? "Segunda Oración Final" : "Second Closing Prayer", text: FINAL_PRAYER_2 },
    { part: 2, stepIndex: 3, stepCount: 4, kind: "complete", title: lang === "es" ? "¡Has completado la Coronilla de la Divina Misericordia!" : "You have completed the Chaplet of Divine Mercy!", text: lang === "es" ? "Que la Divina Misericordia cubra al mundo entero." : "May Divine Mercy cover the whole world." },
  ];
}

function buildPages(lang) {
  return [...buildOpeningPages(lang), ...buildDecadePages(lang), ...buildClosingPages(lang)];
}

// Progreso en curso, persistido igual que el Rosario — misma razón (una
// interrupción de sesión mata el estado en memoria) y mismo anclaje de
// fecha a America/Bogota. Clave propia para no chocar con la del Rosario.
//
// Con 5 décadas, "en qué década vas" se deriva de pageIndex (cada página ya
// sabe su propio decadeIndex), sin necesidad de guardar un campo aparte —
// mismo mecanismo que usa Rosario.jsx para mysteryIndex (derivado de
// pages[pageIndex], no guardado por separado). Solo mysteryKey se guarda
// aparte allá porque afecta qué páginas se construyen según el día; aquí
// las 5 décadas son siempre las mismas, así que no aplica un equivalente.
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
  if (page.part === 1) return lang === "es" ? `la Década ${page.decadeIndex + 1} de ${TOTAL_DECADES}` : `Decade ${page.decadeIndex + 1} of ${TOTAL_DECADES}`;
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

      {/* Insignia de década — mismo patrón que la insignia de misterio del Rosario */}
      {page.part === 1 && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", fontSize: 12, color: GOLD, marginBottom: 12, fontFamily: "'Cormorant', serif" }}>
          ✦ {lang === "es" ? "Década" : "Decade"} {page.decadeIndex + 1} {lang === "es" ? `de ${TOTAL_DECADES}` : `of ${TOTAL_DECADES}`}
        </div>
      )}

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
