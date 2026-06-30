import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc, getDoc, setDoc, serverTimestamp, arrayUnion, arrayRemove, deleteDoc, where } from "firebase/firestore";
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
const db = getFirestore(app);
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
    nav: ["Inicio", "Oración personal", "Evangelio", "Lecturas del día", "Rosario", "Devocional", "La Biblia", "Reflexiones", "Tienda", "Configuración"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "🕊️", title: "Oración Personal", desc: "Construye tu oración y lleva un diario de gracias", btn: "Comenzar", img: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600", tab: 1 },
        { icon: "📖", title: "Evangelio del Día", desc: "La Palabra de Dios para hoy", btn: "Leer más", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600", tab: 2 },
        { icon: "📜", title: "Lecturas del Día", desc: "Primera Lectura y Salmo del día", btn: "Ver lecturas", img: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=600", tab: 3 },
        { icon: "📿", title: "Santo Rosario", desc: "Misterios Gloriosos · Miércoles y Domingos", btn: "Comenzar", img: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600", tab: 4 },
        { icon: "🙏", title: "Devocional", desc: "Oraciones y reflexiones para tu fe", btn: "Rezar", img: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?w=600", tab: 5 },
        { icon: "🛒", title: "Tienda", desc: "Artículos de fe para tu hogar y devoción", btn: "Ver tienda", img: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600", tab: 8 },
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
    nav: ["Home", "Personal prayer", "Gospel", "Daily readings", "Rosary", "Devotional", "Bible", "Reflections", "Shop", "Settings"],
    home: {
      greeting: "May the peace of the Lord be with you",
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "🕊️", title: "Personal Prayer", desc: "Build your prayer and keep a gratitude journal", btn: "Start", img: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600", tab: 1 },
        { icon: "📖", title: "Gospel of the Day", desc: "God's Word for today", btn: "Read more", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600", tab: 2 },
        { icon: "📜", title: "Daily Readings", desc: "First Reading and Psalm of the day", btn: "View readings", img: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=600", tab: 3 },
        { icon: "📿", title: "Holy Rosary", desc: "Glorious Mysteries · Wednesday & Sunday", btn: "Begin", img: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600", tab: 4 },
        { icon: "🙏", title: "Devotional", desc: "Prayers and reflections for your faith", btn: "Pray", img: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?w=600", tab: 5 },
        { icon: "🛒", title: "Shop", desc: "Faith items for your home and devotion", btn: "View shop", img: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600", tab: 8 },
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
    { id: "gratitud",   icon: "✝", label: "Gratitud",   verse: "«Dad gracias en todo» — 1 Tes 5:18",                           saint: "San Francisco de Asís",         template: "Señor, te doy gracias por...",                       prayer: "Señor y Dios mío,\n\nCon el corazón lleno de gratitud me postro ante Ti. Gracias por cada bendición que derramas sobre mi vida, por Tu amor que nunca falla y por la gracia de este nuevo día. Tu bondad me rodea y Tu misericordia me sostiene.\n\nQue mis labios siempre Te bendigan y que mi corazón nunca olvide lo que Tu mano ha hecho por mí.\n\nAmén." },
    { id: "ansiedad",   icon: "🕊", label: "Ansiedad",   verse: "«No se turbe vuestro corazón» — Jn 14:1",                      saint: "Santa Teresa de Ávila",         template: "Señor, siento angustia por... confío en Ti porque...", prayer: "Señor Jesús,\n\nTú que dijiste «No se turbe vuestro corazón», vengo a Ti cargado/a de preocupaciones. Deposito en Tus manos todo lo que me inquieta y perturba mi paz. Tú conoces lo que siento mejor que yo mismo/a.\n\nQue Tu paz, que sobrepasa todo entendimiento, guarde mi corazón y mi mente en Ti. Confío en Tu amor.\n\nAmén." },
    { id: "familia",    icon: "♡", label: "Familia",    verse: "«El amor es paciente» — 1 Cor 13:4",                           saint: "San José",                      template: "Señor, pongo en tus manos a mi familia, especialmente a...", prayer: "Padre celestial,\n\nTe encomiendo a mi familia. Que Tu amor sea el cimiento de nuestro hogar, que el perdón sea nuestra práctica diaria y la alegría nuestra herencia. Protege a cada uno de los que amo.\n\nSan José, modelo de fidelidad y amor, intercede por nosotros. Que Dios bendiga nuestro hogar.\n\nAmén." },
    { id: "trabajo",    icon: "✝", label: "Trabajo",    verse: "«Todo lo que hagan, háganlo de corazón» — Col 3:23",           saint: "San José Obrero",               template: "Señor, bendice mi trabajo hoy en...",                 prayer: "Señor,\n\nBendice el trabajo de mis manos. Que todo lo que realice hoy sea ofrendado a Ti, para Tu gloria y el bien de mis hermanos. Dame sabiduría para decidir, fortaleza para perseverar y un corazón generoso para servir.\n\nSan José Obrero, patrono del trabajo honesto, intercede por mí.\n\nAmén." },
    { id: "duelo",      icon: "🕯", label: "Duelo",     verse: "«Bienaventurados los que lloran» — Mt 5:4",                    saint: "Nuestra Señora de los Dolores", template: "Señor, llevo en mi corazón la pérdida de...",         prayer: "Señor de la vida y de la muerte,\n\nVengo a Ti con el corazón roto. En medio de la oscuridad del dolor, creo que Tú estás presente y que ninguna lágrima cae sin que Tú la veas. Tú que resucitaste, transforma mi duelo en esperanza.\n\nNuestra Señora de los Dolores, que conociste el dolor junto a la cruz, acompáñame en este camino.\n\nAmén." },
    { id: "salud",      icon: "✞", label: "Salud",      verse: "«Sana a los enfermos» — Lc 9:2",                              saint: "San Rafael Arcángel",           template: "Señor, te pido por la salud de...",                  prayer: "Señor Jesucristo,\n\nTú que recorriste los caminos de Galilea sanando a los enfermos con Tu sola palabra, te pido salud y restauración. Pon Tu mano misericordiosa sobre quien sufre y devuélvele la fortaleza y la paz.\n\nSan Rafael Arcángel, medicina de Dios, intercede ante el Señor por esta intención.\n\nAmén." },
    { id: "decisiones", icon: "✦", label: "Decisiones", verse: "«Fíate del Señor con todo tu corazón» — Prov 3:5",            saint: "Espíritu Santo",                template: "Señor, necesito sabiduría para decidir sobre...",    prayer: "Espíritu Santo,\n\nVen a iluminar mi mente y a guiar mis pasos. Me encuentro en una encrucijada y necesito Tu sabiduría. Dame el discernimiento para reconocer Tu voluntad y el valor para seguirla, aunque no lo entienda todo.\n\nSeñor, no mi voluntad sino la Tuya.\n\nAmén." },
    { id: "otra",       icon: "✿", label: "Otra",       verse: "«Todo lo que pidan en mi nombre, lo haré» — Jn 14:13",        saint: "Espíritu Santo",                template: "Señor, quiero hablarte de...",                       prayer: "Señor,\n\nAquí estoy ante Ti con todo lo que llevo en el corazón. No sé cómo expresarlo con palabras, pero Tú conoces mis necesidades antes de que yo las formule. Escucha el clamor de mi alma.\n\nResponde según Tu voluntad perfecta y que en todo sea glorificado Tu santo nombre.\n\nAmén." },
  ],
  en: [
    { id: "gratitud",   icon: "✝", label: "Gratitude",  verse: "«Give thanks in all circumstances» — 1 Thes 5:18",            saint: "St. Francis of Assisi",       template: "Lord, I am grateful for...",                         prayer: "Lord my God,\n\nWith a heart full of gratitude I come before You. Thank You for every blessing You pour into my life, for Your love that never fails, and for the grace of this new day. Your goodness surrounds me and Your mercy sustains me.\n\nMay my lips always bless You and may my heart never forget what Your hand has done for me.\n\nAmen." },
    { id: "ansiedad",   icon: "🕊", label: "Anxiety",    verse: "«Let not your hearts be troubled» — Jn 14:1",                 saint: "St. Teresa of Ávila",         template: "Lord, I feel anxious about... I trust in You because...", prayer: "Lord Jesus,\n\nYou who said 'Let not your hearts be troubled,' I come to You burdened with worries. I place in Your hands everything that unsettles me and disturbs my peace. You know what I feel better than I do myself.\n\nMay Your peace, which surpasses all understanding, guard my heart and mind in You. I trust in Your love.\n\nAmen." },
    { id: "familia",    icon: "♡", label: "Family",     verse: "«Love is patient» — 1 Cor 13:4",                              saint: "St. Joseph",                  template: "Lord, I place my family in Your hands, especially...", prayer: "Heavenly Father,\n\nI entrust my family to You. May Your love be the foundation of our home, may forgiveness be our daily practice, and joy our inheritance. Protect each one of those I love.\n\nSt. Joseph, model of faithful love, intercede for us. May God bless our home.\n\nAmen." },
    { id: "trabajo",    icon: "✝", label: "Work",       verse: "«Whatever you do, do it from the heart» — Col 3:23",          saint: "St. Joseph the Worker",       template: "Lord, bless my work today in...",                     prayer: "Lord,\n\nBless the work of my hands. May everything I do today be offered to You, for Your glory and the good of my brothers and sisters. Give me wisdom to decide, strength to persevere, and a generous heart to serve.\n\nSt. Joseph the Worker, patron of honest labor, intercede for me.\n\nAmen." },
    { id: "duelo",      icon: "🕯", label: "Grief",     verse: "«Blessed are those who mourn» — Mt 5:4",                     saint: "Our Lady of Sorrows",         template: "Lord, I carry in my heart the loss of...",            prayer: "Lord of life and death,\n\nI come to You with a broken heart. In the darkness of pain, I believe that You are present and that no tear falls without You seeing it. You who rose again, transform my grief into hope.\n\nOur Lady of Sorrows, who knew pain beside the cross, accompany me on this journey.\n\nAmen." },
    { id: "salud",      icon: "✞", label: "Health",     verse: "«Heal the sick» — Lk 9:2",                                   saint: "St. Raphael the Archangel",   template: "Lord, I pray for the health of...",                   prayer: "Lord Jesus Christ,\n\nYou who healed the sick with Your word alone, I ask You for health and restoration. Lay Your merciful hand upon those who suffer and restore their strength and peace.\n\nSt. Raphael the Archangel, medicine of God, intercede before the Lord for this intention.\n\nAmen." },
    { id: "decisiones", icon: "✦", label: "Decisions",  verse: "«Trust in the Lord with all your heart» — Prov 3:5",         saint: "Holy Spirit",                 template: "Lord, I need wisdom to decide about...",              prayer: "Holy Spirit,\n\nCome to enlighten my mind and guide my steps. I find myself at a crossroads and I need Your wisdom. Give me the discernment to recognize Your will and the courage to follow it, even when I don't understand everything.\n\nLord, not my will but Yours.\n\nAmen." },
    { id: "otra",       icon: "✿", label: "Other",      verse: "«Whatever you ask in my name, I will do it» — Jn 14:13",     saint: "Holy Spirit",                 template: "Lord, I want to talk to you about...",                prayer: "Lord,\n\nHere I am before You with everything I carry in my heart. I don't know how to put it into words, but You know my needs before I express them. Hear the cry of my soul.\n\nRespond according to Your perfect will and may Your holy name be glorified in all things.\n\nAmen." },
  ],
};

const BIBLE_BOOKS = {
  es: {
    ot: {
      pentateuco:   [ { id:"GEN",name:"Génesis" },{ id:"EXO",name:"Éxodo" },{ id:"LEV",name:"Levítico" },{ id:"NUM",name:"Números" },{ id:"DEU",name:"Deuteronomio" } ],
      historicos:   [ { id:"JOS",name:"Josué" },{ id:"JDG",name:"Jueces" },{ id:"RUT",name:"Rut" },{ id:"1SA",name:"1 Samuel" },{ id:"2SA",name:"2 Samuel" },{ id:"1KI",name:"1 Reyes" },{ id:"2KI",name:"2 Reyes" },{ id:"1CH",name:"1 Crónicas" },{ id:"2CH",name:"2 Crónicas" },{ id:"EZR",name:"Esdras" },{ id:"NEH",name:"Nehemías" },{ id:"TOB",name:"Tobías" },{ id:"JDT",name:"Judit" },{ id:"EST",name:"Ester" },{ id:"1MA",name:"1 Macabeos" },{ id:"2MA",name:"2 Macabeos" } ],
      sapienciales: [ { id:"JOB",name:"Job" },{ id:"PSA",name:"Salmos" },{ id:"PRO",name:"Proverbios" },{ id:"ECC",name:"Eclesiastés" },{ id:"SNG",name:"Cantares" },{ id:"WIS",name:"Sabiduría" },{ id:"SIR",name:"Sirácide" } ],
      profeticos:   [ { id:"ISA",name:"Isaías" },{ id:"JER",name:"Jeremías" },{ id:"LAM",name:"Lamentaciones" },{ id:"BAR",name:"Baruc" },{ id:"EZK",name:"Ezequiel" },{ id:"DAN",name:"Daniel" },{ id:"HOS",name:"Oseas" },{ id:"JOL",name:"Joel" },{ id:"AMO",name:"Amós" },{ id:"OBA",name:"Abdías" },{ id:"JON",name:"Jonás" },{ id:"MIC",name:"Miqueas" },{ id:"NAM",name:"Nahúm" },{ id:"HAB",name:"Habacuc" },{ id:"ZEP",name:"Sofonías" },{ id:"HAG",name:"Ageo" },{ id:"ZEC",name:"Zacarías" },{ id:"MAL",name:"Malaquías" } ],
    },
    nt: {
      evangelios:  [ { id:"MAT",name:"Mateo" },{ id:"MRK",name:"Marcos" },{ id:"LUK",name:"Lucas" },{ id:"JHN",name:"Juan" } ],
      hechos:      [ { id:"ACT",name:"Hechos de los Apóstoles" } ],
      cartas:      [ { id:"ROM",name:"Romanos" },{ id:"1CO",name:"1 Corintios" },{ id:"2CO",name:"2 Corintios" },{ id:"GAL",name:"Gálatas" },{ id:"EPH",name:"Efesios" },{ id:"PHP",name:"Filipenses" },{ id:"COL",name:"Colosenses" },{ id:"1TH",name:"1 Tesalonicenses" },{ id:"2TH",name:"2 Tesalonicenses" },{ id:"1TI",name:"1 Timoteo" },{ id:"2TI",name:"2 Timoteo" },{ id:"TIT",name:"Tito" },{ id:"PHM",name:"Filemón" },{ id:"HEB",name:"Hebreos" },{ id:"JAS",name:"Santiago" },{ id:"1PE",name:"1 Pedro" },{ id:"2PE",name:"2 Pedro" },{ id:"1JN",name:"1 Juan" },{ id:"2JN",name:"2 Juan" },{ id:"3JN",name:"3 Juan" },{ id:"JUD",name:"Judas" } ],
      apocalipsis: [ { id:"REV",name:"Apocalipsis" } ],
    },
  },
  en: {
    ot: {
      pentateuco:   [ { id:"GEN",name:"Genesis" },{ id:"EXO",name:"Exodus" },{ id:"LEV",name:"Leviticus" },{ id:"NUM",name:"Numbers" },{ id:"DEU",name:"Deuteronomy" } ],
      historicos:   [ { id:"JOS",name:"Joshua" },{ id:"JDG",name:"Judges" },{ id:"RUT",name:"Ruth" },{ id:"1SA",name:"1 Samuel" },{ id:"2SA",name:"2 Samuel" },{ id:"1KI",name:"1 Kings" },{ id:"2KI",name:"2 Kings" },{ id:"1CH",name:"1 Chronicles" },{ id:"2CH",name:"2 Chronicles" },{ id:"EZR",name:"Ezra" },{ id:"NEH",name:"Nehemiah" },{ id:"TOB",name:"Tobit" },{ id:"JDT",name:"Judith" },{ id:"EST",name:"Esther" },{ id:"1MA",name:"1 Maccabees" },{ id:"2MA",name:"2 Maccabees" } ],
      sapienciales: [ { id:"JOB",name:"Job" },{ id:"PSA",name:"Psalms" },{ id:"PRO",name:"Proverbs" },{ id:"ECC",name:"Ecclesiastes" },{ id:"SNG",name:"Song of Songs" },{ id:"WIS",name:"Wisdom" },{ id:"SIR",name:"Sirach" } ],
      profeticos:   [ { id:"ISA",name:"Isaiah" },{ id:"JER",name:"Jeremiah" },{ id:"LAM",name:"Lamentations" },{ id:"BAR",name:"Baruch" },{ id:"EZK",name:"Ezekiel" },{ id:"DAN",name:"Daniel" },{ id:"HOS",name:"Hosea" },{ id:"JOL",name:"Joel" },{ id:"AMO",name:"Amos" },{ id:"OBA",name:"Obadiah" },{ id:"JON",name:"Jonah" },{ id:"MIC",name:"Micah" },{ id:"NAM",name:"Nahum" },{ id:"HAB",name:"Habakkuk" },{ id:"ZEP",name:"Zephaniah" },{ id:"HAG",name:"Haggai" },{ id:"ZEC",name:"Zechariah" },{ id:"MAL",name:"Malachi" } ],
    },
    nt: {
      evangelios:  [ { id:"MAT",name:"Matthew" },{ id:"MRK",name:"Mark" },{ id:"LUK",name:"Luke" },{ id:"JHN",name:"John" } ],
      hechos:      [ { id:"ACT",name:"Acts of the Apostles" } ],
      cartas:      [ { id:"ROM",name:"Romans" },{ id:"1CO",name:"1 Corinthians" },{ id:"2CO",name:"2 Corinthians" },{ id:"GAL",name:"Galatians" },{ id:"EPH",name:"Ephesians" },{ id:"PHP",name:"Philippians" },{ id:"COL",name:"Colossians" },{ id:"1TH",name:"1 Thessalonians" },{ id:"2TH",name:"2 Thessalonians" },{ id:"1TI",name:"1 Timothy" },{ id:"2TI",name:"2 Timothy" },{ id:"TIT",name:"Titus" },{ id:"PHM",name:"Philemon" },{ id:"HEB",name:"Hebrews" },{ id:"JAS",name:"James" },{ id:"1PE",name:"1 Peter" },{ id:"2PE",name:"2 Peter" },{ id:"1JN",name:"1 John" },{ id:"2JN",name:"2 John" },{ id:"3JN",name:"3 John" },{ id:"JUD",name:"Jude" } ],
      apocalipsis: [ { id:"REV",name:"Revelation" } ],
    },
  },
};

const BIBLE_CATEGORIES = {
  ot: {
    es: [ { key:"pentateuco",label:"Pentateuco" },{ key:"historicos",label:"Históricos" },{ key:"sapienciales",label:"Sapienciales" },{ key:"profeticos",label:"Proféticos" } ],
    en: [ { key:"pentateuco",label:"Pentateuch" },{ key:"historicos",label:"Historical" },{ key:"sapienciales",label:"Wisdom" },{ key:"profeticos",label:"Prophetic" } ],
  },
  nt: {
    es: [ { key:"evangelios",label:"Evangelios" },{ key:"hechos",label:"Hechos" },{ key:"cartas",label:"Cartas" },{ key:"apocalipsis",label:"Apocalipsis" } ],
    en: [ { key:"evangelios",label:"Gospels" },{ key:"hechos",label:"Acts" },{ key:"cartas",label:"Letters" },{ key:"apocalipsis",label:"Revelation" } ],
  },
};

const DAILY_VERSES = [
  { es:{ text:"Todo lo puedo en Cristo que me fortalece.", ref:"Filipenses 4:13" }, en:{ text:"I can do all things through Christ who strengthens me.", ref:"Philippians 4:13" } },
  { es:{ text:"De tal manera amó Dios al mundo, que dio a su Hijo unigénito.", ref:"Juan 3:16" }, en:{ text:"God so loved the world that he gave his only Son.", ref:"John 3:16" } },
  { es:{ text:"El Señor es mi pastor; nada me falta.", ref:"Salmo 23:1" }, en:{ text:"The Lord is my shepherd; I shall not want.", ref:"Psalm 23:1" } },
  { es:{ text:"Busca primero el Reino de Dios y su justicia.", ref:"Mateo 6:33" }, en:{ text:"Seek first the kingdom of God and his righteousness.", ref:"Matthew 6:33" } },
  { es:{ text:"No se turbe vuestro corazón; creed en Dios, creed también en mí.", ref:"Juan 14:1" }, en:{ text:"Let not your hearts be troubled. Believe in God; believe also in me.", ref:"John 14:1" } },
  { es:{ text:"Yo soy el camino, la verdad y la vida.", ref:"Juan 14:6" }, en:{ text:"I am the way, the truth, and the life.", ref:"John 14:6" } },
  { es:{ text:"El amor es paciente, es bondadoso; el amor no tiene envidia.", ref:"1 Corintios 13:4" }, en:{ text:"Love is patient, love is kind; love does not envy.", ref:"1 Corinthians 13:4" } },
  { es:{ text:"Dad gracias en todo; esta es la voluntad de Dios en Cristo Jesús.", ref:"1 Tesalonicenses 5:18" }, en:{ text:"Give thanks in all circumstances; this is God's will for you.", ref:"1 Thessalonians 5:18" } },
  { es:{ text:"Con amor eterno te amé; por eso te mantuve con fidelidad.", ref:"Jeremías 31:3" }, en:{ text:"I have loved you with an everlasting love; I have drawn you with loving kindness.", ref:"Jeremiah 31:3" } },
  { es:{ text:"Venid a mí todos los que estáis fatigados y sobrecargados, y yo os daré descanso.", ref:"Mateo 11:28" }, en:{ text:"Come to me, all who are weary and burdened, and I will give you rest.", ref:"Matthew 11:28" } },
  { es:{ text:"Confía en el Señor con todo tu corazón y no te apoyes en tu propia prudencia.", ref:"Proverbios 3:5" }, en:{ text:"Trust in the Lord with all your heart and lean not on your own understanding.", ref:"Proverbs 3:5" } },
  { es:{ text:"El Señor tu Dios está en medio de ti como un guerrero victorioso.", ref:"Sofonías 3:17" }, en:{ text:"The Lord your God is in your midst, a mighty one who will save.", ref:"Zephaniah 3:17" } },
  { es:{ text:"Bienaventurados los limpios de corazón, porque ellos verán a Dios.", ref:"Mateo 5:8" }, en:{ text:"Blessed are the pure in heart, for they shall see God.", ref:"Matthew 5:8" } },
  { es:{ text:"La verdad os hará libres.", ref:"Juan 8:32" }, en:{ text:"The truth will set you free.", ref:"John 8:32" } },
  { es:{ text:"Yo soy la resurrección y la vida; el que cree en mí, aunque muera, vivirá.", ref:"Juan 11:25" }, en:{ text:"I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live.", ref:"John 11:25" } },
  { es:{ text:"Mi gracia te basta; mi fuerza se manifiesta en la flaqueza.", ref:"2 Corintios 12:9" }, en:{ text:"My grace is sufficient for you, for my power is made perfect in weakness.", ref:"2 Corinthians 12:9" } },
  { es:{ text:"No temas, porque yo te he redimido; te he llamado por tu nombre, tú eres mío.", ref:"Isaías 43:1" }, en:{ text:"Fear not, for I have redeemed you; I have called you by name, you are mine.", ref:"Isaiah 43:1" } },
  { es:{ text:"Bienaventurados los que lloran, porque ellos serán consolados.", ref:"Mateo 5:4" }, en:{ text:"Blessed are those who mourn, for they shall be comforted.", ref:"Matthew 5:4" } },
  { es:{ text:"Yo soy la vid, vosotros los sarmientos; el que permanece en mí da mucho fruto.", ref:"Juan 15:5" }, en:{ text:"I am the vine; you are the branches. Whoever abides in me bears much fruit.", ref:"John 15:5" } },
  { es:{ text:"Sed buenos y compasivos unos con otros, perdonándoos como Dios os perdonó.", ref:"Efesios 4:32" }, en:{ text:"Be kind and compassionate, forgiving each other, just as in Christ God forgave you.", ref:"Ephesians 4:32" } },
  { es:{ text:"Dios es nuestro refugio y fortaleza, nuestro pronto auxilio en las tribulaciones.", ref:"Salmo 46:1" }, en:{ text:"God is our refuge and strength, an ever-present help in trouble.", ref:"Psalm 46:1" } },
  { es:{ text:"A los que aman a Dios, todo les ayuda para bien.", ref:"Romanos 8:28" }, en:{ text:"For those who love God all things work together for good.", ref:"Romans 8:28" } },
  { es:{ text:"Bienaventurados los que tienen hambre y sed de justicia, porque serán saciados.", ref:"Mateo 5:6" }, en:{ text:"Blessed are those who hunger and thirst for righteousness, for they shall be satisfied.", ref:"Matthew 5:6" } },
  { es:{ text:"No os inquietéis por nada; en todo, mediante oración y súplica, presentad vuestras peticiones a Dios.", ref:"Filipenses 4:6" }, en:{ text:"Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.", ref:"Philippians 4:6" } },
  { es:{ text:"Orad sin cesar.", ref:"1 Tesalonicenses 5:17" }, en:{ text:"Pray without ceasing.", ref:"1 Thessalonians 5:17" } },
  { es:{ text:"Amarás al Señor tu Dios con todo tu corazón, con toda tu alma y con toda tu mente.", ref:"Mateo 22:37" }, en:{ text:"You shall love the Lord your God with all your heart, soul, and mind.", ref:"Matthew 22:37" } },
  { es:{ text:"Nada podrá separarnos del amor de Dios manifestado en Cristo Jesús.", ref:"Romanos 8:39" }, en:{ text:"Nothing will be able to separate us from the love of God in Christ Jesus.", ref:"Romans 8:39" } },
  { es:{ text:"Gustad y ved cuán bueno es el Señor; dichoso el que se refugia en él.", ref:"Salmo 34:8" }, en:{ text:"Taste and see that the Lord is good; blessed is the one who takes refuge in him.", ref:"Psalm 34:8" } },
  { es:{ text:"Los que esperan en el Señor renuevan sus fuerzas; vuelan como águilas.", ref:"Isaías 40:31" }, en:{ text:"Those who hope in the Lord will renew their strength; they will soar on wings like eagles.", ref:"Isaiah 40:31" } },
  { es:{ text:"Bienaventurados los pobres de espíritu, porque de ellos es el reino de los cielos.", ref:"Mateo 5:3" }, en:{ text:"Blessed are the poor in spirit, for theirs is the kingdom of heaven.", ref:"Matthew 5:3" } },
];

const formatRef = (r) => r ? String(r).replace(/(\d+):(\d+)/g, '$1, $2') : r;

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
  const [lambOpen, setLambOpen] = useState(false);
  const [lambLoading, setLambLoading] = useState(false);
  const [lambText, setLambText] = useState("");
  const [generatedPrayer, setGeneratedPrayer] = useState(null);
  const [savedPrayers, setSavedPrayers] = useState([]);
  const [prayerBook, setPrayerBook] = useState([]);
  const [prayerBookLoading, setPrayerBookLoading] = useState(false);
  const [expandedPrayerId, setExpandedPrayerId] = useState(null);
  const [hoveredQuickBtn, setHoveredQuickBtn] = useState(null);
  const [pressedQuickBtn, setPressedQuickBtn] = useState(null);
  const [bibleView, setBibleView] = useState("books");
  const [bibleTestament, setBibleTestament] = useState("ot");
  const [bibleCategory, setBibleCategory] = useState("pentateuco");
  const [bibleSelectedBook, setBibleSelectedBook] = useState(null);
  const [bibleChapters, setBibleChapters] = useState([]);
  const [bibleSelectedChapter, setBibleSelectedChapter] = useState(null);
  const [bibleChapterText, setBibleChapterText] = useState("");
  const [bibleSearch, setBibleSearch] = useState("");
  const [bibleSearchResults, setBibleSearchResults] = useState(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [circleView, setCircleView] = useState("list");
  const [myCircles, setMyCircles] = useState([]);
  const [circleLoading, setCircleLoading] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [circleIntenciones, setCircleIntenciones] = useState([]);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [newCircleType, setNewCircleType] = useState("publico");
  const [joinCode, setJoinCode] = useState("");
  const [joinMode, setJoinMode] = useState("private");
  const [publicCircles, setPublicCircles] = useState([]);
  const [newIntencion, setNewIntencion] = useState("");
  const [circleError, setCircleError] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [verseExpanded, setVerseExpanded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashIn, setSplashIn] = useState(false);
  const [splashOut, setSplashOut] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setSplashIn(true), 60);
    const t1 = setTimeout(() => setSplashOut(true), 2300);
    const t2 = setTimeout(() => setShowSplash(false), 3000);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

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

  useEffect(() => {
    if (personalTab !== "book" || !user) return;
    setPrayerBookLoading(true);
    getDocs(query(collection(db, "usuarios", user.uid, "oraciones"), orderBy("fecha", "desc")))
      .then(snap => setPrayerBook(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => {})
      .finally(() => setPrayerBookLoading(false));
  }, [personalTab, user]);

  useEffect(() => {
    if (personalTab !== "circles" || !user) return;
    setCircleLoading(true);
    setCircleView("list");
    getDocs(query(collection(db, "circulos"), where("miembros", "array-contains", user.uid)))
      .then(snap => setMyCircles(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => {})
      .finally(() => setCircleLoading(false));
  }, [personalTab, user]);

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

  const handleLambClick = async () => {
    setLambLoading(true);
    setLambOpen(true);
    setLambText('');

    const today = new Date().toISOString().split('T')[0];

    // 1. localStorage — instantáneo
    const cached = localStorage.getItem(`reflexion_${today}_${lang}`);
    if (cached) {
      setLambText(cached);
      setLambLoading(false);
      return;
    }

    // 2. Firestore — compartido entre usuarios, timeout 1.5s
    try {
      const firestorePromise = getDoc(doc(db, 'reflexiones', `${today}_${lang}`));
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
      const docSnap = await Promise.race([firestorePromise, timeout]);
      if (docSnap.exists() && docSnap.data().texto) {
        const texto = docSnap.data().texto;
        localStorage.setItem(`reflexion_${today}_${lang}`, texto);
        setLambText(texto);
        setLambLoading(false);
        return;
      }
    } catch (e) {
      console.log('[lamb] Firestore skip:', e.message);
    }

    // 3. API Anthropic — solo si los dos anteriores fallan
    try {
      const response = await fetch('/api/spiritual-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gospelRef: gospelData?.reference || '',
          gospelText: gospelData?.text || '',
          lang,
        }),
      });
      const data = await response.json();
      const texto = data.text || '';
      setLambText(texto || 'No se pudo obtener la reflexión.');
      if (texto) {
        localStorage.setItem(`reflexion_${today}_${lang}`, texto);
        setDoc(doc(db, 'reflexiones', `${today}_${lang}`), {
          texto, fecha: today, evangelio: gospelData?.reference || '',
        }).catch(() => {});
      }
    } catch (error) {
      setLambText('No se pudo obtener la reflexión.');
    } finally {
      setLambLoading(false);
    }
  };

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
    const _today = new Date();
    const _dayOfYear = Math.floor((_today - new Date(_today.getFullYear(), 0, 0)) / 86400000);
    const dailyVerse = DAILY_VERSES[_dayOfYear % DAILY_VERSES.length][lang] || DAILY_VERSES[_dayOfYear % DAILY_VERSES.length].es;
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: 12, marginBottom: 16, alignItems: "stretch" }}>
          {/* Tarjeta saludo — tamaño fijo, no se mueve */}
          <div style={{ flex: 1, flexShrink: 0, background: "linear-gradient(135deg, #FAF5ED, #FDF3DC)", borderRadius: 16, padding: "12px 10px", border: `1.5px solid ${GOLD}`, position: "relative", overflow: "hidden", minWidth: 0 }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.08, color: GOLD }}>✝</div>
            <div style={{ fontSize: 9, color: NAVY, textTransform: "capitalize", marginBottom: 2 }}>{t.home.date}</div>
            <div style={{ fontSize: 11, fontStyle: "italic", color: GOLD, fontFamily: "'Crimson Text', serif", lineHeight: 1.4 }}>{t.home.greeting}{user ? `, ${user.displayName?.split(' ')[0] || ''}` : ''}!</div>
            {user ? (
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontSize: 10, color: NAVY_DARK }}>👤 {user.displayName || user.email}</span>
                <span style={{ fontSize: 10, color: GOLD, cursor: "pointer", fontWeight: "bold" }} onClick={handleLogout}>{lang === 'es' ? 'Salir' : 'Sign out'}</span>
              </div>
            ) : (
              <div onClick={() => setAuthMode('login')} style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: NAVY_DARK, padding: "4px 8px", borderRadius: 20, cursor: "pointer" }}>
                <span style={{ fontSize: 10, color: WHITE }}>👤 {lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span>
                <span style={{ color: GOLD, fontSize: 11 }}>→</span>
              </div>
            )}
          </div>
          {/* Tarjeta versículo — clickeable, tamaño siempre fijo */}
          <div
            onClick={() => setVerseExpanded(true)}
            style={{
              flex: 1, flexShrink: 0, background: "linear-gradient(135deg, #FAF5ED, #FDF3DC)",
              borderRadius: 16, padding: "12px 10px", border: `1.5px solid ${GOLD}`,
              position: "relative", overflow: "hidden", minWidth: 0,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ position: "absolute", top: -8, left: -4, fontSize: 56, opacity: 0.06, color: GOLD }}>📖</div>
            <div>
              <div style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, fontWeight: "bold" }}>{lang === 'es' ? 'Versículo del Día' : 'Verse of the Day'}</div>
              <div style={{ fontSize: 11, fontStyle: "italic", color: NAVY_DARK, lineHeight: 1.6 }}>"{dailyVerse.text}"</div>
            </div>
            <div style={{ fontSize: 10, color: GOLD, fontWeight: "bold", marginTop: 6 }}>— {formatRef(dailyVerse.ref)}</div>
          </div>
        </div>

        {/* Overlay versículo expandido */}
        {verseExpanded && (
          <>
            <style>{`
              @keyframes verseCardIn {
                from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                to   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
              }
            `}</style>
            <div
              onClick={() => setVerseExpanded(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(15,28,50,0.72)", zIndex: 500 }}
            />
            <div style={{
              position: "fixed", top: "50%", left: "50%",
              animation: "verseCardIn 0.3s ease forwards",
              width: "90%", maxWidth: 400,
              borderRadius: 22,
              border: `2px solid ${GOLD}`,
              zIndex: 501,
              boxShadow: "0 24px 64px rgba(15,28,50,0.45)",
              overflow: "hidden",
              backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              <div style={{ background: "rgba(250,245,237,0.88)", padding: "28px 24px 24px" }}>
              <button
                onClick={() => setVerseExpanded(false)}
                style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: NAVY_DARK, border: "none", color: WHITE, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
              >✕</button>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 14 }}>{lang === 'es' ? 'Versículo del Día' : 'Verse of the Day'}</div>
              <div style={{ fontSize: "1.4rem", fontStyle: "italic", color: NAVY_DARK, lineHeight: 1.7, fontFamily: "'Crimson Text', serif", marginBottom: 18 }}>"{dailyVerse.text}"</div>
              <div style={{ fontSize: 14, color: GOLD, fontWeight: "bold", fontFamily: "'Cinzel', serif", letterSpacing: 0.5 }}>— {formatRef(dailyVerse.ref)}</div>
              </div>
            </div>
          </>
        )}
        {t.home.cards.map((c, i) => (
          <div key={i} onClick={() => setTab(c.tab)} style={{ position: "relative", borderRadius: 20, minHeight: 140, overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 28px rgba(15,28,50,0.22)", cursor: "pointer", backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div style={{ position: "absolute", inset: 0, background:
              i % 2 === 0
                ? "linear-gradient(to bottom, rgba(139,105,20,0.45) 0%, rgba(139,105,20,0.9) 100%)"
                : "linear-gradient(to bottom, rgba(27,42,74,0.45) 0%, rgba(27,42,74,0.9) 100%)"
            }} />
            <div style={{ position: "relative", padding: "20px 20px 18px", color: WHITE, display: "flex", flexDirection: "column", minHeight: 140, justifyContent: "space-between", boxSizing: "border-box" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 17, fontFamily: "'Cinzel', serif", marginBottom: 5, lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                  {i === 1 && gospelData ? (
                    <><span style={{ fontWeight: "bold", color: GOLD_LIGHT, display: "block", marginBottom: 4 }}>{formatRef(lang === 'en' ? gospelData?.reference : reference)}</span>{body.substring(0, 90) + "…"}</>
                  ) : i === 2 && gospelData?.reading1 ? (
                    <><span style={{ fontWeight: "bold", color: "#90CAF9", display: "block", marginBottom: 4 }}>{formatRef(gospelData.reading1.reference)}</span>{gospelData.reading1.text.substring(0, 90) + "…"}</>
                  ) : c.desc}
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <span style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.38)", padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: "bold" }}>{c.btn} →</span>
              </div>
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
          <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>{formatRef(lang === 'en' ? gospelData?.reference : (reference || t.gospel.reading))}</div>
        </div>
        <div style={{ background: WHITE, borderRadius: 16, padding: 20, fontSize: 14, lineHeight: 1.9, color: "#3A2A1E", whiteSpace: "pre-wrap", boxShadow: "0 4px 16px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
          {formatted}{"\n\n"}<span style={{ color: NAVY, fontWeight: "bold", fontStyle: "italic" }}>— {lang === 'es' ? 'Palabra del Señor.' : 'The Gospel of the Lord.'}</span>
        </div>
      </div>
    );
  };

  const renderReadings = () => {
    const sections = [];
    const iconScroll = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <rect x="3" y="1" width="14" height="4" rx="2" stroke="#1A3A5C" strokeWidth="1.3"/>
        <rect x="5" y="4" width="10" height="12" stroke="#1A3A5C" strokeWidth="1.3"/>
        <rect x="3" y="15" width="14" height="4" rx="2" stroke="#1A3A5C" strokeWidth="1.3"/>
        <line x1="7.5" y1="7.5" x2="12.5" y2="7.5" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="7.5" y1="10" x2="12.5" y2="10" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="7.5" y1="12.5" x2="12.5" y2="12.5" stroke="#C9A84C" strokeWidth="1"/>
      </svg>
    );
    const iconBook = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <rect x="3" y="2" width="13" height="16" rx="1.5" stroke="#1A3A5C" strokeWidth="1.3"/>
        <line x1="6" y1="2" x2="6" y2="18" stroke="#1A3A5C" strokeWidth="0.8"/>
        <path d="M11 0.5 L14.5 0.5 L14.5 7 L12.75 5.5 L11 7 Z" fill="#C9A84C"/>
        <line x1="8" y1="9" x2="15" y2="9" stroke="#1A3A5C" strokeWidth="0.8"/>
        <line x1="8" y1="12" x2="15" y2="12" stroke="#1A3A5C" strokeWidth="0.8"/>
        <line x1="8" y1="15" x2="15" y2="15" stroke="#1A3A5C" strokeWidth="0.8"/>
      </svg>
    );
    const iconLyre = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M5 10 C5 14 7 18 10 18 C13 18 15 14 15 10" stroke="#1A3A5C" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="5" y1="10" x2="5" y2="3" stroke="#1A3A5C" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="15" y2="3" stroke="#1A3A5C" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="5" y1="3" x2="15" y2="3" stroke="#1A3A5C" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8" y1="3.5" x2="8.5" y2="16.5" stroke="#C9A84C" strokeWidth="0.9"/>
        <line x1="10" y1="3.5" x2="10" y2="17.5" stroke="#C9A84C" strokeWidth="0.9"/>
        <line x1="12" y1="3.5" x2="11.5" y2="16.5" stroke="#C9A84C" strokeWidth="0.9"/>
      </svg>
    );
    if (gospelData?.reading1) sections.push({ key: 'r1', title: lang === 'es' ? 'Primera Lectura' : 'First Reading', ref: gospelData.reading1.reference, text: gospelData.reading1.text, icon: iconScroll });
    if (gospelData?.reading2) sections.push({ key: 'r2', title: lang === 'es' ? 'Segunda Lectura' : 'Second Reading', ref: gospelData.reading2.reference, text: gospelData.reading2.text, icon: iconBook });
    if (gospelData?.psalm) sections.push({ key: 'ps', title: lang === 'es' ? 'Salmo Responsorial' : 'Responsorial Psalm', ref: gospelData.psalm.reference, text: gospelData.psalm.text, icon: iconLyre });
    if (!gospelData) return <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>{lang === 'es' ? 'Cargando lecturas...' : 'Loading readings...'}</div>;
    return (
      <div>
        {sections.map((s) => (
          <div key={s.key} style={{ background: WHITE, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(26,58,92,0.08)", border: `1px solid ${CREAM_DARK}` }}>
            <div onClick={() => setOpenReading(openReading === s.key ? null : s.key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: "bold", color: BLUE_DARK, fontSize: 15, fontFamily: "'Cinzel', serif", display: "flex", alignItems: "center", gap: 8 }}>{s.icon}{s.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{formatRef(s.ref)}</div>
              </div>
              <span style={{ color: BLUE, fontSize: 20, fontWeight: "bold" }}>{openReading === s.key ? "−" : "+"}</span>
            </div>
            {openReading === s.key && (
              <div style={{ padding: "0 18px 18px", fontSize: 14, color: "#1A2A3A", lineHeight: 1.9, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14, whiteSpace: "pre-wrap" }}>
                {s.text}
                {(s.key === 'r1' || s.key === 'r2') && (
                  <div style={{ fontStyle: "italic", color: GOLD, marginTop: 10, whiteSpace: "normal" }}>
                    {lang === 'es' ? '— Palabra de Dios.' : '— The Word of the Lord.'}
                  </div>
                )}
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

    const generatePrayer = () => {
      const currentMood = PRAYER_MOODS[lang].find(m => m.id === selectedMood);
      if (!currentMood) return;
      const base = currentMood.prayer;
      const full = prayerIntention.trim()
        ? `${base}\n\n${lang === "es" ? "Te lo pido especialmente por" : "I especially pray for"}: ${prayerIntention.trim()}.`
        : base;
      setGeneratedPrayer(full);
    };

    const savePrayer = async () => {
      if (!mood || !generatedPrayer) return;
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" }),
        moodId: mood.id,
        moodLabel: mood.label,
        moodIcon: mood.icon,
        intention: prayerIntention.trim(),
        oracion: generatedPrayer,
        received: false,
      };
      const updated = [entry, ...savedPrayers];
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
      if (user) {
        try {
          await addDoc(collection(db, "usuarios", user.uid, "oraciones"), {
            estado: mood.label,
            intencion: prayerIntention.trim(),
            oracion: generatedPrayer,
            fecha: serverTimestamp(),
          });
        } catch (e) {
          console.error("[firestore] error guardando oración:", e.message);
        }
      }
      setPrayerIntention("");
      setSelectedMood(null);
      setGeneratedPrayer(null);
      setPersonalTab("journal");
    };

    const toggleReceived = (id) => {
      const updated = savedPrayers.map(p => p.id === id ? { ...p, received: !p.received } : p);
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
    };

    const markAnswered = async (docId) => {
      if (!user) return;
      try {
        await updateDoc(doc(db, "usuarios", user.uid, "oraciones", docId), {
          respondida: true,
          fechaRespuesta: serverTimestamp(),
        });
        setPrayerBook(prev => prev.map(p => p.id === docId ? { ...p, respondida: true } : p));
      } catch (e) {
        console.error("[firestore] error marcando respondida:", e.message);
      }
    };

    const getMoodIcon = (label) => {
      const all = [...PRAYER_MOODS.es, ...PRAYER_MOODS.en];
      return all.find(m => m.label === label)?.icon || "🙏";
    };

    const formatFirestoreDate = (fecha) => {
      if (!fecha) return "";
      const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
      return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" });
    };

    const deletePrayer = (id) => {
      const updated = savedPrayers.filter(p => p.id !== id);
      setSavedPrayers(updated);
      localStorage.setItem("personal_prayers", JSON.stringify(updated));
    };

    // Shared style for the gold cross in the brand name
    const cx = {color: '#C9A84C', fontSize: '1.2em'};

    // Circles helpers
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const loadPublicCircles = async () => {
      setCircleLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "circulos"), where("tipo", "==", "publico")));
        setPublicCircles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {}
      setCircleLoading(false);
    };

    const loadIntenciones = async (circulo) => {
      setCircleLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "circulos", circulo.id, "intenciones"), orderBy("fecha", "desc")));
        setCircleIntenciones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {}
      setCircleLoading(false);
    };

    const openCircle = async (circulo) => {
      setSelectedCircle(circulo);
      setCircleView("inside");
      setCircleIntenciones([]);
      await loadIntenciones(circulo);
    };

    const createCircle = async () => {
      if (!newCircleName.trim()) { setCircleError(lang === "es" ? "El nombre es requerido" : "Name is required"); return; }
      setCircleLoading(true);
      setCircleError("");
      const codigo = newCircleType === "privado" ? generateCode() : "";
      try {
        const circuloData = {
          nombre: newCircleName.trim(),
          descripcion: newCircleDesc.trim(),
          tipo: newCircleType,
          codigo,
          creadorId: user.uid,
          creadorNombre: user.displayName || user.email,
          miembros: [user.uid],
          fechaCreacion: serverTimestamp(),
        };
        const ref = await addDoc(collection(db, "circulos"), circuloData);
        setMyCircles(prev => [{ id: ref.id, ...circuloData, fechaCreacion: new Date() }, ...prev]);
        setNewCircleName("");
        setNewCircleDesc("");
        setNewCircleType("publico");
        setCircleView("list");
      } catch (e) { setCircleError(e.message); }
      setCircleLoading(false);
    };

    const joinCircleByCode = async () => {
      if (!joinCode.trim()) return;
      setCircleLoading(true);
      setCircleError("");
      try {
        const snap = await getDocs(query(collection(db, "circulos"), where("codigo", "==", joinCode.trim().toUpperCase())));
        if (snap.empty) { setCircleError(lang === "es" ? "Código no encontrado" : "Code not found"); setCircleLoading(false); return; }
        const d = snap.docs[0];
        const circulo = { id: d.id, ...d.data() };
        if (circulo.miembros?.includes(user.uid)) { setCircleError(lang === "es" ? "Ya eres miembro de este círculo" : "Already a member"); setCircleLoading(false); return; }
        if ((circulo.miembros?.length || 0) >= 10) { setCircleError(lang === "es" ? "El círculo está lleno (máx. 10)" : "Circle is full (max 10)"); setCircleLoading(false); return; }
        await updateDoc(doc(db, "circulos", circulo.id), { miembros: arrayUnion(user.uid) });
        setMyCircles(prev => [{ ...circulo, miembros: [...(circulo.miembros || []), user.uid] }, ...prev]);
        setJoinCode("");
        setCircleView("list");
      } catch (e) { setCircleError(e.message); }
      setCircleLoading(false);
    };

    const joinPublicCircle = async (circulo) => {
      if (circulo.miembros?.includes(user.uid) || (circulo.miembros?.length || 0) >= 10) return;
      try {
        await updateDoc(doc(db, "circulos", circulo.id), { miembros: arrayUnion(user.uid) });
        const updated = { ...circulo, miembros: [...(circulo.miembros || []), user.uid] };
        setMyCircles(prev => [updated, ...prev]);
        setPublicCircles(prev => prev.map(c => c.id === circulo.id ? updated : c));
        setCircleView("list");
      } catch (e) { setCircleError(e.message); }
    };

    const addIntencion = async () => {
      if (!newIntencion.trim() || !selectedCircle) return;
      try {
        const data = {
          texto: newIntencion.trim(),
          autorId: user.uid,
          autorNombre: user.displayName || user.email.split("@")[0],
          fecha: serverTimestamp(),
          orando: [],
        };
        const ref = await addDoc(collection(db, "circulos", selectedCircle.id, "intenciones"), data);
        setCircleIntenciones(prev => [{ id: ref.id, ...data, fecha: new Date() }, ...prev]);
        setNewIntencion("");
      } catch (e) {}
    };

    const toggleOrando = async (intent) => {
      const isOrando = intent.orando?.includes(user.uid);
      const updatedOrando = isOrando
        ? (intent.orando || []).filter(u => u !== user.uid)
        : [...(intent.orando || []), user.uid];

      // Optimistic update — UI responds immediately
      setCircleIntenciones(prev => prev.map(i =>
        i.id === intent.id ? { ...i, orando: updatedOrando } : i
      ));

      try {
        await updateDoc(doc(db, "circulos", selectedCircle.id, "intenciones", intent.id), {
          orando: isOrando ? arrayRemove(user.uid) : arrayUnion(user.uid),
        });
      } catch (e) {
        console.error("[toggleOrando] Firestore error:", e.message);
        // Revert on failure
        setCircleIntenciones(prev => prev.map(i =>
          i.id === intent.id ? { ...i, orando: intent.orando || [] } : i
        ));
      }
    };

    const deleteIntencion = async (intent) => {
      try {
        await deleteDoc(doc(db, "circulos", selectedCircle.id, "intenciones", intent.id));
        setCircleIntenciones(prev => prev.filter(i => i.id !== intent.id));
      } catch (e) {}
    };

    const leaveCircle = async () => {
      if (!selectedCircle) return;
      try {
        await updateDoc(doc(db, "circulos", selectedCircle.id), { miembros: arrayRemove(user.uid) });
        setMyCircles(prev => prev.filter(c => c.id !== selectedCircle.id));
        setSelectedCircle(null);
        setCircleView("list");
      } catch (e) {}
    };

    return (
      <div>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[
            ["builder", "✝", lang === "es" ? "Crear Oración" : "Crear"],
            ["journal", (() => {
                const sel = personalTab === "journal";
                const c = sel ? "#FAF5ED" : "#9CA3AF";
                const cr = sel ? "#C9A84C" : "#9CA3AF";
                return (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="3" y="2" width="14" height="18" rx="2" stroke={c} strokeWidth="1.3"/>
                    <line x1="6.5" y1="2" x2="6.5" y2="20" stroke={c} strokeWidth="0.9"/>
                    <line x1="8.5" y1="6"    x2="16" y2="6"    stroke={c} strokeWidth="0.8"/>
                    <line x1="8.5" y1="8.5"  x2="16" y2="8.5"  stroke={c} strokeWidth="0.8"/>
                    <line x1="8.5" y1="11"   x2="16" y2="11"   stroke={c} strokeWidth="0.8"/>
                    <line x1="8.5" y1="13.5" x2="16" y2="13.5" stroke={c} strokeWidth="0.8"/>
                    <line x1="11" y1="16" x2="11" y2="19.5" stroke={cr} strokeWidth="1.3" strokeLinecap="round"/>
                    <line x1="9.2" y1="17.8" x2="12.8" y2="17.8" stroke={cr} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                );
              })(), lang === "es" ? "Diario" : "Journal"],
            ["book", (() => {
                const sel = personalTab === "book";
                const c = sel ? "#FAF5ED" : "#9CA3AF";
                const cr = sel ? "#C9A84C" : "#9CA3AF";
                return (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="3" y="2" width="16" height="18" rx="2" stroke={c} strokeWidth="1.3"/>
                    <line x1="7" y1="2" x2="7" y2="20" stroke={c} strokeWidth="0.9"/>
                    <rect x="11.8" y="7" width="2.4" height="9" rx="1.2" fill={cr}/>
                    <rect x="9.8" y="10.2" width="6.4" height="2.4" rx="1.2" fill={cr}/>
                  </svg>
                );
              })(), lang === "es" ? "Mis Oraciones" : "Mis Orac."],
            ["circles", (() => {
                const sel = personalTab === "circles";
                const fg = sel ? "#FAF5ED" : "#9CA3AF";
                const cr = sel ? "#C9A84C" : "#9CA3AF";
                return (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* left person (behind) */}
                    <circle cx="8" cy="19" r="3.5" fill={fg}/>
                    <path d="M2 31 C2 21 14 21 14 31Z" fill={fg}/>
                    {/* right person (behind) */}
                    <circle cx="24" cy="19" r="3.5" fill={fg}/>
                    <path d="M18 31 C18 21 30 21 30 31Z" fill={fg}/>
                    {/* center person (front, larger) */}
                    <circle cx="16" cy="15" r="4.5" fill={fg}/>
                    <path d="M9 31 C9 19 23 19 23 31Z" fill={fg}/>
                    {/* small cross — top center, above heads */}
                    <rect x="14.8" y="1" width="2.4" height="8" rx="1.2" fill={cr}/>
                    <rect x="11.5" y="3.8" width="9" height="2.4" rx="1.2" fill={cr}/>
                  </svg>
                );
              })(), lang === "es" ? <>Conec<span style={cx}>✝</span>2</> : <>Pray<span style={cx}>✝</span>2gether</>],
          ].map(([key, icon, label]) => (
            <button key={key} onClick={() => setPersonalTab(key)} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, background: personalTab === key ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : WHITE, color: personalTab === key ? WHITE : MUTED, border: `1px solid ${personalTab === key ? NAVY : CREAM_DARK}`, fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif", textAlign: "center", lineHeight: 1.3 }}>
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div>{label}</div>
            </button>
          ))}
        </div>

        {personalTab === "builder" ? (
          <div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: NAVY_DARK, marginBottom: 14, fontFamily: "'Crimson Text', serif" }}>
              {lang === "es" ? "¿Cómo está tu corazón hoy?" : "How is your heart today?"}
            </div>

            {/* Mood grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
              {moods.map(m => (
                <button key={m.id} onClick={() => { const next = selectedMood === m.id ? null : m.id; setSelectedMood(next); setGeneratedPrayer(null); setPrayerIntention(""); }} style={{ padding: "10px 4px", borderRadius: 12, background: selectedMood === m.id ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : WHITE, color: selectedMood === m.id ? WHITE : NAVY_DARK, border: `1.5px solid ${selectedMood === m.id ? NAVY : CREAM_DARK}`, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: "600", fontFamily: "'Crimson Text', serif", lineHeight: 1.2 }}>{m.label}</div>
                </button>
              ))}
            </div>

            {/* Paso 2: intención + generar */}
            {mood && !generatedPrayer && (
              <div>
                <div style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}55`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontStyle: "italic", color: NAVY_DARK, lineHeight: 1.7, fontFamily: "'Crimson Text', serif" }}>{mood.verse}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, background: WHITE, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <span style={{ fontSize: 22 }}>🕯️</span>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED, letterSpacing: 0.5 }}>{lang === "es" ? "Santo patrono sugerido" : "Suggested patron saint"}</div>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif" }}>{mood.saint}</div>
                  </div>
                </div>

                <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 8, fontFamily: "'Crimson Text', serif" }}>
                    {lang === "es" ? "¿Tienes una intención específica? (opcional)" : "Do you have a specific intention? (optional)"}
                  </div>
                  <textarea
                    value={prayerIntention}
                    onChange={e => setPrayerIntention(e.target.value)}
                    placeholder={lang === "es" ? "Ej: por mi mamá enferma, por mi trabajo..." : "E.g.: for my sick mother, for my job..."}
                    style={{ width: "100%", minHeight: 80, padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: NAVY_DARK, background: CREAM, fontFamily: "'Georgia', serif", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, outline: "none" }}
                  />
                </div>

                <button onClick={generatePrayer} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                  ✝️ {lang === "es" ? "Generar mi oración" : "Generate my prayer"}
                </button>
              </div>
            )}

            {/* Paso 3: oración generada */}
            {mood && generatedPrayer && (
              <div>
                <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: "22px 20px", marginBottom: 14, color: WHITE, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -16, right: -10, fontSize: 80, opacity: 0.06 }}>✝</div>
                  <div style={{ fontSize: 11, color: GOLD, fontWeight: "bold", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>{mood.icon} {mood.label}</div>
                  <div style={{ fontSize: 15, fontFamily: "'Crimson Text', serif", lineHeight: 1.8, color: "rgba(255,255,255,0.92)", whiteSpace: "pre-wrap" }}>{generatedPrayer}</div>
                </div>

                {user ? (
                  <button onClick={savePrayer} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, #1a6b3a, #0f4a28)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif", marginBottom: 10 }}>
                    🙏 {lang === "es" ? "Guardar oración" : "Save prayer"}
                  </button>
                ) : (
                  <div style={{ background: CREAM, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, padding: "16px", marginBottom: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 14, color: NAVY_DARK, marginBottom: 10, fontFamily: "'Crimson Text', serif" }}>
                      {lang === "es" ? "Inicia sesión para guardar tus oraciones" : "Sign in to save your prayers"}
                    </div>
                    <button onClick={() => setAuthMode("login")} style={{ padding: "9px 24px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                      👤 {lang === "es" ? "Iniciar sesión" : "Sign in"}
                    </button>
                  </div>
                )}

                <button onClick={() => { setGeneratedPrayer(null); setSelectedMood(null); setPrayerIntention(""); }} style={{ width: "100%", padding: "10px", background: CREAM_DARK, color: NAVY_DARK, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                  ← {lang === "es" ? "Nueva oración" : "New prayer"}
                </button>
              </div>
            )}
          </div>
        ) : personalTab === "journal" ? (
          <div>
            {savedPrayers.length === 0 ? (
              <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📔</div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{lang === "es" ? "Aún no tienes oraciones guardadas." : "No saved prayers yet."}</div>
                <div style={{ fontSize: 13, color: MUTED }}>{lang === "es" ? "Usa Crear Oración para empezar ↑" : "Use Create Prayer to get started ↑"}</div>
              </div>
            ) : savedPrayers.map(p => (
              <div key={p.id} style={{ background: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${p.received ? GOLD + "66" : CREAM_DARK}`, boxShadow: p.received ? `0 2px 16px ${GOLD}22` : "0 2px 8px rgba(15,28,50,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{p.moodIcon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif" }}>{p.moodLabel}</div>
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
        ) : personalTab === "circles" ? (
          /* Círculos de Oración */
          <div>
            {!user ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔵</div>
                <div style={{ fontSize: 14, color: NAVY_DARK, marginBottom: 16, fontFamily: "'Crimson Text', serif" }}>
                  {lang === "es" ? <>Inicia sesión para unirte a Conec<span style={cx}>✝</span>2 de Oración</> : <>Sign in to join Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <button onClick={() => setAuthMode("login")} style={{ padding: "10px 28px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                  👤 {lang === "es" ? "Iniciar sesión" : "Sign in"}
                </button>
              </div>
            ) : circleView === "list" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif" }}>
                    <>{lang === "es" ? "Mis" : "My"} {lang === "es" ? <>Conec<span style={cx}>✝</span>2</> : <>Pray<span style={cx}>✝</span>2gether</>}</>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setCircleError(""); setNewCircleName(""); setNewCircleDesc(""); setNewCircleType("publico"); setCircleView("create"); }} style={{ padding: "8px 14px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                      + {lang === "es" ? "Crear" : "Create"}
                    </button>
                    <button onClick={() => { setCircleError(""); setJoinCode(""); setJoinMode("private"); setPublicCircles([]); setCircleView("join"); }} style={{ padding: "8px 14px", background: WHITE, color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                      {lang === "es" ? "Unirse" : "Join"}
                    </button>
                  </div>
                </div>
                {circleLoading ? (
                  <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔵</div>
                    <div style={{ fontSize: 14 }}>{lang === "es" ? <>Cargando Conec<span style={cx}>✝</span>2...</> : <>Loading Pray<span style={cx}>✝</span>2gether...</>}</div>
                  </div>
                ) : myCircles.length === 0 ? (
                  <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🙏</div>
                    <div style={{ fontSize: 15, color: NAVY_DARK, marginBottom: 8, fontFamily: "'Crimson Text', serif" }}>
                      {lang === "es" ? <>Aún no perteneces a ningún Conec<span style={cx}>✝</span>2</> : <>You're not in any Pray<span style={cx}>✝</span>2gether yet</>}
                    </div>
                    <div style={{ fontSize: 13 }}>{lang === "es" ? "Crea uno o únete a uno para orar juntos" : "Create or join one to pray together"}</div>
                  </div>
                ) : myCircles.map(c => (
                  <div key={c.id} onClick={() => openCircle(c)} style={{ background: WHITE, borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif", marginBottom: 3 }}>{c.nombre}</div>
                        {c.descripcion && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{c.descripcion.length > 80 ? c.descripcion.substring(0, 80) + "…" : c.descripcion}</div>}
                      </div>
                      <span style={{ fontSize: 11, background: c.tipo === "privado" ? `${NAVY}18` : `${GOLD}22`, color: c.tipo === "privado" ? NAVY : "#8B6A1A", padding: "3px 8px", borderRadius: 20, fontWeight: "bold", flexShrink: 0 }}>
                        {c.tipo === "privado" ? "🔒" : "🌍"} {c.tipo === "privado" ? (lang === "es" ? "Privado" : "Private") : (lang === "es" ? "Público" : "Public")}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
                      👥 {c.miembros?.length || 1}/10 · {c.creadorId === user.uid ? (lang === "es" ? "Tú eres el creador" : "You're the creator") : c.creadorNombre}
                    </div>
                  </div>
                ))}
              </div>
            ) : circleView === "create" ? (
              <div>
                <button onClick={() => setCircleView("list")} style={{ background: "none", border: "none", color: NAVY, fontSize: 14, cursor: "pointer", padding: "0 0 16px 0", fontWeight: "bold" }}>
                  ← {lang === "es" ? "Volver" : "Back"}
                </button>
                <div style={{ fontSize: 16, fontWeight: "bold", color: NAVY_DARK, marginBottom: 16, fontFamily: "'Crimson Text', serif" }}>
                  {lang === "es" ? <>Crear Conec<span style={cx}>✝</span>2</> : <>Create Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{lang === "es" ? "Nombre del círculo*" : "Circle name*"}</div>
                  <input value={newCircleName} onChange={e => setNewCircleName(e.target.value)} placeholder={lang === "es" ? "Ej: Familia López" : "E.g.: Lopez Family"} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: NAVY_DARK, background: CREAM, boxSizing: "border-box", outline: "none", fontFamily: "Georgia, serif" }} />
                </div>
                <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{lang === "es" ? "Descripción (opcional)" : "Description (optional)"}</div>
                  <textarea value={newCircleDesc} onChange={e => setNewCircleDesc(e.target.value)} placeholder={lang === "es" ? "¿De qué trata este círculo?" : "What is this circle about?"} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: NAVY_DARK, background: CREAM, minHeight: 70, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "Georgia, serif" }} />
                </div>
                <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{lang === "es" ? "Tipo de círculo" : "Circle type"}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["publico", "🌍", lang === "es" ? "Público" : "Public"], ["privado", "🔒", lang === "es" ? "Privado" : "Private"]].map(([type, icon, label]) => (
                      <button key={type} onClick={() => setNewCircleType(type)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${newCircleType === type ? NAVY : CREAM_DARK}`, background: newCircleType === type ? `${NAVY}18` : WHITE, color: newCircleType === type ? NAVY : MUTED, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                  {newCircleType === "privado" && (
                    <div style={{ marginTop: 12, background: `${GOLD}18`, borderRadius: 10, padding: "10px 14px", border: `1px solid ${GOLD}44` }}>
                      <div style={{ fontSize: 11, color: "#8B6A1A", fontWeight: "bold", marginBottom: 4 }}>
                        {lang === "es" ? "CÓDIGO DE ACCESO (se genera al crear)" : "ACCESS CODE (generated on create)"}
                      </div>
                      <div style={{ fontSize: 18, color: MUTED, letterSpacing: 4, fontFamily: "monospace" }}>
                        {lang === "es" ? "· · · · · ·" : "· · · · · ·"}
                      </div>
                    </div>
                  )}
                </div>
                {circleError && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{circleError}</div>}
                <button onClick={createCircle} disabled={circleLoading || !newCircleName.trim()} style={{ width: "100%", padding: 13, background: !newCircleName.trim() ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: !newCircleName.trim() ? MUTED : WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: newCircleName.trim() ? "pointer" : "default", fontFamily: "'Crimson Text', serif" }}>
                  🙏 {circleLoading ? (lang === "es" ? "Creando..." : "Creating...") : (lang === "es" ? <>Crear Conec<span style={cx}>✝</span>2</> : <>Create Pray<span style={cx}>✝</span>2gether</>)}
                </button>
              </div>
            ) : circleView === "join" ? (
              <div>
                <button onClick={() => setCircleView("list")} style={{ background: "none", border: "none", color: NAVY, fontSize: 14, cursor: "pointer", padding: "0 0 16px 0", fontWeight: "bold" }}>
                  ← {lang === "es" ? "Volver" : "Back"}
                </button>
                <div style={{ fontSize: 16, fontWeight: "bold", color: NAVY_DARK, marginBottom: 16, fontFamily: "'Crimson Text', serif" }}>
                  {lang === "es" ? <>Unirse a un Conec<span style={cx}>✝</span>2</> : <>Join a Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {[["private", "🔒", lang === "es" ? "Código privado" : "Private code"], ["public", "🌍", lang === "es" ? <>Conec<span style={cx}>✝</span>2 públicos</> : <>Public Pray<span style={cx}>✝</span>2gether</>]].map(([mode, icon, label]) => (
                    <button key={mode} onClick={() => { setJoinMode(mode); if (mode === "public") loadPublicCircles(); }} style={{ flex: 1, padding: "9px 8px", borderRadius: 12, background: joinMode === mode ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : WHITE, color: joinMode === mode ? WHITE : MUTED, border: `1px solid ${joinMode === mode ? NAVY : CREAM_DARK}`, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
                {joinMode === "private" ? (
                  <div>
                    <div style={{ background: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{lang === "es" ? "Código del círculo" : "Circle code"}</div>
                      <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="XXXXXX" maxLength={6} style={{ width: "100%", padding: "12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 22, fontFamily: "monospace", letterSpacing: 6, color: NAVY_DARK, background: CREAM, boxSizing: "border-box", textAlign: "center", outline: "none" }} />
                    </div>
                    {circleError && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{circleError}</div>}
                    <button onClick={joinCircleByCode} disabled={circleLoading || joinCode.length < 6} style={{ width: "100%", padding: 13, background: joinCode.length < 6 ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: joinCode.length < 6 ? MUTED : WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: joinCode.length >= 6 ? "pointer" : "default", fontFamily: "'Crimson Text', serif" }}>
                      {circleLoading ? (lang === "es" ? "Buscando..." : "Searching...") : (lang === "es" ? <>Unirse al Conec<span style={cx}>✝</span>2</> : <>Join Pray<span style={cx}>✝</span>2gether</>)}
                    </button>
                  </div>
                ) : (
                  <div>
                    {circleLoading ? (
                      <div style={{ textAlign: "center", color: MUTED, padding: "32px 20px" }}>
                        <div style={{ fontSize: 14 }}>{lang === "es" ? <>Cargando Conec<span style={cx}>✝</span>2...</> : <>Loading Pray<span style={cx}>✝</span>2gether...</>}</div>
                      </div>
                    ) : publicCircles.filter(c => !myCircles.find(m => m.id === c.id)).length === 0 ? (
                      <div style={{ textAlign: "center", color: MUTED, padding: "32px 20px" }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>🌍</div>
                        <div style={{ fontSize: 14 }}>{lang === "es" ? <>No hay Conec<span style={cx}>✝</span>2 públicos disponibles</> : <>No public Pray<span style={cx}>✝</span>2gether available</>}</div>
                      </div>
                    ) : publicCircles.filter(c => !myCircles.find(m => m.id === c.id)).map(c => (
                      <div key={c.id} style={{ background: WHITE, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}` }}>
                        <div style={{ fontSize: 14, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif" }}>{c.nombre}</div>
                        {c.descripcion && <div style={{ fontSize: 13, color: MUTED, marginTop: 3, marginBottom: 8 }}>{c.descripcion}</div>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 12, color: MUTED }}>👥 {c.miembros?.length || 1}/10</div>
                          <button onClick={() => joinPublicCircle(c)} disabled={(c.miembros?.length || 0) >= 10} style={{ padding: "7px 16px", background: (c.miembros?.length || 0) >= 10 ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: (c.miembros?.length || 0) >= 10 ? MUTED : WHITE, border: "none", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: (c.miembros?.length || 0) >= 10 ? "default" : "pointer" }}>
                            {(c.miembros?.length || 0) >= 10 ? (lang === "es" ? "Lleno" : "Full") : (lang === "es" ? "Unirse" : "Join")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Inside circle */
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <button onClick={() => { setCircleView("list"); setSelectedCircle(null); setCircleIntenciones([]); }} style={{ background: "none", border: "none", color: NAVY, fontSize: 18, cursor: "pointer", fontWeight: "bold", padding: 0 }}>
                    ←
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Crimson Text', serif" }}>{selectedCircle?.nombre}</div>
                    {selectedCircle?.descripcion && <div style={{ fontSize: 12, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedCircle.descripcion}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, flexShrink: 0 }}>👥 {selectedCircle?.miembros?.length || 1}/10</div>
                </div>

                {/* Access code — visible only to the creator of a private circle */}
                {selectedCircle?.tipo === "privado" && selectedCircle?.creadorId === user.uid && (
                  <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}66`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>🔑</span>
                      <div>
                        <div style={{ fontSize: 10, color: "#8B6A1A", fontWeight: "bold", letterSpacing: 0.5 }}>
                          {lang === "es" ? "CÓDIGO DE ACCESO" : "ACCESS CODE"}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: "bold", color: NAVY, fontFamily: "monospace", letterSpacing: 4 }}>
                          {selectedCircle.codigo}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCircle.codigo).catch(() => {});
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      style={{ padding: "6px 14px", background: codeCopied ? "#1a6b3a" : NAVY, color: WHITE, border: "none", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
                    >
                      {codeCopied ? (lang === "es" ? "¡Copiado!" : "Copied!") : (lang === "es" ? "Copiar" : "Copy")}
                    </button>
                  </div>
                )}

                {/* Add intention */}
                <div style={{ background: WHITE, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${CREAM_DARK}` }}>
                  <textarea value={newIntencion} onChange={e => setNewIntencion(e.target.value)} placeholder={lang === "es" ? "Comparte una intención de oración..." : "Share a prayer intention..."} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: NAVY_DARK, background: CREAM, minHeight: 60, boxSizing: "border-box", resize: "none", outline: "none", fontFamily: "Georgia, serif" }} />
                  <button onClick={addIntencion} disabled={!newIntencion.trim()} style={{ marginTop: 8, width: "100%", padding: "9px", background: !newIntencion.trim() ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: !newIntencion.trim() ? MUTED : WHITE, border: "none", borderRadius: 10, fontSize: 13, fontWeight: "bold", cursor: newIntencion.trim() ? "pointer" : "default" }}>
                    🙏 {lang === "es" ? "Compartir intención" : "Share intention"}
                  </button>
                </div>

                {/* Intentions list */}
                {circleLoading ? (
                  <div style={{ textAlign: "center", color: MUTED, padding: "32px 20px" }}>
                    <div style={{ fontSize: 14 }}>{lang === "es" ? "Cargando intenciones..." : "Loading intentions..."}</div>
                  </div>
                ) : circleIntenciones.length === 0 ? (
                  <div style={{ textAlign: "center", color: MUTED, padding: "32px 20px" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🙏</div>
                    <div style={{ fontSize: 14 }}>{lang === "es" ? "Sé el primero en compartir una intención" : "Be the first to share an intention"}</div>
                  </div>
                ) : circleIntenciones.map(intent => {
                  const isOrando = intent.orando?.includes(user.uid);
                  const orandoCount = intent.orando?.length || 0;
                  const canDelete = intent.autorId === user.uid || selectedCircle?.creadorId === user.uid;
                  return (
                    <div key={intent.id} style={{ background: WHITE, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)" }}>
                      <div style={{ fontSize: 11, color: GOLD, fontWeight: "bold", marginBottom: 6 }}>{intent.autorNombre}</div>
                      <div style={{ fontSize: 14, color: NAVY_DARK, lineHeight: 1.65, fontFamily: "'Crimson Text', serif", marginBottom: 10 }}>{intent.texto}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button onClick={() => toggleOrando(intent)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: isOrando ? `${GOLD}22` : CREAM, border: `1px solid ${isOrando ? GOLD : CREAM_DARK}`, borderRadius: 20, fontSize: 13, cursor: "pointer", color: isOrando ? "#8B6A1A" : MUTED }}>
                          🙏 {orandoCount > 0 && <span style={{ fontWeight: "bold" }}>{orandoCount}</span>} <span>{lang === "es" ? "Estoy orando" : "I'm praying"}</span>
                        </button>
                        {canDelete && (
                          <button onClick={() => deleteIntencion(intent)} style={{ background: "none", border: "none", color: MUTED, fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Leave circle */}
                {selectedCircle && selectedCircle.creadorId !== user.uid && (
                  <div style={{ marginTop: 20, textAlign: "center" }}>
                    <button onClick={leaveCircle} style={{ background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                      {lang === "es" ? <>Abandonar este Conec<span style={cx}>✝</span>2</> : <>Leave this Pray<span style={cx}>✝</span>2gether</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Pestaña: Mi Libro de Oraciones (Firestore) */
          <div>
            {!user ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📖</div>
                <div style={{ fontSize: 14, color: NAVY_DARK, marginBottom: 16, fontFamily: "'Crimson Text', serif" }}>
                  {lang === "es" ? "Inicia sesión para ver tu libro de oraciones" : "Sign in to see your prayer book"}
                </div>
                <button onClick={() => setAuthMode("login")} style={{ padding: "10px 28px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                  👤 {lang === "es" ? "Iniciar sesión" : "Sign in"}
                </button>
              </div>
            ) : prayerBookLoading ? (
              <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🙏</div>
                <div style={{ fontSize: 14 }}>{lang === "es" ? "Cargando tus oraciones..." : "Loading your prayers..."}</div>
              </div>
            ) : prayerBook.length === 0 ? (
              <div style={{ textAlign: "center", color: MUTED, padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📖</div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{lang === "es" ? "Aún no tienes oraciones guardadas." : "No prayers saved yet."}</div>
                <div style={{ fontSize: 13 }}>{lang === "es" ? "Crea tu primera oración ↑" : "Create your first prayer ↑"}</div>
              </div>
            ) : prayerBook.map(p => {
              const isOpen = expandedPrayerId === p.id;
              const previewText = p.intencion
                ? p.intencion
                : p.oracion.split('\n').filter(l => l.trim()).slice(0, 2).join(' ');
              return (
                <div key={p.id} style={{ background: WHITE, borderRadius: 16, marginBottom: 14, overflow: "hidden", border: `1px solid ${p.respondida ? GOLD + "88" : CREAM_DARK}`, boxShadow: p.respondida ? `0 4px 20px ${GOLD}28` : "0 2px 10px rgba(15,28,50,0.06)" }}>
                  {/* Header — clic para expandir/colapsar */}
                  <div onClick={() => setExpandedPrayerId(isOpen ? null : p.id)} style={{ background: p.respondida ? `linear-gradient(135deg, ${NAVY_DARK}, #3a2800)` : `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{getMoodIcon(p.estado)}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: "bold", color: WHITE, fontFamily: "'Crimson Text', serif" }}>{p.estado}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{formatFirestoreDate(p.fecha)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {p.respondida && (
                        <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, fontSize: 11, fontWeight: "bold", padding: "4px 10px", borderRadius: 20 }}>
                          ✨ {lang === "es" ? "Respondida" : "Answered"}
                        </span>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Vista colapsada: intención o primeras 2 líneas */}
                  {!isOpen && (
                    <div style={{ padding: "12px 16px", borderTop: `1px solid ${CREAM_DARK}` }}>
                      <div style={{ fontSize: 13, color: p.intencion ? "#5A3A2E" : MUTED, lineHeight: 1.6, fontStyle: p.intencion ? "italic" : "normal" }}>
                        {previewText.length > 120 ? previewText.substring(0, 120) + "…" : previewText}
                      </div>
                    </div>
                  )}

                  {/* Vista expandida: intención resaltada + oración completa */}
                  {isOpen && (
                    <div style={{ padding: "16px 16px 14px" }}>
                      {p.intencion && (
                        <div style={{ background: `${GOLD}18`, borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 14 }}>
                          <div style={{ fontSize: 11, color: "#8B6A1A", fontWeight: "bold", marginBottom: 4, letterSpacing: 0.5 }}>
                            {lang === "es" ? "TU INTENCIÓN" : "YOUR INTENTION"}
                          </div>
                          <div style={{ fontSize: 14, color: "#5A3A2E", fontStyle: "italic", lineHeight: 1.65, fontFamily: "'Crimson Text', serif" }}>
                            {p.intencion}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const marker = lang === "es" ? "Te lo pido especialmente por" : "I especially pray for";
                        const idx = p.oracion.indexOf(marker);
                        if (idx === -1) {
                          return (
                            <div style={{ fontSize: 14, color: NAVY_DARK, lineHeight: 1.8, fontFamily: "'Crimson Text', serif", whiteSpace: "pre-wrap" }}>
                              {p.oracion}
                            </div>
                          );
                        }
                        const before = p.oracion.substring(0, idx).trimEnd();
                        const line = p.oracion.substring(idx).trim();
                        return (
                          <>
                            <div style={{ fontSize: 14, color: NAVY_DARK, lineHeight: 1.8, fontFamily: "'Crimson Text', serif", whiteSpace: "pre-wrap", marginBottom: 12 }}>
                              {before}
                            </div>
                            <div style={{ background: "#FDF3DC", borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 12, fontStyle: "italic", color: NAVY, fontSize: 14, fontFamily: "'Crimson Text', serif", lineHeight: 1.7 }}>
                              {line}
                            </div>
                          </>
                        );
                      })()}
                      {!p.respondida && (
                        <button onClick={() => markAnswered(p.id)} style={{ marginTop: 14, width: "100%", padding: "10px", background: `linear-gradient(135deg, #1a6b3a, #0f4a28)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Crimson Text', serif" }}>
                          🙏 {lang === "es" ? "¡Respondida!" : "Answered!"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

  const renderBible = () => {
    const BIBLE_ID = "e3f420b9665abaeb-01";
    const API_KEY = "8z-olVvbUPzjg2OtXjSks";
    const loadChapters = async (book) => {
      setBibleSelectedBook(book);
      setBibleView("chapters");
      setBibleChapters([]);
      setBibleLoading(true);
      try {
        const r = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books/${book.id}/chapters`,
          { headers: { "api-key": API_KEY } }
        );
        const json = await r.json();
        setBibleChapters((json.data || []).filter(c => c.number !== "intro"));
      } catch (_) {}
      setBibleLoading(false);
    };

    const loadChapter = async (chapter) => {
      setBibleSelectedChapter(chapter);
      setBibleView("verses");
      setBibleChapterText("");
      setBibleLoading(true);
      try {
        const r = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${chapter.id}?content-type=html&include-verse-numbers=true&include-titles=false&include-notes=false&include-chapter-numbers=false`,
          { headers: { "api-key": API_KEY } }
        );
        const json = await r.json();
        setBibleChapterText(json.data?.content || "");
      } catch (_) {}
      setBibleLoading(false);
    };

    const doSearch = async () => {
      const q = bibleSearch.trim();
      if (!q) return;
      setBibleView("search");
      setBibleLoading(true);
      setBibleSearchResults(null);
      try {
        const r = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(q)}&limit=20`,
          { headers: { "api-key": API_KEY } }
        );
        const json = await r.json();
        setBibleSearchResults(json.data?.verses || []);
      } catch (_) {
        setBibleSearchResults([]);
      }
      setBibleLoading(false);
    };

    const parseVerses = (html) => {
      if (!html) return [];
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const result = [];
        const vSpans = Array.from(doc.querySelectorAll(".v[data-number]"));
        if (vSpans.length === 0) {
          const text = doc.body.textContent.replace(/\s+/g, " ").trim();
          return text ? [{ num: 0, text }] : [];
        }
        vSpans.forEach(span => {
          const num = parseInt(span.getAttribute("data-number"));
          if (isNaN(num) || num < 1) return;
          let text = "";
          let cur = span.nextSibling;
          while (cur) {
            if (cur.nodeType === 1 && cur.getAttribute?.("data-number") && cur.classList?.contains("v")) break;
            text += cur.textContent || "";
            cur = cur.nextSibling;
          }
          text = text.replace(/\s+/g, " ").trim();
          if (text) result.push({ num, text });
        });
        return result.sort((a, b) => a.num - b.num);
      } catch (_) {
        return [];
      }
    };

    const searchBarJsx = (autoFocus = false) => (
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          autoFocus={autoFocus}
          value={bibleSearch}
          onChange={e => setBibleSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder={lang === "es" ? "Buscar versículo..." : "Search verse..."}
          style={{ flex: 1, padding: "10px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, color: NAVY_DARK, background: CREAM, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={doSearch} style={{ padding: "10px 16px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>
          🔍
        </button>
      </div>
    );

    if (bibleView === "books") {
      const categories = BIBLE_CATEGORIES[bibleTestament][lang];
      const currentBooks = BIBLE_BOOKS[lang][bibleTestament][bibleCategory] || [];
      return (
        <div>
          {searchBarJsx(false)}

          {/* Botones Antiguo / Nuevo Testamento */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              { key: "ot", label: lang === "es" ? "Antiguo Testamento" : "Old Testament" },
              { key: "nt", label: lang === "es" ? "Nuevo Testamento" : "New Testament" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setBibleTestament(key);
                  setBibleCategory(key === "ot" ? "pentateuco" : "evangelios");
                }}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12,
                  background: bibleTestament === key
                    ? `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`
                    : WHITE,
                  border: bibleTestament === key
                    ? `2px solid ${GOLD}`
                    : `1px solid ${CREAM_DARK}`,
                  color: bibleTestament === key ? WHITE : NAVY_DARK,
                  fontSize: 13, fontWeight: "bold", cursor: "pointer",
                  fontFamily: "'Cinzel', serif", lineHeight: 1.3,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Pestañas de categoría — scroll horizontal */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBibleCategory(key)}
                style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 20,
                  background: bibleCategory === key ? GOLD : "transparent",
                  border: `1px solid ${bibleCategory === key ? GOLD : CREAM_DARK}`,
                  color: bibleCategory === key ? NAVY_DARK : MUTED,
                  fontSize: 12, fontWeight: "bold", cursor: "pointer",
                  fontFamily: "'Crimson Text', serif", whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grilla de libros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {currentBooks.map(b => (
              <button
                key={b.id}
                onClick={() => loadChapters(b)}
                style={{
                  padding: "9px 6px", borderRadius: 10,
                  background: WHITE, border: `1px solid ${CREAM_DARK}`,
                  color: NAVY_DARK, fontSize: 12, cursor: "pointer",
                  fontFamily: "'Crimson Text', serif", textAlign: "center",
                  fontWeight: "600", lineHeight: 1.3,
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (bibleView === "chapters") {
      return (
        <div>
          <button onClick={() => setBibleView("books")} style={{ marginBottom: 16, background: "none", border: "none", color: NAVY, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Crimson Text', serif", display: "flex", alignItems: "center", gap: 4 }}>
            ← {lang === "es" ? "Libros" : "Books"}
          </button>
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, color: WHITE }}>
            <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>{bibleSelectedBook?.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              {lang === "es" ? "Selecciona un capítulo" : "Select a chapter"}
            </div>
          </div>
          {bibleLoading ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40, fontSize: 24 }}>🙏</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {bibleChapters.map(c => (
                <button key={c.id} onClick={() => loadChapter(c)} style={{ padding: "13px 6px", borderRadius: 10, background: WHITE, border: `1px solid ${CREAM_DARK}`, color: NAVY_DARK, fontSize: 15, cursor: "pointer", fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>
                  {c.number}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (bibleView === "search") {
      return (
        <div>
          <button onClick={() => { setBibleView("books"); setBibleSearchResults(null); }} style={{ marginBottom: 16, background: "none", border: "none", color: NAVY, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Crimson Text', serif" }}>
            ← {lang === "es" ? "Libros" : "Books"}
          </button>
          {searchBarJsx(true)}
          {bibleLoading ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🙏</div>
              <div style={{ fontSize: 14 }}>{lang === "es" ? "Buscando..." : "Searching..."}</div>
            </div>
          ) : bibleSearchResults === null ? null : bibleSearchResults.length === 0 ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40, fontSize: 14 }}>
              {lang === "es" ? "Sin resultados para " : "No results for "}«{bibleSearch}»
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
                {bibleSearchResults.length} {lang === "es" ? "versículos encontrados" : "verses found"}
              </div>
              {bibleSearchResults.map((v, i) => (
                <div key={i} style={{ background: WHITE, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: "bold", color: GOLD, marginBottom: 6, fontFamily: "'Cinzel', serif", letterSpacing: 0.5 }}>
                    {formatRef(v.reference)}
                  </div>
                  <div style={{ fontSize: 14, color: NAVY_DARK, lineHeight: 1.75, fontFamily: "'Crimson Text', serif" }}>
                    {v.text?.replace(/\s+/g, " ").trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (bibleView === "verses") {
      const verses = parseVerses(bibleChapterText);
      return (
        <div>
          <button onClick={() => setBibleView("chapters")} style={{ marginBottom: 14, background: "none", border: "none", color: NAVY, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Crimson Text', serif" }}>
            ← {bibleSelectedBook?.name}
          </button>
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, color: WHITE }}>
            <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cinzel', serif" }}>
              {bibleSelectedBook?.name} {bibleSelectedChapter?.number}
            </div>
          </div>
          {bibleLoading ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🙏</div>
              <div style={{ fontSize: 14 }}>{lang === "es" ? "Cargando capítulo..." : "Loading chapter..."}</div>
            </div>
          ) : verses.length === 0 ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40, fontSize: 14 }}>
              {lang === "es" ? "No se pudo cargar el capítulo." : "Could not load chapter."}
            </div>
          ) : (
            <div>
              {verses.map(v => (
                <div key={v.num} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${CREAM_DARK}` }}>
                  {v.num > 0 && (
                    <div style={{ fontSize: 11, fontWeight: "bold", color: GOLD, minWidth: 22, paddingTop: 3, fontFamily: "'Cinzel', serif", flexShrink: 0, textAlign: "right" }}>
                      {v.num}
                    </div>
                  )}
                  <div style={{ fontSize: 15, color: NAVY_DARK, lineHeight: 1.8, fontFamily: "'Crimson Text', serif", flex: 1 }}>
                    {v.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const navIcons = [
    /* 0 Inicio */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 11 L12 3 L22 11" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        <rect x="4" y="11" width="16" height="10" rx="1" stroke={c} strokeWidth="1.5"/>
        <rect x="9.5" y="15" width="5" height="6" fill="#C9A84C" rx="0.5"/>
      </svg>
    ),
    /* 1 Oración */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="4.5" r="2.2" fill={c}/>
        <rect x="10.8" y="3.5" width="2.4" height="18" rx="1.2" fill={c}/>
        <rect x="4.5" y="9.5" width="15" height="2.4" rx="1.2" fill={c}/>
      </svg>
    ),
    /* 2 Evangelio */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke={c} strokeWidth="1.5"/>
        <line x1="8" y1="3" x2="8" y2="21" stroke={c} strokeWidth="1"/>
        <line x1="10" y1="8.5" x2="18" y2="8.5" stroke={c} strokeWidth="1.2"/>
        <line x1="10" y1="12" x2="18" y2="12" stroke={c} strokeWidth="1.2"/>
        <line x1="10" y1="15.5" x2="18" y2="15.5" stroke={c} strokeWidth="1.2"/>
      </svg>
    ),
    /* 3 Lecturas */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="4.5" rx="2.2" stroke={c} strokeWidth="1.5"/>
        <rect x="6" y="6" width="12" height="13" stroke={c} strokeWidth="1.5"/>
        <rect x="4" y="18.5" width="16" height="4.5" rx="2.2" stroke={c} strokeWidth="1.5"/>
        <line x1="9" y1="9.5" x2="15" y2="9.5" stroke={c} strokeWidth="1"/>
        <line x1="9" y1="12.5" x2="15" y2="12.5" stroke={c} strokeWidth="1"/>
        <line x1="9" y1="15.5" x2="15" y2="15.5" stroke={c} strokeWidth="1"/>
      </svg>
    ),
    /* 4 Rosario */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="7" stroke={c} strokeWidth="1.2" strokeDasharray="2.5 2.5"/>
        <circle cx="12" cy="3" r="1.8" fill="#C9A84C"/>
        <circle cx="5.3" cy="12.5" r="1.8" fill="#C9A84C"/>
        <circle cx="18.7" cy="12.5" r="1.8" fill="#C9A84C"/>
        <line x1="12" y1="17" x2="12" y2="23" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9.5" y1="20.5" x2="14.5" y2="20.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    /* 5 Devocional */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="0.5" x2="12" y2="4.5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="10" y1="2.5" x2="14" y2="2.5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 11 L12 4.5 L21 11" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        <rect x="5" y="11" width="14" height="10" rx="1" stroke={c} strokeWidth="1.5"/>
        <rect x="9.5" y="15" width="5" height="6" rx="0.5" stroke={c} strokeWidth="1"/>
      </svg>
    ),
    /* 6 La Biblia */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 6 C9 5 5 6 3 8 L3 20 C5 18 9 17 12 19 Z" stroke={c} strokeWidth="1.5"/>
        <path d="M12 6 C15 5 19 6 21 8 L21 20 C19 18 15 17 12 19 Z" stroke={c} strokeWidth="1.5"/>
        <line x1="12" y1="6" x2="12" y2="19" stroke={c} strokeWidth="1.5"/>
        <line x1="5" y1="11" x2="10.5" y2="10" stroke={c} strokeWidth="1"/>
        <line x1="5" y1="14" x2="10.5" y2="13" stroke={c} strokeWidth="1"/>
        <line x1="13.5" y1="10" x2="19" y2="11" stroke={c} strokeWidth="1"/>
        <line x1="13.5" y1="13" x2="19" y2="14" stroke={c} strokeWidth="1"/>
      </svg>
    ),
    /* 7 Reflexiones */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 6 C9 5 5 6 3 8 L3 20 C5 18 9 17 12 19 Z" stroke={c} strokeWidth="1.5"/>
        <path d="M12 6 C15 5 19 6 21 8 L21 20 C19 18 15 17 12 19 Z" stroke={c} strokeWidth="1.5"/>
        <line x1="12" y1="6" x2="12" y2="19" stroke={c} strokeWidth="1.5"/>
        <line x1="5" y1="11" x2="10.5" y2="10" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="5" y1="14" x2="10.5" y2="13" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="5" y1="17" x2="10.5" y2="16" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="13.5" y1="10" x2="19" y2="11" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="13.5" y1="13" x2="19" y2="14" stroke="#C9A84C" strokeWidth="1"/>
        <line x1="13.5" y1="16" x2="19" y2="17" stroke="#C9A84C" strokeWidth="1"/>
      </svg>
    ),
    /* 8 Tienda */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 8 H19 L17.5 21 H6.5 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 8 C9 4.5 15 4.5 15 8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="12.5" x2="12" y2="16.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="14.5" x2="14" y2="14.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    /* 9 Configuración */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18.2 10 L20.8 10.1 L20.8 13.9 L18.2 14 L16.8 16.4 L18 18.7 L14.8 20.6 L13.4 18.4 L10.6 18.4 L9.2 20.6 L6 18.7 L7.2 16.4 L5.8 14 L3.2 13.9 L3.2 10.1 L5.8 10 L7.2 7.6 L6 5.3 L9.2 3.4 L10.6 5.6 L13.4 5.6 L14.8 3.4 L18 5.3 L16.8 7.6 Z" stroke={c} strokeWidth="1.2"/>
        <circle cx="12" cy="12" r="3" fill="#C9A84C"/>
      </svg>
    ),
  ];
  const sections = [renderHome, renderPersonalPrayer, renderGospel, renderReadings, renderRosary, renderPrayers, renderBible, renderReflections, renderShop, renderSettings];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: CREAM, minHeight: "100vh", maxWidth: 430, margin: "0 auto", boxShadow: "0 0 60px rgba(15,28,50,0.12)" }}>

      {/* Splash screen */}
      {showSplash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: CREAM,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: splashIn && !splashOut ? 1 : 0,
          transition: splashOut ? "opacity 0.7s ease" : "opacity 0.6s ease",
          pointerEvents: "none",
        }}>
          {/* Logo SVG — road converging to a glowing cross */}
          <svg viewBox="0 0 160 160" width="150" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="lumoraGlow" cx="50%" cy="43%" r="38%">
                <stop offset="0%"   stopColor="#E8C76A" stopOpacity="1"/>
                <stop offset="45%"  stopColor="#C9A84C" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Golden glow disc behind cross */}
            <circle cx="80" cy="65" r="58" fill="url(#lumoraGlow)"/>
            {/* Road perspective — outer edges */}
            <line x1="80" y1="65" x2="5"   y2="158" stroke="#C9A84C" strokeWidth="2"   strokeLinecap="round" opacity="0.5"/>
            <line x1="80" y1="65" x2="155" y2="158" stroke="#C9A84C" strokeWidth="2"   strokeLinecap="round" opacity="0.5"/>
            {/* Road perspective — inner lane marks */}
            <line x1="80" y1="65" x2="40"  y2="158" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" opacity="0.28"/>
            <line x1="80" y1="65" x2="120" y2="158" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" opacity="0.28"/>
            {/* Center dashed lane */}
            <line x1="80" y1="68" x2="80"  y2="158" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="11,11" strokeLinecap="round" opacity="0.35"/>
            {/* Horizontal depth lines */}
            <line x1="27" y1="108" x2="133" y2="108" stroke="#C9A84C" strokeWidth="1" opacity="0.18"/>
            <line x1="14" y1="133" x2="146" y2="133" stroke="#C9A84C" strokeWidth="1" opacity="0.13"/>
            {/* Cross — centered at (80, 62) */}
            <rect x="74" y="30" width="12" height="64" rx="6" fill="#C9A84C"/>
            <rect x="52" y="52" width="56" height="12" rx="6" fill="#C9A84C"/>
          </svg>

          {/* App name */}
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 42,
            fontWeight: 700,
            color: NAVY,
            letterSpacing: 12,
            marginTop: 18,
            textTransform: "uppercase",
          }}>{t.appName}</div>

          {/* Tagline */}
          <div style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: 16,
            fontStyle: "italic",
            color: GOLD,
            marginTop: 10,
            letterSpacing: 0.5,
          }}>
            {t.tagline}
          </div>
        </div>
      )}

      {paymentSuccess && renderPaymentSuccess()}
      {authMode && renderAuthModal()}
      {showCart && renderCartModal()}

      <style>{`
        @keyframes lambPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0.35); }
          50%       { box-shadow: 0 4px 18px rgba(201,168,76,0.7), 0 0 0 9px rgba(201,168,76,0); }
        }
      `}</style>

      {/* Botón Cordero de Dios */}
      {tab === 2 && gospelData && (
        <button
          onClick={handleLambClick}
          title={lang === 'es' ? 'Guía Espiritual' : 'Spiritual Guide'}
          style={{
            position: "fixed", bottom: 80, left: 20, zIndex: 60,
            width: 50, height: 50, borderRadius: "50%",
            background: NAVY_DARK,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, animation: "lambPulse 2.5s ease-in-out infinite",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >🐑</button>
      )}

      {/* Modal Guía Espiritual */}
      {lambOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,18,35,0.78)" }}
          onClick={() => setLambOpen(false)}
        >
          <div
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "linear-gradient(145deg, #FAF5ED 0%, #F5EDD8 100%)", border: `2px solid ${GOLD}`, borderRadius: 24, padding: "28px 24px 24px", width: "90vw", maxWidth: 440, maxHeight: "82vh", overflowY: "auto", zIndex: 101, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Título centrado */}
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🐑</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: NAVY, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
                {lang === 'es' ? 'Guía Espiritual' : 'Spiritual Guide'}
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
                {lang === 'es' ? 'Reflexión del Evangelio de hoy' : 'Reflection on today\'s Gospel'}
              </div>
            </div>
            {/* Separador dorado decorativo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 14px" }}>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <span style={{ color: GOLD, fontSize: 12 }}>✦</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>
            {gospelData?.reference && (
              <div style={{ fontSize: 11, color: GOLD, fontWeight: "bold", textAlign: "center", marginBottom: 14 }}>{formatRef(gospelData.reference)}</div>
            )}
            {lambLoading ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>✨</div>
                <div style={{ fontSize: 14, fontStyle: "italic", color: MUTED }}>
                  {lang === 'es' ? 'Preparando tu reflexión…' : 'Preparing your reflection…'}
                </div>
              </div>
            ) : lambText ? (
              <div style={{ fontSize: 15, color: NAVY_DARK, lineHeight: 1.75, fontFamily: "'Crimson Text', serif" }}>
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => <div style={{ fontWeight: "bold", fontSize: 15, color: NAVY, marginTop: 14, marginBottom: 3 }}>{children}</div>,
                    h3: ({ children }) => <div style={{ fontWeight: "bold", fontSize: 14, color: NAVY, marginTop: 12, marginBottom: 3 }}>{children}</div>,
                    strong: ({ children }) => <strong style={{ color: NAVY }}>{children}</strong>,
                    p: ({ children }) => <p style={{ margin: "0 0 10px" }}>{children}</p>,
                    hr: () => <hr style={{ border: "none", borderTop: `1px solid ${GOLD}55`, margin: "12px 0" }} />,
                  }}
                >
                  {formatRef(lambText)}
                </ReactMarkdown>
              </div>
            ) : null}
            <button
              onClick={() => setLambOpen(false)}
              style={{ marginTop: 18, width: "100%", padding: "11px", background: NAVY_DARK, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: 0.5 }}
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Botón Inicio fijo */}
      {tab !== 0 && (
        <button
          onClick={() => setTab(0)}
          title={lang === "es" ? "Inicio" : "Home"}
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 60,
            width: 44, height: 44, borderRadius: "50%",
            background: NAVY_DARK, border: `1.5px solid ${GOLD}44`,
            color: GOLD, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(15,28,50,0.4)",
          }}
        >
          {navIcons[0](GOLD)}
        </button>
      )}

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2A3F6B 100%)", color: WHITE, position: "sticky", top: 0, zIndex: 40, borderRadius: 24, margin: 8 }}>

        {/* Barra superior: hamburguesa + logo izquierda | acciones derecha */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 14px 10px", gap: 10 }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, width: 36, height: 36, borderRadius: 10, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {menuOpen ? "✕" : "☰"}
          </button>

          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 5, color: GOLD, fontFamily: "'Cinzel', serif" }}>{t.appName}</div>
            <div style={{ width: 64, height: 1.5, background: GOLD, margin: "4px auto 0", borderRadius: 1, opacity: 0.75 }}/>
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
            { icon: (c) => (
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="5" r="2.5" fill={c}/>
                  <rect x="12.5" y="4" width="3" height="20" rx="1.5" fill={c}/>
                  <rect x="5" y="11" width="18" height="3" rx="1.5" fill={c}/>
                </svg>
              ), label: lang === 'es' ? "Oración"   : "Prayer",   idx: 1 },
            { icon: (c) => (
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <rect x="6" y="4" width="16" height="21" rx="2" stroke={c} strokeWidth="1.5"/>
                  <line x1="9" y1="4" x2="9" y2="25" stroke={c} strokeWidth="1"/>
                  <line x1="11" y1="10" x2="21" y2="10" stroke={c} strokeWidth="1.2"/>
                  <line x1="11" y1="14" x2="21" y2="14" stroke={c} strokeWidth="1.2"/>
                  <line x1="11" y1="18" x2="21" y2="18" stroke={c} strokeWidth="1.2"/>
                </svg>
              ), label: lang === 'es' ? "Evangelio" : "Gospel",  idx: 2 },
            { icon: (c) => (
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M14 7 C11 6 7 7 5 9 L5 22 C7 20 11 19 14 21 Z" stroke={c} strokeWidth="1.5"/>
                  <path d="M14 7 C17 6 21 7 23 9 L23 22 C21 20 17 19 14 21 Z" stroke={c} strokeWidth="1.5"/>
                  <line x1="14" y1="7" x2="14" y2="21" stroke={c} strokeWidth="1.5"/>
                  <line x1="7" y1="12" x2="12.5" y2="11" stroke={c} strokeWidth="1"/>
                  <line x1="7" y1="15" x2="12.5" y2="14" stroke={c} strokeWidth="1"/>
                  <line x1="15.5" y1="11" x2="21" y2="12" stroke={c} strokeWidth="1"/>
                  <line x1="15.5" y1="14" x2="21" y2="15" stroke={c} strokeWidth="1"/>
                </svg>
              ), label: lang === 'es' ? "La Biblia" : "Bible",    idx: 6 },
            { icon: (c) => (
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <rect x="5" y="3" width="18" height="5" rx="2.5" stroke={c} strokeWidth="1.5"/>
                  <rect x="7" y="7" width="14" height="15" stroke={c} strokeWidth="1.5"/>
                  <rect x="5" y="21" width="18" height="5" rx="2.5" stroke={c} strokeWidth="1.5"/>
                  <line x1="10" y1="11" x2="18" y2="11" stroke={c} strokeWidth="1"/>
                  <line x1="10" y1="14.5" x2="18" y2="14.5" stroke={c} strokeWidth="1"/>
                  <line x1="10" y1="18" x2="18" y2="18" stroke={c} strokeWidth="1"/>
                </svg>
              ), label: lang === 'es' ? "Lecturas"  : "Readings", idx: 3 },
            { icon: (c) => (
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M5 9 H23 L21 24 H7 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 9 C10 5 18 5 18 9" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="14" y1="14" x2="14" y2="19" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="11.5" y1="16.5" x2="16.5" y2="16.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ), label: lang === 'es' ? "Tienda"    : "Shop",     idx: 8 },
          ].map(({ icon, label, idx }) => {
            const isActive = tab === idx;
            const isHovered = hoveredQuickBtn === idx;
            const isPressed = pressedQuickBtn === idx;
            const iconColor = isActive ? GOLD : "#FAF5ED";
            const bibleStyle = {
              background: isActive
                ? "rgba(201,168,76,0.28)"
                : isHovered
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.12)",
              border: `1px solid ${isActive ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.2)"}`,
              color: isActive ? GOLD : "rgba(255,255,255,0.75)",
            };
            const transform = isPressed ? "scale(0.95)" : isHovered ? "translateY(-2px)" : "none";
            const transition = `transform ${isPressed ? "0.1s" : "0.2s"} ease, background 0.2s ease, box-shadow 0.2s ease`;
            return (
              <button
                key={idx}
                onClick={() => setTab(idx)}
                onPointerEnter={() => setHoveredQuickBtn(idx)}
                onPointerLeave={() => { setHoveredQuickBtn(null); setPressedQuickBtn(null); }}
                onPointerDown={() => setPressedQuickBtn(idx)}
                onPointerUp={() => setPressedQuickBtn(null)}
                onPointerCancel={() => setPressedQuickBtn(null)}
                style={{ flex: 1, padding: "6px 4px", borderRadius: 10, cursor: "pointer", textAlign: "center", transform, transition, ...bibleStyle }}
              >
                <div style={{ marginBottom: 2, lineHeight: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{icon(iconColor)}</div>
                <div style={{ fontSize: 13, fontWeight: "600", fontFamily: "'Crimson Text', serif", letterSpacing: 0.2, whiteSpace: "nowrap" }}>{label}</div>
              </button>
            );
          })}
        </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <div style={{ background: NAVY_DARK, borderTop: "1px solid rgba(255,255,255,0.08)", maxHeight: "60vh", overflowY: "auto" }}>
            {t.nav.map((n, i) => (
              <button key={i} onClick={() => { setTab(i); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 20px", background: tab === i ? "rgba(201,168,76,0.1)" : "none", border: "none", borderLeft: tab === i ? `3px solid ${GOLD}` : "3px solid transparent", color: tab === i ? GOLD : "rgba(255,255,255,0.75)", fontSize: 15, cursor: "pointer", fontFamily: "'Crimson Text', serif", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center" }}>{navIcons[i](tab === i ? GOLD : "rgba(255,255,255,0.75)")}</span>
                <span>{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ padding: "20px 20px 52px" }}>
        {tab !== 0 && (
          <div style={{ fontSize: 19, fontWeight: "bold", color: NAVY, marginBottom: 18, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12, fontFamily: "'Crimson Text', serif" }}>
            {t.nav[tab]}
          </div>
        )}
        {sections[tab]()}
      </div>
    </div>
  );
}
