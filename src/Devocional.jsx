import { useState } from "react";

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

export default function Devocional({ lang = "es", onBack }) {
  const [activeTab, setActiveTab] = useState("clasicas");
  const [expandedPrayer, setExpandedPrayer] = useState(null);

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
                fontSize: 12, fontWeight: "bold", cursor: "pointer",
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
      ) : (
        <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
          <div style={{ fontSize: 15 }}>
            {lang === "es" ? "Próximamente" : "Coming soon"}
          </div>
        </div>
      )}
    </div>
  );
}
