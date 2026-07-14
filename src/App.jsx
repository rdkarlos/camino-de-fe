import { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, updateDoc, doc, getDoc, setDoc, serverTimestamp, arrayUnion, arrayRemove, deleteDoc, where } from "firebase/firestore";
import { products, formatPrice } from "./products";
import Rosario from "./Rosario";
import Devocional, { getSantoHoy } from "./Devocional";
import JovenFe from "./JovenFe";
import VERSICULOS from "./versiculos";
import { NOCHE, CARD, ALBA, LINO, CIELO, PIEDRA, ALBA_LIGHT, ALBA_DARK, NOCHE_DARK, BRISA_ALBA, rgba, mix } from "./theme";
import Horeb from "./Horeb";
import { generateLambShareImage, generateVerseShareImage, gospelExcerpt } from "./shareImage";

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
    appName: "Horeb",
    tagline: "Luz que guía, amor que une",
    nav: ["Inicio", "Oración personal", "Evangelio", "Lecturas del día", "Rosario", "Devocional", "La Biblia", "Tienda", "Configuración", "Joven Fe"],
    home: {
      greeting: "Que la paz del Señor esté contigo",
      date: new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "🕊️", title: "Oración Personal", desc: "Construye tu oración y lleva un diario de gracias", btn: "Comenzar", img: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600", tab: 1 },
        { icon: "📖", title: "Evangelio del Día", desc: "La Palabra de Dios para hoy", btn: "Leer más", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600", tab: 2 },
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
  },
  en: {
    appName: "Horeb",
    tagline: "Light that guides, love that unites",
    nav: ["Home", "Personal prayer", "Gospel", "Daily readings", "Rosary", "Devotional", "Bible", "Shop", "Settings", "Youth Faith"],
    home: {
      greeting: "May the peace of the Lord be with you",
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      cards: [
        { icon: "🕊️", title: "Personal Prayer", desc: "Build your prayer and keep a gratitude journal", btn: "Start", img: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600", tab: 1 },
        { icon: "📖", title: "Gospel of the Day", desc: "God's Word for today", btn: "Read more", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600", tab: 2 },
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
  },
};

const GOLD = ALBA;
const GOLD_LIGHT = ALBA_LIGHT;
const NAVY = NOCHE;
const NAVY_DARK = NOCHE_DARK;
const CREAM = LINO;
const CREAM_DARK = PIEDRA;
const MUTED = CIELO;
const WHITE = "#FFFFFF";
const BG_MAIN = NOCHE;
const BG_CARD = CARD;

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

const PRAYER_INTENTION_PREFIX = {
  es: {
    gratitud:   "Te agradezco especialmente por:",
    ansiedad:   "Te pido especialmente por:",
    familia:    "Te encomiendo especialmente a:",
    trabajo:    "Te pido orientación especialmente en:",
    duelo:      "En este dolor te ofrezco:",
    salud:      "Te pido sanación especialmente por:",
    decisiones: "Te pido sabiduría especialmente en:",
    otra:       "Te lo pido especialmente por:",
  },
  en: {
    gratitud:   "I especially thank You for:",
    ansiedad:   "I especially ask You for:",
    familia:    "I especially entrust to You:",
    trabajo:    "I especially seek guidance for:",
    duelo:      "In this pain, I offer You:",
    salud:      "I especially ask for healing for:",
    decisiones: "I especially ask for wisdom in:",
    otra:       "I especially pray for:",
  },
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

const ONBOARDING_ICONS = {
  logo: (
    <svg viewBox="0 0 160 160" width="88" height="88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="onboardGlow" cx="50%" cy="43%" r="38%">
          <stop offset="0%"   stopColor={GOLD_LIGHT} stopOpacity="1"/>
          <stop offset="45%"  stopColor={GOLD} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="80" cy="65" r="58" fill="url(#onboardGlow)"/>
      <line x1="80" y1="65" x2="5"   y2="158" stroke={GOLD} strokeWidth="2"   strokeLinecap="round" opacity="0.5"/>
      <line x1="80" y1="65" x2="155" y2="158" stroke={GOLD} strokeWidth="2"   strokeLinecap="round" opacity="0.5"/>
      <line x1="80" y1="65" x2="40"  y2="158" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.28"/>
      <line x1="80" y1="65" x2="120" y2="158" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.28"/>
      <line x1="80" y1="68" x2="80"  y2="158" stroke={GOLD} strokeWidth="1.5" strokeDasharray="11,11" strokeLinecap="round" opacity="0.35"/>
      <rect x="74" y="30" width="12" height="64" rx="6" fill={GOLD}/>
      <rect x="52" y="52" width="56" height="12" rx="6" fill={GOLD}/>
    </svg>
  ),
  book: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path d="M12 6 C9 5 5 6 3 8 L3 20 C5 18 9 17 12 19 Z" stroke={GOLD} strokeWidth="1.3"/>
      <path d="M12 6 C15 5 19 6 21 8 L21 20 C19 18 15 17 12 19 Z" stroke={GOLD} strokeWidth="1.3"/>
      <line x1="12" y1="6" x2="12" y2="19" stroke={GOLD} strokeWidth="1.3"/>
      <line x1="5" y1="11" x2="10.5" y2="10" stroke={GOLD} strokeWidth="0.9"/>
      <line x1="5" y1="14" x2="10.5" y2="13" stroke={GOLD} strokeWidth="0.9"/>
      <line x1="13.5" y1="10" x2="19" y2="11" stroke={GOLD} strokeWidth="0.9"/>
      <line x1="13.5" y1="13" x2="19" y2="14" stroke={GOLD} strokeWidth="0.9"/>
    </svg>
  ),
  cross: (
    <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
      <rect x="42" y="8" width="16" height="84" rx="8" fill={GOLD}/>
      <rect x="18" y="36" width="64" height="16" rx="8" fill={GOLD}/>
    </svg>
  ),
  star: (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14.4 8.6 L21 9 L15.9 13.1 L17.7 19.6 L12 15.9 L6.3 19.6 L8.1 13.1 L3 9 L9.6 8.6 Z" fill={GOLD}/>
    </svg>
  ),
};

const ONBOARDING_SCREENS = {
  es: [
    { title: "Bienvenido a Horeb", text: "Tu compañero espiritual diario. Fe, oración y comunidad, siempre contigo.", icon: "logo" },
    { title: "El Evangelio cada día", text: "Lee el Evangelio de cada día y encuentra una reflexión para vivirlo.", icon: "book" },
    { title: "Reza y crece", text: "Crea oraciones, reza el rosario y únete a círculos con tu familia.", icon: "cross" },
    { title: "Fe viva para jóvenes", text: "Retos de fe, testimonios y quiz bíblico para vivir tu fe con otros jóvenes.", icon: "star" },
  ],
  en: [
    { title: "Welcome to Horeb", text: "Your daily spiritual companion. Faith, prayer, and community in your pocket.", icon: "logo" },
    { title: "The Gospel every day", text: "Read today's gospel and receive reflections that transform your life.", icon: "book" },
    { title: "Pray, grow, believe", text: "Create prayers, pray the rosary, and join circles with your family.", icon: "cross" },
    { title: "Living faith for youth", text: "Faith challenges, testimonies, and Bible quiz. Faith is the greatest adventure!", icon: "star" },
  ],
};

const formatRef = (r) => r ? String(r).replace(/(\d+):(\d+)/g, '$1, $2') : r;

const SITE_URL = 'https://somoshoreb.com';

const LAMB_BTN_SIZE = 50;
const clampLambPos = ({ x, y }) => ({
  x: Math.min(Math.max(x, 0), Math.max(window.innerWidth - LAMB_BTN_SIZE, 0)),
  y: Math.min(Math.max(y, 0), Math.max(window.innerHeight - LAMB_BTN_SIZE, 0)),
});

// Heurística general para detectar texto en español: no depende de un libro
// bíblico concreto (no busca "Salmo" a propósito). El texto en español (LBLA)
// siempre trae tildes/ñ/¿/¡, o al menos palabras funcionales muy comunes.
// El texto crudo de Universalis (inglés) nunca las tiene.
const looksSpanish = (text) => {
  if (!text || typeof text !== 'string') return false;
  if (/[áéíóúñÁÉÍÓÚÑ¿¡]/.test(text)) return true;
  return /\b(el|la|los|las|que|del|con|para|su|es)\b/i.test(text);
};

// Antes de cachear la respuesta de /api/gospel en español, confirma que cada
// sección presente tenga texto real en español. Una sección "no disponible"
// (fallback sereno con textEn) es válida pero NO se cachea — ver razonamiento
// en la conversación: el fallo puede ser transitorio, y cachearlo dejaría al
// usuario viendo "no disponible" toda la sesión aunque el servidor ya lo
// resuelva en el siguiente intento.
const isSafeToCacheGospelEs = (data) => {
  if (!data?.success) return false;
  if (!looksSpanish(data.text)) return false;
  for (const key of ['reading1', 'reading2', 'psalm']) {
    const section = data[key];
    if (!section) continue; // esa lectura no aplica hoy, está bien
    if (!section.text || !looksSpanish(section.text)) return false;
  }
  return true;
};

// Rastro de luz — aviso in-app de intenciones nuevas en Conec✝2.
// toMillisSafe acepta tanto Timestamp de Firestore como Date local (el que
// usamos como aproximación optimista justo después de escribir en Firestore).
const toMillisSafe = (v) => {
  if (!v) return 0;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v instanceof Date) return v.getTime();
  return 0;
};

// Chequeo barato (sin lecturas extra): compara la última intención del
// círculo contra el lastSeen del usuario. Ver conversación — es exacto en
// este modelo porque nunca se puede publicar sin abrir antes el círculo
// (lo que ya actualiza lastSeen), salvo la ventana angosta que cierra la
// segunda pasada (findSuspiciousCircles + confirmNewCircles más abajo).
const circleLooksNew = (circle, lastSeen, uid) => {
  if (!circle?.ultimaIntencionFecha || circle.ultimaIntencionAutorId === uid) return false;
  const seen = lastSeen?.[circle.id];
  if (!seen) return false; // sin línea base todavía (se resuelve con el backfill) — nunca inunda
  return toMillisSafe(circle.ultimaIntencionFecha) > toMillisSafe(seen);
};

// Punto de luz — círculo pequeño en Alba con halo suave, sin número ni texto.
const LightDot = ({ style }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute", width: 9, height: 9, borderRadius: "50%",
      background: ALBA, boxShadow: `0 0 6px 2px ${ALBA}99, 0 0 2px ${ALBA}`,
      ...style,
    }}
  />
);

const cleanGospelText = (text) => {
  if (!text) return { reference: '', body: '' };
  let clean = text.replace('Evangelio del día', '').trim();
  const refMatch = clean.match(/Lectura del santo Evangelio según san ([\w\s]+?)\s*([\d:,\s\-–—]+)\n/i);
  const reference = refMatch ? `${refMatch[1].trim()} ${refMatch[2].trim()}` : '';
  const body = clean.replace(/Lectura del santo Evangelio según san [\w\s]+?\s*[\d:,\s\-–—]+\n/i, '').trim();
  return { reference, body };
};

// Horarios de misa por parroquia — días de la semana en orden fijo, sin acentos
// en las claves (evita cualquier problema de codificación en Firestore/JS).
const DAY_KEYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAY_LABELS = {
  es: { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' },
  en: { lunes: 'Monday', martes: 'Tuesday', miercoles: 'Wednesday', jueves: 'Thursday', viernes: 'Friday', sabado: 'Saturday', domingo: 'Sunday' },
};

// Ancla el día de hoy a America/Bogota — mismo patrón que Rosario.jsx
// (Intl.DateTimeFormat con locale fijo 'en-US' y weekday:'short', mapeado
// explícitamente para evitar cualquier ambigüedad de índice/idioma).
const todayParishDayKey = () => {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short' }).format(new Date());
  const map = { Mon: 'lunes', Tue: 'martes', Wed: 'miercoles', Thu: 'jueves', Fri: 'viernes', Sat: 'sabado', Sun: 'domingo' };
  return map[weekday];
};

const misasSignature = (misas) => (misas || []).map(m => `${m.hora}|${m.lugar || ''}`).join(';');

// Agrupa días consecutivos (en el orden fijo lunes→domingo) que tengan
// exactamente el mismo horario, para mostrar "Lunes a viernes" en vez de
// repetir 5 veces la misma lista de misas.
const groupWeekSchedule = (horarioMisas) => {
  const groups = [];
  let i = 0;
  while (i < DAY_KEYS.length) {
    const sig = misasSignature(horarioMisas?.[DAY_KEYS[i]]);
    let j = i;
    while (j + 1 < DAY_KEYS.length && misasSignature(horarioMisas?.[DAY_KEYS[j + 1]]) === sig) j++;
    groups.push({ days: DAY_KEYS.slice(i, j + 1), misas: horarioMisas?.[DAY_KEYS[i]] || [] });
    i = j + 1;
  }
  return groups;
};

const groupDayLabel = (days, lang) => {
  const labels = days.map(d => DAY_LABELS[lang][d]);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} ${lang === 'es' ? 'y' : 'and'} ${labels[1]}`;
  return `${labels[0]} ${lang === 'es' ? 'a' : 'to'} ${labels[labels.length - 1]}`;
};

// "2026-07-12" -> "12 de julio de 2026" (o el equivalente en inglés) — para
// mencionar la fecha del directorio sin que suene a metadato bibliográfico.
const formatFuenteFecha = (iso, lang) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function App() {
  const [lang, setLang] = useState("es");
  const [tab, setTab] = useState(0);
  const [rosaryStep, setRosaryStep] = useState(0);
  const [selectedMystery, setSelectedMystery] = useState(0);
  const [openPrayer, setOpenPrayer] = useState(null);
  const [cart, setCart] = useState([]);
  const [gospelData, setGospelData] = useState(null);
  const [cronVerse, setCronVerse] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openReading, setOpenReading] = useState(null);
  const [showEnglishFallback, setShowEnglishFallback] = useState({});
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
  const [personalSection, setPersonalSection] = useState(null);
  const [devocionalInitialTab, setDevocionalInitialTab] = useState(null);
  const [parroquias, setParroquias] = useState([]);
  const [userParroquiaId, setUserParroquiaId] = useState(null);
  const [parroquiaExpanded, setParroquiaExpanded] = useState(false);

  // Entrada "limpia" a una sección desde fuera de ella (menú, accesos rápidos,
  // tarjetas de Inicio): resetea la memoria de sub-navegación de Oración Personal
  // antes de cambiar de tab, para que cada entrada sea predecible. Los atajos que
  // fijan un destino específico (ej. Santo del Día) no pasan por aquí — asignan
  // su propio estado directamente.
  const goToTab = (i) => {
    setPersonalSection(null);
    setPersonalTab("builder");
    setDevocionalInitialTab(null);
    setTab(i);
  };
  const [hoveredPersonalCard, setHoveredPersonalCard] = useState(null);
  const [pressedPersonalCard, setPressedPersonalCard] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [prayerIntention, setPrayerIntention] = useState("");
  const [lambOpen, setLambOpen] = useState(false);
  const [lambLoading, setLambLoading] = useState(false);
  const [lambText, setLambText] = useState("");
  const [lambCopied, setLambCopied] = useState(false);
  const [lambImageSaved, setLambImageSaved] = useState(false);
  const [verseCopied, setVerseCopied] = useState(false);
  const [verseImageSaved, setVerseImageSaved] = useState(false);
  const [lambPos, setLambPos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lambPosition'));
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
        return clampLambPos(saved);
      }
    } catch {}
    return clampLambPos({ x: 20, y: window.innerHeight - 80 - LAMB_BTN_SIZE });
  });
  const [lambDragging, setLambDragging] = useState(false);
  const lambDragRef = useRef({ pointerId: null, startX: 0, startY: 0, origX: 0, origY: 0, dragging: false, moved: false, isTouch: false, longPressTimer: null });
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
  const [circleLastSeen, setCircleLastSeen] = useState({});
  const [circleLastSeenLoaded, setCircleLastSeenLoaded] = useState(false);
  const [confirmedNewCircles, setConfirmedNewCircles] = useState({});
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
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return localStorage.getItem('lumora_splash_shown') !== new Date().toDateString();
    } catch {
      return true;
    }
  });
  const [splashIn, setSplashIn] = useState(false);
  const [splashOut, setSplashOut] = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    const t0 = setTimeout(() => setSplashIn(true), 60);
    const t1 = setTimeout(() => setSplashOut(true), 2500);
    const t2 = setTimeout(() => {
      setShowSplash(false);
      try { localStorage.setItem('lumora_splash_shown', new Date().toDateString()); } catch {}
    }, 3200);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem('lumora_onboarding_done') !== 'true';
    } catch {
      return true;
    }
  });
  const [onboardingStep, setOnboardingStep] = useState(0);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem('lumora_onboarding_done', 'true'); } catch {}
  };

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
    const cacheKey = `gospel_v4_${lang}_${day}_${month}_${year}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setGospelData(JSON.parse(cached)); return; }
    } catch(e) {}
    axios.get(`/api/gospel?lang=${lang}&day=${day}&month=${month}&year=${year}`)
      .then(res => {
        if (res.data.success) {
          setGospelData(res.data);
          const safeToCache = lang === 'es' ? isSafeToCacheGospelEs(res.data) : true;
          if (safeToCache) {
            try { sessionStorage.setItem(cacheKey, JSON.stringify(res.data)); } catch(e) {}
          }
        }
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
    getDoc(doc(db, 'versiculos', today))
      .then((snap) => {
        if (snap.exists() && snap.data().texto) {
          setCronVerse(snap.data());
        }
      })
      .catch(() => {});
  }, []);

  // Lista de parroquias — lectura pública, no depende de sesión.
  useEffect(() => {
    getDocs(collection(db, "parroquias"))
      .then(snap => setParroquias(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  }, []);

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

  // Carga temprana de "mis círculos" + su lastSeen, en cuanto haya sesión —
  // no espera a que el usuario entre al tab Conec✝2, porque el rastro de luz
  // de los niveles 1 y 2 (Inicio, entrada a Conec✝2) necesita saber desde el
  // arranque si hay algo nuevo en cualquier círculo. Es la misma consulta que
  // ya se hacía antes al entrar al tab, solo que ahora corre una vez al iniciar
  // sesión en lugar de repetirse cada vez que se abre el tab.
  //
  // También se vuelve a ejecutar cuando la app vuelve a primer plano
  // (visibilitychange), con un throttle de 3 minutos para no recargar si el
  // usuario alterna rápido entre apps. Sin onSnapshot, sin temporizador de
  // fondo — solo el trigger de visibilidad.
  const lastCircleActivityFetchRef = useRef(0);
  const CIRCLE_ACTIVITY_THROTTLE_MS = 3 * 60 * 1000;
  useEffect(() => {
    if (!user) {
      setMyCircles([]); setCircleLastSeen({}); setCircleLastSeenLoaded(false); setConfirmedNewCircles({});
      setUserParroquiaId(null);
      return;
    }

    const loadCircleActivity = () => {
      lastCircleActivityFetchRef.current = Date.now();
      getDocs(query(collection(db, "circulos"), where("miembros", "array-contains", user.uid)))
        .then(snap => setMyCircles(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
        .catch(() => {});
      // Mismo doc de usuario que ya se leía para circleLastSeen — se
      // aprovecha la lectura para tomar también parroquiaId, sin duplicarla.
      getDoc(doc(db, "usuarios", user.uid))
        .then(snap => {
          setCircleLastSeen(snap.exists() ? (snap.data().circleLastSeen || {}) : {});
          setUserParroquiaId(snap.exists() ? (snap.data().parroquiaId || null) : null);
        })
        .catch(() => setCircleLastSeen({}))
        .finally(() => setCircleLastSeenLoaded(true));
    };

    loadCircleActivity();

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastCircleActivityFetchRef.current < CIRCLE_ACTIVITY_THROTTLE_MS) return;
      loadCircleActivity();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user]);

  // Backfill — la primera vez que vemos un círculo del que ya somos miembros
  // pero sin lastSeen guardado (usuarios existentes al desplegar esto, o recién
  // unidos), fijamos su lastSeen a "ahora" para que las intenciones viejas no
  // aparezcan como una avalancha de novedades.
  useEffect(() => {
    if (!user || !circleLastSeenLoaded || !myCircles.length) return;
    const missing = myCircles.filter(c => !circleLastSeen[c.id]);
    if (!missing.length) return;
    const patch = {};
    missing.forEach(c => { patch[c.id] = serverTimestamp(); });
    setDoc(doc(db, "usuarios", user.uid), { circleLastSeen: patch }, { merge: true })
      .then(() => {
        setCircleLastSeen(prev => {
          const next = { ...prev };
          missing.forEach(c => { next[c.id] = new Date(); });
          return next;
        });
      })
      .catch(() => {});
  }, [user, circleLastSeenLoaded, myCircles, circleLastSeen]);

  // Booleano agregado para los niveles 1 y 2 (Inicio, entrada a Conec✝2):
  // ¿hay algo nuevo en cualquier círculo? Se recalcula solo cuando cambian
  // los datos de entrada, no en cada render.
  const hasAnyNewCircleActivity = useMemo(
    () => myCircles.some(c => circleLooksNew(c, circleLastSeen, user?.uid)),
    [myCircles, circleLastSeen, user]
  );

  useEffect(() => {
    if (personalTab !== "circles" || !user) return;
    setCircleView("list");
  }, [personalTab, user]);

  // Segunda pasada — solo para círculos que el chequeo barato ya marcó como
  // sospechosos. Confirma con una consulta chica (sin índice compuesto: un
  // solo campo de rango) si de verdad hay una intención ajena sin ver, para
  // cerrar el caso borde donde una intención propia "tapa" una ajena.
  useEffect(() => {
    if (personalTab !== "circles" || !user || !circleLastSeenLoaded) return;
    const suspicious = myCircles.filter(c => circleLooksNew(c, circleLastSeen, user.uid));
    if (!suspicious.length) { setConfirmedNewCircles({}); return; }
    let cancelled = false;
    Promise.all(suspicious.map(async (c) => {
      const seen = circleLastSeen[c.id];
      try {
        const snap = await getDocs(query(
          collection(db, "circulos", c.id, "intenciones"),
          where("fecha", ">", seen),
          orderBy("fecha", "asc"),
          limit(3)
        ));
        const hasOther = snap.docs.some(d => d.data().autorId !== user.uid);
        return [c.id, hasOther];
      } catch (e) {
        return [c.id, true]; // si la consulta falla, preferimos un falso positivo a perder un aviso real
      }
    })).then(results => {
      if (cancelled) return;
      const confirmed = {};
      results.forEach(([id, isNew]) => { if (isNew) confirmed[id] = true; });
      setConfirmedNewCircles(confirmed);
    });
    return () => { cancelled = true; };
  }, [personalTab, user, circleLastSeenLoaded, myCircles, circleLastSeen]);

  // Marca un círculo como visto ahora — se llama al abrirlo (apaga el rastro
  // de luz para ese círculo) y al crear/unirse (arranca en cero, sin avalancha).
  const markCircleSeen = (circleId) => {
    if (!user) return;
    setCircleLastSeen(prev => ({ ...prev, [circleId]: new Date() }));
    setConfirmedNewCircles(prev => {
      if (!prev[circleId]) return prev;
      const next = { ...prev };
      delete next[circleId];
      return next;
    });
    setDoc(doc(db, "usuarios", user.uid), { circleLastSeen: { [circleId]: serverTimestamp() } }, { merge: true }).catch(() => {});
  };

  // Fija (o cambia) la parroquia del usuario — un usuario tiene una sola,
  // y puede cambiarla en cualquier momento desde Configuración.
  const chooseParroquia = (parroquiaId) => {
    if (!user) return;
    setUserParroquiaId(parroquiaId);
    setDoc(doc(db, "usuarios", user.uid), { parroquiaId }, { merge: true }).catch(() => {});
  };

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

    const now = new Date();
    const colombiaOffset = -5 * 60;
    const colombiaTime = new Date(now.getTime() + (colombiaOffset - now.getTimezoneOffset()) * 60000);
    const today = colombiaTime.toISOString().split('T')[0];

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

  const handleShareLamb = async () => {
    const { body } = gospelData ? cleanGospelText(gospelData.text) : { body: '' };
    const quoteText = gospelExcerpt(body);
    const quoteRef = gospelData?.reference ? formatRef(gospelData.reference) : '';
    const shareText = lang === 'es'
      ? 'Una idea para vivir el Evangelio hoy. Hay más camino en Horeb.'
      : 'An idea to live the Gospel today. There is more to walk in Horeb.';

    let blob = null;
    try {
      blob = await generateLambShareImage({ reflectionMarkdown: lambText, quoteText, quoteRef });
    } catch (e) {
      console.log('[lamb] no se pudo generar la imagen, comparto como texto:', e.message);
    }

    if (blob) {
      const file = new File([blob], 'horeb-ponlo-en-practica.png', { type: 'image/png' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Ponlo en Práctica — Horeb', text: `${shareText}\n\n${SITE_URL}` });
          return;
        } catch (e) {
          if (e?.name === 'AbortError') return;
        }
      }
      // El dispositivo no soporta compartir archivos: descarga serena de la imagen.
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'horeb-ponlo-en-practica.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setLambImageSaved(true);
      setTimeout(() => setLambImageSaved(false), 2600);
      return;
    }

    // La imagen no pudo generarse: comportamiento anterior, compartir/copiar texto.
    const shareData = {
      title: 'Ponlo en Práctica — Horeb',
      text: `${shareText}\n\n${lambText}`,
      url: SITE_URL,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      setLambCopied(true);
      setTimeout(() => setLambCopied(false), 2000);
    } catch (e) {}
  };

  const handleShareVerse = async () => {
    const versiculoBanco = getVersiculoHoy();
    const versiculoActivo = cronVerse || versiculoBanco;
    const verseText = versiculoActivo.texto;
    const verseRef = formatRef(versiculoActivo.referencia);
    const shareText = lang === 'es' ? 'Algo de luz para tu día.' : 'A little light for your day.';

    let blob = null;
    try {
      blob = await generateVerseShareImage({ verseText, verseRef });
    } catch (e) {
      console.log('[verse] no se pudo generar la imagen, comparto como texto:', e.message);
    }

    if (blob) {
      const file = new File([blob], 'horeb-versiculo-del-dia.png', { type: 'image/png' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: lang === 'es' ? 'Versículo del Día — Horeb' : 'Verse of the Day — Horeb', text: `${shareText}\n\n${SITE_URL}` });
          return;
        } catch (e) {
          if (e?.name === 'AbortError') return;
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'horeb-versiculo-del-dia.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setVerseImageSaved(true);
      setTimeout(() => setVerseImageSaved(false), 2600);
      return;
    }

    const shareData = {
      title: lang === 'es' ? 'Versículo del Día — Horeb' : 'Verse of the Day — Horeb',
      text: `${shareText}\n\n"${verseText}" — ${verseRef}`,
      url: SITE_URL,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      setVerseCopied(true);
      setTimeout(() => setVerseCopied(false), 2000);
    } catch (e) {}
  };

  const LAMB_LONG_PRESS_MS = 400;
  const LAMB_DRAG_THRESHOLD = 6;

  const handleLambPointerDown = (e) => {
    const drag = lambDragRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.pointerId = e.pointerId;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.origX = lambPos.x;
    drag.origY = lambPos.y;
    drag.dragging = false;
    drag.moved = false;
    drag.isTouch = e.pointerType !== 'mouse';
    clearTimeout(drag.longPressTimer);
    if (drag.isTouch) {
      drag.longPressTimer = setTimeout(() => {
        drag.dragging = true;
        if (navigator.vibrate) navigator.vibrate(30);
        setLambDragging(true);
      }, LAMB_LONG_PRESS_MS);
    }
  };

  const handleLambPointerMove = (e) => {
    const drag = lambDragRef.current;
    if (drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.dragging) {
      if (!drag.isTouch && (Math.abs(dx) > LAMB_DRAG_THRESHOLD || Math.abs(dy) > LAMB_DRAG_THRESHOLD)) {
        drag.dragging = true;
        setLambDragging(true);
      } else {
        return;
      }
    }
    drag.moved = true;
    setLambPos(clampLambPos({ x: drag.origX + dx, y: drag.origY + dy }));
  };

  const handleLambPointerUp = (e) => {
    const drag = lambDragRef.current;
    if (drag.pointerId !== e.pointerId) return;
    clearTimeout(drag.longPressTimer);
    if (drag.dragging) {
      localStorage.setItem('lambPosition', JSON.stringify(lambPos));
    }
    drag.dragging = false;
    drag.pointerId = null;
    setLambDragging(false);
  };

  const handleLambButtonClick = () => {
    if (lambDragRef.current.moved) {
      lambDragRef.current.moved = false;
      return;
    }
    handleLambClick();
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
      <div style={{ background: BG_CARD, borderRadius: 24, padding: 32, width: "100%", maxWidth: 380, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: `1px solid ${CREAM_DARK}` }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🙏</div>
        <div style={{ fontSize: 24, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginBottom: 8 }}>
          {lang === 'es' ? '¡Gracias por tu compra!' : 'Thank you for your purchase!'}
        </div>
        <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>
          {lang === 'es' ? 'Tu pago fue aprobado. Recibirás un email de confirmación pronto.' : 'Your payment was approved. You will receive a confirmation email soon.'}
        </div>
        <div style={{ fontSize: 13, color: GOLD, fontStyle: "italic", marginBottom: 24, fontFamily: "'Work Sans', sans-serif" }}>
          {lang === 'es' ? '«Gratis recibisteis, dad gratis» — Mateo 10:8' : '«Freely you have received, freely give» — Matthew 10:8'}
        </div>
        <button onClick={() => setPaymentSuccess(false)} style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", padding: "12px 28px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif" }}>
          {lang === 'es' ? 'Continuar →' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderAuthModal = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,28,50,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setAuthMode(null)}>
      <div style={{ background: BG_CARD, borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: `1px solid ${CREAM_DARK}` }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Horeb size={40} /></div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif" }}>
            {authMode === 'register' ? (lang === 'es' ? 'Crear cuenta' : 'Create account') : (lang === 'es' ? 'Iniciar sesión' : 'Sign in')}
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{lang === 'es' ? 'Únete a nuestra comunidad de fe' : 'Join our faith community'}</div>
        </div>
        <button onClick={handleGoogle} style={{ width: "100%", padding: "12px", background: BG_CARD, color: CREAM, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Cormorant', serif" }}>
          <span style={{ fontSize: 18 }}>G</span> {lang === 'es' ? 'Continuar con Google' : 'Continue with Google'}
        </button>
        <div style={{ textAlign: "center", color: MUTED, fontSize: 12, marginBottom: 16 }}>— {lang === 'es' ? 'o con email' : 'or with email'} —</div>
        {authMode === 'register' && <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cormorant', serif", boxSizing: "border-box", background: NAVY, color: CREAM }} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} value={authName} onChange={e => setAuthName(e.target.value)} />}
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cormorant', serif", boxSizing: "border-box", background: NAVY, color: CREAM }} placeholder="Email" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 16, fontFamily: "'Cormorant', serif", boxSizing: "border-box", background: NAVY, color: CREAM }} placeholder={lang === 'es' ? 'Contraseña' : 'Password'} type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
        {authError && <div style={{ background: "rgba(200,50,50,0.15)", border: "1px solid rgba(200,50,50,0.4)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#FF8A8A", marginBottom: 12 }}>{authError}</div>}
        <button onClick={authMode === 'register' ? handleRegister : handleLogin} disabled={authLoading} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 12, fontFamily: "'Cormorant', serif" }}>
          {authLoading ? '...' : authMode === 'register' ? (lang === 'es' ? 'Registrarme' : 'Register') : (lang === 'es' ? 'Entrar' : 'Sign in')}
        </button>
        <div style={{ textAlign: "center", fontSize: 13, color: MUTED }}>
          {authMode === 'register'
            ? <>{lang === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}<span style={{ color: GOLD, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('login')}>{lang === 'es' ? 'Inicia sesión' : 'Sign in'}</span></>
            : <>{lang === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}<span style={{ color: GOLD, cursor: "pointer", fontWeight: "bold" }} onClick={() => setAuthMode('register')}>{lang === 'es' ? 'Regístrate' : 'Register'}</span></>
          }
        </div>
      </div>
    </div>
  );

  const renderCartModal = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,28,50,0.75)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => { setShowCart(false); setCheckoutStep(0); }}>
      <div style={{ background: BG_CARD, borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, maxHeight: "80vh", overflowY: "auto", border: `1px solid ${CREAM_DARK}`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif" }}>{lang === 'es' ? 'Tu carrito' : 'Your cart'}</div>
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
                    <div style={{ fontWeight: "bold", color: CREAM, fontSize: 13 }}>{lang === 'es' ? item.nameEs : item.nameEn}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>x{item.quantity} · {formatPrice(item.price)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: "bold", color: GOLD, fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontWeight: "bold" }}>
              <span style={{ color: CREAM, fontFamily: "'Cormorant', serif" }}>Total</span>
              <span style={{ color: GOLD, fontSize: 18 }}>{formatPrice(cartTotal)}</span>
            </div>
            {checkoutStep === 0 ? (
              <button onClick={() => setCheckoutStep(1)} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif" }}>
                {lang === 'es' ? 'Proceder al pago →' : 'Proceed to checkout →'}
              </button>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: "bold", color: CREAM, marginBottom: 12, fontFamily: "'Cormorant', serif" }}>{lang === 'es' ? 'Datos de contacto' : 'Contact details'}</div>
                <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 10, fontFamily: "'Cormorant', serif", boxSizing: "border-box", background: NAVY, color: CREAM }} placeholder={lang === 'es' ? 'Nombre completo' : 'Full name'} value={checkoutName} onChange={e => setCheckoutName(e.target.value)} />
                <input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, marginBottom: 16, fontFamily: "'Cormorant', serif", boxSizing: "border-box", background: NAVY, color: CREAM }} placeholder="Email" type="email" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} />
                <button onClick={handleCheckout} disabled={checkoutLoading || !checkoutName || !checkoutEmail} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, #2E7D32, #1B5E20)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif", marginBottom: 8 }}>
                  {checkoutLoading ? '...' : `${lang === 'es' ? 'Pagar con Wompi' : 'Pay with Wompi'} · ${formatPrice(cartTotal)}`}
                </button>
                <button onClick={() => setCheckoutStep(0)} style={{ width: "100%", padding: "10px", background: CREAM_DARK, color: CREAM, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>← {lang === 'es' ? 'Volver' : 'Back'}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const getVersiculoHoy = () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
    const key = today.slice(5); // MM-DD
    return VERSICULOS[key] || VERSICULOS['01-01'];
  };

  const renderHome = () => {
    const { reference, body } = gospelData ? cleanGospelText(gospelData.text) : { reference: '', body: '' };
    const versiculoBanco = getVersiculoHoy();
    const versiculoActivo = cronVerse || versiculoBanco;
    const dailyVerse = { text: versiculoActivo.texto, ref: versiculoActivo.referencia };
    const { santo } = getSantoHoy();
    const oracionCard = t.home.cards[0];
    const evangelioCard = t.home.cards[1];
    const parroquiaActual = parroquias.find(p => p.id === userParroquiaId) || null;
    const parroquiaTodayKey = todayParishDayKey();
    const parroquiaTodayMisas = parroquiaActual ? (parroquiaActual.horarioMisas?.[parroquiaTodayKey] || []) : [];
    const parroquiaWeekGroups = parroquiaActual ? groupWeekSchedule(parroquiaActual.horarioMisas) : [];
    return (
      <div>
        {/* Tarjeta versículo — ancho completo, clickeable */}
        <div
          onClick={() => setVerseExpanded(true)}
          style={{
            background: `linear-gradient(135deg, ${BG_MAIN}, ${BG_CARD})`,
            border: `1px solid ${GOLD}`,
            borderRadius: 16, padding: "16px 18px", marginBottom: 16,
            position: "relative", overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <div style={{ position: "absolute", top: -8, left: -4, fontSize: 56, opacity: 0.06, color: GOLD }}>📖</div>
          <div style={{ fontSize: 16, color: GOLD, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 700 }}>✦ {lang === 'es' ? 'Versículo del Día' : 'Verse of the Day'}</div>
          <div style={{ fontSize: 15, fontStyle: "italic", color: CREAM, lineHeight: 1.6 }}>"{dailyVerse.text}"</div>
          <div style={{ fontSize: "0.8rem", color: GOLD, fontWeight: "bold", marginTop: 8 }}>— {formatRef(dailyVerse.ref)}</div>
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
              <div style={{ background: "rgba(30,38,48,0.72)", padding: "28px 24px 24px" }}>
              <button
                onClick={() => setVerseExpanded(false)}
                style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: GOLD, fontSize: 18, cursor: "pointer", padding: 12, lineHeight: 1, fontWeight: "bold" }}
              >✕</button>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 14 }}>{lang === 'es' ? 'Versículo del Día' : 'Verse of the Day'}</div>
              <div style={{ fontSize: "1.4rem", fontStyle: "italic", color: CREAM, fontWeight: 600, lineHeight: 1.7, fontFamily: "'Work Sans', sans-serif", marginBottom: 18 }}>"{dailyVerse.text}"</div>
              <div style={{ fontSize: 14, color: ALBA_DARK, fontWeight: "bold", fontFamily: "'Cormorant', serif", letterSpacing: 0.5 }}>— {formatRef(dailyVerse.ref)}</div>
              <button
                onClick={handleShareVerse}
                style={{ marginTop: 20, width: "100%", padding: "11px", background: "none", color: GOLD, border: `1.5px solid ${GOLD}`, borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {verseImageSaved
                  ? (lang === 'es' ? '✓ Imagen guardada' : '✓ Image saved')
                  : verseCopied
                  ? (lang === 'es' ? '✓ Copiado' : '✓ Copied')
                  : (lang === 'es' ? '↗ Comparte esta luz' : '↗ Share this light')}
              </button>
              </div>
            </div>
          </>
        )}
        {/* ── Bloque "Hoy" — contenido diario, seguido ── */}

        {/* Evangelio del Día — card compacta */}
        <div onClick={() => goToTab(evangelioCard.tab)} style={{ position: "relative", height: 90, borderRadius: 14, overflow: "hidden", marginBottom: 10, cursor: "pointer", border: `1px solid ${CREAM_DARK}` }}>
          {/* Imagen de fondo a 0.4 de opacidad */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${evangelioCard.img})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.4 }} />
          {/* Gradiente de izquierda a derecha */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${BG_CARD} 40%, transparent 100%)` }} />
          {/* Contenido */}
          <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box" }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 16, color: GOLD, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>✝ {lang === 'es' ? 'Evangelio del Día' : 'Gospel of the Day'}</div>
              {gospelData && (
                <div style={{ fontSize: 16, color: WHITE, fontWeight: 700, fontFamily: "'Cormorant', serif", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatRef(lang === 'en' ? gospelData?.reference : reference)}</div>
              )}
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{gospelData ? body.substring(0, 85) + "…" : evangelioCard.desc}</div>
            </div>
            <div style={{ color: GOLD, fontSize: 26, fontWeight: "300", flexShrink: 0 }}>›</div>
          </div>
        </div>

        {/* Santo del Día — card, abre el detalle que ya existe en Devocional */}
        <div
          onClick={() => { setDevocionalInitialTab('santo'); setPersonalSection('devocional'); setTab(1); }}
          style={{
            position: "relative", background: BG_CARD, border: `1px solid ${GOLD}66`,
            borderRadius: 16, padding: "16px 18px", marginBottom: 16,
            overflow: "hidden", cursor: "pointer",
          }}
        >
          {/* Resplandor atmosférico — esquina superior derecha, motivo decorativo (no la marca) */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(228,199,155,0.11)" }} />
          <div style={{ position: "absolute", top: -32, right: -32, width: 86, height: 86, borderRadius: "50%", background: "rgba(228,199,155,0.13)" }} />
          <div style={{ position: "absolute", top: 16, right: 20, width: 8, height: 8, borderRadius: "50%", background: BRISA_ALBA, boxShadow: `0 0 8px 2px ${BRISA_ALBA}99` }} />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 16, color: GOLD, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 700 }}>✦ {lang === 'es' ? 'Santo del Día' : 'Saint of the Day'}</div>
            <div style={{ fontSize: 19, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginBottom: 6 }}>{santo.nombre}</div>
            <div style={{ fontSize: 12.5, color: CREAM_DARK, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{santo.bio}</div>
            <div style={{ fontSize: 13, color: GOLD, fontWeight: "bold", fontFamily: "'Cormorant', serif", marginTop: 10 }}>{lang === 'es' ? 'Conocer su vida' : "Learn about the saint"} ›</div>
          </div>
        </div>

        {/* Tu parroquia — misas de hoy, o invitación a elegirla */}
        <div style={{ position: "relative", background: BG_CARD, border: `1px solid ${GOLD}66`, borderRadius: 16, padding: "16px 18px", marginBottom: 16, overflow: "hidden" }}>
          {!parroquiaActual ? (
            <div onClick={() => goToTab(8)} style={{ position: "relative", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(228,199,155,0.11)" }} />
              <div style={{ position: "absolute", top: -32, right: -32, width: 86, height: 86, borderRadius: "50%", background: "rgba(228,199,155,0.13)" }} />
              <div style={{ position: "absolute", top: 16, right: 20, width: 8, height: 8, borderRadius: "50%", background: BRISA_ALBA, boxShadow: `0 0 8px 2px ${BRISA_ALBA}99` }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 16, color: GOLD, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 700 }}>✦ {lang === 'es' ? 'Tu parroquia' : 'Your parish'}</div>
                <div style={{ fontSize: 13, color: CREAM_DARK, lineHeight: 1.5, marginBottom: 10 }}>
                  {lang === 'es'
                    ? 'La misa es la fuente y la cumbre. Elige tu parroquia y que el camino al altar nunca te quede lejos.'
                    : 'The Mass is the source and summit. Choose your parish so the way to the altar is never far.'}
                </div>
                <div style={{ fontSize: 13, color: GOLD, fontWeight: "bold", fontFamily: "'Cormorant', serif" }}>
                  {lang === 'es' ? 'Elegir mi parroquia' : 'Choose my parish'} ›
                </div>
              </div>
            </div>
          ) : !parroquiaExpanded ? (
            <div>
              <div style={{ fontSize: 16, color: GOLD, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 700 }}>✦ {lang === 'es' ? 'Misas de hoy' : "Today's Masses"}</div>
              <div style={{ fontSize: 13, color: CREAM_DARK, marginBottom: 12 }}>
                {parroquiaActual.nombre} · {DAY_LABELS[lang][parroquiaTodayKey]}
              </div>
              {parroquiaTodayMisas.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {parroquiaTodayMisas.map((m, i) => (
                    <div key={i} style={{ background: `${GOLD}1F`, border: `1px solid ${GOLD}59`, color: CREAM, borderRadius: 20, padding: "6px 12px", fontSize: 13, fontFamily: "'Work Sans', sans-serif" }}>
                      {m.hora}{m.lugar ? ` · ${m.lugar}` : ""}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 12, fontStyle: "italic" }}>
                  {lang === 'es' ? 'Sin misas programadas hoy.' : 'No Masses scheduled today.'}
                </div>
              )}
              <div onClick={() => setParroquiaExpanded(true)} style={{ fontSize: 13, color: GOLD, fontWeight: "bold", fontFamily: "'Cormorant', serif", cursor: "pointer" }}>
                {lang === 'es' ? 'Ver la semana' : 'See the week'} ›
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 16, color: GOLD, letterSpacing: "0.5px", fontWeight: 700 }}>✦ {lang === 'es' ? 'Misas de hoy' : "Today's Masses"}</div>
                <div onClick={() => setParroquiaExpanded(false)} style={{ fontSize: 12, color: MUTED, cursor: "pointer", flexShrink: 0, marginLeft: 10 }}>
                  ‹ {lang === 'es' ? 'Ver menos' : 'See less'}
                </div>
              </div>
              <div style={{ fontSize: 13, color: CREAM_DARK, marginBottom: 14 }}>{parroquiaActual.nombre}</div>
              {parroquiaWeekGroups.map((g, i) => {
                const isToday = g.days.includes(parroquiaTodayKey);
                return (
                  <div key={i} style={{ background: isToday ? `${GOLD}14` : "transparent", borderRadius: 10, padding: "8px 10px", marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: isToday ? GOLD : CREAM, fontFamily: "'Cormorant', serif", marginBottom: 4 }}>
                      {groupDayLabel(g.days, lang)}
                    </div>
                    <div style={{ fontSize: 12.5, color: CREAM_DARK, lineHeight: 1.6 }}>
                      {g.misas.length > 0
                        ? g.misas.map((m) => `${m.hora}${m.lugar ? ` (${m.lugar})` : ""}`).join(' · ')
                        : (lang === 'es' ? 'Sin misa' : 'No Mass')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Separador — cierre silencioso del bloque "Hoy" */}
        <div style={{ height: 1, background: `${CREAM_DARK}1F`, margin: "28px 0" }} />

        {/* ── Bloque "Tu camino" ── */}

        {/* Oración Personal — card grande */}
        <div onClick={() => goToTab(oracionCard.tab)} style={{ position: "relative", borderRadius: 20, minHeight: 140, overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 28px rgba(15,28,50,0.22)", cursor: "pointer", backgroundImage: `url(${oracionCard.img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(139,105,20,0.2) 0%, rgba(139,105,20,0.55) 100%)" }} />
          <div style={{ position: "relative", padding: "20px 20px 18px", color: WHITE, display: "flex", flexDirection: "column", minHeight: 140, justifyContent: "space-between", boxSizing: "border-box" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: GOLD, marginBottom: 5, lineHeight: 1.2 }}>{oracionCard.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>{oracionCard.desc}</div>
            </div>
            <div style={{ marginTop: 14 }}>
              <span style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.38)", padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: "bold" }}>{oracionCard.btn} →</span>
            </div>
          </div>
        </div>

        {/* Card especial Joven Fe */}
        <style>{`
          @keyframes goldPulse {
            0% { box-shadow: 0 0 0 0 ${rgba(GOLD, 0.4)}; }
            70% { box-shadow: 0 0 0 10px ${rgba(GOLD, 0)}; }
            100% { box-shadow: 0 0 0 0 ${rgba(GOLD, 0)}; }
          }
        `}</style>
        <div
          onClick={() => goToTab(9)}
          style={{
            position: "relative", borderRadius: 20, minHeight: 180, overflow: "hidden", marginBottom: 14,
            cursor: "pointer", border: `1.5px solid ${GOLD}`, animation: "goldPulse 2s infinite",
            backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80)",
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${rgba(NOCHE_DARK, 0.7)}, ${rgba(NOCHE, 0.65)})` }} />
          <div style={{ position: "relative", padding: "22px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minHeight: 180, justifyContent: "space-between", boxSizing: "border-box" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8 }}>
                <path d="M12 2 L14.4 8.6 L21 9 L15.9 13.1 L17.7 19.6 L12 15.9 L6.3 19.6 L8.1 13.1 L3 9 L9.6 8.6 Z" fill={GOLD}/>
              </svg>
              <div style={{ fontWeight: "bold", fontSize: 28, color: GOLD, fontFamily: "'Cormorant', serif", marginBottom: 6, lineHeight: 1.2 }}>
                {lang === 'es' ? 'Joven Fe' : 'Youth Faith'}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: CREAM, marginBottom: 12 }}>
                {lang === 'es' ? 'Fe viva para jóvenes' : 'Living faith for young people'}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ fontSize: 10, fontWeight: "bold", color: GOLD, background: rgba(GOLD, 0.1), border: `1px solid ${GOLD}`, padding: "6px 14px", borderRadius: 14 }}>
                  ✦ {lang === 'es' ? 'Retos' : 'Challenges'}
                </span>
                <span style={{ fontSize: 10, fontWeight: "bold", color: GOLD, background: rgba(GOLD, 0.1), border: `1px solid ${GOLD}`, padding: "6px 14px", borderRadius: 14 }}>
                  ✦ {lang === 'es' ? 'Testimonios' : 'Testimonies'}
                </span>
                <span style={{ fontSize: 10, fontWeight: "bold", color: GOLD, background: rgba(GOLD, 0.1), border: `1px solid ${GOLD}`, padding: "6px 14px", borderRadius: 14 }}>
                  ✦ Quiz
                </span>
              </div>
            </div>
            <div style={{ marginTop: 14, width: "100%" }}>
              <span style={{ display: "block", width: "100%", textAlign: "center", background: GOLD, color: NAVY, padding: "10px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, boxSizing: "border-box" }}>
                {lang === 'es' ? 'Explorar' : 'Explore'} →
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGospel = () => {
    if (!gospelData) {
      return (
        <div>
          <div className="skeleton-shimmer" style={{ height: 20, width: "55%", borderRadius: 6, marginBottom: 10 }} />
          <div className="skeleton-shimmer" style={{ height: 28, width: "75%", borderRadius: 8, marginBottom: 16 }} />
          <div className="skeleton-shimmer" style={{ height: 180, borderRadius: 16 }} />
        </div>
      );
    }
    const { reference, body } = cleanGospelText(gospelData.text);
    const formatted = body.replace(/\. ([A-ZÁÉÍÓÚ«"A-Z])/g, ".\n\n$1").trim();
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: "18px 20px", marginBottom: 16, color: WHITE }}>
          <div style={{ fontSize: 13, color: GOLD_LIGHT, fontStyle: "italic", marginBottom: 4 }}>{lang === 'es' ? 'Lectura del santo Evangelio' : 'Reading of the Holy Gospel'}</div>
          <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cormorant', serif" }}>{formatRef(lang === 'en' ? gospelData?.reference : (reference || t.gospel.reading))}</div>
        </div>
        <div style={{ background: BG_CARD, borderRadius: 16, padding: 20, fontSize: 14, lineHeight: 1.9, color: CREAM, whiteSpace: "pre-wrap", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: `1px solid ${CREAM_DARK}` }}>
          {formatted}{"\n\n"}<span style={{ color: GOLD, fontWeight: "bold", fontStyle: "italic" }}>— {lang === 'es' ? 'Palabra del Señor.' : 'The Gospel of the Lord.'}</span>
        </div>
      </div>
    );
  };

  const renderReadings = () => {
    const sections = [];
    const iconScroll = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <rect x="3" y="1" width="14" height="4" rx="2" stroke={MUTED} strokeWidth="1.3"/>
        <rect x="5" y="4" width="10" height="12" stroke={MUTED} strokeWidth="1.3"/>
        <rect x="3" y="15" width="14" height="4" rx="2" stroke={MUTED} strokeWidth="1.3"/>
        <line x1="7.5" y1="7.5" x2="12.5" y2="7.5" stroke={GOLD} strokeWidth="1"/>
        <line x1="7.5" y1="10" x2="12.5" y2="10" stroke={GOLD} strokeWidth="1"/>
        <line x1="7.5" y1="12.5" x2="12.5" y2="12.5" stroke={GOLD} strokeWidth="1"/>
      </svg>
    );
    const iconBook = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <rect x="3" y="2" width="13" height="16" rx="1.5" stroke={MUTED} strokeWidth="1.3"/>
        <line x1="6" y1="2" x2="6" y2="18" stroke={MUTED} strokeWidth="0.8"/>
        <path d="M11 0.5 L14.5 0.5 L14.5 7 L12.75 5.5 L11 7 Z" fill={GOLD}/>
        <line x1="8" y1="9" x2="15" y2="9" stroke={MUTED} strokeWidth="0.8"/>
        <line x1="8" y1="12" x2="15" y2="12" stroke={MUTED} strokeWidth="0.8"/>
        <line x1="8" y1="15" x2="15" y2="15" stroke={MUTED} strokeWidth="0.8"/>
      </svg>
    );
    const iconLyre = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M5 10 C5 14 7 18 10 18 C13 18 15 14 15 10" stroke={MUTED} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="5" y1="10" x2="5" y2="3" stroke={MUTED} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="15" y2="3" stroke={MUTED} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="5" y1="3" x2="15" y2="3" stroke={MUTED} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8" y1="3.5" x2="8.5" y2="16.5" stroke={GOLD} strokeWidth="0.9"/>
        <line x1="10" y1="3.5" x2="10" y2="17.5" stroke={GOLD} strokeWidth="0.9"/>
        <line x1="12" y1="3.5" x2="11.5" y2="16.5" stroke={GOLD} strokeWidth="0.9"/>
      </svg>
    );
    if (gospelData?.reading1) sections.push({ key: 'r1', title: lang === 'es' ? 'Primera lectura' : 'First reading', ref: gospelData.reading1.reference, text: gospelData.reading1.text, refEn: gospelData.reading1.referenceEn, textEn: gospelData.reading1.textEn, icon: iconScroll });
    if (gospelData?.psalm) sections.push({ key: 'ps', title: lang === 'es' ? 'Salmo responsorial' : 'Responsorial psalm', ref: gospelData.psalm.reference, text: gospelData.psalm.text, refEn: gospelData.psalm.referenceEn, textEn: gospelData.psalm.textEn, icon: iconLyre });
    if (gospelData?.reading2) sections.push({ key: 'r2', title: lang === 'es' ? 'Segunda lectura' : 'Second reading', ref: gospelData.reading2.reference, text: gospelData.reading2.text, refEn: gospelData.reading2.referenceEn, textEn: gospelData.reading2.textEn, icon: iconBook });
    if (!gospelData) return <div style={{ textAlign: "center", color: MUTED, padding: 40 }}>{lang === 'es' ? 'Cargando lecturas...' : 'Loading readings...'}</div>;
    return (
      <div>
        {sections.map((s) => (
          <div key={s.key} style={{ background: BG_CARD, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(26,58,92,0.08)", border: `1px solid ${CREAM_DARK}` }}>
            <div onClick={() => setOpenReading(openReading === s.key ? null : s.key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: "bold", color: CREAM, fontSize: 15, fontFamily: "'Cormorant', serif", display: "flex", alignItems: "center", gap: 8 }}>{s.icon}{s.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{formatRef(s.ref)}</div>
              </div>
              <span style={{ color: GOLD, fontSize: 20, fontWeight: "bold" }}>{openReading === s.key ? "−" : "+"}</span>
            </div>
            {openReading === s.key && (
              <div style={{ padding: "0 18px 18px", fontSize: 14, color: CREAM, lineHeight: 1.9, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14, whiteSpace: "pre-wrap" }}>
                {s.text ? (
                  s.key === 'ps' ? (
                    s.text.split('\n').map((line, i) => {
                      if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
                      if (line.startsWith('R.')) {
                        return <div key={i} style={{ color: GOLD, fontWeight: "bold" }}>{line}</div>;
                      }
                      if (line.startsWith('V.')) {
                        return <div key={i}>{line}</div>;
                      }
                      return <div key={i}>{line}</div>;
                    })
                  ) : (
                    <>
                      {s.text}
                      {(s.key === 'r1' || s.key === 'r2') && (
                        <div style={{ fontStyle: "italic", color: GOLD, marginTop: 10, whiteSpace: "normal" }}>
                          {lang === 'es' ? '— Palabra de Dios.' : '— The Word of the Lord.'}
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div style={{ whiteSpace: "normal" }}>
                    <div style={{ color: MUTED, fontStyle: "italic" }}>
                      {lang === 'es' ? 'Esta lectura aún no está disponible en español.' : "This reading isn't available in English yet."}
                    </div>
                    {!showEnglishFallback[s.key] ? (
                      <button
                        onClick={() => setShowEnglishFallback(prev => ({ ...prev, [s.key]: true }))}
                        style={{ marginTop: 10, background: "none", border: "none", padding: 0, color: GOLD, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}
                      >
                        {lang === 'es' ? 'Ver en inglés →' : 'View in English →'}
                      </button>
                    ) : (
                      <div style={{ marginTop: 14, whiteSpace: "pre-wrap" }}>
                        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{formatRef(s.refEn)}</div>
                        {s.key === 'ps' ? (
                          (s.textEn || '').split('\n').map((line, i) => {
                            if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
                            if (line.startsWith('R.')) {
                              return <div key={i} style={{ color: GOLD, fontWeight: "bold" }}>{line}</div>;
                            }
                            return <div key={i}>{line}</div>;
                          })
                        ) : (
                          s.textEn
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRosary = () => <Rosario lang={lang} onHome={() => setTab(0)} />;

  const renderPrayers = () => (
    <div>
      {t.prayers.list.map((p, i) => (
        <div key={i} style={{ background: BG_CARD, borderRadius: 16, marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
          <div onClick={() => setOpenPrayer(openPrayer === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", cursor: "pointer" }}>
            <span style={{ fontWeight: "bold", color: CREAM, fontSize: 15, fontFamily: "'Cormorant', serif" }}>🙏 {p.name}</span>
            <span style={{ color: GOLD, fontSize: 20, fontWeight: "bold" }}>{openPrayer === i ? "−" : "+"}</span>
          </div>
          {openPrayer === i && <div style={{ padding: "0 18px 16px", fontSize: 14, color: CREAM, lineHeight: 1.8, borderTop: `1px solid ${CREAM_DARK}`, paddingTop: 14 }}>{p.text}</div>}
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
      const prefix = PRAYER_INTENTION_PREFIX[lang][currentMood.id] || PRAYER_INTENTION_PREFIX[lang].otra;
      const full = prayerIntention.trim()
        ? `${base}\n\n${prefix} ${prayerIntention.trim()}.`
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
    const cx = {color: GOLD, fontSize: '1.2em'};

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
      markCircleSeen(circulo.id);
      await loadIntenciones(circulo);
    };

    const createCircle = async () => {
      if (!newCircleName.trim()) { setCircleError(lang === "es" ? "Escribe un nombre para tu círculo" : "Name is required"); return; }
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
        markCircleSeen(ref.id);
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
        if (snap.empty) { setCircleError(lang === "es" ? "No encontramos ese código" : "Code not found"); setCircleLoading(false); return; }
        const d = snap.docs[0];
        const circulo = { id: d.id, ...d.data() };
        if (circulo.miembros?.includes(user.uid)) { setCircleError(lang === "es" ? "Ya eres miembro de este círculo" : "Already a member"); setCircleLoading(false); return; }
        if ((circulo.miembros?.length || 0) >= 10) { setCircleError(lang === "es" ? "El círculo está lleno (máx. 10)" : "Circle is full (max 10)"); setCircleLoading(false); return; }
        await updateDoc(doc(db, "circulos", circulo.id), { miembros: arrayUnion(user.uid) });
        setMyCircles(prev => [{ ...circulo, miembros: [...(circulo.miembros || []), user.uid] }, ...prev]);
        markCircleSeen(circulo.id);
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
        markCircleSeen(circulo.id);
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
        updateDoc(doc(db, "circulos", selectedCircle.id), {
          ultimaIntencionFecha: serverTimestamp(),
          ultimaIntencionAutorId: user.uid,
        }).catch(() => {});
        setMyCircles(prev => prev.map(c => c.id === selectedCircle.id
          ? { ...c, ultimaIntencionFecha: new Date(), ultimaIntencionAutorId: user.uid }
          : c));
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

    const personalCards = [
      {
        id: "oracion",
        title: lang === "es" ? "Mi Oración" : "My Prayer",
        desc: lang === "es" ? "Crea oraciones, lleva tu diario y conéctate con otros" : "Create prayers, keep your journal, and connect with others",
        icon: (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="10" stroke={GOLD} strokeWidth="1.5"/>
            <line x1="13" y1="7" x2="13" y2="19" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="8.5" y1="11" x2="17.5" y2="11" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        id: "rosario",
        title: lang === "es" ? "Santo Rosario" : "Holy Rosary",
        desc: lang === "es" ? "Reza el rosario con los misterios del día" : "Pray the rosary with today's mysteries",
        icon: (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="10" r="7.5" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 3"/>
            <line x1="13" y1="17.5" x2="13" y2="23.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10.8" y1="20.3" x2="15.2" y2="20.3" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        id: "devocional",
        title: lang === "es" ? "Devocional" : "Devotional",
        desc: lang === "es" ? "Reflexiones y oraciones para tu fe" : "Reflections and prayers for your faith",
        icon: (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2 C15 5, 15 7.5, 13 9 C11 7.5, 11 5, 13 2 Z" stroke={GOLD} strokeWidth="1.3" strokeLinejoin="round"/>
            <line x1="13" y1="9" x2="13" y2="11.5" stroke={GOLD} strokeWidth="1.2"/>
            <rect x="9.5" y="11.5" width="7" height="12" rx="1.3" stroke={GOLD} strokeWidth="1.6"/>
          </svg>
        ),
      },
    ];

    const backButton = (
      <button
        onClick={() => setPersonalSection(null)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "'Cormorant', serif" }}
      >
        ← {lang === "es" ? "Volver" : "Back"}
      </button>
    );

    if (personalSection === null) {
      return (
        <div>
          {personalCards.map(c => (
            <div
              key={c.id}
              onClick={() => { if (c.id === "devocional") setDevocionalInitialTab(null); setPersonalSection(c.id); }}
              onPointerEnter={() => setHoveredPersonalCard(c.id)}
              onPointerLeave={() => { setHoveredPersonalCard(null); setPressedPersonalCard(null); }}
              onPointerDown={() => setPressedPersonalCard(c.id)}
              onPointerUp={() => setPressedPersonalCard(null)}
              style={{
                position: "relative",
                display: "flex", alignItems: "center", gap: 14,
                background: BG_CARD,
                border: `1.5px solid ${(hoveredPersonalCard === c.id || pressedPersonalCard === c.id) ? GOLD : CREAM_DARK}`,
                borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
            >
              {c.id === "oracion" && hasAnyNewCircleActivity && <LightDot style={{ top: 10, right: 10 }} />}
              <div style={{ width: 52, height: 52, borderRadius: 12, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {c.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{c.desc}</div>
              </div>
              <div style={{ color: GOLD, fontSize: 26, fontWeight: 300, flexShrink: 0 }}>›</div>
            </div>
          ))}
        </div>
      );
    }

    if (personalSection === "rosario") {
      return (
        <div>
          {backButton}
          <Rosario lang={lang} onHome={() => setPersonalSection(null)} />
        </div>
      );
    }

    if (personalSection === "devocional") {
      return <Devocional lang={lang} onBack={() => { setPersonalSection(null); setDevocionalInitialTab(null); }} initialTab={devocionalInitialTab} />;
    }

    return (
      <div>
        {backButton}
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[
            ["builder", "✝", lang === "es" ? "Crear Oración" : "Crear"],
            ["journal", (() => {
                const sel = personalTab === "journal";
                const c = sel ? CREAM : MUTED;
                const cr = sel ? GOLD : MUTED;
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
                const c = sel ? CREAM : MUTED;
                const cr = sel ? GOLD : MUTED;
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
                const fg = sel ? CREAM : MUTED;
                const cr = sel ? GOLD : MUTED;
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
            <button key={key} onClick={() => setPersonalTab(key)} style={{ position: "relative", flex: 1, padding: "9px 4px", borderRadius: 12, background: personalTab === key ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : BG_CARD, color: personalTab === key ? WHITE : MUTED, border: `1px solid ${personalTab === key ? GOLD+"66" : CREAM_DARK}`, fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", textAlign: "center", lineHeight: 1.3 }}>
              {key === "circles" && hasAnyNewCircleActivity && <LightDot style={{ top: 4, right: 4 }} />}
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div>{label}</div>
            </button>
          ))}
        </div>

        {personalTab === "builder" ? (
          <div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, marginBottom: 14, fontFamily: "'Work Sans', sans-serif" }}>
              {lang === "es" ? "¿Cómo está tu corazón hoy?" : "How is your heart today?"}
            </div>

            {/* Mood grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
              {moods.map(m => (
                <button key={m.id} onClick={() => { const next = selectedMood === m.id ? null : m.id; setSelectedMood(next); setGeneratedPrayer(null); setPrayerIntention(""); }} style={{ padding: "10px 4px", borderRadius: 12, background: selectedMood === m.id ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : BG_CARD, color: selectedMood === m.id ? WHITE : CREAM, border: `1.5px solid ${selectedMood === m.id ? GOLD : CREAM_DARK}`, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: "600", fontFamily: "'Work Sans', sans-serif", lineHeight: 1.2 }}>{m.label}</div>
                </button>
              ))}
            </div>

            {/* Paso 2: intención + generar */}
            {mood && !generatedPrayer && (
              <div>
                <div style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}55`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontStyle: "italic", color: CREAM, lineHeight: 1.7, fontFamily: "'Work Sans', sans-serif" }}>{mood.verse}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, background: BG_CARD, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <span style={{ fontSize: 22 }}>🕯️</span>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED, letterSpacing: 0.5 }}>{lang === "es" ? "Santo patrono sugerido" : "Suggested patron saint"}</div>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>{mood.saint}</div>
                  </div>
                </div>

                <div style={{ background: BG_CARD, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 8, fontFamily: "'Work Sans', sans-serif" }}>
                    {lang === "es" ? "¿Tienes una intención específica? (opcional)" : "Do you have a specific intention? (optional)"}
                  </div>
                  <textarea
                    value={prayerIntention}
                    onChange={e => setPrayerIntention(e.target.value)}
                    placeholder={lang === "es" ? "Ej: por mi mamá enferma, por mi trabajo..." : "E.g.: for my sick mother, for my job..."}
                    style={{ width: "100%", minHeight: 80, padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: CREAM, background: NAVY, color: CREAM, fontFamily: "'Georgia', serif", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, outline: "none" }}
                  />
                </div>

                <button onClick={generatePrayer} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                  ✝ {lang === "es" ? "Orar" : "Pray"}
                </button>
              </div>
            )}

            {/* Paso 3: oración generada */}
            {mood && generatedPrayer && (
              <div>
                <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: "22px 20px", marginBottom: 14, color: WHITE, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -16, right: -10, fontSize: 80, opacity: 0.06 }}>✝</div>
                  <div style={{ fontSize: 11, color: GOLD, fontWeight: "bold", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>{mood.icon} {mood.label}</div>
                  <div style={{ fontSize: 15, fontFamily: "'Work Sans', sans-serif", lineHeight: 1.8, color: "rgba(255,255,255,0.92)", whiteSpace: "pre-wrap" }}>{generatedPrayer}</div>
                </div>

                {user ? (
                  <button onClick={savePrayer} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, #1a6b3a, #0f4a28)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", marginBottom: 10 }}>
                    {lang === "es" ? "Guardar oración" : "Save prayer"}
                  </button>
                ) : (
                  <div style={{ background: BG_CARD, border: `1px solid ${CREAM_DARK}`, borderRadius: 12, padding: "16px", marginBottom: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 14, color: CREAM, marginBottom: 10, fontFamily: "'Work Sans', sans-serif" }}>
                      {lang === "es" ? "Inicia sesión para guardar tus oraciones" : "Sign in to save your prayers"}
                    </div>
                    <button onClick={() => setAuthMode("login")} style={{ padding: "9px 24px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                      {lang === "es" ? "Iniciar sesión" : "Sign in"}
                    </button>
                  </div>
                )}

                <button onClick={() => { setGeneratedPrayer(null); setSelectedMood(null); setPrayerIntention(""); }} style={{ width: "100%", padding: "10px", background: CREAM_DARK, color: CREAM, border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
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
              <div key={p.id} style={{ background: BG_CARD, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${p.received ? GOLD + "66" : CREAM_DARK}`, boxShadow: p.received ? `0 2px 16px ${GOLD}22` : "0 2px 8px rgba(15,28,50,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{p.moodIcon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>{p.moodLabel}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{p.date}</div>
                    </div>
                  </div>
                  {p.received && (
                    <span style={{ fontSize: 11, background: `${GOLD}22`, color: ALBA_DARK, padding: "3px 10px", borderRadius: 20, fontWeight: "bold", flexShrink: 0 }}>
                      {lang === "es" ? "Recibida" : "Received"}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 13, color: CREAM, lineHeight: 1.65, marginBottom: 12, fontStyle: "italic", borderLeft: `3px solid ${CREAM_DARK}`, paddingLeft: 10 }}>
                  {p.intention.length > 140 ? p.intention.substring(0, 140) + "…" : p.intention}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleReceived(p.id)} style={{ flex: 1, padding: "7px 10px", borderRadius: 20, border: `1px solid ${p.received ? GOLD : CREAM_DARK}`, background: p.received ? `${GOLD}18` : BG_CARD, color: p.received ? GOLD : MUTED, fontSize: 12, cursor: "pointer", fontWeight: "bold" }}>
                    {p.received ? (lang === "es" ? "Gracia recibida" : "Grace received") : `○ ${lang === "es" ? "Marcar como recibida" : "Mark as received"}`}
                  </button>
                  <button onClick={() => deletePrayer(p.id)} style={{ padding: "7px 12px", borderRadius: 20, border: `1px solid ${CREAM_DARK}`, background: BG_CARD, color: MUTED, fontSize: 12, cursor: "pointer" }}>
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
                <div style={{ fontSize: 14, color: CREAM, marginBottom: 16, fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? <>Inicia sesión para unirte a Conec<span style={cx}>✝</span>2 de Oración</> : <>Sign in to join Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <button onClick={() => setAuthMode("login")} style={{ padding: "10px 28px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? "Iniciar sesión" : "Sign in"}
                </button>
              </div>
            ) : circleView === "list" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>
                    <>{lang === "es" ? "Mis" : "My"} {lang === "es" ? <>Conec<span style={cx}>✝</span>2</> : <>Pray<span style={cx}>✝</span>2gether</>}</>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setCircleError(""); setNewCircleName(""); setNewCircleDesc(""); setNewCircleType("publico"); setCircleView("create"); }} style={{ padding: "8px 14px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                      + {lang === "es" ? "Crear" : "Create"}
                    </button>
                    <button onClick={() => { setCircleError(""); setJoinCode(""); setJoinMode("private"); setPublicCircles([]); setCircleView("join"); }} style={{ padding: "8px 14px", background: BG_CARD, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 20, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
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
                    <div style={{ fontSize: 15, color: CREAM, marginBottom: 8, fontFamily: "'Work Sans', sans-serif" }}>
                      {lang === "es" ? <>Todavía no tienes un Conec<span style={cx}>✝</span>2</> : <>You're not in any Pray<span style={cx}>✝</span>2gether yet</>}
                    </div>
                    <div style={{ fontSize: 13 }}>{lang === "es" ? "Crea uno o únete a uno para orar juntos" : "Create or join one to pray together"}</div>
                  </div>
                ) : myCircles.map(c => (
                  <div key={c.id} onClick={() => openCircle(c)} style={{ background: BG_CARD, borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif", marginBottom: 3 }}>
                          {confirmedNewCircles[c.id] && <LightDot style={{ position: "static", flexShrink: 0 }} />}
                          {c.nombre}
                        </div>
                        {c.descripcion && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{c.descripcion.length > 80 ? c.descripcion.substring(0, 80) + "…" : c.descripcion}</div>}
                      </div>
                      <span style={{ fontSize: 11, background: c.tipo === "privado" ? `${NAVY}18` : `${GOLD}22`, color: c.tipo === "privado" ? NAVY : ALBA_DARK, padding: "3px 8px", borderRadius: 20, fontWeight: "bold", flexShrink: 0 }}>
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
                <button onClick={() => setCircleView("list")} style={{ background: "none", border: "none", color: CREAM, fontSize: 14, cursor: "pointer", padding: "0 0 16px 0", fontWeight: "bold" }}>
                  ← {lang === "es" ? "Volver" : "Back"}
                </button>
                <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, marginBottom: 16, fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? <>Crear Conec<span style={cx}>✝</span>2</> : <>Create Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <div style={{ background: BG_CARD, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{lang === "es" ? "Nombre del círculo*" : "Circle name*"}</div>
                  <input value={newCircleName} onChange={e => setNewCircleName(e.target.value)} placeholder={lang === "es" ? "Ej: Familia López" : "E.g.: Lopez Family"} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: CREAM, background: NAVY, boxSizing: "border-box", outline: "none", fontFamily: "Georgia, serif" }} />
                </div>
                <div style={{ background: BG_CARD, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{lang === "es" ? "Descripción (opcional)" : "Description (optional)"}</div>
                  <textarea value={newCircleDesc} onChange={e => setNewCircleDesc(e.target.value)} placeholder={lang === "es" ? "¿De qué trata este círculo?" : "What is this circle about?"} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: CREAM, background: NAVY, minHeight: 70, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "Georgia, serif" }} />
                </div>
                <div style={{ background: BG_CARD, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${CREAM_DARK}` }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{lang === "es" ? "Tipo de círculo" : "Circle type"}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["publico", "🌍", lang === "es" ? "Público" : "Public"], ["privado", "🔒", lang === "es" ? "Privado" : "Private"]].map(([type, icon, label]) => (
                      <button key={type} onClick={() => setNewCircleType(type)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${newCircleType === type ? NAVY : CREAM_DARK}`, background: newCircleType === type ? `${GOLD}18` : BG_CARD, color: newCircleType === type ? GOLD : MUTED, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                  {newCircleType === "privado" && (
                    <div style={{ marginTop: 12, background: `${GOLD}18`, borderRadius: 10, padding: "10px 14px", border: `1px solid ${GOLD}44` }}>
                      <div style={{ fontSize: 11, color: ALBA_DARK, fontWeight: "bold", marginBottom: 4 }}>
                        {lang === "es" ? "Código de acceso (se genera al crear)" : "Access code (generated on create)"}
                      </div>
                      <div style={{ fontSize: 18, color: MUTED, letterSpacing: 4, fontFamily: "monospace" }}>
                        {lang === "es" ? "· · · · · ·" : "· · · · · ·"}
                      </div>
                    </div>
                  )}
                </div>
                {circleError && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{circleError}</div>}
                <button onClick={createCircle} disabled={circleLoading || !newCircleName.trim()} style={{ width: "100%", padding: 13, background: !newCircleName.trim() ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: !newCircleName.trim() ? MUTED : WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: newCircleName.trim() ? "pointer" : "default", fontFamily: "'Work Sans', sans-serif" }}>
                  🙏 {circleLoading ? (lang === "es" ? "Creando..." : "Creating...") : (lang === "es" ? <>Crear Conec<span style={cx}>✝</span>2</> : <>Create Pray<span style={cx}>✝</span>2gether</>)}
                </button>
              </div>
            ) : circleView === "join" ? (
              <div>
                <button onClick={() => setCircleView("list")} style={{ background: "none", border: "none", color: CREAM, fontSize: 14, cursor: "pointer", padding: "0 0 16px 0", fontWeight: "bold" }}>
                  ← {lang === "es" ? "Volver" : "Back"}
                </button>
                <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, marginBottom: 16, fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? <>Unirse a un Conec<span style={cx}>✝</span>2</> : <>Join a Pray<span style={cx}>✝</span>2gether</>}
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {[["private", "🔒", lang === "es" ? "Código privado" : "Private code"], ["public", "🌍", lang === "es" ? <>Conec<span style={cx}>✝</span>2 públicos</> : <>Public Pray<span style={cx}>✝</span>2gether</>]].map(([mode, icon, label]) => (
                    <button key={mode} onClick={() => { setJoinMode(mode); if (mode === "public") loadPublicCircles(); }} style={{ flex: 1, padding: "9px 8px", borderRadius: 12, background: joinMode === mode ? `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})` : BG_CARD, color: joinMode === mode ? WHITE : MUTED, border: `1px solid ${joinMode === mode ? NAVY : CREAM_DARK}`, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
                {joinMode === "private" ? (
                  <div>
                    <div style={{ background: BG_CARD, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${CREAM_DARK}` }}>
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{lang === "es" ? "Código del círculo" : "Circle code"}</div>
                      <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="XXXXXX" maxLength={6} style={{ width: "100%", padding: "12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 22, fontFamily: "monospace", letterSpacing: 6, color: CREAM, background: NAVY, boxSizing: "border-box", textAlign: "center", outline: "none" }} />
                    </div>
                    {circleError && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{circleError}</div>}
                    <button onClick={joinCircleByCode} disabled={circleLoading || joinCode.length < 6} style={{ width: "100%", padding: 13, background: joinCode.length < 6 ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: joinCode.length < 6 ? MUTED : WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: joinCode.length >= 6 ? "pointer" : "default", fontFamily: "'Work Sans', sans-serif" }}>
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
                      <div key={c.id} style={{ background: BG_CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}` }}>
                        <div style={{ fontSize: 14, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>{c.nombre}</div>
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
                  <button onClick={() => { setCircleView("list"); setSelectedCircle(null); setCircleIntenciones([]); }} style={{ background: "none", border: "none", color: CREAM, fontSize: 18, cursor: "pointer", fontWeight: "bold", padding: 0 }}>
                    ←
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>{selectedCircle?.nombre}</div>
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
                        <div style={{ fontSize: 10, color: ALBA_DARK, fontWeight: "bold", letterSpacing: 0.5 }}>
                          {lang === "es" ? "Código de acceso" : "Access code"}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: "bold", color: GOLD, fontFamily: "monospace", letterSpacing: 4 }}>
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
                <div style={{ background: BG_CARD, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${CREAM_DARK}` }}>
                  <textarea value={newIntencion} onChange={e => setNewIntencion(e.target.value)} placeholder={lang === "es" ? "Comparte una intención de oración..." : "Share a prayer intention..."} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${CREAM_DARK}`, borderRadius: 10, fontSize: 14, color: CREAM, background: NAVY, minHeight: 60, boxSizing: "border-box", resize: "none", outline: "none", fontFamily: "Georgia, serif" }} />
                  <button onClick={addIntencion} disabled={!newIntencion.trim()} style={{ marginTop: 8, width: "100%", padding: "9px", background: !newIntencion.trim() ? CREAM_DARK : `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: !newIntencion.trim() ? MUTED : WHITE, border: "none", borderRadius: 10, fontSize: 13, fontWeight: "bold", cursor: newIntencion.trim() ? "pointer" : "default" }}>
                    {lang === "es" ? "Compartir intención" : "Share intention"}
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
                    <div style={{ fontSize: 14 }}>{lang === "es" ? "Todavía no hay intenciones. ¿Compartes la primera?" : "Be the first to share an intention"}</div>
                  </div>
                ) : circleIntenciones.map(intent => {
                  const isOrando = intent.orando?.includes(user.uid);
                  const orandoCount = intent.orando?.length || 0;
                  const canDelete = intent.autorId === user.uid || selectedCircle?.creadorId === user.uid;
                  return (
                    <div key={intent.id} style={{ background: BG_CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)" }}>
                      <div style={{ fontSize: 11, color: GOLD, fontWeight: "bold", marginBottom: 6 }}>{intent.autorNombre}</div>
                      <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.65, fontFamily: "'Work Sans', sans-serif", marginBottom: 10 }}>{intent.texto}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button onClick={() => toggleOrando(intent)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: isOrando ? `${GOLD}22` : CREAM, border: `1px solid ${isOrando ? GOLD : CREAM_DARK}`, borderRadius: 20, fontSize: 13, cursor: "pointer", color: isOrando ? ALBA_DARK : MUTED }}>
                          {orandoCount > 0 && <span style={{ fontWeight: "bold" }}>{orandoCount}</span>} <span>{lang === "es" ? "Estoy orando" : "I'm praying"}</span>
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
                <div style={{ fontSize: 14, color: CREAM, marginBottom: 16, fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? "Inicia sesión para ver tu libro de oraciones" : "Sign in to see your prayer book"}
                </div>
                <button onClick={() => setAuthMode("login")} style={{ padding: "10px 28px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                  {lang === "es" ? "Iniciar sesión" : "Sign in"}
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
                <div key={p.id} style={{ background: BG_CARD, borderRadius: 16, marginBottom: 14, overflow: "hidden", border: `1px solid ${p.respondida ? GOLD + "88" : CREAM_DARK}`, boxShadow: p.respondida ? `0 4px 20px ${GOLD}28` : "0 2px 10px rgba(15,28,50,0.06)" }}>
                  {/* Header — clic para expandir/colapsar */}
                  <div onClick={() => setExpandedPrayerId(isOpen ? null : p.id)} style={{ background: p.respondida ? `linear-gradient(135deg, ${NAVY_DARK}, #432B00)` : `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{getMoodIcon(p.estado)}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: "bold", color: WHITE, fontFamily: "'Work Sans', sans-serif" }}>{p.estado}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{formatFirestoreDate(p.fecha)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {p.respondida && (
                        <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: CREAM, fontSize: 11, fontWeight: "bold", padding: "4px 10px", borderRadius: 20 }}>
                          {lang === "es" ? "Respondida" : "Answered"}
                        </span>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Vista colapsada: intención o primeras 2 líneas */}
                  {!isOpen && (
                    <div className="expand-fade" style={{ padding: "12px 16px", borderTop: `1px solid ${CREAM_DARK}` }}>
                      <div style={{ fontSize: 13, color: p.intencion ? CREAM : MUTED, lineHeight: 1.6, fontStyle: p.intencion ? "italic" : "normal" }}>
                        {previewText.length > 120 ? previewText.substring(0, 120) + "…" : previewText}
                      </div>
                    </div>
                  )}

                  {/* Vista expandida: intención resaltada + oración completa */}
                  {isOpen && (
                    <div className="expand-fade" style={{ padding: "16px 16px 14px" }}>
                      {p.intencion && (
                        <div style={{ background: `${GOLD}18`, borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 14 }}>
                          <div style={{ fontSize: 11, color: ALBA_DARK, fontWeight: "bold", marginBottom: 4, letterSpacing: 0.5 }}>
                            {lang === "es" ? "Tu intención" : "Your intention"}
                          </div>
                          <div style={{ fontSize: 14, color: CREAM, fontStyle: "italic", lineHeight: 1.65, fontFamily: "'Work Sans', sans-serif" }}>
                            {p.intencion}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const moodId = [...PRAYER_MOODS.es, ...PRAYER_MOODS.en].find(m => m.label === p.estado)?.id;
                        const prefixEs = PRAYER_INTENTION_PREFIX.es[moodId] || PRAYER_INTENTION_PREFIX.es.otra;
                        const prefixEn = PRAYER_INTENTION_PREFIX.en[moodId] || PRAYER_INTENTION_PREFIX.en.otra;
                        const legacyMarker = lang === "es" ? "Te lo pido especialmente por" : "I especially pray for";
                        const marker = [prefixEs, prefixEn, legacyMarker].find(m => p.oracion.includes(m)) || legacyMarker;
                        const idx = p.oracion.indexOf(marker);
                        if (idx === -1) {
                          return (
                            <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.8, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                              {p.oracion}
                            </div>
                          );
                        }
                        const before = p.oracion.substring(0, idx).trimEnd();
                        const line = p.oracion.substring(idx).trim();
                        return (
                          <>
                            <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.8, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap", marginBottom: 12 }}>
                              {before}
                            </div>
                            <div style={{ background: rgba(GOLD, 0.1), borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 12, fontStyle: "italic", color: CREAM, fontSize: 14, fontFamily: "'Work Sans', sans-serif", lineHeight: 1.7 }}>
                              {line}
                            </div>
                          </>
                        );
                      })()}
                      {!p.respondida && (
                        <button onClick={() => markAnswered(p.id)} style={{ marginTop: 14, width: "100%", padding: "10px", background: `linear-gradient(135deg, #1a6b3a, #0f4a28)`, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                          {lang === "es" ? "Respondida" : "Answered"}
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "20px 10px" }}>
      <div style={{ background: BG_CARD, border: `1.5px solid ${GOLD}55`, borderRadius: 20, padding: "40px 28px", maxWidth: 340, width: "100%" }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 18 }}>
          <path d="M5 8 H19 L17.5 21 H6.5 Z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M9 8 C9 4.5 15 4.5 15 8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="12.5" x2="12" y2="16.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="10" y1="14.5" x2="14" y2="14.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 14 }}>
          {lang === 'es' ? 'Tienda Horeb' : 'Horeb Shop'}
        </div>
        <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.7, fontFamily: "'Work Sans', sans-serif", marginBottom: 18 }}>
          {lang === 'es'
            ? 'Estamos preparando algo especial para ti. Pronto encontrarás artículos de fe para tu hogar y devoción.'
            : 'We are preparing something special for you. Soon you will find faith items for your home and devotion.'}
        </div>
        <span style={{ display: "inline-block", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, fontSize: 11, fontWeight: "bold", padding: "6px 16px", borderRadius: 20, letterSpacing: 0.5 }}>
          {lang === 'es' ? 'Próximamente' : 'Coming Soon'}
        </span>
      </div>
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
        if (notifGospel) scheduleNotification(gospelTime, 'Evangelio del día', 'El Evangelio de hoy te espera');
        if (notifRosary) scheduleNotification(rosaryTime, 'Santo Rosario', 'Un momento para el Rosario, cuando puedas');
        if (notifLiturgy) scheduleNotification(liturgyTime, 'Liturgia de las Horas', 'Un espacio para la oración de las horas');
      }
    };

    const switchStyle = (active) => ({ width: 44, height: 24, borderRadius: 12, background: active ? NAVY : CREAM_DARK, position: "relative", cursor: "pointer", border: "none", flexShrink: 0 });
    const knobStyle = (active) => ({ position: "absolute", top: 2, left: active ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: WHITE, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" });

    const notifs = [
      { label: lang === 'es' ? 'Evangelio del día' : 'Gospel of the Day', desc: lang === 'es' ? 'Recordatorio matutino' : 'Morning reminder', active: notifGospel, setter: setNotifGospel, time: gospelTime, setTime: setGospelTime },
      { label: lang === 'es' ? 'Santo Rosario' : 'Holy Rosary', desc: lang === 'es' ? 'Recordatorio para rezar el Rosario' : 'Rosary reminder', active: notifRosary, setter: setNotifRosary, time: rosaryTime, setTime: setRosaryTime },
      { label: lang === 'es' ? 'Liturgia de las Horas' : 'Liturgy of the Hours', desc: lang === 'es' ? 'Un espacio para la oración de las horas' : 'A space for the liturgy of the hours', active: notifLiturgy, setter: setNotifLiturgy, time: liturgyTime, setTime: setLiturgyTime },
    ];

    return (
      <div>
        <div style={{ background: BG_CARD, borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 2px 12px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
          <div style={{ fontWeight: "bold", color: CREAM, fontSize: 16, fontFamily: "'Cormorant', serif", marginBottom: 4 }}>
            {lang === 'es' ? 'Tu parroquia' : 'Your Parish'}
          </div>
          {!user ? (
            <div style={{ textAlign: "center", padding: "20px 10px" }}>
              <div style={{ fontSize: 13, color: CREAM, marginBottom: 14, fontFamily: "'Work Sans', sans-serif" }}>
                {lang === 'es' ? 'Inicia sesión para elegir tu parroquia' : 'Sign in to choose your parish'}
              </div>
              <button onClick={() => setAuthMode('login')} style={{ padding: "10px 28px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: WHITE, border: "none", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
                {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                {lang === 'es' ? 'Puedes cambiarla cuando quieras.' : 'You can change it anytime.'}
              </div>
              {parroquias.length === 0 ? (
                <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>
                  {lang === 'es' ? 'Cargando parroquias…' : 'Loading parishes…'}
                </div>
              ) : parroquias.map(p => {
                const selected = p.id === userParroquiaId;
                return (
                  <div
                    key={p.id}
                    onClick={() => chooseParroquia(p.id)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer", background: selected ? `${GOLD}1F` : NAVY, border: `1px solid ${selected ? GOLD : CREAM_DARK}` }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif" }}>{p.nombre}</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{p.municipio}</div>
                    </div>
                    {selected && <span style={{ color: GOLD, fontSize: 16, flexShrink: 0, marginLeft: 10 }}>✓</span>}
                  </div>
                );
              })}
              {(() => {
                const fuenteInfo = parroquias.find(p => p.id === userParroquiaId) || parroquias[0];
                if (!fuenteInfo?.fuente) return null;
                return (
                  <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginTop: 10 }}>
                    {lang === 'es'
                      ? `Estos horarios vienen del directorio de la Diócesis de Zipaquirá, actualizado el ${formatFuenteFecha(fuenteInfo.fuenteFecha, lang)}. Si algo cambió, escríbenos y lo corregimos.`
                      : `These schedules come from the Diocese of Zipaquirá's directory, updated on ${formatFuenteFecha(fuenteInfo.fuenteFecha, lang)}. If something changed, let us know and we'll fix it.`}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        {Notification.permission !== 'granted' && (
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 16, padding: 20, marginBottom: 16, color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, fontFamily: "'Cormorant', serif" }}>{lang === 'es' ? 'Activar notificaciones' : 'Enable notifications'}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>{lang === 'es' ? 'Un recordatorio diario para tu oración' : 'A daily reminder for your prayer'}</div>
            <button onClick={requestPermission} style={{ background: GOLD, color: CREAM, border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif" }}>{lang === 'es' ? 'Permitir notificaciones' : 'Allow notifications'}</button>
          </div>
        )}
        {notifs.map((n, i) => (
          <div key={i} style={{ background: BG_CARD, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: "0 2px 12px rgba(15,28,50,0.07)", border: `1px solid ${CREAM_DARK}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", color: CREAM, fontSize: 14, fontFamily: "'Cormorant', serif" }}>{n.label}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{n.desc}</div>
              </div>
              <button style={switchStyle(n.active)} onClick={() => n.setter(!n.active)}>
                <div style={knobStyle(n.active)} />
              </button>
            </div>
            {n.active && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span style={{ fontSize: 12, color: MUTED }}>{lang === 'es' ? 'Hora:' : 'Time:'}</span>
                <input type="time" value={n.time} onChange={e => n.setTime(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${CREAM_DARK}`, fontSize: 13, color: CREAM, background: NAVY }} />
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
          style={{ flex: 1, padding: "10px 14px", border: `1px solid ${CREAM_DARK}`, borderRadius: 12, fontSize: 14, color: CREAM, background: NAVY, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }}
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
                    : BG_CARD,
                  border: bibleTestament === key
                    ? `2px solid ${GOLD}`
                    : `1px solid ${CREAM_DARK}`,
                  color: bibleTestament === key ? WHITE : CREAM,
                  fontSize: 13, fontWeight: "bold", cursor: "pointer",
                  fontFamily: "'Cormorant', serif", lineHeight: 1.3,
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
                  fontFamily: "'Work Sans', sans-serif", whiteSpace: "nowrap",
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
                  background: BG_CARD, border: `1px solid ${CREAM_DARK}`,
                  color: CREAM, fontSize: 12, cursor: "pointer",
                  fontFamily: "'Work Sans', sans-serif", textAlign: "center",
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
          <button onClick={() => setBibleView("books")} style={{ marginBottom: 16, background: "none", border: "none", color: CREAM, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Work Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
            ← {lang === "es" ? "Libros" : "Books"}
          </button>
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, color: WHITE }}>
            <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cormorant', serif" }}>{bibleSelectedBook?.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              {lang === "es" ? "Selecciona un capítulo" : "Select a chapter"}
            </div>
          </div>
          {bibleLoading ? (
            <div style={{ textAlign: "center", color: MUTED, padding: 40, fontSize: 24 }}>🙏</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {bibleChapters.map(c => (
                <button key={c.id} onClick={() => loadChapter(c)} style={{ padding: "13px 6px", borderRadius: 10, background: BG_CARD, border: `1px solid ${CREAM_DARK}`, color: CREAM, fontSize: 15, cursor: "pointer", fontWeight: "bold", fontFamily: "'Cormorant', serif" }}>
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
          <button onClick={() => { setBibleView("books"); setBibleSearchResults(null); }} style={{ marginBottom: 16, background: "none", border: "none", color: CREAM, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Work Sans', sans-serif" }}>
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
                <div key={i} style={{ background: BG_CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${CREAM_DARK}`, boxShadow: "0 2px 8px rgba(15,28,50,0.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: "bold", color: GOLD, marginBottom: 6, fontFamily: "'Cormorant', serif", letterSpacing: 0.5 }}>
                    {formatRef(v.reference)}
                  </div>
                  <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.75, fontFamily: "'Work Sans', sans-serif" }}>
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
          <button onClick={() => setBibleView("chapters")} style={{ marginBottom: 14, background: "none", border: "none", color: CREAM, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Work Sans', sans-serif" }}>
            ← {bibleSelectedBook?.name}
          </button>
          <div style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY})`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, color: WHITE }}>
            <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "'Cormorant', serif" }}>
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
              {lang === "es" ? "No pudimos cargar el capítulo. Intenta de nuevo." : "We couldn't load the chapter. Please try again."}
            </div>
          ) : (
            <div>
              {verses.map(v => (
                <div key={v.num} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${CREAM_DARK}` }}>
                  {v.num > 0 && (
                    <div style={{ fontSize: 11, fontWeight: "bold", color: GOLD, minWidth: 22, paddingTop: 3, fontFamily: "'Cormorant', serif", flexShrink: 0, textAlign: "right" }}>
                      {v.num}
                    </div>
                  )}
                  <div style={{ fontSize: 15, color: CREAM, lineHeight: 1.8, fontFamily: "'Work Sans', sans-serif", flex: 1 }}>
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

  const renderJovenFe = () => <JovenFe lang={lang} onBack={() => goToTab(0)} />;

  const navIcons = [
    /* 0 Inicio */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 11 L12 3 L22 11" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        <rect x="4" y="11" width="16" height="10" rx="1" stroke={c} strokeWidth="1.5"/>
        <rect x="9.5" y="15" width="5" height="6" fill={GOLD} rx="0.5"/>
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
        <circle cx="12" cy="3" r="1.8" fill={GOLD}/>
        <circle cx="5.3" cy="12.5" r="1.8" fill={GOLD}/>
        <circle cx="18.7" cy="12.5" r="1.8" fill={GOLD}/>
        <line x1="12" y1="17" x2="12" y2="23" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9.5" y1="20.5" x2="14.5" y2="20.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    /* 5 Devocional */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="0.5" x2="12" y2="4.5" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="10" y1="2.5" x2="14" y2="2.5" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
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
    /* 7 Tienda */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 8 H19 L17.5 21 H6.5 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 8 C9 4.5 15 4.5 15 8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="12.5" x2="12" y2="16.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="14.5" x2="14" y2="14.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    /* 8 Configuración */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18.2 10 L20.8 10.1 L20.8 13.9 L18.2 14 L16.8 16.4 L18 18.7 L14.8 20.6 L13.4 18.4 L10.6 18.4 L9.2 20.6 L6 18.7 L7.2 16.4 L5.8 14 L3.2 13.9 L3.2 10.1 L5.8 10 L7.2 7.6 L6 5.3 L9.2 3.4 L10.6 5.6 L13.4 5.6 L14.8 3.4 L18 5.3 L16.8 7.6 Z" stroke={c} strokeWidth="1.2"/>
        <circle cx="12" cy="12" r="3" fill={GOLD}/>
      </svg>
    ),
    /* 9 Joven Fe */ (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 L14.4 9.2 L21 9.6 L15.9 13.7 L17.7 20 L12 16.3 L6.3 20 L8.1 13.7 L3 9.6 L9.6 9.2 Z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  ];
  const sections = [renderHome, renderPersonalPrayer, renderGospel, renderReadings, renderRosary, renderPrayers, renderBible, renderShop, renderSettings, renderJovenFe];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: BG_MAIN, minHeight: "100vh", maxWidth: 430, margin: "0 auto", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}>

      {/* Splash screen */}
      {showSplash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: `linear-gradient(180deg, ${mix(NOCHE, GOLD, 0.4)} 0%, ${NOCHE} 34%, ${NOCHE_DARK} 100%)`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: splashIn && !splashOut ? 1 : 0,
          transition: splashOut ? "opacity 0.7s ease" : "opacity 0.6s ease",
          pointerEvents: "none",
        }}>
          {/* Vértice de luz — fade-in propio, con un leve retraso respecto al fondo */}
          <div style={{
            opacity: splashIn ? 1 : 0,
            transform: splashIn ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 1s ease 0.25s, transform 1s ease 0.25s",
          }}>
            <Horeb size={120} />
          </div>

          {/* App name */}
          <div style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 42,
            fontWeight: 600,
            color: LINO,
            letterSpacing: 14,
            marginTop: 18,
            textTransform: "uppercase",
          }}>{t.appName}</div>

          {/* Tagline */}
          <div style={{
            fontFamily: "'Work Sans', sans-serif",
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

      {/* Onboarding */}
      {!showSplash && showOnboarding && (() => {
        const screens = ONBOARDING_SCREENS[lang];
        const screen = screens[onboardingStep];
        const isLast = onboardingStep === screens.length - 1;
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: BG_MAIN,
            display: "flex", flexDirection: "column", justifyContent: "center",
            minHeight: "100vh",
          }}>
            {/* Botón Saltar */}
            <button
              onClick={finishOnboarding}
              style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", color: MUTED, fontSize: 14, cursor: "pointer", padding: 8, fontFamily: "'Work Sans', sans-serif" }}
            >
              {lang === 'es' ? 'Saltar' : 'Skip'}
            </button>

            {/* Contenido */}
            <div key={onboardingStep} className="section-fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 32px" }}>
              <div style={{ marginBottom: 28 }}>{ONBOARDING_ICONS[screen.icon]}</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 700, color: GOLD, marginBottom: 16, lineHeight: 1.3 }}>
                {screen.title}
              </div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 16, color: CREAM, lineHeight: 1.7, maxWidth: 320 }}>
                {screen.text}
              </div>
            </div>

            {/* Puntos de navegación */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              {screens.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setOnboardingStep(i)}
                  style={{
                    width: i === onboardingStep ? 22 : 8, height: 8, borderRadius: 4,
                    background: i === onboardingStep ? GOLD : CREAM_DARK,
                    cursor: "pointer", transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>

            {/* Botón inferior */}
            <div style={{ padding: "0 32px 40px" }}>
              {isLast ? (
                <button
                  onClick={finishOnboarding}
                  style={{ width: "100%", padding: "14px", background: GOLD, color: NAVY, border: "none", borderRadius: 24, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant', serif" }}
                >
                  {lang === 'es' ? 'Comenzar mi camino' : 'Start my journey'}
                </button>
              ) : (
                <button
                  onClick={() => setOnboardingStep(s => Math.min(screens.length - 1, s + 1))}
                  style={{ width: "100%", padding: "14px", background: GOLD, color: NAVY, border: "none", borderRadius: 24, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant', serif" }}
                >
                  {lang === 'es' ? 'Siguiente' : 'Next'} →
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {paymentSuccess && renderPaymentSuccess()}
      {authMode && renderAuthModal()}
      {showCart && renderCartModal()}

      <style>{`
        body { background: ${BG_MAIN}; }
        @keyframes lambPulse {
          0%, 100% { box-shadow: 0 4px 14px ${rgba(GOLD, 0.5)}, 0 0 0 0 ${rgba(GOLD, 0.35)}; }
          50%       { box-shadow: 0 4px 18px ${rgba(GOLD, 0.7)}, 0 0 0 9px ${rgba(GOLD, 0)}; }
        }
        @keyframes sectionFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .section-fade { animation: sectionFadeIn 0.3s ease; }
        @keyframes expandFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .expand-fade { animation: expandFadeIn 0.3s ease; }
        button { transition: transform 0.15s ease; }
        button:hover { transform: scale(1.02); }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-shimmer {
          background-color: ${BG_CARD};
          background-image: linear-gradient(90deg, ${rgba(GOLD, 0)} 0%, ${rgba(GOLD, 0.15)} 50%, ${rgba(GOLD, 0)} 100%);
          background-repeat: no-repeat;
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        input::placeholder, textarea::placeholder { color: ${MUTED}; opacity: 1; }
        input, textarea, select { color-scheme: dark; }
      `}</style>

      {/* Botón Cordero de Dios */}
      {tab === 2 && gospelData && (
        <button
          onClick={handleLambButtonClick}
          onPointerDown={handleLambPointerDown}
          onPointerMove={handleLambPointerMove}
          onPointerUp={handleLambPointerUp}
          onPointerCancel={handleLambPointerUp}
          title={lang === 'es' ? 'Ponlo en Práctica' : 'Put It Into Practice'}
          style={{
            position: "fixed", left: lambPos.x, top: lambPos.y, zIndex: 60,
            width: LAMB_BTN_SIZE, height: LAMB_BTN_SIZE, borderRadius: "50%",
            background: NAVY_DARK,
            border: "none", cursor: lambDragging ? "grabbing" : "pointer",
            touchAction: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, animation: lambDragging ? "none" : "lambPulse 2.5s ease-in-out infinite",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        ><Horeb size={24} /></button>
      )}

      {/* Modal Ponlo en Práctica */}
      {lambOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,18,35,0.78)" }}
          onClick={() => setLambOpen(false)}
        >
          <div
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: BG_CARD, border: `2px solid ${GOLD}`, borderRadius: 20, padding: 24, width: "82%", maxWidth: 400, maxHeight: "82vh", overflowY: "auto", zIndex: 101, boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Título centrado */}
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Horeb size={28} /></div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: CREAM, fontFamily: "'Cormorant', serif", letterSpacing: 1 }}>
                {lang === 'es' ? 'Ponlo en Práctica' : 'Put It Into Practice'}
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
              <div style={{ fontSize: 15, color: CREAM, lineHeight: 1.75, fontFamily: "'Work Sans', sans-serif" }}>
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => <div style={{ fontWeight: "bold", fontSize: 15, color: GOLD, marginTop: 14, marginBottom: 3 }}>{children}</div>,
                    h3: ({ children }) => <div style={{ fontWeight: "bold", fontSize: 14, color: GOLD, marginTop: 12, marginBottom: 3 }}>{children}</div>,
                    strong: ({ children }) => <strong style={{ color: GOLD }}>{children}</strong>,
                    p: ({ children }) => <p style={{ margin: "0 0 10px" }}>{children}</p>,
                    hr: () => <hr style={{ border: "none", borderTop: `1px solid ${GOLD}55`, margin: "12px 0" }} />,
                  }}
                >
                  {formatRef(lambText)}
                </ReactMarkdown>
              </div>
            ) : null}
            {!lambLoading && lambText && (
              <button
                onClick={handleShareLamb}
                style={{ marginTop: 18, width: "100%", padding: "11px", background: "none", color: GOLD, border: `1.5px solid ${GOLD}`, borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {lambImageSaved
                  ? (lang === 'es' ? '✓ Imagen guardada' : '✓ Image saved')
                  : lambCopied
                  ? (lang === 'es' ? '✓ Copiado' : '✓ Copied')
                  : (lang === 'es' ? '↗ Comparte esta luz' : '↗ Share this light')}
              </button>
            )}
            <button
              onClick={() => setLambOpen(false)}
              style={{ marginTop: 10, width: "100%", padding: "11px", background: NAVY_DARK, color: WHITE, border: "none", borderRadius: 12, fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: 0.5 }}
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Botón Inicio fijo */}
      {tab !== 0 && tab !== 4 && !(tab === 1 && personalSection === "rosario") && (
        <button
          onClick={() => goToTab(0)}
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
      <div style={{ background: NAVY, borderBottom: `1px solid ${CREAM_DARK}33`, color: WHITE, position: "sticky", top: 0, zIndex: 40, borderRadius: 24, margin: 8 }}>

        {/* Barra superior: hamburguesa + logo izquierda | acciones derecha */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 14px 10px", gap: 10 }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, width: 36, height: 36, borderRadius: 10, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {menuOpen ? "✕" : "☰"}
          </button>

          <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 5, color: GOLD, fontFamily: "'Cormorant', serif" }}>{t.appName}</div>
            <div style={{ width: 64, height: 1.5, background: GOLD, margin: "4px auto 0", borderRadius: 1, opacity: 0.75 }}/>
          </div>

          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: GOLD, width: 30, height: 30, borderRadius: 8, fontSize: 9, cursor: "pointer", fontWeight: "bold", fontFamily: "'Cormorant', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                  <line x1="14" y1="14" x2="14" y2="19" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="11.5" y1="16.5" x2="16.5" y2="16.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ), label: lang === 'es' ? "Tienda"    : "Shop",     idx: 7 },
          ].map(({ icon, label, idx }) => {
            const isActive = tab === idx;
            const isHovered = hoveredQuickBtn === idx;
            const isPressed = pressedQuickBtn === idx;
            const iconColor = isActive ? GOLD : MUTED;
            const bibleStyle = {
              background: isActive
                ? rgba(GOLD, 0.28)
                : isHovered
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.12)",
              border: `1px solid ${isActive ? rgba(GOLD, 0.5) : "rgba(255,255,255,0.2)"}`,
              color: isActive ? GOLD : "rgba(255,255,255,0.75)",
            };
            const transform = isPressed ? "scale(0.95)" : isHovered ? "translateY(-2px)" : "none";
            const transition = `transform ${isPressed ? "0.1s" : "0.2s"} ease, background 0.2s ease, box-shadow 0.2s ease`;
            return (
              <button
                key={idx}
                onClick={() => goToTab(idx)}
                onPointerEnter={() => setHoveredQuickBtn(idx)}
                onPointerLeave={() => { setHoveredQuickBtn(null); setPressedQuickBtn(null); }}
                onPointerDown={() => setPressedQuickBtn(idx)}
                onPointerUp={() => setPressedQuickBtn(null)}
                onPointerCancel={() => setPressedQuickBtn(null)}
                style={{ position: "relative", flex: 1, padding: "6px 4px", borderRadius: 10, cursor: "pointer", textAlign: "center", transform, transition, ...bibleStyle }}
              >
                {idx === 1 && hasAnyNewCircleActivity && <LightDot style={{ top: 4, right: 4 }} />}
                <div style={{ marginBottom: 2, lineHeight: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{icon(iconColor)}</div>
                <div style={{ fontSize: 13, fontWeight: "600", fontFamily: "'Work Sans', sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap" }}>{label}</div>
              </button>
            );
          })}
        </div>

        {/* Saludo sutil de estado de sesión */}
        <div style={{ textAlign: "center", padding: "0 14px 9px" }}>
          {user ? (
            <div style={{ fontSize: 12, fontStyle: "italic", color: GOLD, fontFamily: "'Work Sans', sans-serif" }}>
              {lang === 'es'
                ? `Que la paz del Señor esté contigo, ${user.displayName || (user.email ? user.email.split('@')[0] : '')} ✓`
                : `May the Lord's peace be with you, ${user.displayName || (user.email ? user.email.split('@')[0] : '')} ✓`}
            </div>
          ) : (
            <div onClick={() => setAuthMode('login')} style={{ fontSize: 12, color: MUTED, cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
              {lang === 'es' ? 'Inicia sesión para guardar tu progreso' : 'Sign in to save your progress'}
            </div>
          )}
        </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <div style={{ background: BG_MAIN, borderTop: "1px solid rgba(255,255,255,0.08)", maxHeight: "60vh", overflowY: "auto" }}>
            {/* Perfil */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: NAVY, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16, fontFamily: "'Cormorant', serif", flexShrink: 0 }}>
                    {(user.displayName || user.email || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: CREAM, fontSize: 14, fontWeight: "bold", fontFamily: "'Work Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.displayName || (lang === 'es' ? 'Usuario' : 'User')}
                    </div>
                    <div style={{ color: MUTED, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ background: "rgba(220,90,90,0.12)", border: "1px solid rgba(220,90,90,0.4)", color: "#E08080", fontSize: 11, fontWeight: "bold", borderRadius: 8, padding: "6px 10px", cursor: "pointer", flexShrink: 0, fontFamily: "'Work Sans', sans-serif" }}>
                    {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke={GOLD} strokeWidth="1.5"/>
                      <path d="M4 20 C4 15.5 7.5 13 12 13 C16.5 13 20 15.5 20 20" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: GOLD, fontSize: 14, fontWeight: "bold", fontFamily: "'Work Sans', sans-serif" }}>
                      {lang === 'es' ? 'Inicia sesión' : 'Sign in'}
                    </div>
                    <div style={{ color: MUTED, fontSize: 12 }}>
                      {lang === 'es' ? 'Guarda tu progreso espiritual' : 'Save your spiritual progress'}
                    </div>
                  </div>
                  <button onClick={() => { setAuthMode('login'); setMenuOpen(false); }} style={{ background: GOLD, border: "none", color: NAVY_DARK, fontSize: 12, fontWeight: "bold", borderRadius: 8, padding: "7px 14px", cursor: "pointer", flexShrink: 0, fontFamily: "'Work Sans', sans-serif" }}>
                    {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
                  </button>
                </div>
              )}
            </div>
            {t.nav.map((n, i) => (
              (i === 4 || i === 5) ? null :
              <button key={i} onClick={() => { goToTab(i); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 20px", background: tab === i ? rgba(GOLD, 0.1) : "none", border: "none", borderLeft: tab === i ? `3px solid ${GOLD}` : "3px solid transparent", color: tab === i ? GOLD : "rgba(255,255,255,0.75)", fontSize: 15, cursor: "pointer", fontFamily: "'Work Sans', sans-serif", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center" }}>{navIcons[i](tab === i ? GOLD : "rgba(255,255,255,0.75)")}</span>
                <span>{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTENIDO ── */}
      <div key={tab} className="section-fade" style={{ padding: "20px 20px 52px" }}>
        {tab !== 0 && (
          <div style={{ fontSize: 19, fontWeight: "bold", color: CREAM, marginBottom: 18, borderLeft: `4px solid ${GOLD}`, paddingLeft: 12, fontFamily: "'Work Sans', sans-serif" }}>
            {t.nav[tab]}
          </div>
        )}
        {sections[tab]()}
      </div>
    </div>
  );
}
