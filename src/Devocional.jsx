import { useState, useEffect } from "react";
import SANTOS from './santos';
import { NOCHE, CARD, ALBA, LINO, CIELO, PIEDRA, NOCHE_DARK } from "./theme";
import ComingSoon from "./ComingSoon";

const BG_MAIN = NOCHE;
const BG_CARD = CARD;
const GOLD = ALBA;
const CREAM = LINO;
const CREAM_DARK = PIEDRA;
const MUTED = CIELO;
const NAVY = NOCHE;
const NAVY_DARK = NOCHE_DARK;
const WHITE = "#FFFFFF";

const TABS = [
  { id: "clasicas", es: "Oraciones Clásicas", en: "Classic Prayers" },
  { id: "novenas", es: "Novenas", en: "Novenas" },
  { id: "santo", es: "Santo del Día", en: "Saint of the Day" },
];

const DIACRITICS_RE = new RegExp("[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]", "g");
const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CLASSIC_PRAYERS_ES_RAW = [
  {
    roman: "I",
    title: "Oraciones Básicas y Principales",
    prayers: [
      { title: "La Señal de la Cruz", text: "Por la señal de la Santa Cruz, de nuestros enemigos, líbranos, Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén." },
      { title: "El Padre Nuestro", text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén." },
      { title: "El Ave María", text: "Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén." },
      { title: "El Gloria", text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén." },
      { title: "El Credo (Símbolo de los Apóstoles)", text: "Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre Todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia Católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén." },
      { title: "El Credo Niceno-Constantinopolano", text: "Creo en un solo Dios, Padre todopoderoso, Creador del cielo y de la tierra, de todo lo visible y lo invisible.\nCreo en un solo Señor, Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos: Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma naturaleza del Padre, por quien todo fue hecho; que por nosotros, los hombres, y por nuestra salvación bajó del cielo, y por obra del Espíritu Santo se encarnó de María, la Virgen, y se hizo hombre; y por nuestra causa fue crucificado en tiempos de Poncio Pilato; padeció y fue sepultado, y resucitó al tercer día, según las Escrituras, y subió al cielo, y está sentado a la derecha del Padre; y de nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin.\nCreo en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo, con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas. Creo en la Iglesia, que es una, santa, católica y apostólica. Confieso que hay un solo bautismo para el perdón de los pecados. Espero la resurrección de los muertos y la vida del mundo futuro. Amén." },
      { title: "La Salve", text: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén." },
      { title: "Ángel de la Guarda", text: "Ángel de mi guarda, mi dulce compañía, no me desampares ni de noche ni de día, hasta que me pongas en paz y alegría con todos los santos, Jesús, José y María. Amén." },
      { title: "Dulce Madre", text: "Dulce Madre, no te alejes, tu vista de mí no apartes. Ven conmigo a todas partes y nunca solo me dejes. Ya que me proteges tanto como verdadera Madre, haz que me bendiga el Padre, el Hijo y el Espíritu Santo. Amén." },
      { title: "Acto de Contrición", text: "Jesús, mi Señor y Redentor, yo me arrepiento de todos los pecados que he cometido hasta hoy, y me pesa de todo corazón, porque con ellos he ofendido a un Dios tan bueno. Propongo firmemente no volver a pecar y confío que por tu infinita misericordia me has de conceder el perdón de mis culpas y me has de llevar a la vida eterna. Amén." },
      { title: "Bendición de los Alimentos", text: "Bendice, Señor, a nosotros y a estos alimentos que por tu bondad vamos a recibir. Por Cristo Nuestro Señor. Amén." },
      { title: "Oración de la Mañana", text: "Te doy gracias, Dios mío, por haberme creado, redimido, hecho cristiano y conservado la vida en esta noche. Te ofrezco mis pensamientos, palabras y obras de este día, a honra y gloria tuya. Concédeme la gracia de no ofenderte y de cumplir fielmente tu santa voluntad. Amén." },
      { title: "Oración de la Noche", text: "Visita, Señor, esta habitación, aleja de ella todas las insidias del enemigo; que tus santos ángeles habiten en ella y nos guarden en paz, y que tu bendición permanezca siempre con nosotros. Por Cristo nuestro Señor. Amén." },
    ],
  },
  {
    roman: "II",
    title: "Oraciones para la Santa Misa",
    prayers: [
      { title: "Yo Pecador (Rito Penitencial)", text: "Yo confieso ante Dios Todopoderoso, y ante ustedes hermanos, que he pecado mucho de pensamiento, palabra, obra y omisión. Por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a Santa María, siempre Virgen, a los ángeles, a los santos y a ustedes hermanos, que intercedan por mí ante Dios, Nuestro Señor. Amén." },
      { title: "Gloria a Dios en el cielo (Himno de Alabanza)", text: "Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso. Señor, Hijo único, Jesucristo. Señor Dios, Cordero de Dios, Hijo del Padre; tú que quitas el pecado del mundo, ten piedad de nosotros; tú que quitas el pecado del mundo, atiende nuestra súplica; tú que estás sentado a la derecha del Padre, ten piedad de nosotros; porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo en la gloria de Dios Padre. Amén." },
      { title: "Santo, Santo, Santo (Aclamación Eucarística)", text: "Santo, Santo, Santo es el Señor, Dios del Universo. Llenos están el cielo y la tierra de tu gloria. Hosanna en el cielo. Bendito el que viene en nombre del Señor. Hosanna en el cielo." },
      { title: "Cordero de Dios (Fracción del Pan)", text: "Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.\nCordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.\nCordero de Dios, que quitas el pecado del mundo, danos la paz." },
      { title: "Señor, no soy digno (Antes de Comulgar)", text: "Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme." },
      { title: "Comunión Espiritual (Para cuando no se puede comulgar sacramentalmente)", text: "Creo, Jesús mío, que estás real y verdaderamente en el cielo y en el Santísimo Sacramento del Altar. Te amo sobre todas las cosas y deseo vivamente recibirte dentro de mi alma, pero no pudiendo hacerlo ahora sacramentalmente, ven al menos espiritualmente a mi corazón. Y como si ya te hubiese recibido, te abrazo y me uno del todo a Ti. Señor, no permitas que jamás me aparte de Ti. Amén." },
      { title: "Alma de Cristo (Oración para después de Comulgar)", text: "Alma de Cristo, santifícame.\nCuerpo de Cristo, sálvame.\nSangre de Cristo, embriágame.\nAgua del costado de Cristo, lávame.\nPasión de Cristo, confórtame.\n¡Oh, buen Jesús!, óyeme.\nDentro de tus llagas, escóndeme.\nNo permitas que me aparte de Ti.\nDel maligno enemigo, defiéndeme\nEn la hora de mi muerte, llámame.\nY mándame ir a Ti.\nPara que con tus santos te alabe.\nPor los siglos de los siglos.\nAmén" },
    ],
  },
  {
    roman: "III",
    title: "Oraciones a la Virgen María",
    prayers: [
      { title: "El Magníficat", text: "Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios, mi salvador; porque ha mirado la humillación de su esclava. Desde ahora me felicitarán todas las generaciones, porque el Poderoso ha hecho obras grandes por mí: su nombre es santo y su misericordia llega a sus fieles de generación en generación... Amén." },
      { title: "Acordaos (San Bernardo)", text: "Acuérdate, ¡oh piadosísima Virgen María!, que jamás se ha oído decir que ninguno de los que han acudido a tu protección, implorando tu asistencia y reclamando tu socorro, haya sido desamparado. Animado por esta confianza, a Ti acudo, oh Madre, Virgen de las vírgenes... Amén." },
      { title: "Consagración a la Virgen", text: "¡Oh Señora mía! ¡Oh Madre mía! Yo me ofrezco del todo a Ti y, en prueba de mi filial afecto, te consagro en este día mis ojos, mis oídos, mi lengua, mi corazón; en una palabra, todo mi ser. Ya que soy todo tuyo, oh Madre de bondad, guárdame y defiéndeme como cosa y posesión tuya. Amén." },
      { title: "Bajo tu Amparo", text: "Bajo tu amparo nos acogemos, Santa Madre de Dios; no deseches las súplicas que te dirigimos en nuestras necesidades, antes bien, líbranos de todo peligro, ¡oh Virgen gloriosa y bendita!" },
      { title: "Bendita sea tu Pureza", text: "Bendita sea tu pureza y eternamente lo sea, pues todo un Dios se recrea en tan graciosa belleza. A Ti, celestial princesa, Virgen Sagrada María, te ofrezco en este día, alma, vida y corazón. Mírame con compasión, no me dejes, Madre mía. Amén." },
      { title: "El Ángelus", dialogue: [
          { v: "El Ángel del Señor anunció a María.", r: "Y concibió por obra y gracia del Espíritu Santo.", note: "(Se reza un Ave María)" },
          { v: "He aquí la esclava del Señor.", r: "Hágase en mí según tu palabra.", note: "(Se reza un Ave María)" },
          { v: "Y el Verbo se hizo carne.", r: "Y habitó entre nosotros.", note: "(Se reza un Ave María)" },
          { v: "Ruega por nosotros, Santa Madre de Dios.", r: "Para que seamos dignos de alcanzar las promesas de Cristo. Amén.", note: null },
        ] },
      { title: "Regina Coeli (Reina del Cielo - Tiempo Pascual)", text: "Reina del cielo, alégrate, aleluya. Porque el Señor, a quien mereciste llevar, aleluya. Ha resucitado, según su palabra, aleluya. Ruega al Señor por nosotros, aleluya." },
      { title: "A la Virgen de Guadalupe", text: "Oh Virgen Inmaculada, Madre del verdadero Dios y Madre de la Iglesia. Tú, que desde este lugar manifiestas tu clemencia y tu compasión a todos los que solicitan tu amparo, escucha la oración que con filial confianza te dirigimos, y preséntala ante tu Hijo Jesús, único Redentor nuestro. Amén." },
      { title: "A María Desatanudos", text: "Santa María, llena de la presencia de Dios, durante los días de tu vida aceptaste con toda humildad la voluntad del Padre. Madre de Dios y Madre nuestra, que con tu corazón materno desatas los nudos que entorpecen nuestra vida, te pedimos que nos libres de las ataduras y confusiones. Amén." },
      { title: "A la Virgen del Carmen", text: "Tengo mil dificultades: ayúdame. De los enemigos del alma: sálvame. En mis desaciertos: ilumíname. En mis dudas y penas: confórtame. En mis enfermedades: fortaléceme... Virgen del Carmen, ruega por nosotros. Amén." },
    ],
  },
  {
    roman: "IV",
    title: "Oraciones al Espíritu Santo",
    prayers: [
      { title: "Invocación Breve", text: "Ven, Espíritu Santo, llena los corazones de tus fieles y enciende en ellos el fuego de tu amor. Envía, Señor, tu Espíritu y todo será creado, y renovarás la faz de la tierra. Amén." },
      { title: "Secuencia de Pentecostés", text: "Ven, Espíritu Divino, manda tu luz desde el cielo. Padre amoroso del pobre; don, en tus dones espléndido; luz que penetra las almas; fuente del mayor consuelo... Amén." },
      { title: "Veni Creator (Versión Breve)", text: "Ven, Espíritu Creador, visita las almas de tus fieles y llena de la divina gracia los corazones que Tú mismo creaste. Ilumina nuestros sentidos, infunde tu amor en nuestros corazones. Amén." },
      { title: "Oración de San Agustín al Espíritu Santo", text: "Respira en mí, oh Espíritu Santo, para que mis pensamientos puedan ser todos santos. Actúa en mí, oh Espíritu Santo, para que mi trabajo también pueda ser santo. Atrae mi corazón, para que sólo ame lo que es santo... Amén." },
      { title: "Consagración al Espíritu Santo", text: "Oh Espíritu Santo, divino Espíritu de luz y de amor, te consagro mi inteligencia, mi corazón y mi voluntad, mi ser todo en el tiempo y en la eternidad. Amén." },
      { title: "Para pedir los Siete Dones", text: "Espíritu Santo, concédeme el don de Sabiduría para comprender las cosas de Dios; el don de Entendimiento para iluminar mi mente; el don de Consejo para elegir siempre el bien; el don de Fortaleza para vencer las tentaciones; el don de Ciencia para conocer a Dios; el don de Piedad para amarlo con dulzura; y el don de Temor de Dios para no ofenderle jamás. Amén." },
      { title: "Pidiendo Luz y Guía", text: "Espíritu Santo, ven a mi corazón. Por tu infinito poder concédeme paciencia en el sufrimiento, fortaleza en la debilidad y perseverancia en el bien. Amén." },
      { title: "Oración al Espíritu Santo (Cardenal Verdier)", text: "Oh Espíritu Santo,\nAmor del Padre, y del Hijo,\nInspírame siempre lo que debo pensar,\nlo que debo decir,\ncómo debo decirlo,\nlo que debo callar,\ncómo debo actuar,\nlo que debo hacer,\npara gloria de Dios,\nbien de las almas\ny mi propia Santificación.\nEspíritu Santo,\nDame agudeza\npara entender,\ncapacidad para retener,\nmétodo y facultad para aprender,\nsutileza para interpretar,\ngracia y eficacia para hablar.\nDame acierto al empezar\ndirección al progresar\ny perfección al acabar.\nAmén." },
    ],
  },
  {
    roman: "V",
    title: "Oraciones a Jesucristo",
    prayers: [
      { title: "Al Sagrado Corazón de Jesús", text: "Oh Sagrado Corazón de Jesús, fuente de todo bien, te adoro, creo en ti, espero en ti y te amo. Te ofrezco este pobre corazón mío, hazlo humilde, paciente, puro y obediente a tu voluntad. Sagrado Corazón de Jesús, en Vos confío. Amén." },
      { title: "A la Divina Misericordia", text: "Oh Sangre y Agua que brotaste del Corazón de Jesús como una fuente de misericordia para nosotros, en Ti confío. Jesús, yo confío en Ti." },
      { title: "Oración a la Sangre de Cristo", text: "Señor Jesús, en tu nombre y con el Poder de tu Sangre Preciosa sellamos toda persona, hechos o acontecimientos a través de los cuales el enemigo nos quiera hacer daño. Amén." },
      { title: "Al Justo Juez", text: "Divino y Justo Juez de vivos y muertos, eterno sol de justicia. Oh Verbo Divino, por el amor con que padeciste por nuestra salvación, te ruego me cubras con el manto de tu infinita misericordia y me libres de las acechanzas de mis enemigos. Amén." },
      { title: "Visita al Santísimo Sacramento", text: "¡Viva Jesús Sacramentado! ¡Viva y de todos sea amado! Bendito y alabado sea el Santísimo Sacramento del Altar. Amén." },
      { title: "Instrumento de tu Paz (Atribuida a San Francisco)", text: "Señor, haz de mí un instrumento de tu paz. Que allá donde hay odio, yo ponga el amor. Donde hay ofensa, yo ponga el perdón. Donde hay discordia, yo ponga la unión. Donde hay duda, yo ponga la Fe. Donde hay tristeza, yo ponga la alegría. Amén." },
    ],
  },
  {
    roman: "VI",
    title: "Oraciones de Protección y a los Santos",
    prayers: [
      { title: "A San Miguel Arcángel", text: "San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra la perversidad y asechanzas del demonio. Reprímale Dios, pedimos suplicantes, y tú príncipe de la milicia celestial arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos. Amén." },
      { title: "A San Judas Tadeo (Causas Difíciles)", text: "¡Oh glorioso apóstol San Judas, siervo fiel y amigo de Jesús! La Iglesia te honra y te invoca como patrón de los casos difíciles y desesperados. Ruega por mí, que soy tan miserable, y haz uso de ese privilegio especial a ti concedido de socorrer pronto y visiblemente cuando casi se ha perdido toda esperanza. Amén." },
      { title: "A San Benito (Para Protección)", text: "Que la Santa Cruz sea mi luz. Que el demonio no sea mi guía. ¡Apártate, Satanás! Nunca me sugieras cosas vanas. Maldad es lo que brindas. Bebe tú mismo tu veneno. Amén." },
      { title: "A San José", text: "A ti, bienaventurado San José, acudimos en nuestra tribulación, y después de implorar el auxilio de tu santísima esposa, solicitamos también confiadamente tu patrocinio. Por aquella caridad que con la Inmaculada Virgen María te tuvo unido, te suplicamos que protejas la herencia que Jesucristo adquirió con su sangre. Amén." },
      { title: "Por las Ánimas del Purgatorio", text: "Dales, Señor, el descanso eterno, y brille para ellas la luz perpetua. Que las almas de los fieles difuntos, por la misericordia de Dios, descansen en paz. Amén." },
    ],
  },
];

let _classicPrayerCount = 0;
const CLASSIC_PRAYERS_ES = CLASSIC_PRAYERS_ES_RAW.map((section) => ({
  ...section,
  id: slugify(section.title),
  prayers: section.prayers.map((p) => {
    _classicPrayerCount += 1;
    return { ...p, id: slugify(p.title), number: _classicPrayerCount };
  }),
}));

const CLASSIC_PRAYERS = {
  es: CLASSIC_PRAYERS_ES,
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

export const getSantoHoy = () => {
  const now = new Date();
  const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaTime.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;
  return { key: SANTOS[key] ? key : '01-01', santo: SANTOS[key] || SANTOS['01-01'] };
};

function formatSantoFecha(key) {
  const [month, day] = key.split('-').map(Number);
  const d = new Date(2000, month - 1, day);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(d);
}

export default function Devocional({ lang = "es", onBack, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "clasicas");
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedPrayer, setExpandedPrayer] = useState(null);

  useEffect(() => {
    if (activeTab !== "clasicas") {
      setExpandedSection(null);
      setExpandedPrayer(null);
    }
  }, [activeTab]);

  useEffect(() => {
    setExpandedSection(null);
    setExpandedPrayer(null);
  }, [lang]);

  return (
    <div style={{ background: BG_MAIN, color: CREAM, minHeight: "100%" }}>
      <button
        onClick={() => onBack && onBack()}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "'Cormorant', serif" }}
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
                fontFamily: "'Work Sans', sans-serif", textAlign: "center", lineHeight: 1.3,
              }}
            >
              {lang === "es" ? t.es : t.en}
            </button>
          );
        })}
      </div>

      {activeTab === "clasicas" ? (
        lang === "es" ? (
          <div>
            {CLASSIC_PRAYERS.es.map((sec) => {
              const secOpen = expandedSection === sec.id;
              return (
                <div
                  key={sec.id}
                  style={{
                    background: BG_CARD, borderRadius: 14, marginBottom: 10, overflow: "hidden",
                    border: `1px solid ${secOpen ? GOLD : CREAM_DARK}`,
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <button
                    onClick={() => { setExpandedSection(secOpen ? null : sec.id); setExpandedPrayer(null); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "13px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{
                      flex: "0 0 auto", width: 30, height: 30, borderRadius: "50%",
                      background: NAVY_DARK, color: GOLD, fontFamily: "'Cormorant', serif", fontWeight: 700, fontSize: 12.5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {sec.roman}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "'Cormorant', serif", fontWeight: "bold", fontSize: 15, color: CREAM, lineHeight: 1.25 }}>
                        {sec.title}
                      </span>
                      <span style={{ display: "block", fontSize: 11, color: MUTED, marginTop: 2 }}>
                        {sec.prayers.length} {sec.prayers.length === 1 ? "oración" : "oraciones"}
                      </span>
                    </span>
                    <span style={{ color: GOLD, fontSize: 13, transition: "transform 0.2s ease", transform: secOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                  </button>

                  {secOpen && (
                    <div style={{ padding: "0 10px 10px" }}>
                      {sec.prayers.map((p) => {
                        const open = expandedPrayer === p.id;
                        return (
                          <div key={p.id} style={{ borderTop: `1px solid ${CREAM_DARK}2e` }}>
                            <button
                              onClick={() => setExpandedPrayer(open ? null : p.id)}
                              style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 8,
                                padding: "11px 6px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                              }}
                            >
                              <span style={{ fontSize: 12, color: MUTED, width: 22, flex: "0 0 auto", fontVariantNumeric: "tabular-nums" }}>
                                {p.number}.
                              </span>
                              <span style={{ flex: 1, fontFamily: "'Cormorant', serif", fontWeight: "bold", fontSize: 14, color: CREAM }}>
                                {p.title}
                              </span>
                              <span style={{ color: GOLD, fontSize: 13, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                            </button>
                            <div
                              style={{
                                maxHeight: open ? 900 : 0,
                                opacity: open ? 1 : 0,
                                overflow: "hidden",
                                transition: "max-height 0.3s ease, opacity 0.3s ease",
                              }}
                            >
                              <div style={{ padding: "0 6px 14px" }}>
                                {p.dialogue ? (
                                  p.dialogue.map((pair, i) => (
                                    <div key={i} style={{ marginBottom: 10 }}>
                                      <div style={{ fontSize: 17, lineHeight: 1.75, fontFamily: "'Work Sans', sans-serif", color: CREAM }}>
                                        <span style={{ color: GOLD, fontWeight: "bold" }}>V.</span> {pair.v}
                                      </div>
                                      <div style={{ fontSize: 17, lineHeight: 1.75, fontFamily: "'Work Sans', sans-serif", color: CREAM }}>
                                        <span style={{ color: CREAM, fontWeight: "bold" }}>R.</span> {pair.r}
                                      </div>
                                      {pair.note && (
                                        <div style={{ marginTop: 2, marginLeft: 20, fontStyle: "italic", fontSize: 13, color: MUTED, fontFamily: "'Work Sans', sans-serif" }}>
                                          {pair.note}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: 17, lineHeight: 1.8, color: CREAM, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                                    {p.text}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {CLASSIC_PRAYERS.en.map((p) => {
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
                      color: CREAM, fontSize: 15, fontWeight: "bold", fontFamily: "'Cormorant', serif",
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
                      transition: "max-height 0.3s ease, opacity 0.3s ease",
                    }}
                  >
                    <div style={{ padding: "0 16px 16px", fontSize: 17, lineHeight: 1.8, color: CREAM, fontFamily: "'Work Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                      {p.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === "novenas" ? (
        <ComingSoon
          icon={
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="6" height="12" rx="1" stroke={GOLD} strokeWidth="1.5"/>
              <path d="M12 9 C12 9 10 6.5 12 4 C14 6.5 12 9 12 9 Z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="7" y1="21" x2="17" y2="21" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
          title={lang === "es" ? "Novenas" : "Novenas"}
          description={lang === "es"
            ? "Estamos preparando este espacio con cuidado. Vuelve pronto."
            : "We're carefully preparing this space. Check back soon."}
          badge={lang === "es" ? "Próximamente" : "Coming Soon"}
        />
      ) : (
        (() => {
          const { key, santo } = getSantoHoy();
          return (
            <div>
              <div style={{ textAlign: "center", fontSize: 12, color: GOLD, marginBottom: 12, fontFamily: "'Cormorant', serif" }}>
                ✦ {lang === "es" ? "Hoy celebramos a" : "Today we celebrate"}
              </div>
              <div style={{ background: BG_CARD, borderRadius: 14, border: `1px solid ${CREAM_DARK}`, padding: 20, textAlign: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 14 }}>
                  <line x1="12" y1="2" x2="12" y2="22" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="6" y1="8" x2="18" y2="8" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div style={{ fontSize: 20, fontWeight: "bold", color: GOLD, fontFamily: "'Cormorant', serif", marginBottom: 6 }}>
                  {santo.nombre}
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
                  {formatSantoFecha(key)}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: CREAM, fontFamily: "'Work Sans', sans-serif", marginBottom: 16, textAlign: "left" }}>
                  {santo.bio}
                </div>
                <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, fontSize: 14, fontStyle: "italic", color: GOLD, fontFamily: "'Work Sans', sans-serif", lineHeight: 1.6, textAlign: "left" }}>
                  "{santo.frase}"
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
