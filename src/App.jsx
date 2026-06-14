import { useState, useEffect } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOZMcPE-9T3E8PtrIvXn4DoqgWG0J9Db0",
  authDomain: "camino-de-fe-4d9c2.firebaseapp.com",
  projectId: "camino-de-fe-4d9c2",
  storageBucket: "camino-de-fe-4d9c2.firebasestorage.app",
  messagingSenderId: "1067905510058",
  appId: "1:1067905510058:web:e68d01c447a0e84c48fed3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

const translations = {
  es: {
    appName: "Camino de Fe",
    tagline: "Cada día, un paso más cerca de Dios",
    nav: ["Inicio", "Evangelio", "Rosario", "Oraciones", "Reflexiones", "Tienda"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Evangelio del Día", desc: "Cargando el Evangelio de hoy...", btn: "Leer más" },
        { icon: "📿", title: "Santo Rosario", desc: "Misterios Gloriosos · Miércoles y Domingos", btn: "Comenzar" },
        { icon: "🕯️", title: "Oración de la Mañana", desc: "Comienza el día con gratitud y entrega a Dios.", btn: "Rezar" },
      ],
      reminder: "🔔 Recordatorio activo: Ángelus · 12:00 PM",
    },
    gospel: { reading: "Evangelio del día", text: "Cargando el Evangelio de hoy..." },
    rosary: {
      mysteries: ["Misterios Gozosos", "Misterios Luminosos", "Misterios Dolorosos", "Misterios Gloriosos"],
      today: "Misterios Gloriosos",
      steps: [
        "✝️ Señal de la Cruz","📿 Credo Apostólico","🙏 Padre Nuestro","💛 3 Ave Marías","⭐ Gloria",
        "🌟 1er Misterio: La Resurrección","🌟 2do Misterio: La Ascensión","🌟 3er Misterio: Pentecostés",
        "🌟 4to Misterio: La Asunción","🌟 5to Misterio: La Coronación","✝️ Salve Regina",
      ],
    },
    prayers: {
      list: [
        { name: "Padre Nuestro", text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo..." },
        { name: "Ave María", text: "Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús..." },
        { name: "Gloria", text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén." },
        { name: "Ángelus", text: "El ángel del Señor anunció a María, y concibió por obra del Espíritu Santo. Dios te salve, María..." },
      ],
    },
    reflections: {
      daily: [
        { quote: "«La oración es el oxígeno del alma.»", author: "San Pío de Pietrelcina" },
        { quote: "«No tengas miedo de amar a Dios. Él siempre te amó primero.»", author: "San Juan Pablo II" },
        { quote: "«Haz el bien hoy, aunque no lo recuerdes mañana.»", author: "Santa Teresa de Calcuta" },
      ],
    },
    shop: {
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
        { icon: "📖", title: "Gospel of the Day", desc: "Loading today's Gospel...", btn: "Read more" },
        { icon: "📿", title: "Holy Rosary", desc: "Glorious Mysteries · Wednesday & Sunday", btn: "Begin" },
        { icon: "🕯️", title: "Morning Prayer", desc: "Start your day with gratitude and surrender to God.", btn: "Pray" },
      ],
      reminder: "🔔 Active reminder: Angelus · 12:00 PM",
    },
    gospel: { reading: "Gospel of the day", text: "Loading today's Gospel..." },
    rosary: {
      mysteries: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
      today: "Glorious Mysteries",
      steps: [
        "✝️ Sign of the Cross","📿 Apostles' Creed","🙏 Our Father","💛 3 Hail Marys","⭐ Glory Be",
        "🌟 1st Mystery: The Resurrection","🌟 2nd Mystery: The Ascension","🌟 3rd Mystery: Pentecost",
        "🌟 4th Mystery: The Assumption","🌟 5th Mystery: The Coronation","✝️ Hail Holy Queen",
      ],
    },
    prayers: {
      list: [
        { name: "Our Father", text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven..." },
        { name: "Hail Mary", text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus..." },
        { name: "Glory Be", text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen." },
        { name: "Angelus", text: "The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Hail Mary..." },
      ],
    },
    reflections: {
      daily: [
        { quote: "«Prayer is the oxygen of the soul.»", author: "St. Pio of Pietrelcina" },
        { quote: "«Do not be afraid to love God. He always loved you first.»", author: "St. John Paul II" },
        { quote: "«Do good today, even if you won't remember it tomorrow.»", author: "St. Teresa of Calcutta" },
      ],
    },
    shop: {
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

const cleanGospelText = (text) => {
  if (!text) return { reference: '', body: '' };
  let clean = text.replace('Evangelio del día', '').trim();
  const refMatch = clean.match(/Lectura del santo evangelio según san (\w+)\s*([\d,\s\-–—]+)/i);
  const reference = refMatch ? `${refMatch[1]} ${refMatch[2].trim()}` : '';
  const body = clean.replace(/Lectura del santo evangelio según san \w+\s*[\d,\s\-–—]+/i, '').trim();
  return { reference, body };
};

export default function App() {
  const [lang, setLang] = useState("es");
  const [tab, setTab] = useState(0);
  const [rosaryStep, setRosaryStep] = useState(0);
  const [selectedMystery, setSelectedMystery] = useState(0);
  const [openPrayer, setOpenPrayer] = useState(null);
  const [cart, setCart] = useState([]);
  const [gospelData, setGospelData] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

 useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    const url = lang === 'en' 
      ? '/api/gospel-en'
      : `/api/gospel?lang=${lang}&day=${day}&month=${month}&year=${year}`;
    
    axios.get(url)
      .then(res => { if (res.data.success) setGospelData(res.data); })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleGoogle = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthMode(null);
    } catch (e) {
      setAuthError(e.message);
    }
    setAuthLoading(false);
  };

  const handleRegister = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      await updateProfile(cred.user, { displayName: authName });
      setAuthMode(null);
    } catch (e) {
      setAuthError(e.message);
    }
    setAuthLoading(false);
  };

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthMode(null);
    } catch (e) {
      setAuthError(e.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

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
    navBtn: (active) => ({ padding: "10px 14px", fontSize: 11, color: active ? GOLD : "rgba(255,255,255,0.6)", borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Georgia, serif" }),
    body: { padding: 20, paddingBottom: 30 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: DEEP, marginBottom: 16, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12 },
    card: { background: "white", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(27,42,74,0.08)", borderLeft: `3px solid ${GOLD}` },
    cardIcon: { fontSize: 28, marginBottom: 8 },
    cardTitle: { fontWeight: "bold", color: DEEP, fontSize: 15, marginBottom: 6 },
    cardDesc: { color: "#555", fontSize: 13, lineHeight: 1.6, marginBottom: 12 },
    btn: { background: `linear-gradient(135deg, ${GOLD}, #E8C76A)`, color: DEEP, border: "none", padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" },
    reminder: { background: LIGHT_GOLD, border: `1px solid ${GOLD}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: DEEP, marginBottom: 16 },
    greeting: { fontSize: 14, color: MUTED, fontStyle: "italic", marginBottom: 6 },
    dateText: { fontSize: 12, color: MUTED, marginBottom: 16, textTransform: "capitalize" },
    gospelText: { background: "white", borderRadius: 12, padding: 18, fontSize: 14, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    gospelReading: { fontSize: 15, color: GOLD, fontWeight: "bold", marginBottom: 4 },
    gospelSubtitle: { fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 12 },
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
    authOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    authBox: { background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" },
    authTitle: { fontSize: 22, fontWeight: "bold", color: DEEP, marginBottom: 6, textAlign: "center" },
    authSubtitle: { fontSize: 13, color: MUTED, marginBottom: 24, textAlign: "center" },
    authInput: { width: "100%", padding: "12px 14px", border: `1px solid #ddd`, borderRadius: 10, fontSize: 14, marginBottom: 12, fontFamily: "Georgia, serif", boxSizing: "border-box" },
    authBtn: { width: "100%", padding: "12px", background: `linear-gradient(135deg, ${GOLD}, #E8C76A)`, color: DEEP, border: "none", borderRadius: 10, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 10 },
    googleBtn: { width: "100%", padding: "12px", background: "white", color: "#333", border: "1px solid #ddd", borderRadius: 10, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    authError: { background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#cc0000", marginBottom: 12 },
    authSwitch: { textAlign: "center", fontSize: 13, color: MUTED, marginTop: 8 },
    authSwitchLink: { color: GOLD, cursor: "pointer", fontWeight: "bold", textDecoration: "underline" },
    userBar: { background: LIGHT_GOLD, border: `1px solid ${GOLD}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: DEEP, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" },
  };

  const renderAuthModal = () => (
    <div style={styles.authOverlay} onClick={() => setAuthMode(null)}>
      <div style={styles.authBox} onClick={e => e.stopPropagation()}>
        <div style={styles.authTitle}>✝ {authMode === 'register' ? (lang === 'es' ? 'Crear cuenta' : 'Create account') : (lang === 'es' ? 'Iniciar sesión' : 'Sign in')}</div>
        <div style={styles.authSubtitle}>{lang === 'es' ? 'Únete a nuestra comunidad de fe' : 'Join our faith community'}</div>
        <button style={styles.googleBtn} onClick={handleGoogle}>
          <span style={{ fontSize: 18 }}>G</span>
          {lang === 'es' ? 'Continuar con Google' : 'Continue with Google'}
        </button>
        <div style={{ textAlign: "center", color: MUTED, fontSize: 12, marginBottom: 16 }}>— {lang === 'es' ? 'o con email' : 'or with email'} —</div>
        {authMode === 'register' && (
          <input style={styles.authInput} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} value={authName} onChange={e => setAuthName(e.target.value)} />
        )}
        <input style={styles.authInput} placeholder="Email" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <input style={styles.authInput} placeholder={lang === 'es' ? 'Contraseña' : 'Password'} type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
        {authError && <div style={styles.authError}>{authError}</div>}
        <button style={styles.authBtn} onClick={authMode === 'register' ? handleRegister : handleLogin} disabled={authLoading}>
          {authLoading ? '...' : authMode === 'register' ? (lang === 'es' ? 'Registrarme' : 'Register') : (lang === 'es' ? 'Entrar' : 'Sign in')}
        </button>
        <div style={styles.authSwitch}>
          {authMode === 'register'
            ? <>{lang === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}<span style={styles.authSwitchLink} onClick={() => setAuthMode('login')}>{lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span></>
            : <>{lang === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}<span style={styles.authSwitchLink} onClick={() => setAuthMode('register')}>{lang === 'es' ? 'Regístrate' : 'Register'}</span></>
          }
        </div>
      </div>
    </div>
  );

  const renderHome = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: '' };
    return (
      <div>
        <p style={styles.greeting}>{t.home.greeting}{user ? `, ${user.displayName || user.email}` : ''}!</p>
        <p style={styles.dateText}>{t.home.date}</p>
        {user ? (
          <div style={styles.userBar}>
            <span>👤 {user.displayName || user.email}</span>
            <span style={{ cursor: "pointer", color: GOLD }} onClick={handleLogout}>{lang === 'es' ? 'Salir' : 'Sign out'}</span>
          </div>
        ) : (
          <div style={{ ...styles.userBar, cursor: "pointer" }} onClick={() => setAuthMode('login')}>
            <span>👤 {lang === 'es' ? 'Inicia sesión o regístrate' : 'Sign in or register'}</span>
            <span style={{ color: GOLD }}>→</span>
          </div>
        )}
        <div style={styles.reminder}>{t.home.reminder}</div>
        {t.home.cards.map((c, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardIcon}>{c.icon}</div>
            <div style={styles.cardTitle}>{c.title}</div>
            <div style={styles.cardDesc}>
              {i === 0 && gospelData ? (
                <>
                  <span style={{ fontWeight: "bold", color: GOLD, display: "block", marginBottom: 6 }}>{reference}</span>
                  {body.substring(0, 80) + "..."}
                </>
              ) : c.desc}
            </div>
            <button style={styles.btn} onClick={() => setTab(i + 1)}>{c.btn}</button>
          </div>
        ))}
      </div>
    );
  };

  const renderGospel = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: t.gospel.text };
    const formatted = body.replace(/\. ([A-ZÁÉÍÓÚ«])/g, ".\n\n$1").trim();
    return (
      <div>
        <p style={styles.gospelReading}>{reference || t.gospel.reading}</p>
        <p style={styles.gospelSubtitle}>Lectura del santo Evangelio</p>
        <div style={styles.gospelText}>
          {formatted}
          {"\n\n— " + (lang === 'es' ? 'Palabra del Señor.' : 'The Gospel of the Lord.')}
        </div>
      </div>
    );
  };

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
            Total: ${cart.reduce((a, b) => a + parseFloat(b.price.replace("$", "")), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );

  const sections = [renderHome, renderGospel, renderRosary, renderPrayers, renderReflections, renderShop];

  return (
    <div style={styles.app}>
      {authMode && renderAuthModal()}
      <div style={styles.header}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.appName}>✝ {t.appName}</div>
            <div style={styles.tagline}>{t.tagline}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button style={styles.langBtn(lang === "es")} onClick={() => setLang("es")}>ES</button>
            <button style={styles.langBtn(lang === "en")} onClick={() => setLang("en")}>EN</button>
            {!user && <button style={{ ...styles.langBtn(false), fontSize: 10 }} onClick={() => setAuthMode('login')}>👤</button>}
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
