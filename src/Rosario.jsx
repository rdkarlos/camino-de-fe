import { useState } from "react";
import { NOCHE, ALBA, LINO, CIELO, PIEDRA, ALBA_LIGHT, NOCHE_DARK } from "./theme";
import VerticeDeLuz from "./VerticeDeLuz";

const BG_MAIN = NOCHE;
const GOLD = ALBA;
const GOLD_LIGHT = ALBA_LIGHT;
const CREAM = LINO;
const CREAM_DARK = PIEDRA;
const MUTED = CIELO;
const NAVY = NOCHE;
const NAVY_DARK = NOCHE_DARK;

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
    gozosos:   { label: "Misterios Gozosos",   items: ["La Encarnación del Hijo de Dios", "La Visitación de Nuestra Señora a su prima Santa Isabel", "El Nacimiento del Hijo de Dios en el portal de Belén", "La presentación de Jesús en el Templo", "El Niño Jesús perdido y hallado en el Templo"] },
    dolorosos: { label: "Misterios Dolorosos", items: ["La oración en el Huerto", "La flagelación de Jesús atado a la columna", "La coronación de espinas", "Jesús con la Cruz a cuestas camino del Calvario", "La crucifixión y muerte de Jesús"] },
    gloriosos: { label: "Misterios Gloriosos", items: ["La resurrección del Hijo de Dios", "La Ascensión del Señor al cielo", "La venida del Espíritu Santo", "La Asunción de María al cielo", "La coronación de María como Reina y Señora de todo lo creado"] },
    luminosos: { label: "Misterios Luminosos", items: ["El Bautismo en el Jordán", "Las bodas de Caná", "El anuncio del Reino de Dios", "La Transfiguración", "La institución de la Eucaristía"] },
  },
  en: {
    gozosos:   { label: "Joyful Mysteries",    items: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation", "The Finding in the Temple"] },
    dolorosos: { label: "Sorrowful Mysteries", items: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"] },
    gloriosos: { label: "Glorious Mysteries",  items: ["The Resurrection", "The Ascension", "Pentecost", "The Assumption", "The Coronation of Mary"] },
    luminosos: { label: "Luminous Mysteries",  items: ["The Baptism of Jesus", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"] },
  },
};

// Citas bíblicas de meditación por misterio — fuente oficial de la Santa Sede,
// copiadas literal. Solo español por ahora (Opción A: sin traducción no oficial
// en inglés hasta contar con el texto oficial). Las referencias conservan el
// espaciado exacto de la fuente (algunas usan "Lc 1,26-27", otras "Lc 1, 39-42").
const MYSTERY_MEDITATIONS = {
  es: {
    gozosos: [
      { quote: '«Al sexto mes el ángel Gabriel fue enviado por Dios a una ciudad de Galilea, llamada Nazaret, a una virgen desposada con un hombre llamado José, de la estirpe de David; el nombre de la virgen era María»', ref: 'Lc 1,26-27' },
      { quote: '«En aquellos días María se puso en camino y fue aprisa a la región montañosa, a una ciudad de Judá; entró en casa de Zacarías y saludó a Isabel. Y sucedió que, en cuanto Isabel oyó el saludo de María, saltó de gozo el niño en su seno, e Isabel quedó llena de Espíritu Santo; y exclamando a voz en grito, dijo: "Bendita tú entre las mujeres y bendito el fruto de tu seno"»', ref: 'Lc 1, 39-42' },
      { quote: '«Sucedió que por aquellos días salió un edicto de César Augusto ordenando que se empadronase todo el mundo. Este primer empadronamiento tuvo lugar siendo Cirino gobernador de Siria. Iban todos a empadronarse, cada uno a su ciudad. Subió también José desde Galilea, de la ciudad de Nazaret, a Judea, a la ciudad de David, que se llama Belén, por ser él de la casa y familia de David, para empadronarse con María, su esposa, que estaba encinta. Y sucedió que, mientras ellos estaban allí, se le cumplieron los días del alumbramiento, y dio a luz a su hijo primogénito, le envolvió en pañales y le acostó en un pesebre, porque no tenían sitio en el alojamiento»', ref: 'Lc 2,1-7' },
      { quote: '«Cuando se cumplieron los ocho días para circuncidarle, se le dio el nombre de Jesús, como lo había llamado el ángel antes de ser concebido en el seno. Cuando se cumplieron los días de la purificación de ellos, según la Ley de Moisés, llevaron a Jesús a Jerusalén para presentarle al Señor, como está escrito en la Ley del Señor: Todo varón primogénito será consagrado al Señor y para ofrecer en sacrificio un par de tórtolas o dos pichones, conforme a lo que se dice en la Ley del Señor»', ref: 'Lc 2, 21-24' },
      { quote: '«Sus padres iban todos los años a Jerusalén a la fiesta de la Pascua. Cuando tuvo doce años, subieron ellos como de costumbre a la fiesta y, al volverse, pasados los días, el niño Jesús se quedó en Jerusalén, sin saberlo sus padres... Y sucedió que al cabo de tres días, le encontraron en el Templo sentado en medio de los maestros, escuchándoles y preguntándoles; todos los que le oían, estaban estupefactos por su inteligencia y sus respuestas»', ref: 'Lc 2, 41-47' },
    ],
    luminosos: [
      { quote: '«Bautizado Jesús, salió luego del agua; y en esto se abrieron los cielos y vio al Espíritu de Dios que bajaba en forma de paloma y venía sobre él. Y una voz que salía de los cielos decía: "Este es mi Hijo amado, en quien me complazco"»', ref: 'Mt 3,16-17' },
      { quote: '«Tres días después se celebraba una boda en Caná de Galilea y estaba allí la madre de Jesús. Fue invitado también a la boda Jesús con sus discípulos. Y, como faltara vino, porque se había acabado el vino de la boda, le dice a Jesús su madre: "No tienen vino". Jesús le responde: "¿Qué tengo yo contigo, mujer? Todavía no ha llegado mi hora". Dice su madre a los sirvientes: "Haced lo que él os diga"»', ref: 'Jn 2, 1-5' },
      { quote: '«El tiempo se ha cumplido y el Reino de Dios está cerca; convertíos y creed en el Evangelio»', ref: 'Mc 1, 15' },
      { quote: '«Seis días después, Jesús tomó consigo a Pedro, a Santiago y a su hermano Juan, y los llevó aparte, a un monte alto. Y se transfiguró delante de ellos: su rostro se puso brillante como el sol y sus vestidos se volvieron blancos como la luz»', ref: 'Mt 17, 1-2' },
      { quote: '«Mientras estaban comiendo, tomó Jesús pan y lo bendijo, lo partió y, dándoselo a sus discípulos, dijo: "Tomad, comed, éste es mi cuerpo"»', ref: 'Mt 26, 26' },
    ],
    dolorosos: [
      { quote: '«Entonces Jesús fue con ellos a un huerto, llamado Getsemaní, y dijo a sus discípulos: "Sentaos aquí mientras voy a orar". Y tomando consigo a Pedro y a los dos hijos de Zebedeo, comenzó a sentir tristeza y angustia. Entonces les dijo: "Mi alma está triste hasta el punto de morir; quedaos aquí y velad conmigo". Y adelantándose un poco, cayó rostro en tierra, y suplicaba así: "Padre mío, si es posible, que pase de mí esta copa, pero no sea como yo quiero, sino como quieras tú"»', ref: 'Mt 26, 36-39' },
      { quote: '«Pilato puso en libertad a Barrabás; y a Jesús, después de haberlo hecho azotar, lo entregó para que fuera crucificado»', ref: 'Mt 27, 26' },
      { quote: '«Entonces los soldados del procurador llevaron consigo a Jesús al pretorio y reunieron alrededor de él a toda la cohorte. Lo desnudaron y le echaron encima un manto de púrpura y, trenzando una corona de espinas, se la pusieron sobre la cabeza, y en su mano derecha una caña, y doblando la rodilla delante de él, le hacían burla diciendo: "Salve, Rey de los judíos"»', ref: 'Mt 27, 27-29' },
      { quote: '«Y obligaron a uno que pasaba, a Simón de Cirene, que volvía del campo, el padre de Alejandro y de Rufo, a que llevara su cruz. Lo condujeron al lugar del Gólgota, que quiere decir de la "Calavera"»', ref: 'Mc 15, 21-22' },
      { quote: '«Llegados al lugar llamado "La Calavera", le crucificaron allí a él y a los dos malhechores, uno a la derecha y otro a la izquierda. Jesús decía: "Padre, perdónales, porque no saben lo que hacen"... Era ya eso de mediodía cuando, al eclipsarse el sol, hubo oscuridad sobre toda la tierra hasta la media tarde. El velo del Santuario se rasgó por medio y Jesús, dando un fuerte grito dijo: "Padre, en tus manos pongo mi espíritu" y, dicho esto, expiró»', ref: 'Lc 23, 33-46' },
    ],
    gloriosos: [
      { quote: '«El primer día de la semana, muy de mañana, fueron al sepulcro llevando los aromas que habían preparado. Pero encontraron que la piedra había sido retirada del sepulcro, y entraron, pero no hallaron el cuerpo del Señor Jesús. No sabían qué pensar de esto, cuando se presentaron ante ellas dos hombres con vestidos resplandecientes. Ellas, despavoridas, miraban al suelo, y ellos les dijeron: "¿Por qué buscáis entre los muertos al que está vivo? No está aquí, ha resucitado"»', ref: 'Lc 24, 1-6' },
      { quote: '«El Señor Jesús, después de hablarles, ascendió al cielo y se sentó a la derecha de Dios»', ref: 'Mc 16, 19' },
      { quote: '«Al llegar el día de Pentecostés, estaban todos reunidos en un mismo lugar. De repente vino del cielo un ruido como el de una ráfaga de viento impetuoso, que llenó toda la casa en la que se encontraban. Se les aparecieron unas lenguas como de fuego que se repartieron y se posaron sobre cada uno de ellos; quedaron todos llenos del Espíritu Santo y se pusieron a hablar en otras lenguas, según el Espíritu les concedía expresarse»', ref: 'Hch 2, 1-4' },
      { quote: '«Todas las generaciones me llamarán bienaventurada porque el Señor ha hecho obras grandes en mí»', ref: 'Lc 1, 48-49' },
      { quote: '«Una gran señal apareció en el cielo: una mujer, vestida de sol, con la luna bajo sus pies, y una corona de doce estrellas sobre su cabeza»', ref: 'Ap 12, 1' },
    ],
  },
};

function todayMysteryKey() {
  // Ancla el día de la semana a America/Bogota (no al huso horario del
  // dispositivo), mismo patrón que el resto del proyecto. Se usa el nombre
  // del día en vez del índice numérico de getDay() (0=domingo) para evitar
  // cualquier ambigüedad de mapeo.
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short' }).format(new Date());
  if (weekday === 'Mon' || weekday === 'Sat') return "gozosos";
  if (weekday === 'Tue' || weekday === 'Fri') return "dolorosos";
  if (weekday === 'Wed' || weekday === 'Sun') return "gloriosos";
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
  // La meditación (cita bíblica) solo existe en español por ahora — Opción A:
  // en inglés el rosario se queda en 5 pasos por misterio hasta tener el texto oficial.
  const meditations = lang === "es" ? MYSTERY_MEDITATIONS.es[mysteryKey] : null;
  const stepCount = meditations ? 6 : 5;
  const pages = [];
  set.items.forEach((name, mi) => {
    let step = 0;
    pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "title", title: `${lang === "es" ? "Misterio" : "Mystery"} ${mi + 1}: ${name}`, text: null });
    if (meditations) {
      pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "meditation", title: null, text: meditations[mi].quote, ref: meditations[mi].ref });
    }
    pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "ourFather", title: lang === "es" ? "Padre Nuestro" : "Our Father", text: OUR_FATHER[lang] });
    pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "aveMaria", counterId: `myst-${mi}`, total: 10, title: lang === "es" ? "10 Ave Marías" : "10 Hail Marys", text: HAIL_MARY[lang] });
    pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "glory", title: lang === "es" ? "Gloria" : "Glory Be", text: GLORY_BE[lang] });
    pages.push({ part: 1, stepIndex: step, stepCount, mysteryIndex: mi, mysteryStepIndex: step++, kind: "jaculatoria", title: lang === "es" ? "Jaculatoria" : "Ejaculatory Prayer", text: JACULATORIA[lang] });
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
      ? `Misterio ${page.mysteryIndex + 1} de 5 · Paso ${page.mysteryStepIndex + 1} de ${page.stepCount}`
      : `Mystery ${page.mysteryIndex + 1} of 5 · Step ${page.mysteryStepIndex + 1} of ${page.stepCount}`;
  } else if (page.stepCount > 1) {
    subLabel = lang === "es" ? `Paso ${page.stepIndex + 1} de ${page.stepCount}` : `Step ${page.stepIndex + 1} of ${page.stepCount}`;
  }

  const isComplete = page.kind === "complete";

  return (
    <div style={{ position: "relative", background: BG_MAIN, color: CREAM, padding: "20px 20px 90px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {/* Resplandor de fondo */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ width: 300, height: 500, borderRadius: "50%", background: `rgba(232,180,92,${page.kind === "meditation" ? 0.14 : 0.06})`, filter: "blur(60px)", transition: "background 0.4s ease" }} />
      </div>

      {/* Barra de progreso */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 6, marginBottom: 12 }}>
        {partTitles.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= page.part ? GOLD : CREAM_DARK, transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Insignia del misterio de hoy */}
      {page.part === 1 && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", fontSize: 12, color: GOLD, marginBottom: 12, fontFamily: "'Cormorant', serif" }}>
          ✦ {lang === "es" ? "Hoy rezamos los" : "Today's mysteries"}: {todayLabel}
        </div>
      )}

      {/* Contenido central */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 350px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflowY: "auto" }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          {!isComplete && (
            <div style={{ fontSize: 12, color: GOLD, letterSpacing: 1, marginBottom: 10, fontFamily: "'Cormorant', serif" }}>
              {lang === "es" ? `Parte ${page.part + 1} de ${partTitles.length}` : `Part ${page.part + 1} of ${partTitles.length}`}
              {subLabel && ` · ${subLabel}`}
            </div>
          )}

          {isComplete ? (
            <div>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 18 }}>
                <line x1="12" y1="2" x2="12" y2="22" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="6" y1="8" x2="18" y2="8" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cormorant', serif", color: GOLD, marginBottom: 12 }}>
                {page.title}
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.7, color: CREAM, fontFamily: "'Work Sans', sans-serif" }}>
                {page.text}
              </div>
              <button
                onClick={goRestart}
                style={{ marginTop: 24, padding: "13px 28px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_DARK, border: "none", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Cormorant', serif", boxShadow: `0 0 24px ${GOLD}55` }}
              >
                {lang === "es" ? "Rezar de nuevo" : "Pray again"}
              </button>
            </div>
          ) : page.kind === "meditation" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <VerticeDeLuz size={40} />
              </div>
              <div style={{ fontSize: 19, lineHeight: 2, color: CREAM, fontFamily: "'Work Sans', sans-serif", fontStyle: "italic" }}>
                {page.text}
              </div>
              <div style={{ marginTop: 28, fontSize: 13, color: MUTED, letterSpacing: 0.5 }}>
                {page.ref}
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: "bold", fontFamily: "'Cormorant', serif", marginBottom: page.text ? 18 : 0 }}>
                {page.title}
              </div>

              {page.kind === "aveMaria" ? (
                <>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: CREAM, fontFamily: "'Work Sans', sans-serif", fontStyle: "italic", marginBottom: 24 }}>
                    {page.text}
                  </div>
                  <button
                    onClick={() => handleAveMariaTap(page.counterId, page.total)}
                    style={{
                      width: 140, height: 140, borderRadius: "50%", margin: "0 auto",
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", userSelect: "none",
                      border: "none", outline: "none", padding: 0, WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <span style={{ fontSize: 46, fontWeight: "bold", color: NAVY_DARK, fontFamily: "'Cormorant', serif" }}>
                      {aveCounts[page.counterId] || 0}
                    </span>
                  </button>
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
                <div style={{ fontSize: 18, lineHeight: 1.8, color: CREAM, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                  {page.text}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div style={{ position: "fixed", zIndex: 1, bottom: 20, left: 0, right: 0, padding: "0 16px", boxSizing: "border-box" }}>
        {isComplete ? (
          <div style={{ display: "flex", justifyContent: "center", maxWidth: 400, margin: "0 auto" }}>
            <button
              onClick={() => onHome && onHome()}
              title={lang === "es" ? "Inicio" : "Home"}
              style={{ width: 48, height: 48, padding: 0, background: NAVY, border: `1px solid ${GOLD}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 11 L12 3 L22 11" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <rect x="4" y="11" width="16" height="10" rx="1" stroke={GOLD} strokeWidth="1.5"/>
                <rect x="9.5" y="15" width="5" height="6" fill={GOLD} rx="0.5"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
            <button
              onClick={goPrev}
              disabled={pageIndex === 0}
              style={{ flex: 1, padding: "12px", background: NAVY_DARK, color: pageIndex === 0 ? CREAM_DARK : CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === 0 ? "default" : "pointer", fontFamily: "'Cormorant', serif", opacity: pageIndex === 0 ? 0.5 : 1 }}
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
            <button
              onClick={goNext}
              disabled={pageIndex === pages.length - 1}
              style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`, color: CREAM, border: `1px solid ${GOLD}`, borderRadius: 12, fontSize: 14, cursor: pageIndex === pages.length - 1 ? "default" : "pointer", fontFamily: "'Cormorant', serif", opacity: pageIndex === pages.length - 1 ? 0.5 : 1 }}
            >
              {lang === "es" ? "Siguiente" : "Next"} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
