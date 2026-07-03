import { useState, useEffect } from "react";

const BG_MAIN = "#0A0F1E";
const BG_CARD = "#111827";
const GOLD = "#C9A84C";
const CREAM = "#FAF5ED";
const CREAM_DARK = "#2A3A5A";
const MUTED = "#8A9BB5";
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F1C32";
const WHITE = "#FFFFFF";

const TABS = [
  { id: "clasicas", es: "Oraciones Clásicas", en: "Classic Prayers" },
  { id: "novenas", es: "Novenas", en: "Novenas" },
  { id: "santo", es: "Santo del Día", en: "Saint of the Day" },
];

const CLASSIC_PRAYERS = {
  es: [
    {
      id: "angelus",
      title: "Angelus",
      text: "El Ángel del Señor anunció a María, y ella concibió por obra del Espíritu Santo. Dios te salve María...\nHe aquí la esclava del Señor, hágase en mí según tu palabra. Dios te salve María...\nY el Verbo se hizo carne y habitó entre nosotros. Dios te salve María...\nRuega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.",
    },
    {
      id: "magnificat",
      title: "Magnificat",
      text: "Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios, mi salvador; porque ha mirado la humillación de su esclava. Desde ahora me felicitarán todas las generaciones, porque el Poderoso ha hecho obras grandes por mí: su nombre es santo, y su misericordia llega a sus fieles de generación en generación. Él hace proezas con su brazo: dispersa a los soberbios de corazón, derriba del trono a los poderosos y enaltece a los humildes, a los hambrientos los colma de bienes y a los ricos los despide vacíos. Auxilia a Israel, su siervo, acordándose de la misericordia como lo había prometido a nuestros padres en favor de Abrahán y su descendencia por siempre. Amén.",
    },
    {
      id: "sanfrancisco",
      title: "Oración de San Francisco",
      text: "Señor, hazme instrumento de tu paz. Donde haya odio, que yo lleve el amor. Donde haya ofensa, el perdón. Donde haya discordia, la unión. Donde haya duda, la fe. Donde haya error, la verdad. Donde haya desesperación, la esperanza. Donde haya tristeza, la alegría. Donde haya tinieblas, la luz. Amén.",
    },
    {
      id: "actocontricion",
      title: "Acto de Contrición",
      text: "Señor mío Jesucristo, Dios y hombre verdadero, me pesa de todo corazón haberte ofendido, porque eres infinitamente bueno y porque el pecado te desagrada. Propongo firmemente, con tu gracia, confesarme, cumplir la penitencia, enmendarme y apartarme de las ocasiones de pecado. Amén.",
    },
    {
      id: "actodefe",
      title: "Acto de Fe",
      text: "Señor Dios, creo firmemente y confieso todas y cada una de las verdades que la Santa Iglesia Católica propone, porque Tú las revelaste, oh Dios, que eres la eterna Verdad y Sabiduría, que ni se engaña ni puede engañarnos. Quiero vivir y morir en esta fe. Amén.",
    },
    {
      id: "actodeesperanza",
      title: "Acto de Esperanza",
      text: "Señor Dios mío, espero por tu gracia la remisión de todos mis pecados, y después de esta vida, la felicidad eterna, porque Tú lo prometiste, que eres infinitamente poderoso, fiel, benigno y lleno de misericordia. Quiero vivir y morir en esta esperanza. Amén.",
    },
    {
      id: "actodecaridad",
      title: "Acto de Caridad",
      text: "Dios mío, te amo sobre todas las cosas y al prójimo por amor a Ti, porque Tú eres el infinito, sumo y perfecto Bien, digno de todo amor. Quiero vivir y morir en este amor. Amén.",
    },
    {
      id: "serenidad",
      title: "Oración de la Serenidad",
      text: "Dios, concédeme la serenidad para aceptar las cosas que no puedo cambiar, valor para cambiar las que sí puedo, y sabiduría para conocer la diferencia. Amén.",
    },
    {
      id: "subtuum",
      title: "Sub Tuum Praesidium",
      text: "Bajo tu amparo nos acogemos, Santa Madre de Dios. No deseches las súplicas que te dirigimos en nuestras necesidades, antes bien líbranos de todos los peligros, oh Virgen gloriosa y bendita. Amén.",
    },
    {
      id: "reginacaeli",
      title: "Regina Caeli",
      text: "Alégrate, Reina del Cielo, aleluya. Porque el Señor a quien mereciste llevar, aleluya. Ha resucitado según su palabra, aleluya. Ruega al Señor por nosotros, aleluya. Gózate y alégrate, Virgen María, aleluya. Porque verdaderamente ha resucitado el Señor, aleluya. Amén.",
    },
    {
      id: "avemarisstella",
      title: "Ave Maris Stella",
      text: "Dios te salve, estrella del mar, santa Madre de Dios, Virgen siempre bienaventurada, puerta del cielo. Tú que recibiste el Ave de labios de Gabriel, confirma nuestra paz, cambiando el nombre de Eva. Amén.",
    },
  ],
  en: [
    {
      id: "angelus",
      title: "Angelus",
      text: "The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Hail Mary...\nBehold the handmaid of the Lord, be it done unto me according to your word. Hail Mary...\nAnd the Word was made flesh, and dwelt among us. Hail Mary...\nPray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
    },
    {
      id: "magnificat",
      title: "Magnificat",
      text: "My soul proclaims the greatness of the Lord, my spirit rejoices in God my Savior, for he has looked with favor on his lowly servant. From this day all generations will call me blessed: the Almighty has done great things for me, and holy is his Name. He has mercy on those who fear him in every generation. He has shown the strength of his arm, and has scattered the proud in their conceit. He has cast down the mighty from their thrones, and has lifted up the lowly. He has filled the hungry with good things, and the rich he has sent away empty. He has come to the help of his servant Israel, for he has remembered his promise of mercy, the promise he made to our fathers, to Abraham and his children forever. Amen.",
    },
    {
      id: "sanfrancisco",
      title: "Prayer of St. Francis",
      text: "Lord, make me an instrument of your peace. Where there is hatred, let me sow love. Where there is injury, pardon. Where there is discord, union. Where there is doubt, faith. Where there is error, truth. Where there is despair, hope. Where there is sadness, joy. Where there is darkness, light. Amen.",
    },
    {
      id: "actocontricion",
      title: "Act of Contrition",
      text: "Lord Jesus Christ, true God and true man, my Creator, I am wholeheartedly sorry for having offended You, because You are infinitely good and because sin displeases You. I firmly resolve, with Your grace, to confess, fulfill my penance, amend my life, and avoid the near occasions of sin. Amen.",
    },
    {
      id: "actodefe",
      title: "Act of Faith",
      text: "Lord God, I firmly believe and confess each and every truth that the Holy Catholic Church proposes, because You revealed them, O God, who are eternal Truth and Wisdom, who can neither deceive nor be deceived. I want to live and die in this faith. Amen.",
    },
    {
      id: "actodeesperanza",
      title: "Act of Hope",
      text: "Lord my God, I hope by your grace for the forgiveness of all my sins, and after this life, eternal happiness, for You have promised it, who are infinitely powerful, faithful, kind, and full of mercy. I want to live and die in this hope. Amen.",
    },
    {
      id: "actodecaridad",
      title: "Act of Charity",
      text: "My God, I love You above all things and my neighbor for love of You, because You are the infinite, supreme, and perfect Good, worthy of all love. I want to live and die in this love. Amen.",
    },
    {
      id: "serenidad",
      title: "Serenity Prayer",
      text: "God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference. Amen.",
    },
    {
      id: "subtuum",
      title: "Sub Tuum Praesidium",
      text: "We fly to your patronage, O holy Mother of God. Despise not our petitions in our necessities, but deliver us always from all dangers, O glorious and blessed Virgin. Amen.",
    },
    {
      id: "reginacaeli",
      title: "Regina Caeli",
      text: "Queen of Heaven, rejoice, alleluia. For he whom you were worthy to bear, alleluia. Has risen as he said, alleluia. Pray for us to God, alleluia. Rejoice and be glad, Virgin Mary, alleluia. For the Lord has truly risen, alleluia. Amen.",
    },
    {
      id: "avemarisstella",
      title: "Ave Maris Stella",
      text: "Hail, star of the sea, nurturing Mother of God, and ever Virgin, happy gate of Heaven. Receiving that 'Ave' from Gabriel's lips, confirm us in peace, reversing Eva's name. Amen.",
    },
  ],
};

