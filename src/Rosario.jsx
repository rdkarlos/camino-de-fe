import { useState } from "react";

const BG_MAIN = "#0A0F1E";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C76A";
const CREAM = "#FAF5ED";
const CREAM_DARK = "#2A3A5A";
const MUTED = "#8A9BB5";
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F1C32";

const SECTIONS = {
  es: ["Oraciones Iniciales", "Los Misterios", "Intenciones del Papa", "Salve Regina"],
  en: ["Opening Prayers", "The Mysteries", "Intentions of the Pope", "Hail Holy Queen"],
};

const OPENING_PRAYERS = {
  es: [
    { title: "Señal de la Cruz", text: "En el nombre del Padre, del Hijo y del Espíritu Santo. Amén." },
    { title: "Persignarse", text: "Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor Dios nuestro. En el nombre del Padre, del Hijo y del Espíritu Santo. Amén." },
    { title: "Acto de Contrición", text: "Señor mío Jesucristo, Dios y hombre verdadero, me pesa de todo corazón haberte ofendido, porque eres infinitamente bueno y porque el pecado te desagrada. Propongo firmemente, con tu gracia, confesarme, cumplir la penitencia, enmendarme y apartarme de las ocasiones de pecado. Amén." },
    { title: "Credo de los Apóstoles", text: "Creo en Dios Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén." },
  ],
  en: [
    { title: "Sign of the Cross", text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen." },
    { title: "Sign of the Holy Cross", text: "By the sign of the Holy Cross, deliver us from our enemies, O Lord our God. In the name of the Father, and of the Son, and of the Holy Spirit. Amen." },
    { title: "Act of Contrition", text: "Lord Jesus Christ, true God and true man, my Creator, I am wholeheartedly sorry for having offended You, because You are infinitely good and because sin displeases You. I firmly resolve, with Your grace, to confess, fulfill my penance, amend my life, and avoid the near occasions of sin. Amen." },
    { title: "Apostles' Creed", text: "I believe in God, the Father almighty, Creator of heaven and earth. I believe in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen." },
  ],
};

const MYSTERY_SETS = {
  es: {
    gozosos:   { label: "Misterios Gozosos",   items: ["La Anunciación", "La Visitación", "El Nacimiento", "La Presentación", "El Niño Jesús en el Templo"] },
    dolorosos: { label: "Misterios Dolorosos", items: ["La Oración en el Huerto", "La Flagelación", "La Coronación de Espinas", "Jesús con la Cruz", "La Crucifixión"] },
    gloriosos: { label: "Misterios Gloriosos", items: ["La Resurrección", "La Ascensión", "Pentecostés", "La Asunción", "La Coronación de María"] },
    luminosos: { label: "Misterios Luminosos", items: ["El Bautismo de Jesús", "Las Bodas de Caná", "El Anuncio del Reino", "La Transfiguración", "La Eucaristía"] },
  },
  en: {
    gozosos:   { label: "Joyful Mysteries",    items: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation", "The Finding in the Temple"] },
    dolorosos: { label: "Sorrowful Mysteries", items: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"] },
    gloriosos: { label: "Glorious Mysteries",  items: ["The Resurrection", "The Ascension", "Pentecost", "The Assumption", "The Coronation of Mary"] },
    luminosos: { label: "Luminous Mysteries",  items: ["The Baptism of Jesus", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"] },
  },
};

function todayMysteryKey() {
  const day = new Date().getDay(); // 0=domingo ... 6=sábado
  if (day === 1 || day === 6) return "gozosos";
  if (day === 2 || day === 5) return "dolorosos";
  if (day === 3 || day === 0) return "gloriosos";
  return "luminosos"; // jueves
}

const OUR_FATHER = {
  es: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
  en: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
};

const HAIL_MARY = {
  es: "Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
  en: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
};

const GLORY_BE = {
  es: "Gloria al Padre, al Hijo y al Espíritu Santo, como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  en: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
};

const JACULATORIA = {
  es: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
  en: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those most in need of Your mercy.",
};

const POPE_INTRO = {
  es: "Rezamos un Padre Nuestro, tres Ave Marías y un Gloria por las intenciones del Santo Padre el Papa.",
  en: "We pray one Our Father, three Hail Marys, and one Glory Be for the intentions of the Holy Father, the Pope.",
};

const SALVE_REGINA = {
  es: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra. Dios te salve. A ti llamamos los desterrados hijos de Eva. A ti suspiramos gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos. Y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.",
  en: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
};

function buildMysteryPages(lang, mysteryKey) {
  const set = MYSTERY_SETS[lang][mysteryKey];
  const pages = [];
  set.items.forEach((name, mi) => {
    pages.push({ part: 1, stepIndex: 0, stepCount: 5, mysteryIndex: mi, mysteryStepIndex: 0, kind: "title", title: `${lang === "es" ? "Misterio" : "Mystery"} ${mi + 1}: ${name}`, text: null });
    pages.push({ part: 1, stepIndex: 1, stepCount: 5, mysteryIndex: mi, mysteryStepIndex: 1, kind: "ourFather", title: lang === "es" ? "Padre Nuestro" : "Our Father", text: OUR_FATHER[lang] });
    pages.push({ part: 1, stepIndex: 2, stepCount: 5, mysteryIndex: mi, mysteryStepIndex: 2, kind: "aveMaria", counterId: `myst-${mi}`, total: 10, title: lang === "es" ? "10 Ave Marías" : "10 Hail Marys", text: HAIL_MARY[lang] });
    pages.push({ part: 1, stepIndex: 3, stepCount: 5, mysteryIndex: mi, mysteryStepIndex: 3, kind: "glory", title: lang === "es" ? "Gloria" : "Glory Be", text: GLORY_BE[lang] });
    pages.push({ part: 1, stepIndex: 4, stepCount: 5, mysteryIndex: mi, mysteryStepIndex: 4, kind: "jaculatoria", title: lang === "es" ? "Jaculatoria" : "Ejaculatory Prayer", text: JACULATORIA[lang] });
  });
  return pages;
}

function buildPopePages(lang) {
  return [
    { part: 2, stepIndex: 0, stepCount: 4, kind: "title", title: lang === "es" ? "Por las intenciones del Santo Padre" : "For the Intentions of the Holy Father", text: POPE_INTRO[lang] },
    { part: 2, stepIndex: 1, stepCount: 4, kind: "ourFather", title: lang === "es" ? "Padre Nuestro" : "Our Father", text: OUR_FATHER[lang] },
    { part: 2, stepIndex: 2, stepCount: 4, kind: "aveMaria", counterId: "pope", total: 3, title: lang === "es" ? "3 Ave Marías" : "3 Hail Marys", text: HAIL_MARY[lang] },
    { part: 2, stepIndex: 3, stepCount: 4, kind: "glory", title: lang === "es" ? "Gloria" : "Glory Be", text: GLORY_BE[lang] },
  ];
}

function buildSalvePages(lang) {
  return [
    { part: 3, stepIndex: 0, stepCount: 2, kind: "salve", title: lang === "es" ? "Salve Regina" : "Hail Holy Queen", text: SALVE_REGINA[lang] },
    { part: 3, stepIndex: 1, stepCount: 2, kind: "complete", title: lang === "es" ? "¡Has completado el Santo Rosario!" : "You have completed the Holy Rosary!", text: lang === "es" ? "Que la Virgen María interceda por ti." : "May the Virgin Mary intercede for you." },
  ];
}

function buildPages(lang, mysteryKey) {
  const openingPages = OPENING_PRAYERS[lang].map((p, i) => ({
    part: 0, stepIndex: i, stepCount: OPENING_PRAYERS[lang].length,
    kind: "opening", title: p.title, text: p.text,
  }));
  return [...openingPages, ...buildMysteryPages(lang, mysteryKey), ...buildPopePages(lang), ...buildSalvePages(lang)];
}

export default function Rosario({ lang = "es", onHome }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [aveCounts, setAveCounts] = useState({});
  const mysteryKey = todayMysteryKey();
  const partTitles = SECTIONS[lang];
  const pages = buildPages(lang, mysteryKey);
  const page = pages[pageIndex];
  const todayLabel = MYSTERY_SETS[lang][mysteryKey].label;

  const goNext = () => setPageIndex(p => Math.min(pages.length - 1, p + 1));
  const goPrev = () => setPageIndex(p => Math.max(0, p - 1));
  const goRestart = () => { setAveCounts({}); setPageIndex(0); };

  const handleAveMariaTap = (counterId, total) => {
    const current = aveCounts[counterId] || 0;
    if (current >= total) return;
    if (navigator.vibrate) navigator.vibrate(50);
    const next = current + 1;
    setAveCounts(prev => ({ ...prev, [counterId]: next }));
    if (next === total) {
      setTimeout(goNext, 400);
    }
  };

  let subLabel = null;
  if (page.part === 1) {
    subLabel = lang === "es"
      ? `Misterio ${page.mysteryIndex + 1} de 5 · Paso ${page.mysteryStepIndex + 1} de 5`
      : `Mystery ${page.mysteryIndex + 1} of 5 · Step ${page.mysteryStepIndex + 1} of 5`;
  } else if (page.stepCount > 1) {
    subLabel = lang === "es" ? `Paso ${page.stepIndex + 1} de ${page.stepCount}` : `Step ${page.stepIndex + 1} of ${page.stepCount}`;
  }

  const isComplete = page.kind === "complete";

  return (
    <div style={{ minHeight: "100vh", background: BG_MAIN, color: CREAM, padding: "20px 20px 90px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {/* Barra de progreso */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {partTitles.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= page.part ? GOLD : CREAM_DARK, transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Insignia del misterio de hoy */}
      {page.part === 1 && (
        <div style={{ textAlign: "center", fontSize: 12, color: GOLD, marginBottom: 12, fontFamily: "'Cinzel', serif" }}>
          ✨ {lang === "es" ? "Hoy rezamos los" : "Today's mysteries"}: {todayLabel}
        </div>
      )}

      {/* Contenido central */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflowY: "auto" }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          {!isComplete && (
            <div style={{ fontSize: 12, color: GOLD, letterSpacing: 1, marginBottom: 10, fontFamily: "'Cinzel', serif" }}>
              {lang === "es" ? `Parte ${page.part + 1} de ${partTitles.length}` : `Part ${page.part + 1} of ${partTitles.length}`}
              {subLabel && ` · ${subLabel}`}
            </div>
          )}

          {isComplete ? (
            <div>
              <div style={{ fontSize: 64, marginBottom: 18 }}>✝️</div>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cinzel', serif", color: GOLD, marginBottom: 12 }}>
                {page.title}
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.7, color: CREAM, fontFamily: "'Crimson Text', serif", marginBottom: 28 }}>
                {page.text}
              </div>
              <button
                onClick={goRestart}
                style={{ padding: "13px 28px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, border: "none", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif", boxShadow: `0 0 24px ${GOLD}55` }}
              >
                🔄 {lang === "es" ? "Rezar de nuevo" : "Pray again"}
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cinzel', serif", marginBottom: page.text ? 18 : 0 }}>
                {page.title}
              </div>

              {page.kind === "aveMaria" ? (
                <>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: CREAM, fontFamily: "'Crimson Text', serif", fontStyle: "italic", marginBottom: 24 }}>
                    {page.text}
                  </div>
                  <div
                    onClick={() => handleAveMariaTap(page.counterId, page.total)}
                    style={{
                      width: 140, height: 140, borderRadius: "50%", margin: "0 auto",
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", userSelect: "none",
                      boxShadow: `0 0 28px ${GOLD}66`,
                    }}
                  >
                    <span style={{ fontSize: 46, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cinzel', serif" }}>
                      {aveCounts[page.counterId] || 0}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, maxWidth: 220, margin: "18px auto 0" }}>
                    {Array.from({ length: page.total }).map((_, i) => (
                      <div key={i} style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: i < (aveCounts[page.counterId] || 0) ? GOLD : "transparent",
                        border: `2px solid ${GOLD}`, transition: "background 0.2s",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 14 }}>
                    {lang === "es" ? "Toca el círculo para contar" : "Tap the circle to count"}
                  </div>
                </>
              ) : page.text ? (
                <div style={{ fontSize: 18, lineHeight: 1.8, color: CREAM, fontFamily: "'Crimson Text', serif", whiteSpace: "pre-wrap" }}>
                  {page.text}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div style={{ position: "fixed", bottom: 20, left: 0, right: 0, padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
          <button
            onClick={goPrev}
            disabled={pageIndex === 0}
            style={{ flex: 1, padding: "12px", background: NAVY_DARK, color: pageIndex === 0 ? CREAM_DARK : CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === 0 ? "default" : "pointer", fontFamily: "'Cinzel', serif", opacity: pageIndex === 0 ? 0.5 : 1 }}
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
          {!isComplete && (
            <button
              onClick={goNext}
              disabled={pageIndex === pages.length - 1}
              style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === pages.length - 1 ? "default" : "pointer", fontFamily: "'Cinzel', serif", opacity: pageIndex === pages.length - 1 ? 0.5 : 1 }}
            >
              {lang === "es" ? "Siguiente" : "Next"} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
