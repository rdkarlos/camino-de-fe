import { useState } from "react";

const translations = {
  es: {
    appName: "Camino de Fe",
    tagline: "Cada día, un paso más cerca de Dios",
    nav: ["Inicio", "Evangelio", "Rosario", "Oraciones", "Reflexiones", "Tienda"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Evangelio del Día", desc: "Juan 15:12 — «Ámense los unos a los otros como yo los he amado.»", btn: "Leer más" },
        { icon: "📿", title: "Santo Rosario", desc: "Misterios Gloriosos · Miércoles y Domingos", btn: "Comenzar" },
        { icon: "🕯️", title: "Oración de la Mañana", desc: "Comienza el día con gratitud y entrega a Dios.", btn: "Rezar" },
      ],
      reminder: "🔔 Recordatorio activo: Ángelus · 12:00 PM",
    },
    gospel: {
      title: "Evangelio del Día",
      reading: "Evangelio según San Juan 15, 9-17",
      text: "En aquel tiempo, Jesús dijo a sus discípulos: «Como el Padre me ha amado, así también yo los he amado a ustedes. Permanezcan en mi amor. Si guardan mis mandamientos, permanecerán en mi amor, igual que yo he guardado los mandamientos de mi Padre y permanezco en su amor.\n\nLes digo estas cosas para que mi alegría esté en ustedes y su alegría sea plena. Este es mi mandamiento: que se amen los unos a los otros como yo los he amado.»",
      reflection: "💭 Reflexión: Hoy el Señor nos invita a permanecer en su amor no solo con palabras, sino con obras concretas hacia quienes nos rodean.",
    },
    rosary: {
      title: "Santo Rosario",
      mysteries: ["Misterios Gozosos", "Misterios Luminosos", "Misterios Dolorosos", "Misterios Gloriosos"],
      today: "Misterios Gloriosos",
      steps: [
        "✝️ Señal de la Cruz",
        "📿 Credo Apostólico",
        "🙏 Padre Nuestro",
        "💛 3 Ave Marías",
        "⭐ Gloria",
        "🌟 1er Misterio: La Resurrección",
        "🌟 2do Misterio: La Ascensión",
        "🌟 3er Misterio: Pentecostés",
        "🌟 4to Misterio: La Asunción",
        "🌟 5to Misterio: La Coronación",
        "✝️ Salve Regina",
      ],
    },
    prayers: {
      title: "Oraciones",
      list: [
        { name: "Padre Nuestro", text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo..." },
        { name: "Ave María", text: "Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús..." },
        { name: "Gloria", text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén." },
        { name: "Ángelus", text: "El ángel del Señor anunció a María, y concibió por obra del Espíritu Santo. Dios te salve, María..." },
      ],
    },
    reflections: {
      title: "Reflexiones",
      daily: [
        { quote: "«La oración es el oxígeno del alma.»", author: "San Pío de Pietrelcina" },
        { quote: "«No tengas miedo de amar a Dios. Él siempre te amó primero.»", author: "San Juan Pablo II" },
        { quote: "«Haz el bien hoy, aunque no lo recuerdes mañana.»", author: "Santa Teresa de Calcuta" },
      ],
    },
    shop: {
      title: "Tienda",
      subtitle: "Artículos para acompañar tu fe",
      items: [
        { name: "Rosario de madera", price: "$12.99", icon: "📿", tag: "Más vendido" },
        { name: "Biblia Católica", price: "$24.99", icon: "📖", tag: "Nuevo" },
        { name: "Vela votiva", price: "$8.50", icon: "🕯️", tag: "" },
        { name: "Medalla de la Virgen", price: "$15.00", icon: "✨", tag: "Popular" },
        { name: "Libro de oraciones", price: "$18.00", icon: "📔", tag: "" },
        { name: "Cruz de pared", price: "$29.99", icon: "✝️", tag: "Artesanal" },
      ],
    },
  },
  en: {
    appName: "Path of Faith",
    tagline: "Every day, one step closer to God",
    nav: ["Home", "Gospel", "Rosary", "Prayers", "Reflections", "Shop"],
    home: {
      greeting: "May the peace of the Lord be with you",
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Gospel of the Day", desc: "John 15:12 — «Love one another as I have loved you.»", btn: "Read more" },
        { icon: "📿", title: "Holy Rosary", desc: "Glorious Mysteries · Wednesday & Sunday", btn: "Begin" },
        { icon: "🕯️", title: "Morning Prayer", desc: "Start your day with gratitude and surrender to God.", btn: "Pray" },
      ],
      reminder: "🔔 Active reminder: Angelus · 12:00 PM",
    },
    gospel: {
      title: "Gospel of the Day",
      reading: "Gospel of John 15, 9-17",
      text: "At that time, Jesus said to his disciples: «As the Father has loved me, so I have loved you. Remain in my love. If you keep my commandments, you will remain in my love, just as I have kept my Father's commandments and remain in his love.\n\nI have told you these things so that my joy may be in you and your joy may be complete. This is my commandment: love one another as I have loved you.»",
      reflection: "💭 Reflection: Today the Lord invites us to remain in his love not only with words, but with concrete actions toward those around us.",
    },
    rosary: {
      title: "Holy Rosary",
      mysteries: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
      today: "Glorious Mysteries",
      steps: [
        "✝️ Sign of the Cross",
        "📿 Apostles' Creed",
        "🙏 Our Father",
        "💛 3 Hail Marys",
        "⭐ Glory Be",
        "🌟 1st Mystery: The Resurrection",
        "🌟 2nd Mystery: The Ascension",
        "🌟 3rd Mystery: Pentecost",
        "🌟 4th Mystery: The Assumption",
        "🌟 5th Mystery: The Coronation",
        "✝️ Hail Holy Queen",
      ],
    },
    prayers: {
      title: "Prayers",
      list: [
        { name: "Our Father", text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven..." },
        { name: "Hail Mary", text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus..." },
        { name: "Glory Be", text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen." },
        { name: "Angelus", text: "The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Hail Mary..." },
      ],
    },
    reflections: {
      title: "Reflections",
      daily: [
        { quote: "«Prayer is the oxygen of the soul.»", author: "St. Pio of Pietrelcina" },
        { quote: "«Do not be afraid to love God. He always loved you first.»", author: "St. John Paul II" },
        { quote: "«Do good today, even if you won't remember it tomorrow.»", author: "St. Teresa of Calcutta" },
      ],
    },
    shop: {
      title: "Shop",
      subtitle: "Items to accompany your faith",
      items: [
        { name: "Wooden Rosary", price: "$12.99", icon: "📿", tag: "Best Seller" },
        { name: "Catholic Bible", price: "$24.99", icon: "📖", tag: "New" },
        { name: "Votive Candle", price: "$8.50", icon: "🕯️", tag: "" },
        { name: "Virgin Mary Medal", price: "$15.00", icon: "✨", tag: "Popular" },
        { name: "Prayer Book", price: "$18.00", icon: "📔", tag: "" },
        { name: "Wall Cross", price: "$29.99", icon: "✝️", tag: "Handmade" },
      ],
    },
  },
};

const GOLD = "#C9A84C";
const DEEP = "#1B2A4A";
const CREAM = "#FAF7F2";
const LIGHT_GOLD = "#F5EDD6";
const MUTED = "#6B7A99";

export default function App() {
  const [lang, setLang] = useState("es");
  const [tab, setTab] = useState(0);
  const [rosaryStep, setRosaryStep] = useState(0);
  const [openPrayer, setOpenPrayer] = useState(null);
  const [cart, setCart] = useState([]);

  const t = translations[lang];

  const styles = {
    app: { fontFamily: "'Georgia', serif", background: CREAM, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.15)" },
    header: { background: `linear-gradient(135deg, ${DEEP} 0%, #2C4270 100%)`, padding: "20px 20px 0", color: "white" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    appName: { fontSize: 22, fontWeight: "bold", letterSpacing: 1, color: GOLD },
    langToggle: { display: "flex", gap: 6 },
    langBtn: (active) => ({ padding: "4px 10px", borderRadius: 20, border: `1px solid ${active ? GOLD : "rgba(255,255,255,0.3)"}`, background: active ? GOLD : "transparent", color: active ? DEEP : "white", fontSize: 12, cursor: "pointer", fontWeight: active ? "bold" : "normal" }),
    tagline: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontStyle: "italic", marginBottom: 16 },
    nav: { display: "flex", overflowX: "auto", gap: 0, borderTop: "1px solid rgba(255,255,255,0.1)" },
    navBtn: (active) => ({ padding: "10px 14px", fontSize: 11, color: active ? GOLD : "rgba(255,255,255,0.6)", borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent", background: "none", border: "none", borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Georgia, serif" }),
    body: { padding: 20, paddingBottom: 30 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: DEEP, marginBottom: 16, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12 },
    card: { background: "white", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(27,42,74,0.08)", borderLeft: `3px solid ${GOLD}` },
    cardIcon: { fontSize: 28, marginBottom: 8 },
    cardTitle: { fontWeight: "bold", color: DEEP, fontSize: 15, marginBottom: 6 },
    cardDesc: { color: "#555", fontSize: 13, lineHeight: 1.5, marginBottom: 12 },
    btn: { background: `linear-gradient(135deg, ${GOLD}, #E8C76A)`, color: DEEP, border: "none", padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" },
    reminder: { background: LIGHT_GOLD, border: `1px solid ${GOLD}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: DEEP, marginBottom: 16 },
    greeting: { fontSize: 14, color: MUTED, fontStyle: "italic", marginBottom: 6 },
    dateText: { fontSize: 12, color: MUTED, marginBottom: 16, textTransform: "capitalize" },
    gospelText: { background: "white", borderRadius: 12, padding: 18, fontSize: 14, lineHeight: 1.8, color: "#333", whiteSpace: "pre-line", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    gospelReading: { fontSize: 13, color: GOLD, fontWeight: "bold", marginBottom: 10 },
    reflection: { background: LIGHT_GOLD, borderRadius: 10, padding: 14, fontSize: 13, color: DEEP, lineHeight: 1.6 },
    mysteryBtn: (active) => ({ padding: "8px 14px", borderRadius: 20, border: `1px solid ${active ? GOLD : "#ddd"}`, background: active ? GOLD : "white", color: active ? DEEP : "#555", fontSize: 11, cursor: "pointer", margin: "0 4px 8px 0", fontFamily: "Georgia, serif" }),
    rosaryToday: { fontSize: 13, color: MUTED, marginBottom: 14, fontStyle: "italic" },
    stepList: { listStyle: "none", padding: 0, margin: 0 },
    stepItem: (active, done) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, marginBottom: 6, background: done ? "#f0f7ee" : active ? LIGHT_GOLD : "white", border: `1px solid ${done ? "#b5d5b0" : active ? GOLD : "#eee"}`, fontSize: 13, color: done ? "#5a8f57" : DEEP, cursor: "pointer", transition: "all 0.2s" }),
    prayerItem: { background: "white", borderRadius: 12, marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    prayerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer" },
    prayerName: { fontWeight: "bold", color: DEEP, fontSize: 14 },
    prayerText: { padding: "0 16px 14px", fontSize: 13, color: "#555", lineHeight: 1.7 },
    quoteCard: { background: `linear-gradient(135deg, ${DEEP}, #2C4270)`, borderRadius: 14, padding: 20, marginBottom: 12, color: "white" },
    quote: { fontSize: 15, fontStyle: "italic", lineHeight: 1.6, marginBottom: 10 },
    quoteAuthor: { fontSize: 12, color: GOLD, fontWeight: "bold" },
    shopSubtitle: { fontSize: 13, color: MUTED, marginBottom: 16, fontStyle: "italic" },
    shopGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    shopCard: { background: "white", borderRadius: 12, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", position: "relative", textAlign: "center" },
    shopIcon: { fontSize: 32, marginBottom: 8 },
    shopName: { fontSize: 13, fontWeight: "bold", color: DEEP, marginBottom: 4 },
    shopPrice: { fontSize: 14, color: GOLD, fontWeight: "bold", marginBottom: 10 },
    shopTag: { position: "absolute", top: 8, right: 8, background: GOLD, color: DEEP, fontSize: 9, fontWeight: "bold", padding: "2px 7px", borderRadius: 10 },
    shopBtn: { background: DEEP, color: "white", border: "none", padding: "6px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", width: "100%" },
    cartBadge: { background: "red", color: "white", fontSize: 10, borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4 },
  };

  const renderHome = () => (
    <div>
      <p style={styles.greeting}>{t.home.greeting}</p>
      <p style={styles.dateText}>{t.home.date}</p>
      <div style={styles.reminder}>{t.home.reminder}</div>
      {t.home.cards.map((c, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.cardIcon}>{c.icon}</div>
          <div style={styles.cardTitle}>{c.title}</div>
          <div style={styles.cardDesc}>{c.desc}</div>
          <button style={styles.btn} onClick={() => setTab(i + 1)}>{c.btn}</button>
        </div>
      ))}
    </div>
  );

  const renderGospel = () => (
    <div>
      <p style={styles.gospelReading}>{t.gospel.reading}</p>
      <div style={styles.gospelText}>{t.gospel.text}</div>
      <div style={styles.reflection}>{t.gospel.reflection}</div>
    </div>
  );

  const [selectedMystery, setSelectedMystery] = useState(0);
  const renderRosary = () => (
    <div>
      <p style={styles.rosaryToday}>✨ {t.rosary.today}</p>
      <div style={{ marginBottom: 14, display: "flex", flexWrap: "wrap" }}>
        {t.rosary.mysteries.map((m, i) => (
          <button key={i} style={styles.mysteryBtn(selectedMystery === i)} onClick={() => setSelectedMystery(i)}>{m}</button>
        ))}
      </div>
      <ul style={styles.stepList}>
        {t.rosary.steps.map((step, i) => (
          <li key={i} style={styles.stepItem(rosaryStep === i, i < rosaryStep)} onClick={() => setRosaryStep(i)}>
            <span style={{ fontSize: 16 }}>{i < rosaryStep ? "✅" : rosaryStep === i ? "👉" : "○"}</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button style={{ ...styles.btn, background: "#eee", color: DEEP }} onClick={() => setRosaryStep(Math.max(0, rosaryStep - 1))}>← Anterior</button>
        <button style={styles.btn} onClick={() => setRosaryStep(Math.min(t.rosary.steps.length - 1, rosaryStep + 1))}>Siguiente →</button>
      </div>
    </div>
  );

  const renderPrayers = () => (
    <div>
      {t.prayers.list.map((p, i) => (
        <div key={i} style={styles.prayerItem}>
          <div style={styles.prayerHeader} onClick={() => setOpenPrayer(openPrayer === i ? null : i)}>
            <span style={styles.prayerName}>🙏 {p.name}</span>
            <span style={{ color: GOLD, fontSize: 18 }}>{openPrayer === i ? "−" : "+"}</span>
          </div>
          {openPrayer === i && <div style={styles.prayerText}>{p.text}</div>}
        </div>
      ))}
    </div>
  );

  const renderReflections = () => (
    <div>
      {t.reflections.daily.map((r, i) => (
        <div key={i} style={styles.quoteCard}>
          <div style={styles.quote}>{r.quote}</div>
          <div style={styles.quoteAuthor}>— {r.author}</div>
        </div>
      ))}
    </div>
  );

  const renderShop = () => (
    <div>
      <p style={styles.shopSubtitle}>{t.shop.subtitle}</p>
      <div style={styles.shopGrid}>
        {t.shop.items.map((item, i) => (
          <div key={i} style={styles.shopCard}>
            {item.tag && <span style={styles.shopTag}>{item.tag}</span>}
            <div style={styles.shopIcon}>{item.icon}</div>
            <div style={styles.shopName}>{item.name}</div>
            <div style={styles.shopPrice}>{item.price}</div>
            <button style={styles.shopBtn} onClick={() => setCart([...cart, item])}>
              {lang === "es" ? "Añadir al carrito" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ marginTop: 20, background: LIGHT_GOLD, borderRadius: 12, padding: 14, textAlign: "center" }}>
          <span style={{ fontWeight: "bold", color: DEEP }}>🛒 {lang === "es" ? "Carrito" : "Cart"}</span>
          <span style={styles.cartBadge}>{cart.length}</span>
          <p style={{ fontSize: 12, color: MUTED, margin: "6px 0 0" }}>
            {lang === "es" ? `Total: $${cart.reduce((a, b) => a + parseFloat(b.price.replace("$", "")), 0).toFixed(2)}` : `Total: $${cart.reduce((a, b) => a + parseFloat(b.price.replace("$", "")), 0).toFixed(2)}`}
          </p>
        </div>
      )}
    </div>
  );

  const sections = [renderHome, renderGospel, renderRosary, renderPrayers, renderReflections, renderShop];

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.appName}>✝ {t.appName}</div>
            <div style={styles.tagline}>{t.tagline}</div>
          </div>
          <div style={styles.langToggle}>
            <button style={styles.langBtn(lang === "es")} onClick={() => setLang("es")}>ES</button>
            <button style={styles.langBtn(lang === "en")} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
        <div style={styles.nav}>
          {t.nav.map((n, i) => (
            <button key={i} style={styles.navBtn(tab === i)} onClick={() => setTab(i)}>{n}</button>
          ))}
        </div>
      </div>
      <div style={styles.body}>
        <div style={styles.sectionTitle}>{t.nav[tab]}</div>
        {sections[tab]()}
      </div>
    </div>
  );
}