const NOVENA_CLOSING = {
  es: "Oh Corazón de Jesús, en quien confío, ten misericordia de mí.",
  en: "O Heart of Jesus, in whom I trust, have mercy on me.",
};

const NOVENAS = {
  es: [
    {
      id: "sagradocorazon",
      title: "Novena al Sagrado Corazón de Jesús",
      days: [
        "Oh Jesús, que has dicho: 'En verdad os digo que todo lo que pidáis al Padre en mi nombre, os lo dará.' Por los méritos de tu Sagrado Corazón te pido la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Todo es posible para el que cree.' Por los méritos de tu Sagrado Corazón, aumenta en mí la fe y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'No se turbe vuestro corazón, creed en Dios.' Por los méritos de tu Sagrado Corazón, fortalece en mí la esperanza y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Amaos los unos a los otros como yo os he amado.' Por los méritos de tu Sagrado Corazón, enciende en mí la caridad y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Aprended de mí, que soy manso y humilde de corazón.' Por los méritos de tu Sagrado Corazón, concédeme la humildad y la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Con vuestra paciencia salvaréis vuestras almas.' Por los méritos de tu Sagrado Corazón, dame paciencia y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Bienaventurados los limpios de corazón, porque ellos verán a Dios.' Por los méritos de tu Sagrado Corazón, purifica mi corazón y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'Amarás al Señor tu Dios con todo tu corazón.' Por los méritos de tu Sagrado Corazón, enciende en mí el amor a Dios y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
        "Oh Jesús, que has dicho: 'El que persevere hasta el fin, ese se salvará.' Por los méritos de tu Sagrado Corazón, dame perseverancia y concédeme la gracia de... (intención personal). Padre Nuestro, Ave María, Gloria.",
      ],
    },
  ],
  en: [
    {
      id: "sagradocorazon",
      title: "Novena to the Sacred Heart of Jesus",
      days: [
        "O Jesus, who has said: 'Truly I say to you, whatever you ask the Father in my name, he will give you.' Through the merits of your Sacred Heart, I ask for the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'All things are possible to him who believes.' Through the merits of your Sacred Heart, increase my faith and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'Let not your heart be troubled, believe in God.' Through the merits of your Sacred Heart, strengthen my hope and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'Love one another as I have loved you.' Through the merits of your Sacred Heart, kindle charity in me and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'Learn from me, for I am meek and humble of heart.' Through the merits of your Sacred Heart, grant me humility and the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'By your patience you will possess your souls.' Through the merits of your Sacred Heart, give me patience and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'Blessed are the pure of heart, for they shall see God.' Through the merits of your Sacred Heart, purify my heart and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'You shall love the Lord your God with all your heart.' Through the merits of your Sacred Heart, kindle in me the love of God and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
        "O Jesus, who has said: 'He who perseveres to the end will be saved.' Through the merits of your Sacred Heart, give me perseverance and grant me the grace of... (personal intention). Our Father, Hail Mary, Glory Be.",
      ],
    },
  ],
};

