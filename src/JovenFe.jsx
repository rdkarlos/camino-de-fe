import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { NOCHE, NOCHE_DARK, CARD, ALBA, LINO, CIELO, PIEDRA, CAMINO_TERRACOTA, rgba } from "./theme";
import { itinerarioClara, decalogoClara, decalogoClaraCierre, creditosItinerarioClara, ITINERARIO_CLARA_ID } from "./itinerarios";
import HorebLoading from "./HorebLoading";

const BG_MAIN = NOCHE;
const BG_CARD = CARD;
const GOLD = ALBA;
const CREAM = LINO;
const CREAM_DARK = PIEDRA;
const MUTED = CIELO;
const NAVY = NOCHE;
const TERRACOTA = CAMINO_TERRACOTA;
const WHITE = "#FFFFFF";

const DEFAULT_ITIN = { diaActual: 1, diasCompletados: {}, ultimaFechaCompletado: null, notas: {} };

// Ancla el día a America/Bogota, "YYYY-MM-DD" — mismo patrón que
// todayDiarioKey() en App.jsx (Diario / Lectio Divina).
const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

// Camino sinuoso ascendente con un punto de luz al final — ícono propio de
// Itinerarios espirituales. Mismo lenguaje de línea fina (1.6px) que el resto
// de los glyphs del proyecto; sin <defs>/gradientes para poder repetirse en
// una misma pantalla sin colisión de ids.
function CamineGlyph({ size = 24, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20 C 7.5 19.2 6.3 15.4 9.8 14.3 C 13.3 13.2 11.8 9.3 15.2 8.2 C 16.9 7.65 17.7 7.1 18.5 6.3"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx="19.3" cy="5.6" r="3" fill={color} opacity="0.16" />
      <circle cx="19.3" cy="5.6" r="1.3" fill={color} />
    </svg>
  );
}

const DAY_FIELDS = [
  { key: "conoceAClara", label: { es: "Conoce a Clara", en: "Get to know Clare" } },
  { key: "suPalabra", label: { es: "Su palabra o su ejemplo", en: "Her word or example" } },
  { key: "reflexion", label: { es: "Reflexión", en: "Reflection" } },
  { key: "oracion", label: { es: "Oración", en: "Prayer" } },
  { key: "oracionFinal", label: { es: "Oración final", en: "Final prayer" } },
  { key: "propositoHoy", label: { es: "Propósito para hoy", en: "Purpose for today" } },
  { key: "paraTuDiaADia", label: { es: "Para tu día a día", en: "For your everyday life" } },
];

