import { useState, useEffect } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { products, formatPrice } from "./products";

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
    nav: ["Inicio", "Evangelio", "Lecturas del Día", "Rosario", "Devocional", "Reflexiones", "Oración Personal", "Tienda", "Configuración"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Evangelio del Día", desc: "Cargando el Evangelio de hoy...", btn: "Leer más", gradient: "linear-gradient(135deg, #1B2A4A, #2C4270)", tab: 1 },
        { icon: "📜", title: "Lecturas del Día", desc: "Primera Lectura y Salmo del día", btn: "Ver lecturas", gradient: "linear-gradient(135deg, #1A3A5C, #2C5F8A)", tab: 2 },
        { icon: "📿", title: "Santo Rosario", desc: "Misterios Gloriosos · Miércoles y Domingos", btn: "Comenzar", gradient: "linear-gradient(135deg, #4A1259, #7B2D8B)", tab: 3 },
        { icon: "🕯️", title: "Oración de la Mañana", desc: "Comienza el día con gratitud y entrega a Dios.", btn: "Rezar", gradient: "linear-gradient(135deg, #7C4A1E, #C17A3A)", tab: 4 },
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
  },
  en: {
    appName: "Path of Faith",
    tagline: "Every day, one step closer to God",
    nav: ["Home", "Gospel", "Daily Readings", "Rosary", "Devotional", "Reflections", "Personal Prayer", "Shop", "Settings"],
    home: {
      greeting: "May the peace of the Lord be with you",
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "📖", title: "Gospel of the Day", desc: "Loading today's Gospel...", btn: "Read more", gradient: "linear-gradient(135deg, #1B2A4A, #2C4270)", tab: 1 },
        { icon: "📜", title: "Daily Readings", desc: "First Reading and Psalm of the day", btn: "View readings", gradient: "linear-gradient(135deg, #1A3A5C, #2C5F8A)", tab: 2 },
        { icon: "📿", title: "Holy Rosary", desc: "Glorious Mysteries · Wednesday & Sunday", btn: "Begin", gradient: "linear-gradient(135deg, #4A1259, #7B2D8B)", tab: 3 },
        { icon: "🕯️", title: "Morning Prayer", desc: "Start your day with gratitude and surrender to God.", btn: "Pray", gradient: "linear-gradient(135deg, #7C4A1E, #C17A3A)", tab: 4 },
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
  },
};

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C76A";
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F1C32";
const NAVY_MID = "#2C4270";
const CREAM = "#FAF5ED";
const CREAM_DARK = "#F0E6D3";
const MUTED = "#6B7A99";
const WHITE = "#FFFFFF";
const BLUE_DARK = "#1A3A5C";
const BLUE = "#2C5F8A";