const DEFAULT_SAINT_KEY = "07-09"; // San Pedro Claver, patrono de Colombia

const SAINTS = {
  "07-01": {
    name: { es: "San Junípero Serra", en: "St. Junípero Serra" },
    bio: { es: "Franciscano que evangelizó las Américas. Fundó misiones en California.", en: "Franciscan who evangelized the Americas. Founded missions in California." },
    quote: { es: "Siempre adelante, nunca atrás.", en: "Always forward, never back." },
  },
  "07-02": {
    name: { es: "Visitación de la Virgen María", en: "Visitation of the Virgin Mary" },
    bio: { es: "María visita a su prima Isabel, quien llevaba en su seno a Juan el Bautista.", en: "Mary visits her cousin Elizabeth, who was carrying John the Baptist in her womb." },
    quote: { es: "Mi alma glorifica al Señor.", en: "My soul magnifies the Lord." },
  },
  "07-03": {
    name: { es: "Santo Tomás Apóstol", en: "St. Thomas the Apostle" },
    bio: { es: "Apóstol que pasó de la duda a proclamar '¡Señor mío y Dios mío!'", en: "Apostle who went from doubt to proclaiming 'My Lord and my God!'" },
    quote: { es: "Señor mío y Dios mío.", en: "My Lord and my God." },
  },
  "07-04": {
    name: { es: "Santa Isabel de Portugal", en: "St. Elizabeth of Portugal" },
    bio: { es: "Reina y pacificadora, amada por su caridad con los pobres.", en: "Queen and peacemaker, beloved for her charity toward the poor." },
    quote: { es: "La paz es fruto de la justicia.", en: "Peace is the fruit of justice." },
  },
  "07-05": {
    name: { es: "San Antonio María Zaccaria", en: "St. Anthony Mary Zaccaria" },
    bio: { es: "Renovó la vida cristiana en Italia con amor a la Eucaristía.", en: "Renewed Christian life in Italy with love for the Eucharist." },
    quote: { es: "La cruz es la llave del cielo.", en: "The cross is the key to heaven." },
  },
  "07-06": {
    name: { es: "Santa María Goretti", en: "St. Maria Goretti" },
    bio: { es: "Mártir de 12 años que murió perdonando, muy venerada en Colombia.", en: "12-year-old martyr who died forgiving, deeply venerated in Colombia." },
    quote: { es: "Lo perdono y quiero que esté conmigo en el cielo.", en: "I forgive him, and I want him with me in heaven." },
  },
  "07-07": {
    name: { es: "Beato Pedro Favre", en: "Blessed Peter Faber" },
    bio: { es: "Primer jesuita ordenado sacerdote, compañero de San Ignacio.", en: "First Jesuit ordained a priest, companion of St. Ignatius." },
    quote: { es: "Todo para la mayor gloria de Dios.", en: "All for the greater glory of God." },
  },
  "07-08": {
    name: { es: "Santa Priscila", en: "St. Priscilla" },
    bio: { es: "Compañera de San Pablo, abrió su hogar para la Iglesia primitiva.", en: "Companion of St. Paul, opened her home to the early Church." },
    quote: { es: "La hospitalidad es una forma de amor.", en: "Hospitality is a form of love." },
  },
  "07-09": {
    name: { es: "San Pedro Claver", en: "St. Peter Claver" },
    bio: { es: "Apóstol de los esclavos en Cartagena, Colombia. Patrono de Colombia.", en: "Apostle to enslaved people in Cartagena, Colombia. Patron saint of Colombia." },
    quote: { es: "Esclavo de los negros para siempre.", en: "Slave of the Black people forever." },
  },
  "07-10": {
    name: { es: "San Agustín Zhao Rong", en: "St. Augustine Zhao Rong" },
    bio: { es: "Mártir chino, representante de los mártires de Asia.", en: "Chinese martyr, representative of the martyrs of Asia." },
    quote: { es: "La sangre de los mártires es semilla de cristianos.", en: "The blood of martyrs is the seed of Christians." },
  },
  "07-11": {
    name: { es: "San Benito de Nursia", en: "St. Benedict of Nursia" },
    bio: { es: "Padre del monaquismo occidental. Su regla transformó Europa.", en: "Father of Western monasticism. His rule transformed Europe." },
    quote: { es: "Ora et Labora — Reza y trabaja.", en: "Ora et Labora — Pray and work." },
  },
  "07-12": {
    name: { es: "San Juan Gualberto", en: "St. John Gualbert" },
    bio: { es: "Perdonó al asesino de su hermano ante el crucifijo que lo aprobó.", en: "Forgave his brother's murderer before the crucifix that approved of it." },
    quote: { es: "El perdón libera más al que perdona que al perdonado.", en: "Forgiveness frees the one who forgives more than the one forgiven." },
  },
  "07-13": {
    name: { es: "San Enrique II", en: "St. Henry II" },
    bio: { es: "Emperador cristiano que gobernó con justicia y piedad.", en: "Christian emperor who ruled with justice and piety." },
    quote: { es: "El poder es un servicio, no un privilegio.", en: "Power is a service, not a privilege." },
  },
  "07-14": {
    name: { es: "San Camilo de Lelis", en: "St. Camillus de Lellis" },
    bio: { es: "Fundador de los Camilos, patrono de enfermos y personal de salud.", en: "Founder of the Camillians, patron of the sick and healthcare workers." },
    quote: { es: "Ver a Cristo en el rostro del enfermo.", en: "To see Christ in the face of the sick." },
  },
  "07-15": {
    name: { es: "San Buenaventura", en: "St. Bonaventure" },
    bio: { es: "Doctor de la Iglesia, maestro de teología y mística franciscana.", en: "Doctor of the Church, master of theology and Franciscan mysticism." },
    quote: { es: "El camino hacia Dios pasa por el amor.", en: "The path to God passes through love." },
  },
};