export default function JovenFe({ lang = "es", onBack, user, onRequireAuth }) {
  const [view, setView] = useState("menu"); // menu | landing | day | decalogo | acerca
  const [itin, setItin] = useState(null);
  const [itinLoading, setItinLoading] = useState(false);
  const [viewingDay, setViewingDay] = useState(1);
  const [notaDraft, setNotaDraft] = useState("");
  const [completing, setCompleting] = useState(false);
  const [showAnteriores, setShowAnteriores] = useState(false);

  const db = getFirestore();
  const itinRef = user ? doc(db, "usuarios", user.uid, "itinerarios", ITINERARIO_CLARA_ID) : null;

  const loadItinerario = async () => {
    if (!user) { setItin(DEFAULT_ITIN); return; }
    setItinLoading(true);
    try {
      const snap = await getDoc(itinRef);
      setItin(snap.exists() ? { ...DEFAULT_ITIN, ...snap.data() } : DEFAULT_ITIN);
    } catch (e) {
      console.error("[firestore] error cargando itinerario:", e.message);
      setItin(DEFAULT_ITIN);
    }
    setItinLoading(false);
  };

  // Carga el progreso apenas se conoce la sesión, para que la tarjeta del
  // menú ya pueda mostrar "Día X de 40" sin esperar a que se abra el itinerario.
  useEffect(() => {
    loadItinerario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const hasCompletedToday = itin?.ultimaFechaCompletado === todayKey();
  const isFinished = (itin?.diaActual || 1) > 40;
  const maxViewable = itin ? Math.min(40, hasCompletedToday || isFinished ? itin.diaActual - 1 : itin.diaActual) : 1;

  const openLanding = () => { setView("landing"); setShowAnteriores(false); };

  const openDay = (n) => {
    setViewingDay(n);
    setNotaDraft(itin?.notas?.[n] || "");
    setView("day");
  };

  const handleCompletar = async () => {
    if (!itin || !user) return;
    setCompleting(true);
    const key = todayKey();
    const updated = {
      diaActual: viewingDay + 1,
      diasCompletados: { ...itin.diasCompletados, [viewingDay]: true },
      ultimaFechaCompletado: key,
      notas: notaDraft.trim() ? { ...itin.notas, [viewingDay]: notaDraft.trim() } : itin.notas,
    };
    try {
      await setDoc(itinRef, updated, { merge: true });
      setItin(updated);
      setNotaDraft("");
      setView(viewingDay === 40 ? "decalogo" : "landing");
    } catch (e) {
      console.error("[firestore] error completando itinerario:", e.message);
    }
    setCompleting(false);
  };

  const cards = [
    {
      id: "retos",
      title: lang === "es" ? "Retos de Fe" : "Faith Challenges",
      desc: lang === "es" ? "30 días con Cristo" : "30 days with Christ",
      icon: (
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
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
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
          <path d="M4 6.5 C4 5.1 5.1 4 6.5 4 H19.5 C20.9 4 22 5.1 22 6.5 V15 C22 16.4 20.9 17.5 19.5 17.5 H10 L5.5 21.5 V17.5 H6.5 C5.1 17.5 4 16.4 4 15 Z" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "quiz",
      title: lang === "es" ? "Quiz Bíblico" : "Bible Quiz",
      desc: lang === "es" ? "Pon a prueba tu fe" : "Put your faith to the test",
      icon: (
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
          <path d="M9.5 9.5 C9.5 7.6 11 6.2 13 6.2 C15 6.2 16.5 7.6 16.5 9.3 C16.5 11.8 13 11.6 13 14.5" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="13" cy="18.5" r="1.1" fill={GOLD}/>
        </svg>
      ),
    },
  ];

  const backBtn = (label, onClick) => (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "'Cormorant', serif" }}
    >
      ← {label}
    </button>
  );

  const noSessionBanner = () => (
    <div style={{ background: `${TERRACOTA}1a`, border: `1px solid ${TERRACOTA}66`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: CREAM, fontFamily: "'Work Sans', sans-serif", display: "flex", flexDirection: "column", gap: 10 }}>
      <span>{lang === "es" ? "Inicia sesión para guardar tu progreso día a día." : "Sign in to save your day-by-day progress."}</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => onRequireAuth && onRequireAuth("register")} style={{ padding: "7px 16px", background: `linear-gradient(135deg, ${NAVY}, ${NOCHE_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
          {lang === "es" ? "Crear cuenta" : "Create account"}
        </button>
        <span onClick={() => onRequireAuth && onRequireAuth("login")} style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}>
          {lang === "es" ? "¿Ya tienes cuenta? " : "Already have an account? "}
          <span style={{ color: TERRACOTA, fontWeight: "bold" }}>{lang === "es" ? "Inicia sesión" : "Sign in"}</span>
        </span>
      </div>
    </div>
  );

  // ── MENÚ ──────────────────────────────────────────────────────────────
  if (view === "menu") {
    const progresoTexto = !user
      ? (lang === "es" ? "Inicia sesión para comenzar" : "Sign in to get started")
      : isFinished
      ? (lang === "es" ? "Itinerario completado ✓" : "Itinerary completed ✓")
      : itin && (itin.diaActual > 1 || Object.keys(itin.diasCompletados || {}).length > 0)
      ? (lang === "es" ? `Día ${itin.diaActual} de 40` : `Day ${itin.diaActual} of 40`)
      : (lang === "es" ? "Comienza tu primer itinerario" : "Start your first itinerary");

    return (
      <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
        {backBtn(lang === "es" ? "Volver" : "Back", () => onBack && onBack())}

        {/* Itinerarios — tarjeta protagonista */}
        <div
          onClick={openLanding}
          style={{
            position: "relative", borderRadius: 18, overflow: "hidden", marginBottom: 20, cursor: "pointer",
            border: `1.5px solid ${TERRACOTA}`,
            background: `linear-gradient(135deg, ${rgba(TERRACOTA, 0.16)}, ${NAVY})`,
            padding: "22px 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: rgba(TERRACOTA, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CamineGlyph size={26} color={TERRACOTA} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", color: TERRACOTA, textTransform: "uppercase", letterSpacing: 1.5 }}>
                {lang === "es" ? "Itinerarios" : "Itineraries"}
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", lineHeight: 1.2 }}>
                {lang === "es" ? "40 Días con Santa Clara" : "40 Days with St. Clare"}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 14 }}>
            {lang === "es"
              ? "Un recorrido día a día por la vida de Santa Clara de Asís, hasta que su forma de amar te lleve de vuelta a Cristo."
              : "A day-by-day journey through the life of St. Clare of Assisi, until her way of loving brings you back to Christ."}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, fontWeight: "bold", color: TERRACOTA }}>{progresoTexto}</span>
            <span style={{ color: TERRACOTA, fontSize: 22, fontWeight: 300 }}>›</span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: "bold", marginBottom: 10 }}>
          {lang === "es" ? "Más de Joven Fe" : "More from Youth Faith"}
        </div>
        <div>
          {cards.map((c) => (
            <div
              key={c.id}
              onClick={() => {}}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: BG_CARD, border: `1px solid ${CREAM_DARK}55`,
                borderRadius: 12, padding: "12px 14px", marginBottom: 10, cursor: "pointer", opacity: 0.85,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {c.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif" }}>{c.title}</div>
                <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4 }}>{c.desc}</div>
              </div>
              <div style={{ color: MUTED, fontSize: 20, fontWeight: 300, flexShrink: 0 }}>›</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LANDING DEL ITINERARIO ──────────────────────────────────────────
  if (view === "landing") {
    return (
      <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
        {backBtn(lang === "es" ? "Joven Fe" : "Youth Faith", () => setView("menu"))}

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <CamineGlyph size={28} color={TERRACOTA} />
          <div style={{ fontSize: 20, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif" }}>
            {lang === "es" ? "40 Días con Santa Clara de Asís" : "40 Days with St. Clare of Assisi"}
          </div>
        </div>
        <div
          onClick={() => setView("acerca")}
          style={{ fontSize: 12.5, color: TERRACOTA, cursor: "pointer", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={TERRACOTA} strokeWidth="1.5"/>
            <line x1="12" y1="11" x2="12" y2="16.5" stroke={TERRACOTA} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="7.8" r="1" fill={TERRACOTA}/>
          </svg>
          {lang === "es" ? "Acerca de este itinerario" : "About this itinerary"}
        </div>

        {!user ? (
          noSessionBanner()
        ) : itinLoading || !itin ? (
          <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><HorebLoading size={32} /></div>
          </div>
        ) : (
          <>
            {isFinished ? (
              <div style={{ background: rgba(TERRACOTA, 0.12), border: `1px solid ${TERRACOTA}`, borderRadius: 14, padding: "18px 16px", marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: "bold", color: CREAM, marginBottom: 10, fontFamily: "'Cormorant', serif" }}>
                  {lang === "es" ? "Completaste los 40 días. Paz y Bien." : "You completed the 40 days. Peace and Good."}
                </div>
                <button
                  onClick={() => setView("decalogo")}
                  style={{ padding: "10px 24px", background: TERRACOTA, color: NAVY, border: "none", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}
                >
                  {lang === "es" ? "Ver el Decálogo de cierre" : "View the closing Ten Points"}
                </button>
              </div>
            ) : hasCompletedToday ? (
              <div style={{ background: rgba(TERRACOTA, 0.1), border: `1px solid ${TERRACOTA}55`, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.6 }}>
                  {lang === "es"
                    ? `Ya completaste tu día de hoy. El Día ${itin.diaActual} se abre mañana.`
                    : `You already completed today's day. Day ${itin.diaActual} opens tomorrow.`}
                </div>
              </div>
            ) : (
              <div style={{ background: BG_CARD, border: `1px solid ${CREAM_DARK}`, borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>
                  {itin.diaActual === 1 && !itin.diasCompletados[1]
                    ? (lang === "es" ? "Aún no has comenzado" : "You haven't started yet")
                    : (lang === "es" ? "Tu progreso" : "Your progress")}
                </div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: TERRACOTA, marginBottom: 14, fontFamily: "'Cormorant', serif" }}>
                  {lang === "es" ? `Día ${itin.diaActual} de 40` : `Day ${itin.diaActual} of 40`}
                </div>
                <button
                  onClick={() => openDay(itin.diaActual)}
                  style={{ width: "100%", padding: "12px", background: TERRACOTA, color: NAVY, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif" }}
                >
                  {itin.diaActual === 1 && !itin.diasCompletados[1]
                    ? (lang === "es" ? "Comenzar el Día 1" : "Start Day 1")
                    : (lang === "es" ? "Continuar" : "Continue")}
                </button>
              </div>
            )}

            {(itin.diaActual > 1 || isFinished) && (
              <div>
                <div
                  onClick={() => setShowAnteriores(v => !v)}
                  style={{ fontSize: 13, color: MUTED, cursor: "pointer", marginBottom: showAnteriores ? 10 : 0, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span style={{ display: "inline-block", transform: showAnteriores ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
                  {lang === "es" ? "Días anteriores" : "Previous days"}
                </div>
                {showAnteriores && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {Array.from({ length: Math.min(40, isFinished ? 40 : itin.diaActual - 1) }, (_, i) => i + 1).map(n => (
                      <div
                        key={n}
                        onClick={() => openDay(n)}
                        style={{ width: 40, height: 40, borderRadius: 10, background: BG_CARD, border: `1px solid ${CREAM_DARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", color: CREAM, cursor: "pointer" }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── DÍA ───────────────────────────────────────────────────────────────
  if (view === "day") {
    const dia = itinerarioClara.find(d => d.dia === viewingDay);
    const isLiveDay = itin && viewingDay === itin.diaActual && !hasCompletedToday && !isFinished;
    const isPastDay = itin && !!itin.diasCompletados[viewingDay];

    if (!dia) return null;

    return (
      <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
        {backBtn(lang === "es" ? "40 Días con Santa Clara" : "40 Days with St. Clare", () => setView("landing"))}

        <div style={{ background: `linear-gradient(135deg, ${rgba(TERRACOTA, 0.22)}, ${NOCHE_DARK})`, borderRadius: 14, padding: "16px 18px", marginBottom: 18, border: `1px solid ${TERRACOTA}55` }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: TERRACOTA, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
            {lang === "es" ? `Día ${dia.dia} de 40` : `Day ${dia.dia} of 40`}
          </div>
          <div style={{ fontSize: 19, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", lineHeight: 1.3 }}>
            {dia.titulo}
          </div>
        </div>

        {DAY_FIELDS.filter(f => dia[f.key]).map(f => (
          <div key={f.key} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: TERRACOTA, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
              {f.label[lang] || f.label.es}
            </div>
            <div style={{ fontSize: 14.5, color: CREAM, lineHeight: 1.75, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-line" }}>
              {dia[f.key]}
            </div>
          </div>
        ))}

        {isLiveDay ? (
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${CREAM_DARK}44` }}>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
              {lang === "es" ? "¿Quieres anotar algo de hoy? (opcional)" : "Want to write something about today? (optional)"}
            </div>
            <textarea
              value={notaDraft}
              onChange={e => setNotaDraft(e.target.value)}
              placeholder={lang === "es" ? "Escribe aquí, si quieres..." : "Write here, if you'd like..."}
              rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${CREAM_DARK}`, background: NOCHE_DARK, color: CREAM, fontSize: 14, fontFamily: "'Work Sans', sans-serif", resize: "vertical", boxSizing: "border-box", marginBottom: 14 }}
            />
            <button
              onClick={handleCompletar}
              disabled={completing}
              style={{ width: "100%", padding: "13px", background: TERRACOTA, color: NAVY, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: completing ? "default" : "pointer", opacity: completing ? 0.7 : 1, fontFamily: "'Cormorant', serif" }}
            >
              {completing
                ? (lang === "es" ? "Guardando..." : "Saving...")
                : (lang === "es" ? `Completar Día ${dia.dia}` : `Complete Day ${dia.dia}`)}
            </button>
          </div>
        ) : isPastDay && itin?.notas?.[viewingDay] ? (
          <div style={{ marginTop: 10, background: BG_CARD, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {lang === "es" ? "Lo que anotaste ese día" : "What you wrote that day"}
            </div>
            <div style={{ fontSize: 13.5, color: CREAM, lineHeight: 1.6 }}>{itin.notas[viewingDay]}</div>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={() => openDay(viewingDay - 1)}
            disabled={viewingDay <= 1}
            style={{ flex: 1, padding: "11px", background: "none", border: `1px solid ${viewingDay <= 1 ? CREAM_DARK : TERRACOTA}`, color: viewingDay <= 1 ? CREAM_DARK : CREAM, borderRadius: 12, fontSize: 13, cursor: viewingDay <= 1 ? "default" : "pointer", opacity: viewingDay <= 1 ? 0.5 : 1 }}
          >
            {lang === "es" ? "Anterior" : "Previous"}
          </button>
          <button
            onClick={() => openDay(viewingDay + 1)}
            disabled={viewingDay >= maxViewable || isLiveDay}
            style={{ flex: 1, padding: "11px", background: "none", border: `1px solid ${(viewingDay >= maxViewable || isLiveDay) ? CREAM_DARK : TERRACOTA}`, color: (viewingDay >= maxViewable || isLiveDay) ? CREAM_DARK : CREAM, borderRadius: 12, fontSize: 13, cursor: (viewingDay >= maxViewable || isLiveDay) ? "default" : "pointer", opacity: (viewingDay >= maxViewable || isLiveDay) ? 0.5 : 1 }}
          >
            {lang === "es" ? "Siguiente" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  // ── DECÁLOGO DE CIERRE ──────────────────────────────────────────────
  if (view === "decalogo") {
    return (
      <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
        {backBtn(lang === "es" ? "40 Días con Santa Clara" : "40 Days with St. Clare", () => setView("landing"))}

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <CamineGlyph size={36} color={TERRACOTA} />
          <div style={{ fontSize: 20, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginTop: 10 }}>
            {lang === "es" ? "Decálogo para vivir como Santa Clara de Asís" : "Ten Points for Living like St. Clare of Assisi"}
          </div>
        </div>

        {decalogoClara.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${TERRACOTA}`, color: TERRACOTA, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", flexShrink: 0, fontFamily: "'Cormorant', serif" }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginBottom: 3 }}>{d.titulo}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{d.descripcion}</div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", fontSize: 14, fontStyle: "italic", color: TERRACOTA, marginTop: 20, marginBottom: 24, lineHeight: 1.6, fontFamily: "'Cormorant', serif" }}>
          {decalogoClaraCierre}
        </div>

        <div
          onClick={() => setView("acerca")}
          style={{ fontSize: 12.5, color: TERRACOTA, cursor: "pointer", textAlign: "center", marginBottom: 10 }}
        >
          {lang === "es" ? "Acerca de este itinerario" : "About this itinerary"}
        </div>
      </div>
    );
  }

  // ── ACERCA DE ESTE ITINERARIO ───────────────────────────────────────
  if (view === "acerca") {
    const c = creditosItinerarioClara;
    return (
      <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
        {backBtn(lang === "es" ? "Volver" : "Back", () => setView("landing"))}

        <div style={{ fontSize: 19, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginBottom: 16 }}>
          {lang === "es" ? "Acerca de este itinerario" : "About this itinerary"}
        </div>

        <div style={{ fontSize: 13.5, color: CREAM, lineHeight: 1.7, marginBottom: 20 }}>{c.nota}</div>

        <div style={{ fontSize: 11, fontWeight: "bold", color: TERRACOTA, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
          {lang === "es" ? "Fuentes" : "Sources"}
        </div>
        <div style={{ marginBottom: 20 }}>
          {c.fuentes.map((f, i) => (
            <div key={i} style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 6, display: "flex", gap: 8 }}>
              <span style={{ color: TERRACOTA, flexShrink: 0 }}>•</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13.5, color: CREAM, lineHeight: 1.7, marginBottom: 20 }}>{c.origen}</div>

        <div style={{ borderTop: `1px solid ${CREAM_DARK}44`, paddingTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: TERRACOTA, fontFamily: "'Cormorant', serif" }}>{c.autor}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{c.rol} — {c.comunidad}</div>
        </div>
      </div>
    );
  }

  return null;
}