const PRAYER_MOODS = {
  es: [
    { id: "gratitud",   icon: "🙏", label: "Gratitud",   verse: "«Dad gracias en todo» — 1 Tes 5:18",                           saint: "San Francisco de Asís",       template: "Señor, te doy gracias por..." },
    { id: "ansiedad",   icon: "🌊", label: "Ansiedad",   verse: "«No se turbe vuestro corazón» — Jn 14:1",                      saint: "Santa Teresa de Ávila",       template: "Señor, siento angustia por... confío en Ti porque..." },
    { id: "familia",    icon: "🏡", label: "Familia",    verse: "«El amor es paciente» — 1 Cor 13:4",                           saint: "San José",                    template: "Señor, pongo en tus manos a mi familia, especialmente a..." },
    { id: "trabajo",    icon: "💼", label: "Trabajo",    verse: "«Todo lo que hagan, háganlo de corazón» — Col 3:23",           saint: "San José Obrero",             template: "Señor, bendice mi trabajo hoy en..." },
    { id: "duelo",      icon: "🕯️", label: "Duelo",     verse: "«Bienaventurados los que lloran» — Mt 5:4",                    saint: "Nuestra Señora de los Dolores", template: "Señor, llevo en mi corazón la pérdida de..." },
    { id: "salud",      icon: "❤️", label: "Salud",      verse: "«Sana a los enfermos» — Lc 9:2",                              saint: "San Rafael Arcángel",         template: "Señor, te pido por la salud de..." },
    { id: "decisiones", icon: "⚖️", label: "Decisiones", verse: "«Fíate del Señor con todo tu corazón» — Prov 3:5",            saint: "Espíritu Santo",              template: "Señor, necesito sabiduría para decidir sobre..." },
  ],
  en: [
    { id: "gratitud",   icon: "🙏", label: "Gratitude",  verse: "«Give thanks in all circumstances» — 1 Thes 5:18",            saint: "St. Francis of Assisi",       template: "Lord, I am grateful for..." },
    { id: "ansiedad",   icon: "🌊", label: "Anxiety",    verse: "«Let not your hearts be troubled» — Jn 14:1",                 saint: "St. Teresa of Ávila",         template: "Lord, I feel anxious about... I trust in You because..." },
    { id: "familia",    icon: "🏡", label: "Family",     verse: "«Love is patient» — 1 Cor 13:4",                              saint: "St. Joseph",                  template: "Lord, I place my family in Your hands, especially..." },
    { id: "trabajo",    icon: "💼", label: "Work",       verse: "«Whatever you do, do it from the heart» — Col 3:23",          saint: "St. Joseph the Worker",       template: "Lord, bless my work today in..." },
    { id: "duelo",      icon: "🕯️", label: "Grief",     verse: "«Blessed are those who mourn» — Mt 5:4",                     saint: "Our Lady of Sorrows",         template: "Lord, I carry in my heart the loss of..." },
    { id: "salud",      icon: "❤️", label: "Health",     verse: "«Heal the sick» — Lk 9:2",                                   saint: "St. Raphael the Archangel",   template: "Lord, I pray for the health of..." },
    { id: "decisiones", icon: "⚖️", label: "Decisions",  verse: "«Trust in the Lord with all your heart» — Prov 3:5",         saint: "Holy Spirit",                 template: "Lord, I need wisdom to decide about..." },
  ],
};

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
  const [notifGospel, setNotifGospel] = useState(false);
  const [notifRosary, setNotifRosary] = useState(false);
  const [notifLiturgy, setNotifLiturgy] = useState(false);
  const [gospelTime, setGospelTime] = useState("07:00");
  const [rosaryTime, setRosaryTime] = useState("19:00");
  const [liturgyTime, setLiturgyTime] = useState("06:00");
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [personalTab, setPersonalTab] = useState("builder");
  const [selectedMood, setSelectedMood] = useState(null);
  const [prayerIntention, setPrayerIntention] = useState("");
  const [savedPrayers, setSavedPrayers] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const transactionId = params.get('id');

      console.log('[wompi-redirect] params completos:', window.location.search);
      console.log('[wompi-redirect] transactionId:', transactionId);

      setPaymentSuccess(true);
      setCart([]);
      setCheckoutStep(0);
      window.history.replaceState({}, '', '/');

      if (transactionId) {
        try {
          const stored = localStorage.getItem('pendingOrder');
          console.log('[wompi-redirect] pendingOrder encontrado:', !!stored);
          if (stored) {
            localStorage.removeItem('pendingOrder');
            axios.post('/api/confirm-payment', { ...JSON.parse(stored), transactionId })
              .then(r => console.log('[wompi-redirect] confirm-payment OK:', r.data))
              .catch(e => console.error('[wompi-redirect] confirm-payment ERROR:', e.response?.data || e.message));
          }
        } catch (e) {
          console.error('[wompi-redirect] excepción parseando localStorage:', e.message);
        }
      } else {
        console.warn('[wompi-redirect] Wompi no envió el parámetro "id" en la URL');
      }
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const cacheKey = `gospel_v3_${lang}_${day}_${month}_${year}`;
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
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setCheckoutName(u.displayName || "");
        setCheckoutEmail(u.email || "");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("personal_prayers");
      if (stored) setSavedPrayers(JSON.parse(stored));
    } catch (_) {}
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

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.id !== productId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!checkoutName || !checkoutEmail) return;
    setCheckoutLoading(true);
    try {
      const res = await axios.post('/api/order', {
        items: cart.map(i => ({ id: i.id, name: lang === 'es' ? i.nameEs : i.nameEn, price: i.price, quantity: i.quantity })),
        customer: { name: checkoutName, email: checkoutEmail },
      });
      if (res.data.success) {
        const { publicKey, reference, amountInCents, currency, signature, customerEmail } = res.data;
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = 'https://checkout.wompi.co/p/';
        const params = {
          'public-key': publicKey,
          'currency': currency,
          'amount-in-cents': amountInCents,
          'reference': reference,
          'signature:integrity': signature,
          'customer-data:email': customerEmail,
          'customer-data:full-name': checkoutName,
          'redirect-url': window.location.origin + '?payment=success',
        };
        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        localStorage.setItem('pendingOrder', JSON.stringify({
          customerName: checkoutName,
          customerEmail: checkoutEmail,
          items: cart.map(i => ({ id: i.id, name: lang === 'es' ? i.nameEs : i.nameEn, icon: i.icon, price: i.price, quantity: i.quantity })),
          total: cartTotal,
          reference,
        }));
        document.body.appendChild(form);
        form.submit();
      }
    } catch (e) { console.error(e); }
    setCheckoutLoading(false);
  };

  const t = translations[lang];

  const renderPaymentSuccess = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,28,50,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: WHITE, borderRadius: 24, padding: 32, width: "100%", maxWidth: 380, textAlign: "center", boxShadow: "0 20px 60px rgba(15,28,50,0.25)" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🙏</div>
        <div style={{ fontSize: 24, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cinzel', serif", marginBottom: 8 }}>
          {lang === 'es' ? '¡Gracias por tu compra!' : 'Thank you for your purchase!'}
        </div>
        <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>
          {lang === 'es' ? 'Tu pago fue aprobado. Recibirás un email de confirmación pronto.' : 'Your payment was approved. You will receive a confirmation email soon.'}
        </div>
        <div style={{ fontSize: 13, color: NAVY, fontStyle: "italic", marginBottom: 24, fontFamily: "'Crimson Text', serif" }}>
          {lang === 'es' ? '«Gratis recibisteis, dad gratis» — Mateo 10:8' : '«Freely you have received, freely give» — Matthew 10:8'}
        </div>
        <button onClick={() => setPaymentSuccess(false)} style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", padding: "12px 28px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif" }}>
          {lang === 'es' ? 'Continuar →' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderAuthModal = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,28,50,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setAuthMode(null)}>
      <div style={{ background: WHITE, borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(15,28,50,0.25)" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✝️</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: NAVY, fontFamily: "'Cinzel', serif" }}>
            {authMode === 'register' ? (lang === 'es' ? 'Crear cuenta' : 'Create account') : (lang === 'es' ? 'Iniciar sesión' : 'Sign in')}
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{lang === 'es' ? 'Únete a nuestra comunidad de fe' : 'Join our faith community'}</div>
        </div>
        <button onClick={handleGoogle} style={{ width: "100%", padding: "12px", background: CREAM, color: NAVY_DARK, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Cinzel', serif" }}>
          <span style={{ fontSize: 18 }}>G</span> {lang === 'es' ? 'Continuar con Google' : 'Continue with Google'}
        </button>
        <div style={{ textAlign: "center", color: MUTED, fontSize: 12, marginBottom: 16 }}>— {lang === 'es' ? 'o con email' : 'or with email'} —</div>
        {authMode === 'register' && <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} value={authName} onChange={e => setAuthName(e.target.value)} />}
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder="Email" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 16, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder={lang === 'es' ? 'Contraseña' : 'Password'} type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
        {authError && <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#cc0000", marginBottom: 12 }}>{authError}</div>}
        <button onClick={authMode === 'register' ? handleRegister : handleLogin} disabled={authLoading} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>
          {authLoading ? '...' : authMode === 'register' ? (lang === 'es' ? 'Registrarme' : 'Register') : (lang === 'es' ? 'Entrar' : 'Sign in')}
        </button>
        <div style={{ textAlign: "center", fontSize: 13, color: MUTED }}>
          {authMode === 'register'
            ? <>{lang === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}<span style={{ color: NAVY, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('login')}>{lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span></>
            : <>{lang === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}<span style={{ color: NAVY, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('register')}>{lang === 'es' ? 'Regístrate' : 'Register'}</span></>
          }
        </div>
      </div>
    </div>
  );

  const renderCartModal = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,28,50,0.75)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => { setShowCart(false); setCheckoutStep(0); }}>
      <div style={{ background: WHITE, borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cinzel', serif" }}>🛒 {lang === 'es' ? 'Tu carrito' : 'Your cart'}</div>
          <button onClick={() => { setShowCart(false); setCheckoutStep(0); }} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: MUTED }}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: MUTED, padding: 30, fontSize: 14 }}>{lang === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'}</div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${CREAM_DARK}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold", color: NAVY_DARK, fontSize: 13 }}>{lang === 'es' ? item.nameEs : item.nameEn}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>x{item.quantity} · {formatPrice(item.price)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: "bold", color: NAVY, fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontWeight: "bold" }}>
              <span style={{ color: NAVY_DARK, fontFamily: "'Cinzel', serif" }}>Total</span>
              <span style={{ color: NAVY, fontSize: 18 }}>{formatPrice(cartTotal)}</span>
            </div>
            {checkoutStep === 0 ? (
              <button onClick={() => setCheckoutStep(1)} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif" }}>
                {lang === 'es' ? 'Proceder al pago →' : 'Proceed to checkout →'}
              </button>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: "bold", color: NAVY_DARK, marginBottom: 12, fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? 'Datos de contacto' : 'Contact details'}</div>
                <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder={lang === 'es' ? 'Nombre completo' : 'Full name'} value={checkoutName} onChange={e => setCheckoutName(e.target.value)} />
                <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 16, fontFamily: "'Cinzel', serif", boxSizing: "border-box", background: CREAM }} placeholder="Email" type="email" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} />
                <button onClick={handleCheckout} disabled={checkoutLoading || !checkoutName || !checkoutEmail} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, #2E7D32, #1B5E20)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif", marginBottom: 8 }}>
                  {checkoutLoading ? '...' : `💳 ${lang === 'es' ? 'Pagar con Wompi' : 'Pay with Wompi'} · ${formatPrice(cartTotal)}`}
                </button>
                <button onClick={() => setCheckoutStep(0)} style={{ width: "100%", padding: "10px", background: CREAM_DARK, color: NAVY_DARK, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>← {lang === 'es' ? 'Volver' : 'Back'}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderHome = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: '' };
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 20, padding: "24px 20px", marginBottom: 16, color: WHITE, position: "relative", overflow: "hidden" }}>
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
        <div style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}40`, borderRadius: 12, padding: "10px 16px", fontSize: 12, color: NAVY, marginBottom: 24 }}>{t.home.reminder}</div>
        {t.home.cards.map((c, i) => (
          <div key={i} style={{ background: c.gradient, borderRadius: 22, padding: "26px 24px", marginBottom: 18, color: WHITE, position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(15,28,50,0.18)", minHeight: 152, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setTab(c.tab)}>
            <div style={{ position: "absolute", bottom: -24, right: -12, fontSize: 120, opacity: 0.09, lineHeight: 1 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 42, marginBottom: 14, lineHeight: 1 }}>{c.icon}</div>
              <div style={{ fontWeight: "bold", fontSize: 19, marginBottom: 8, fontFamily: "'Cinzel', serif", lineHeight: 1.2 }}>{c.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(255,255,255,0.88)" }}>
                {i === 0 && gospelData ? (
                  <><span style={{ fontWeight: "bold", color: GOLD_LIGHT, display: "block", marginBottom: 4 }}>{lang === 'en' ? gospelData?.reference : reference}</span>{body.substring(0, 90) + "…"}</>
                ) : i === 1 && gospelData?.reading1 ? (
                  <><span style={{ fontWeight: "bold", color: "#90CAF9", display: "block", marginBottom: 4 }}>{gospelData.reading1.reference}</span>{gospelData.reading1.text.substring(0, 90) + "…"}</>
                ) : c.desc}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.32)", padding: "8px 20px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>{c.btn} →</span>
            </div>
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
        <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: "18px 20px", marginBottom: 16, color: WHITE }}>
          <div style={{ fontSize: 13, color: GOLD_LIGHT, fontStyle: "italic", marginBottom: 4 }}>{lang === 'es' ? 'Lectura del santo Evangelio' : 'Reading of the Holy Gospel'}</div>
          <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>{lang === 'en' ? gospelData?.reference : (reference || t.gospel.reading)}</div>
        </div>
        <div style={{ background: WHITE, borderRadius: 16, padding: 20, fontSize: 14, lineHeight: 1.9, color: "#3A2A1E", whiteSpace: "pre-wrap", boxShadow: "0 4px 16px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
          {formatted}{"\n\n"}<span style={{ color: NAVY, fontWeight: "bold", fontStyle: "italic" }}>— {lang === 'es' ? 'Palabra del Señor.' : 'The Gospel of the Lord.'}</span>
        </div>
      </div>
    );
  };

  const renderReadings = () => {
    const sections = [];
    if (gospelData?.reading1) sections.push({ key: 'r1', title: lang === 'es' ? 'Primera Lectura' : 'First Reading', ref: gospelData.reading1.reference, text: gospelData.reading1.text, icon: '📜' });
    if (gospelData?.reading2) sections.push({ key: 'r2', title: lang === 'es' ? 'Segunda Lectura' : 'Second Reading', ref: gospelData.reading2.reference, text: gospelData.reading2.text, icon: '📋' });
    if (gospelData?.psalm) sections.push({ key: 'ps', title: lang === 'es' ? 'Salmo Responsorial' : 'Responsorial Psalm', ref: gospelData.psalm.reference, text: gospelData.psalm.text, icon: '🎵' });
    if (!gospelData) return <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>{lang === 'es' ? 'Cargando lecturas...' : 'Loading readings...'}</div>;
    return (
      <div>
        {sections.map((s) => (
          <div key={s.key} style={{ background: WHITE, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(26,58,92,0.08)", border: `1px solid ${CREAM_DARK}` }}>
            <div onClick={() => setOpenReading(openReading === s.key ? null : s.key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: "bold", color: BLUE_DARK, fontSize: 15, fontFamily: "'Cinzel', serif" }}>{s.icon} {s.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.ref}</div>
              </div>
              <span style={{ color: BLUE, fontSize: 20, fontWeight: "bold" }}>{openReading === s.key ? "−" : "+"}</span>
            </div>
            {openReading === s.key && <div style={{ padding: "0 18px 18px", fontSize: 14, color: "#1A2A3A", lineHeight: 1.9, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14, whiteSpace: "pre-wrap" }}>{s.text}</div>}
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
          <button key={i} onClick={() => setSelectedMystery(i)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedMystery === i ? NAVY : CREAM_DARK}`, background: selectedMystery === i ? NAVY : WHITE, color: selectedMystery === i ? WHITE : MUTED, fontSize: 11, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>{m}</button>
        ))}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {t.rosary.steps.map((step, i) => (
          <li key={i} onClick={() => setRosaryStep(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 6, background: i < rosaryStep ? "#f5f0ff" : rosaryStep === i ? `${NAVY}11` : WHITE, border: `1px solid ${i < rosaryStep ? "#c4b5e8" : rosaryStep === i ? NAVY : CREAM_DARK}`, fontSize: 13, color: i < rosaryStep ? "#6B4F9E" : NAVY_DARK, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>{i < rosaryStep ? "✅" : rosaryStep === i ? "👉" : "○"}</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={() => setRosaryStep(Math.max(0, rosaryStep - 1))} style={{ flex: 1, padding: "10px", background: CREAM_DARK, color: NAVY_DARK, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>← {lang === 'es' ? 'Anterior' : 'Previous'}</button>
        <button onClick={() => setRosaryStep(Math.min(t.rosary.steps.length - 1, rosaryStep + 1))} style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? 'Siguiente' : 'Next'} →</button>
      </div>
    </div>
  );

  const renderPrayers = () => (
    <div>
      {t.prayers.list.map((p, i) => (
        <div key={i} style={{ background: WHITE, borderRadius: 16, marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
          <div onClick={() => setOpenPrayer(openPrayer === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
            <span style={{ fontWeight: "bold", color: NAVY_DARK, fontSize: 15, fontFamily: "'Cinzel', serif" }}>🙏 {p.name}</span>
            <span style={{ color: NAVY, fontSize: 20, fontWeight: "bold" }}>{openPrayer === i ? "−" : "+"}</span>
          </div>
          {openPrayer === i && <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#3A2A1E", lineHeight: 1.8, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14 }}>{p.text}</div>}
        </div>
      ))}
    </div>
  );

  const renderReflections = () => (
    <div>
      {t.reflections.daily.map((r, i) => (
        <div key={i} style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_MID}, #7C4A1E)`, borderRadius: 20, padding: "22px 20px", marginBottom: 14, color: WHITE, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.08 }}>✝</div>
          <div style={{ fontSize: 13, color: GOLD, marginBottom: 4 }}>✨ {lang === 'es' ? 'Reflexión del día' : 'Daily reflection'}</div>
          <div style={{ fontSize: 16, fontStyle: "italic", lineHeight: 1.7, marginBottom: 14, fontFamily: "'Crimson Text', serif" }}>{r.quote}</div>
          <div style={{ fontSize: 12, color: GOLD_LIGHT, fontWeight: "bold" }}>— {r.author}</div>
        </div>
      ))}
    </div>
  );

  const renderPersonalPrayer = () => {
    const moods = PRAYER_MOODS[lang];
    const mood = moods.find(m => m.id === selectedMood);

    const savePrayer = () => {
      if (!mood || !prayerIntention.trim()) return;
      const newPrayer = {
        id: Date.now(),
        date: new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" }),
        moodId: mood.id,
        moodLabel: mood.label,
        moodIcon: mood.icon,
        intention: prayerIntention.trim(),
        received: false,
      };
      const updated = [newPrayer, ...savedPrayers];
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
      setPrayerIntention("");
      setSelectedMood(null);
      setPersonalTab("journal");
    };

    const toggleReceived = (id) => {
      const updated = savedPrayers.map(p => p.id === id ? { ...p, received: !p.received } : p);
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
    };

    const deletePrayer = (id) => {
      const updated = savedPrayers.filter(p => p.id !== id);
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
    };

    return (
      <div>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["builder", "🕊️", lang === "es" ? "Constructor" : "Builder"], ["journal", "📔", lang === "es" ? "Diario de Gracias" : "Gratitude Journal"]].map(([key, icon, label]) => (
            <button key={key} onClick={() => setPersonalTab(key)} style={{ flex: 1, padding: "10px 8px", borderRadius: 12, background: personalTab === key ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : WHITE, color: personalTab === key ? WHITE : MUTED, border: `1px solid ${personalTab === key ? NAVY : CREAM_DARK}`, fontSize: 12, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif" }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {personalTab === "builder" ? (
          <div>
            <div style={{ fontSize: 15, fontWeight: "bold", color: NAVY_DARK, marginBottom: 14, fontFamily: "'Cinzel', serif" }}>
              {lang === "es" ? "¿Cómo está tu corazón hoy?" : "How is your heart today?"}
            </div>

            {/* Mood grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
              {moods.map(m => (
                <button key={m.id} onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)} style={{ padding: "10px 4px", borderRadius: 12, background: selectedMood === m.id ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : WHITE, color: selectedMood === m.id ? WHITE : NAVY_DARK, border: `1.5px solid ${selectedMood === m.id ? NAVY : CREAM_DARK}`, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 9, fontWeight: "bold", fontFamily: "'Cinzel', serif", lineHeight: 1.2 }}>{m.label}</div>
                </button>
              ))}
            </div>

            {/* Selected mood content */}
            {mood && (
              <div>
                <div style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}55`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontStyle: "italic", color: NAVY_DARK, lineHeight: 1.7, fontFamily: "'Crimson Text', serif" }}>{mood.verse}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, background: WHITE, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <span style={{ fontSize: 22 }}>🕯️</span>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "es" ? "Santo patrono sugerido" : "Suggested patron saint"}</div>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cinzel', serif" }}>{mood.saint}</div>
                  </div>
                </div>

                <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>{mood.template}</div>
                  <textarea
                    value={prayerIntention}
                    onChange={e => setPrayerIntention(e.target.value)}
                    placeholder={lang === "es" ? "Escribe tu intención aquí..." : "Write your intention here..."}
                    style={{ width: "100%", minHeight: 100, padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: NAVY_DARK, background: CREAM, fontFamily: "'Georgia', serif", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, outline: "none" }}
                  />
                </div>

                <button onClick={savePrayer} disabled={!prayerIntention.trim()} style={{ width: "100%", padding: "13px", background: prayerIntention.trim() ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : CREAM_DARK, color: prayerIntention.trim() ? WHITE : MUTED, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: prayerIntention.trim() ? "pointer" : "default", fontFamily: "'Cinzel', serif" }}>
                  🕊️ {lang === "es" ? "Guardar oración" : "Save prayer"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {savedPrayers.length === 0 ? (
              <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📔</div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{lang === "es" ? "Aún no tienes oraciones guardadas." : "No saved prayers yet."}</div>
                <div style={{ fontSize: 13, color: MUTED }}>{lang === "es" ? "Usa el Constructor para crear tu primera oración ↑" : "Use the Builder to create your first prayer ↑"}</div>
              </div>
            ) : savedPrayers.map(p => (
              <div key={p.id} style={{ background: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${p.received ? GOLD + "66" : CREAM_DARK}`, boxShadow: p.received ? `0 2px 16px ${GOLD}22` : "0 2px 8px rgba(15,28,50,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{p.moodIcon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cinzel', serif" }}>{p.moodLabel}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{p.date}</div>
                    </div>
                  </div>
                  {p.received && (
                    <span style={{ fontSize: 11, background: `${GOLD}22`, color: "#8B6A1A", padding: "3px 10px", borderRadius: 20, fontWeight: "bold", flexShrink: 0 }}>
                      ✨ {lang === "es" ? "Recibida" : "Received"}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 13, color: "#5A3A2E", lineHeight: 1.65, marginBottom: 12, fontStyle: "italic", borderLeft: `3px solid ${CREAM_DARK}`, paddingLeft: 10 }}>
                  {p.intention.length > 140 ? p.intention.substring(0, 140) + "…" : p.intention}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleReceived(p.id)} style={{ flex: 1, padding: "7px 10px", borderRadius: 20, border: `1px solid ${p.received ? GOLD : CREAM_DARK}`, background: p.received ? `${GOLD}18` : WHITE, color: p.received ? "#8B6A1A" : MUTED, fontSize: 12, cursor: "pointer", fontWeight: "bold" }}>
                    {p.received ? `✨ ${lang === "es" ? "Gracia recibida" : "Grace received"}` : `○ ${lang === "es" ? "Marcar como recibida" : "Mark as received"}`}
                  </button>
                  <button onClick={() => deletePrayer(p.id)} style={{ padding: "7px 12px", borderRadius: 20, border: `1px solid ${CREAM_DARK}`, background: WHITE, color: MUTED, fontSize: 12, cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderShop = () => (
    <div>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16, fontStyle: "italic" }}>{lang === 'es' ? 'Artículos para acompañar tu fe' : 'Items to accompany your faith'}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {products.map((item) => (
          <div key={item.id} style={{ background: WHITE, borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(15,28,50,0.07)", position: "relative", textAlign: "center", border: `1px solid ${CREAM_DARK}` }}>
            {item.tag && <span style={{ position: "absolute", top: 8, right: 8, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, fontSize: 9, fontWeight: "bold", padding: "3px 8px", borderRadius: 10 }}>{item.tag}</span>}
            <div style={{ fontSize: 36, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: NAVY_DARK, marginBottom: 4, fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? item.nameEs : item.nameEn}</div>
            <div style={{ fontSize: 15, color: NAVY, fontWeight: "bold", marginBottom: 10 }}>{formatPrice(item.price)}</div>
            <button onClick={() => addToCart(item)} style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", padding: "8px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", width: "100%", fontFamily: "'Cinzel', serif" }}>
              {lang === "es" ? "Añadir al carrito" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <button onClick={() => setShowCart(true)} style={{ position: "fixed", bottom: 24, right: 24, background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 30, padding: "14px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(15,28,50,0.35)", zIndex: 50, fontFamily: "'Cinzel', serif" }}>
          🛒 {cartCount} · {formatPrice(cartTotal)}
        </button>
      )}
    </div>
  );

  const renderSettings = () => {
    const scheduleNotification = (time, title, body) => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const notifTime = new Date();
      notifTime.setHours(hours, minutes, 0, 0);
      if (notifTime <= now) notifTime.setDate(notifTime.getDate() + 1);
      setTimeout(() => {
        if (Notification.permission === 'granted') new Notification(title, { body, icon: '/icon-192.png' });
      }, notifTime - now);
    };

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if (notifGospel) scheduleNotification(gospelTime, '📖 Evangelio del día', 'Lee el Evangelio de hoy');
        if (notifRosary) scheduleNotification(rosaryTime, '📿 Santo Rosario', 'Es hora de rezar el Rosario');
        if (notifLiturgy) scheduleNotification(liturgyTime, '🕐 Liturgia de las Horas', 'Momento de oración litúrgica');
      }
    };

    const switchStyle = (active) => ({ width: 44, height: 24, borderRadius: 12, background: active ? NAVY : CREAM_DARK, position: "relative", cursor: "pointer", border: "none", flexShrink: 0 });
    const knobStyle = (active) => ({ position: "absolute", top: 2, left: active ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: WHITE, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" });

    const notifs = [
      { label: lang === 'es' ? '📖 Evangelio del día' : '📖 Gospel of the Day', desc: lang === 'es' ? 'Recordatorio matutino' : 'Morning reminder', active: notifGospel, setter: setNotifGospel, time: gospelTime, setTime: setGospelTime },
      { label: lang === 'es' ? '📿 Santo Rosario' : '📿 Holy Rosary', desc: lang === 'es' ? 'Recordatorio para rezar el Rosario' : 'Rosary reminder', active: notifRosary, setter: setNotifRosary, time: rosaryTime, setTime: setRosaryTime },
      { label: lang === 'es' ? '🕐 Liturgia de las Horas' : '🕐 Liturgy of the Hours', desc: lang === 'es' ? 'Laudes y Vísperas' : 'Lauds and Vespers', active: notifLiturgy, setter: setNotifLiturgy, time: liturgyTime, setTime: setLiturgyTime },
    ];

    return (
      <div>
        {Notification.permission !== 'granted' && (
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: 20, marginBottom: 16, color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? 'Activar notificaciones' : 'Enable notifications'}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>{lang === 'es' ? 'Recibe recordatorios para rezar cada día' : 'Receive daily prayer reminders'}</div>
            <button onClick={requestPermission} style={{ background: GOLD, color: NAVY_DARK, border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cinzel', serif" }}>{lang === 'es' ? 'Permitir notificaciones' : 'Allow notifications'}</button>
          </div>
        )}
        {notifs.map((n, i) => (
          <div key={i} style={{ background: WHITE, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: "0 2px 12px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", color: NAVY_DARK, fontSize: 14, fontFamily: "'Cinzel', serif" }}>{n.label}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{n.desc}</div>
              </div>
              <button style={switchStyle(n.active)} onClick={() => n.setter(!n.active)}>
                <div style={knobStyle(n.active)} />
              </button>
            </div>
            {n.active && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span style={{ fontSize: 12, color: MUTED }}>{lang === 'es' ? 'Hora:' : 'Time:'}</span>
                <input type="time" value={n.time} onChange={e => n.setTime(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${CREAM_DARK}`, fontSize: 13, color: NAVY_DARK, background: CREAM }} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const navIcons = ["🏠","📖","📜","📿","🙏","💭","🕊️","🛒","⚙️"];
  const sections = [renderHome, renderGospel, renderReadings, renderRosary, renderPrayers, renderReflections, renderPersonalPrayer, renderShop, renderSettings];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: CREAM, minHeight: "100vh", maxWidth: 430, margin: "0 auto", boxShadow: "0 0 60px rgba(15,28,50,0.12)" }}>
      {paymentSuccess && renderPaymentSuccess()}
      {authMode && renderAuthModal()}
      {showCart && renderCartModal()}

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(180deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`, color: WHITE, position: "sticky", top: 0, zIndex: 40 }}>

        {/* Barra superior: hamburguesa + logo izquierda | acciones derecha */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 14px 10px", gap: 10 }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, width: 36, height: 36, borderRadius: 10, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {menuOpen ? "✕" : "☰"}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: "bold", letterSpacing: 1.5, color: GOLD, fontFamily: "'Cinzel', serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>✝ {t.appName}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontStyle: "italic", letterSpacing: 0.4, marginTop: 1 }}>{t.tagline}</div>
          </div>

          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: GOLD, width: 30, height: 30, borderRadius: 8, fontSize: 9, cursor: "pointer", fontWeight: "bold", fontFamily: "'Cinzel', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            {!user ? (
              <button onClick={() => setAuthMode('login')} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, width: 30, height: 30, borderRadius: 8, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</button>
            ) : (
              <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, width: 30, height: 30, borderRadius: 8, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title={lang === 'es' ? 'Salir' : 'Sign out'}>👤</button>
            )}
            <button onClick={() => setShowCart(true)} style={{ background: cartCount > 0 ? GOLD : "rgba(255,255,255,0.1)", border: "none", color: cartCount > 0 ? NAVY_DARK : WHITE, width: 30, height: 30, borderRadius: 8, fontSize: cartCount > 0 ? 9 : 14, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount > 0 ? `🛒${cartCount}` : "🛒"}
            </button>
          </div>
        </div>

        {/* Accesos rápidos — 5 ítems que llenan el ancho */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 5, padding: "7px 10px 9px" }}>
          {[
            { icon: "📖", label: lang === 'es' ? "Evangelio" : "Gospel",  idx: 1 },
            { icon: "📜", label: lang === 'es' ? "Lecturas"  : "Readings", idx: 2 },
            { icon: "📿", label: lang === 'es' ? "Rosario"   : "Rosary",   idx: 3 },
            { icon: "🕊️", label: lang === 'es' ? "Oración"  : "Prayer",   idx: 6 },
            { icon: "🛒", label: lang === 'es' ? "Tienda"    : "Shop",     idx: 7 },
          ].map(({ icon, label, idx }) => (
            <button key={idx} onClick={() => setTab(idx)} style={{ flex: 1, padding: "6px 4px", background: tab === idx ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.12)", border: `1px solid ${tab === idx ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.2)"}`, borderRadius: 10, color: tab === idx ? GOLD : "rgba(255,255,255,0.75)", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 2, lineHeight: 1 }}>{icon}</div>
              <div style={{ fontSize: 9, fontWeight: "bold", fontFamily: "'Cinzel', serif", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{label}</div>
            </button>
          ))}
        </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <div style={{ background: NAVY_DARK, borderTop: "1px solid rgba(255,255,255,0.08)", maxHeight: "60vh", overflowY: "auto" }}>
            {t.nav.map((n, i) => (
              <button key={i} onClick={() => { setTab(i); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "13px 20px", background: tab === i ? "rgba(201,168,76,0.1)" : "none", border: "none", borderLeft: tab === i ? `3px solid ${GOLD}` : "3px solid transparent", color: tab === i ? GOLD : "rgba(255,255,255,0.75)", fontSize: 14, cursor: "pointer", fontFamily: "'Cinzel', serif", textAlign: "left" }}>
                <span style={{ fontSize: 18 }}>{navIcons[i]}</span>
                <span>{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ padding: "20px 20px 52px" }}>
        {tab !== 0 && (
          <div style={{ fontSize: 19, fontWeight: "bold", color: NAVY, marginBottom: 18, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12, fontFamily: "'Cinzel', serif" }}>
            {t.nav[tab]}
          </div>
        )}
        {sections[tab]()}
      </div>
    </div>
  );
}