function getTodaySaintKey() {
  const todayISO = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date()); // YYYY-MM-DD
  return todayISO.slice(5); // MM-DD
}

function formatSaintDate(monthDay, lang) {
  const [month, day] = monthDay.split("-").map(Number);
  const d = new Date(2000, month - 1, day);
  return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long" }).format(d);
}

export default function Devocional({ lang = "es", onBack }) {
  const [activeTab, setActiveTab] = useState("clasicas");
  const [expandedPrayer, setExpandedPrayer] = useState(null);
  const [expandedNovena, setExpandedNovena] = useState(null);
  const [novenaDay, setNovenaDay] = useState({});

  useEffect(() => {
    if (activeTab !== "novenas") {
      setExpandedNovena(null);
    }
  }, [activeTab]);

  return (
    <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
      <button
        onClick={() => onBack && onBack()}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "'Cinzel', serif" }}
      >
        ← {lang === "es" ? "Volver" : "Back"}
      </button>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {TABS.map((t) => {
          const sel = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: "9px 4px", borderRadius: 12,
                background: sel ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : BG_CARD,
                color: sel ? WHITE : MUTED,
                border: `1px solid ${sel ? GOLD + "66" : CREAM_DARK}`,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Crimson Text', serif", textAlign: "center", lineHeight: 1.3,
              }}
            >
              {lang === "es" ? t.es : t.en}
            </button>
          );
        })}
      </div>

      {activeTab === "clasicas" ? (
        <div>
          {CLASSIC_PRAYERS[lang].map((p) => {
            const open = expandedPrayer === p.id;
            return (
              <div
                key={p.id}
                style={{
                  background: BG_CARD, borderRadius: 14, marginBottom: 12, overflow: "hidden",
                  border: `1px solid ${open ? GOLD : CREAM_DARK}`,
                  transition: "border-color 0.2s ease",
                }}
              >
                <button
                  onClick={() => setExpandedPrayer(open ? null : p.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
                    color: CREAM, fontSize: 15, fontWeight: "bold", fontFamily: "'Cinzel', serif",
                  }}
                >
                  <span>{p.title}</span>
                  <span style={{ color: GOLD, fontSize: 14, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </button>
                <div
                  style={{
                    maxHeight: open ? 600 : 0,
                    opacity: open ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                  }}
                >
                  <div style={{ padding: "0 16px 16px", fontSize: 14, lineHeight: 1.8, color: CREAM, fontFamily: "'Crimson Text', serif", whiteSpace: "pre-wrap" }}>
                    {p.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === "novenas" ? (
        <div>
          {NOVENAS[lang].map((n) => {
            const open = expandedNovena === n.id;
            const day = novenaDay[n.id] || 1;
            const setDay = (d) => setNovenaDay((prev) => ({ ...prev, [n.id]: Math.min(9, Math.max(1, d)) }));
            return (
              <div
                key={n.id}
                style={{
                  background: BG_CARD, borderRadius: 14, marginBottom: 12, overflow: "hidden",
                  border: `1px solid ${open ? GOLD : CREAM_DARK}`,
                  transition: "border-color 0.2s ease",
                }}
              >
                <button
                  onClick={() => setExpandedNovena(open ? null : n.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
                    color: CREAM, fontSize: 15, fontWeight: "bold", fontFamily: "'Cinzel', serif",
                  }}
                >
                  <span>{n.title}</span>
                  <span style={{ color: GOLD, fontSize: 14, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </button>
                <div
                  style={{
                    maxHeight: open ? 700 : 0,
                    opacity: open ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                  }}
                >
                  <div style={{ padding: "0 16px 18px" }}>
                    <div style={{ textAlign: "center", fontSize: 12, color: GOLD, letterSpacing: 1, marginBottom: 10, fontFamily: "'Cinzel', serif" }}>
                      {lang === "es" ? `Día ${day} de 9` : `Day ${day} of 9`}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: CREAM, fontFamily: "'Crimson Text', serif", marginBottom: 14 }}>
                      {n.days[day - 1]}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: GOLD, fontStyle: "italic", fontFamily: "'Crimson Text', serif", marginBottom: 16 }}>
                      {NOVENA_CLOSING[lang]}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => setDay(day - 1)}
                        disabled={day === 1}
                        style={{ flex: 1, padding: "10px", background: NAVY_DARK, color: day === 1 ? MUTED : CREAM, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 13, cursor: day === 1 ? "default" : "pointer", fontFamily: "'Cinzel', serif", opacity: day === 1 ? 0.5 : 1 }}
                      >
                        ← {lang === "es" ? "Anterior" : "Previous"}
                      </button>
                      <button
                        onClick={() => setDay(day + 1)}
                        disabled={day === 9}
                        style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 13, cursor: day === 9 ? "default" : "pointer", fontFamily: "'Cinzel', serif", opacity: day === 9 ? 0.5 : 1 }}
                      >
                        {lang === "es" ? "Siguiente" : "Next"} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        (() => {
          const key = getTodaySaintKey();
          const saint = SAINTS[key] || SAINTS[DEFAULT_SAINT_KEY];
          const dateKey = SAINTS[key] ? key : DEFAULT_SAINT_KEY;
          return (
            <div>
              <div style={{ textAlign: "center", fontSize: 12, color: GOLD, marginBottom: 12, fontFamily: "'Cinzel', serif" }}>
                ✨ {lang === "es" ? "Hoy celebramos a" : "Today we celebrate"}
              </div>
              <div style={{ background: BG_CARD, borderRadius: 14, border: `1px solid ${CREAM_DARK}`, padding: 20 }}>
                <div style={{ fontSize: 20, fontWeight: "bold", color: GOLD, fontFamily: "'Cinzel', serif", marginBottom: 6 }}>
                  {saint.name[lang]}
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
                  {formatSaintDate(dateKey, lang)}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: CREAM, fontFamily: "'Crimson Text', serif", marginBottom: 16 }}>
                  {saint.bio[lang]}
                </div>
                <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, fontSize: 14, fontStyle: "italic", color: GOLD, fontFamily: "'Crimson Text', serif", lineHeight: 1.6 }}>
                  "{saint.quote[lang]}"
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
