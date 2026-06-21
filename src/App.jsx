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
    nav: ["Inicio", "Evangelio", "Rosario", "Oraciones", "Reflexiones", "Tienda", "Lecturas", "Configuración"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Evangelio del Día", desc: "Cargando el Evangelio de hoy...", btn: "Leer más", gradient: "linear-gradient(135deg, #6B1F3E, #A0294E)", tab: 1 },
        { icon: "📜", title: "Lecturas del Día", desc: "Primera Lectura y Salmo del día", btn: "Ver lecturas", gradient: "linear-gradient(135deg, #1A3A5C, #2C5F8A)", tab: 6 },
        { icon: "📿", title: "Santo Rosario", desc: "Misterios Gloriosos · Miércoles y Domingos", btn: "Comenzar", gradient: "linear-gradient(135deg, #4A1259, #7B2D8B)", tab: 2 },
        { icon: "🕯️", title: "Oración de la Mañana", desc: "Comienza el día con gratitud y entrega a Dios.", btn: "Rezar", gradient: "linear-gradient(135deg, #7C4A1E, #C17A3A)", tab: 3 },
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
    nav: ["Home", "Gospel", "Rosary", "Prayers", "Reflections", "Shop", "Readings", "Settings"],
    home: {
      greeting: "May the peace of the Lord be with you",
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Gospel of the Day", desc: "Loading today's Gospel...", btn: "Read more", gradient: "linear-gradient(135deg, #6B1F3E, #A0294E)", tab: 1 },
        { icon: "📜", title: "Daily Readings", desc: "First Reading and Psalm of the day", btn: "View readings", gradient: "linear-gradient(135deg, #1A3A5C, #2C5F8A)", tab: 6 },
        { icon: "📿", title: "Holy Rosary", desc: "Glorious Mysteries · Wednesday & Sunday", btn: "Begin", gradient: "linear-gradient(135deg, #4A1259, #7B2D8B)", tab: 2 },
        { icon: "🕯️", title: "Morning Prayer", desc: "Start your day with gratitude and surrender to God.", btn: "Pray", gradient: "linear-gradient(135deg, #7C4A1E, #C17A3A)", tab: 3 },
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
const GOLD_LIGHT = "#E8C76A";
const WINE = "#6B1F3E";
const WINE_DARK = "#4A0F28";
const CREAM = "#FAF5ED";
const CREAM_DARK = "#F0E6D3";
const MUTED = "#8B6E5A";
const WHITE = "#FFFFFF";
const BLUE_DARK = "#1A3A5C";
const BLUE = "#2C5F8A";

const cleanGospelText = (text) => {
  if (!text) return { reference: '', body: '' };
  let clean = text.replace('Evangelio del día', '').trim();
  const refMatch = clean.match(/Lectura del santo Evangelio según san ([\w\s]+?)\s*([\d:,\s\-–—]+)\n/i);
  const reference = refMatch ? `${refMatch[1].trim()} ${refMatch[2].trim()}` : '';
  const body = clean.replace(/Lectura del santo Evangelio según san [\w\s]+?\s*[\d:,\s\-–—]+\n/i, '').trim();
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
  const [authMode, setAuthMode] = useState(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openReading, setOpenReading] = useState(null);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const cacheKey = `gospel_${lang}_${day}_${month}_${year}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setGospelData(JSON.parse(cached)); return; }
    } catch(e) {}
    axios.get(`/api/gospel?lang=${lang}&day=${day}&month=${month}&year=${year}`)
      .then(res => {
        if (res.data.success) {
          setGospelData(res.data);
          try { sessionStorage.setItem(cacheKey, JSON.stringify(res.data)); } catch(e) {}
        }
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleGoogle = async () => {
    setAuthLoading(true); setAuthError("");
    try { await signInWithPopup(auth, googleProvider); setAuthMode(null); }
    catch (e) { setAuthError(e.message); }
    setAuthLoading(false);
  };

  const handleRegister = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      await updateProfile(cred.user, { displayName: authName });
      setAuthMode(null);
    } catch (e) { setAuthError(e.message); }
    setAuthLoading(false);
  };

  const handleLogin = async () => {
    setAuthLoading(true); setAuthError("");
    try { await signInWithEmailAndPassword(auth, authEmail, authPassword); setAuthMode(null); }
    catch (e) { setAuthError(e.message); }
    setAuthLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); };

  const t = translations[lang];

  const renderAuthModal = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(74,15,40,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setAuthMode(null)}>
      <div style={{ background: WHITE, borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(74,15,40,0.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✝️</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: WINE, fontFamily: "'Cinzel', serif" }}>
            {authMode === 'register' ? (lang === 'es' ? 'Crear cuenta' : 'Create account') : (lang === 'es' ? 'Iniciar sesión' : 'Sign in')}
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{lang === 'es' ? 'Únete a nuestra comunidad de fe' : 'Join our faith community'}</div>
        </div>
        <button onClick={handleGoogle} style={{ width: "100%", padding: "12px", background: CREAM, color: WINE_DARK, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Cinzel', serif" }}>
          <span style={{ fontSize: 18 }}>G</span> {lang === 'es' ? 'Continuar con Google' : 'Continue with Google'}
        </button>
        <div style={{ textAlign: "center", color: MUTED, fontSize: 12, marginBottom: 16 }}>— {lang === 'es' ? 'o con email' : 'or with email'} —</div>
        {authMode === 'register' && <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} value={authName} onChange={e => setAuthName(e.target.value)} />}
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder="Email" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 16, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder={lang === 'es' ? 'Contraseña' : 'Password'} type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
        {authError && <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#cc0000", marginBottom: 12 }}>{authError}</div>}
        <button onClick={authMode === 'register' ? handleRegister : handleLogin} disabled={authLoading} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${WINE}, ${WINE_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>
          {authLoading ? '...' : authMode === 'register' ? (lang === 'es' ? 'Registrarme' : 'Register') : (lang === 'es' ? 'Entrar' : 'Sign in')}
        </button>
        <div style={{ textAlign: "center", fontSize: 13, color: MUTED }}>
          {authMode === 'register'
            ? <>{lang === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}<span style={{ color: WINE, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('login')}>{lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span></>
            : <>{lang === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}<span style={{ color: WINE, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('register')}>{lang === 'es' ? 'Regístrate' : 'Register'}</span></>
          }
        </div>
      </div>
    </div>
  );

  const renderHome = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: '' };
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${WINE_DARK}, ${WINE})`, borderRadius: 20, padding: "24px 20px", marginBottom: 16, color: WHITE, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.08 }}>✝</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textTransform: "capitalize", marginBottom: 4 }}>{t.home.date}</div>
          <div style={{ fontSize: 16, fontStyle: "italic", color: GOLD_LIGHT, fontFamily: "'Crimson Text', serif" }}>{t.home.greeting}{user ? `, ${user.displayName?.split(' ')[0] || ''}` : ''}!</div>
          {user ? (
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>👤 {user.displayName || user.email}</span>
              <span style={{ fontSize: 12, color: GOLD, cursor: "pointer" }} onClick={handleLogout}>{lang === 'es' ? 'Salir' : 'Sign out'}</span>
            </div>
          ) : (
            <div onClick={() => setAuthMode('login')} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, cursor: "pointer" }}>
              <span style={{ fontSize: 12, color: WHITE }}>👤 {lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span>
              <span style={{ color: GOLD, fontSize: 14 }}>→</span>
            </div>
          )}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`, border: `1px solid ${GOLD}44`, borderRadius: 12, padding: "10px 14px", fontSize: 12, color: WINE_DARK, marginBottom: 16 }}>
          {t.home.reminder}
        </div>
        {t.home.cards.map((c, i) => (
          <div key={i} style={{ background: c.gradient, borderRadius: 20, padding: "22px 20px", marginBottom: 14, color: WHITE, position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(74,15,40,0.2)" }}>
            <div style={{ position: "absolute", bottom: -15, right: -10, fontSize: 70, opacity: 0.12 }}>{c.icon}</div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: "bold", fontSize: 17, marginBottom: 8, fontFamily: "'Cinzel', serif" }}>{c.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>
              {i === 0 && gospelData ? (
                <>
                  <span style={{ fontWeight: "bold", color: GOLD_LIGHT, display: "block", marginBottom: 4 }}>
                    {lang === 'en' ? gospelData?.reference : reference}
                  </span>
                  {body.substring(0, 80) + "..."}
                </>
              ) : i === 1 && gospelData?.reading1 ? (
                <>
                  <span style={{ fontWeight: "bold", color: "#90CAF9", display: "block", marginBottom: 4 }}>
                    {gospelData.reading1.reference}
                  </span>
                  {gospelData.reading1.text.substring(0, 80) + "..."}
                </>
              ) : c.desc}
            </div>
            <button onClick={() => setTab(c.tab)} style={{ background: "rgba(255,255,255,0.2)", color: WHITE, border: "1px solid rgba(255,255,255,0.4)", padding: "8px 20px", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              {c.btn} →
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderGospel = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: t.gospel.text };
    const formatted = body.replace(/\. ([A-ZÁÉÍÓÚ«"A-Z])/g, ".\n\n$1").trim();
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${WINE_DARK}, ${WINE})`, borderRadius: 16, padding: "18px 20px", marginBottom: 16, color: WHITE }}>
          <div style={{ fontSize: 13, color: GOLD_LIGHT, fontStyle: "italic", marginBottom: 4 }}>
            {lang === 'es' ? 'Lectura del santo Evangelio' : 'Reading of the Holy Gospel'}
          </div>
          <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>
            {lang === 'en' ? gospelData?.reference : (reference || t.gospel.reading)}
          </div>
        </div>
        <div style={{ background: WHITE, borderRadius: 16, padding: 20, fontSize: 14, lineHeight: 1.9, color: "#3A2A1E", whiteSpace: "pre-wrap", boxShadow: "0 4px 16px rgba(74,15,40,0.08)", border: `1px solid ${CREAM_DARK}` }}>
          {formatted}
          {"\n\n"}
          <span style={{ color: WINE, fontWeight: "bold", fontStyle: "italic" }}>
            — {lang === 'es' ? 'Palabra del Señor.' : 'The Gospel of the Lord.'}
          </span>
        </div>
      </div>
    );
  };

  const renderReadings = () => {
    const sections = [];
    if (gospelData?.reading1) sections.push({ key: 'r1', title: lang === 'es' ? 'Primera Lectura' : 'First Reading', ref: gospelData.reading1.reference, text: gospelData.reading1.text, icon: '📜' });
    if (gospelData?.reading2) sections.push({ key: 'r2', title: lang === 'es' ? 'Segunda Lectura' : 'Second Reading', ref: gospelData.reading2.reference, text: gospelData.reading2.text, icon: '📋' });
    if (gospelData?.psalm) sections.push({ key: 'ps', title: lang === 'es' ? 'Salmo Responsorial' : 'Responsorial Psalm', ref: gospelData.psalm.reference, text: gospelData.psalm.text, icon: '🎵' });

    if (!gospelData) return <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>Cargando lecturas...</div>;

    return (
      <div>
        {sections.map((s, i) => (
          <div key={s.key} style={{ background: WHITE, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(26,58,92,0.08)", border: `1px solid ${CREAM_DARK}` }}>
            <div onClick={() => setOpenReading(openReading === s.key ? null : s.key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer", background: openReading === s.key ? `${BLUE_DARK}08` : WHITE }}>
              <div>
                <div style={{ fontWeight: "bold", color: BLUE_DARK, fontSize: 15, fontFamily: "'Cinzel', serif" }}>{s.icon} {s.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.ref}</div>
              </div>
              <span style={{ color: BLUE, fontSize: 20, fontWeight: "bold" }}>{openReading === s.key ? "−" : "+"}</span>
            </div>
            {openReading === s.key && (
              <div style={{ padding: "0 18px 18px", fontSize: 14, color: "#1A2A3A", lineHeight: 1.9, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14, whiteSpace: "pre-wrap" }}>
                {s.text}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRosary = () => (
    <div>
      <div style={{ background: `linear-gradient(135deg, #4A1259, #7B2D8B)`, borderRadius: 16, padding: "16px 20px", marginBottom: 16, color: WHITE }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>✨ {lang === 'es' ? 'Hoy rezamos los' : "Today's mysteries"}</div>
        <div style={{ fontSize: 17, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>{t.rosary.today}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {t.rosary.mysteries.map((m, i) => (
          <button key={i} onClick={() => setSelectedMystery(i)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedMystery === i ? WINE : CREAM_DARK}`, background: selectedMystery === i ? WINE : WHITE, color: selectedMystery === i ? WHITE : MUTED, fontSize: 11, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>{m}</button>
        ))}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {t.rosary.steps.map((step, i) => (
          <li key={i} onClick={() => setRosaryStep(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 6, background: i < rosaryStep ? "#f5f0ff" : rosaryStep === i ? `${WINE}11` : WHITE, border: `1px solid ${i < rosaryStep ? "#c4b5e8" : rosaryStep === i ? WINE : CREAM_DARK}`, fontSize: 13, color: i < rosaryStep ? "#6B4F9E" : WINE_DARK, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>{i < rosaryStep ? "✅" : rosaryStep === i ? "👉" : "○"}</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={() => setRosaryStep(Math.max(0, rosaryStep - 1))} style={{ flex: 1, padding: "10px", background: CREAM_DARK, color: WINE_DARK, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>← {lang === 'es' ? 'Anterior' : 'Previous'}</button>
        <button onClick={() => setRosaryStep(Math.min(t.rosary.steps.length - 1, rosaryStep + 1))} style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${WINE}, ${WINE_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? 'Siguiente' : 'Next'} →</button>
      </div>
    </div>
  );

  const renderPrayers = () => (
    <div>
      {t.prayers.list.map((p, i) => (
        <div key={i} style={{ background: WHITE, borderRadius: 16, marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(74,15,40,0.08)", border: `1px solid ${CREAM_DARK}` }}>
          <div onClick={() => setOpenPrayer(openPrayer === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
            <span style={{ fontWeight: "bold", color: WINE_DARK, fontSize: 15, fontFamily: "'Cinzel', serif" }}>🙏 {p.name}</span>
            <span style={{ color: WINE, fontSize: 20, fontWeight: "bold" }}>{openPrayer === i ? "−" : "+"}</span>
          </div>
          {openPrayer === i && <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#3A2A1E", lineHeight: 1.8, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14 }}>{p.text}</div>}
        </div>
      ))}
    </div>
  );

  const renderReflections = () => (
    <div>
      {t.reflections.daily.map((r, i) => (
        <div key={i} style={{ background: `linear-gradient(135deg, ${WINE_DARK}, #6B1F3E, #7C4A1E)`, borderRadius: 20, padding: "22px 20px", marginBottom: 14, color: WHITE, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.08 }}>✝</div>
          <div style={{ fontSize: 13, color: GOLD, marginBottom: 4 }}>✨ {lang === 'es' ? 'Reflexión del día' : 'Daily reflection'}</div>
          <div style={{ fontSize: 16, fontStyle: "italic", lineHeight: 1.7, marginBottom: 14, fontFamily: "'Crimson Text', serif" }}>{r.quote}</div>
          <div style={{ fontSize: 12, color: GOLD_LIGHT, fontWeight: "bold" }}>— {r.author}</div>
        </div>
      ))}
    </div>
  );

  const renderShop = () => (
    <div>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16, fontStyle: "italic" }}>{t.shop.subtitle}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {t.shop.items.map((item, i) => (
          <div key={i} style={{ background: WHITE, borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(74,15,40,0.08)", position: "relative", textAlign: "center", border: `1px solid ${CREAM_DARK}` }}>
            {item.tag && <span style={{ position: "absolute", top: 8, right: 8, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: WINE_DARK, fontSize: 9, fontWeight: "bold", padding: "3px 8px", borderRadius: 10 }}>{item.tag}</span>}
            <div style={{ fontSize: 36, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: WINE_DARK, marginBottom: 4, fontFamily: "'Cinzel', serif" }}>{item.name}</div>
            <div style={{ fontSize: 15, color: WINE, fontWeight: "bold", marginBottom: 10 }}>{item.price}</div>
            <button onClick={() => setCart([...cart, item])} style={{ background: `linear-gradient(135deg, ${WINE}, ${WINE_DARK})`, color: WHITE, border: "none", padding: "8px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", width: "100%", fontFamily: "'Cinzel', serif" }}>
              {lang === "es" ? "Añadir" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ marginTop: 20, background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`, border: `1px solid ${GOLD}44`, borderRadius: 16, padding: 16, textAlign: "center" }}>
          <span style={{ fontWeight: "bold", color: WINE_DARK }}>🛒 {lang === "es" ? "Carrito" : "Cart"}</span>
          <span style={{ background: WINE, color: WHITE, fontSize: 10, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 6 }}>{cart.length}</span>
          <p style={{ fontSize: 13, color: MUTED, margin: "8px 0 0", fontWeight: "bold" }}>
            Total: ${cart.reduce((a, b) => a + parseFloat(b.price.replace("$", "")), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );

  const navIcons = ["🏠","📖","📿","🙏","💭","🛒","📜","⚙️"];
  const renderSettings = () => {
  const [notifGospel, setNotifGospel] = useState(false);
  const [notifRosary, setNotifRosary] = useState(false);
  const [notifLiturgy, setNotifLiturgy] = useState(false);
  const [gospelTime, setGospelTime] = useState("07:00");
  const [rosaryTime, setRosaryTime] = useState("19:00");
  const [liturgyTime, setLiturgyTime] = useState("06:00");
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPermissionGranted(true);
      scheduleNotification('evangelio', gospelTime, lang === 'es' ? '📖 Evangelio del día' : '📖 Gospel of the Day', lang === 'es' ? 'Lee el Evangelio de hoy' : "Read today's Gospel");
    }
  };

  const scheduleNotification = (type, time, title, body) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const notifTime = new Date();
    notifTime.setHours(hours, minutes, 0, 0);
    if (notifTime <= now) notifTime.setDate(notifTime.getDate() + 1);
    const delay = notifTime - now;
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icon-192.png' });
      }
    }, delay);
  };

  const toggle = (type, value, setter, time, titleEs, titleEn, bodyEs, bodyEn) => {
    setter(value);
    if (value) scheduleNotification(type, time, lang === 'es' ? titleEs : titleEn, lang === 'es' ? bodyEs : bodyEn);
  };

  const switchStyle = (active) => ({
    width: 44, height: 24, borderRadius: 12, background: active ? WINE : CREAM_DARK,
    position: "relative", cursor: "pointer", transition: "background 0.3s", border: "none",
    flexShrink: 0,
  });

  const knobStyle = (active) => ({
    position: "absolute", top: 2, left: active ? 22 : 2, width: 20, height: 20,
    borderRadius: "50%", background: WHITE, transition: "left 0.3s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  });

  return (
    <div>
      {Notification.permission !== 'granted' && (
        <div style={{ background: `linear-gradient(135deg, ${WINE_DARK}, ${WINE})`, borderRadius: 16, padding: 20, marginBottom: 16, color: WHITE, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, fontFamily: "'Cinzel', serif" }}>
            {lang === 'es' ? 'Activar notificaciones' : 'Enable notifications'}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>
            {lang === 'es' ? 'Recibe recordatorios para rezar cada día' : 'Receive daily prayer reminders'}
          </div>
          <button onClick={requestPermission} style={{ background: GOLD, color: WINE_DARK, border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif" }}>
            {lang === 'es' ? 'Permitir notificaciones' : 'Allow notifications'}
          </button>
        </div>
      )}

      {[
        { label: lang === 'es' ? '📖 Evangelio del día' : '📖 Gospel of the Day', desc: lang === 'es' ? 'Recordatorio matutino' : 'Morning reminder', active: notifGospel, setter: setNotifGospel, time: gospelTime, setTime: setGospelTime, titleEs: '📖 Evangelio del día', titleEn: '📖 Gospel of the Day', bodyEs: 'Lee el Evangelio de hoy', bodyEn: "Read today's Gospel" },
        { label: lang === 'es' ? '📿 Santo Rosario' : '📿 Holy Rosary', desc: lang === 'es' ? 'Recordatorio para rezar el Rosario' : 'Rosary prayer reminder', active: notifRosary, setter: setNotifRosary, time: rosaryTime, setTime: setRosaryTime, titleEs: '📿 Santo Rosario', titleEn: '📿 Holy Rosary', bodyEs: 'Es hora de rezar el Rosario', bodyEn: "Time to pray the Rosary" },
        { label: lang === 'es' ? '🕐 Liturgia de las Horas' : '🕐 Liturgy of the Hours', desc: lang === 'es' ? 'Laudes y Vísperas' : 'Lauds and Vespers', active: notifLiturgy, setter: setNotifLiturgy, time: liturgyTime, setTime: setLiturgyTime, titleEs: '🕐 Liturgia de las Horas', titleEn: '🕐 Liturgy of the Hours', bodyEs: 'Momento de oración litúrgica', bodyEn: "Time for liturgical prayer" },
      ].map((n, i) => (
        <div key={i} style={{ background: WHITE, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: "0 2px 12px rgba(74,15,40,0.08)", border: `1px solid ${CREAM_DARK}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: n.active ? 12 : 0 }}>
            <div>
              <div style={{ fontWeight: "bold", color: WINE_DARK, fontSize: 14, fontFamily: "'Cinzel', serif" }}>{n.label}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{n.desc}</div>
            </div>
            <button style={switchStyle(n.active)} onClick={() => toggle(i, !n.active, n.setter, n.time, n.titleEs, n.titleEn, n.bodyEs, n.bodyEn)}>
              <div style={knobStyle(n.active)} />
            </button>
          </div>
          {n.active && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: MUTED }}>{lang === 'es' ? 'Hora:' : 'Time:'}</span>
              <input type="time" value={n.time} onChange={e => n.setTime(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${CREAM_DARK}`, fontSize: 13, color: WINE_DARK, background: CREAM, fontFamily: "'Cinzel', serif" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
  const sections = [renderHome, renderGospel, renderRosary, renderPrayers, renderReflections, renderShop, renderReadings, renderSettings];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: CREAM, minHeight: "100vh", maxWidth: 430, margin: "0 auto", boxShadow: "0 0 60px rgba(74,15,40,0.15)" }}>
      {authMode && renderAuthModal()}

      <div style={{ background: `linear-gradient(135deg, ${WINE_DARK} 0%, ${WINE} 100%)`, padding: "20px 20px 0", color: WHITE }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 2, color: GOLD, fontFamily: "'Cinzel', serif" }}>✝ {t.appName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontStyle: "italic", fontFamily: "'Crimson Text', serif", letterSpacing: 1 }}>{t.tagline}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setLang("es")} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${lang === 'es' ? GOLD : "rgba(255,255,255,0.3)"}`, background: lang === 'es' ? GOLD : "transparent", color: lang === 'es' ? WINE_DARK : WHITE, fontSize: 11, cursor: "pointer", fontWeight: lang === 'es' ? "bold" : "normal" }}>ES</button>
            <button onClick={() => setLang("en")} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${lang === 'en' ? GOLD : "rgba(255,255,255,0.3)"}`, background: lang === 'en' ? GOLD : "transparent", color: lang === 'en' ? WINE_DARK : WHITE, fontSize: 11, cursor: "pointer", fontWeight: lang === 'en' ? "bold" : "normal" }}>EN</button>
            {!user && <button onClick={() => setAuthMode('login')} style={{ padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: WHITE, fontSize: 11, cursor: "pointer" }}>👤</button>}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10, paddingBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: GOLD, fontFamily: "'Cinzel', serif" }}>{t.nav[tab]}</span>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: WHITE, fontSize: 22, padding: "0 4px" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: WINE_DARK, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {t.nav.map((n, i) => (
              <button key={i} onClick={() => { setTab(i); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", background: tab === i ? "rgba(201,168,76,0.15)" : "none", border: "none", borderLeft: tab === i ? `3px solid ${GOLD}` : "3px solid transparent", color: tab === i ? GOLD : "rgba(255,255,255,0.8)", fontSize: 14, cursor: "pointer", fontFamily: "'Cinzel', serif", textAlign: "left" }}>
                <span>{navIcons[i]}</span>
                <span>{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 20, paddingBottom: 40 }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: WINE_DARK, marginBottom: 16, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12, fontFamily: "'Cinzel', serif" }}>
          {t.nav[tab]}
        </div>
        {sections[tab]()}
      </div>
    </div>
  );
}
