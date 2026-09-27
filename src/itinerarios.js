// 40 Días con Santa Clara de Asís — primer Itinerario espiritual de Joven Fe.
// Adaptado del itinerario original de Lida Esperanza López M. (Líder EMC 2026,
// Emaús Mujeres Calahorra) — contenido propio de la comunidad de Carlos, sin
// problema de derechos. Ver PROYECTO.md, sección "Joven Fe", para el contexto
// completo de la decisión de arquitectura.
//
// Campos por día (algunos opcionales — no todos los días los tienen):
//   dia, titulo, conoceAClara?, suPalabra?, reflexion, oracion?, oracionFinal?,
//   propositoHoy?, paraTuDiaADia?
// El Día 40 es especial: sin conoceAClara, usa oracionFinal en vez de oracion,
// y sin propositoHoy (cierra con paraTuDiaADia en tono de despedida del
// itinerario completo). Días 22, 35-39 no tienen suPalabra.

export const ITINERARIO_CLARA_ID = "clara-asis-40-dias";

export const itinerarioClara = [
  {
    "dia": 1,
    "titulo": "Una niña que ya oraba distinto",
    "conoceAClara": "Clara nace hacia 1194 en Asís, en una familia con dinero y apellido. Pero desde niña, sin que nadie se lo pidiera, empezó a rezar distinto — y a escondidas, sacaba comida de su propia mesa para dársela a los pobres.",
    "suPalabra": "No esperó a ser \"grande\" ni a tener permiso de nadie: empezó a los pocos años, a escondidas, sin que en su casa se enteraran.",
    "reflexion": "Es fácil pensar que para hacer algo grande por Dios primero tienes que \"tenerlo todo resuelto\" — la fe madura, la vida en orden, ser ya \"una persona espiritual\". Clara te desmiente eso desde niña: la santidad no es una meta lejana que se alcanza un día, es una forma de mirar y de dar que empieza ya, hoy, con lo que tienes a la mano. Antes de fundar nada, antes de que la conocieran, Clara ya estaba entrenando su corazón compartiendo su propio plato.",
    "oracion": "Señor, Tú que hiciste de Clara una niña generosa antes de hacerla una santa conocida, enséñame a no esperar a \"estar lista\" para amar. Que hoy, en lo pequeño y sin que nadie lo note, empiece ya a parecerme a Ti. Amén.",
    "propositoHoy": "Comparte hoy algo tuyo —tiempo, comida, atención— con alguien, sin que se note que lo hiciste a propósito. Que sea tan discreto como el gesto de la niña Clara en su propia mesa.",
    "paraTuDiaADia": "Sirve hoy en lo más pequeño y oculto de tu rutina —ayudar en tu casa sin que te lo pidan, ceder tu lugar, hacer algo por alguien sin publicarlo— con el mismo amor con que Clara compartía su pan de niña, sin que nadie tenga que enterarse."
  },
  {
    "dia": 2,
    "titulo": "Una joven que supo decir \"no\"",
    "conoceAClara": "Cuando era adolescente, su familia —de dinero y apellido— le buscó varios matrimonios convenientes. Clara los rechazó todos, sin darle a nadie una razón clara todavía.",
    "suPalabra": "Supo decir \"no\" a lo que el mundo llamaba una buena vida, mucho antes de saber a qué diría \"sí\".",
    "reflexion": "Hay decisiones de fe que llegan antes de tener todo claro. Clara no tenía a esa edad un plan armado; solo la certeza de que ese camino no era el suyo. A veces Dios te pide primero un \"no\" firme, y solo después, con tiempo, te muestra el \"sí\" completo. Exigirte tener toda la claridad antes de moverte puede ser, en el fondo, una forma de evitar el paso de fe.",
    "oracion": "Señor, líbrame de necesitar entenderlo todo antes de obedecerte. Dame el valor de Clara para decir no a lo cómodo, aunque todavía no vea el camino completo. Amén.",
    "propositoHoy": "Identifica hoy una comodidad o \"camino fácil\" que sabes que no es lo que Dios te pide, y da un paso —aunque sea pequeño— para alejarte de él.",
    "paraTuDiaADia": "Si algo te tienta a elegir siempre lo más cómodo (quedarte al margen, evitar lo incómodo), elige en cambio hacer lo correcto, aunque no tengas del todo claro por qué es justo eso lo que hace falta hoy."
  },
  {
    "dia": 3,
    "titulo": "Clara escucha predicar a un joven llamado Francisco",
    "conoceAClara": "Francisco de Asís, ya conocido por su conversión radical, predicaba cerca de la casa de Clara. Ella lo escuchó y buscó hablar con él en privado.",
    "suPalabra": "No se conformó con oír de lejos: buscó un encuentro personal y directo con quien podía ayudarla a discernir.",
    "reflexion": "Clara no se quedó solo con la emoción de una buena predicación — pidió un encuentro real. Distinguió entre sentirse tocada por una palabra y dejarse acompañar de verdad en el camino que esa palabra abría. Muchas veces una emoción espiritual se queda en el entusiasmo del momento porque nunca se busca ese encuentro personal que la sostenga.",
    "oracion": "Espíritu Santo, que moviste a Clara a buscar más que una emoción pasajera, dame también la valentía de pedir acompañamiento real para lo que hoy sientes que me tocas en el corazón. Amén.",
    "propositoHoy": "Si hay una inquietud espiritual que has estado posponiendo, busca hoy hablarla con alguien concreto —no solo contigo mismo.",
    "paraTuDiaADia": "Antes de acercarte a alguien que necesita apoyo, busca primero tu propio encuentro breve con Cristo; que lo que le des a esa persona nazca de ese encuentro real, no de un discurso aprendido."
  },
  {
    "dia": 4,
    "titulo": "La decisión que maduró en el silencio",
    "conoceAClara": "Clara empezó a visitar en secreto a Francisco y sus primeros hermanos, pidiendo consejo sobre cómo vivir el Evangelio \"a la letra\", como ellos.",
    "suPalabra": "Antes de dar el paso público, hubo un tiempo escondido de discernimiento y consejo espiritual.",
    "reflexion": "El discernimiento verdadero casi nunca es instantáneo ni ruidoso. Clara vivió meses de visitas discretas, preguntas, maduración interior, antes de la noche de la huida. Ese tiempo \"invisible\" no fue una pérdida de tiempo: fue donde se construyó la firmeza que después le permitió resistir la presión de toda su familia.",
    "oracion": "Señor, enséñame a no tener prisa, sino a escuchar tu voluntad con paciencia. Que no confunda la urgencia con la verdadera guía del Espíritu. Amén.",
    "propositoHoy": "Dedica hoy un tiempo de silencio, sin apuro por \"resolver\", solo para escuchar qué te está diciendo Dios en algo que estás discerniendo.",
    "paraTuDiaADia": "Cuando alguien te pida consejo, resiste el impulso de resolverle todo de inmediato; a veces lo más fiel que puedes hacer es sostener con paciencia su propio proceso, sin apurarlo."
  },
  {
    "dia": 5,
    "titulo": "La noche decisiva se acerca",
    "conoceAClara": "Para el Domingo de Ramos de 1212, Clara ya había tomado su decisión: dejaría su casa esa misma noche. Asistió a la misa vestida como correspondía a su rango, sabiendo que sería la última vez.",
    "suPalabra": "Vivió su último día \"en el mundo\" con total normalidad exterior, guardando en el corazón la decisión ya tomada.",
    "reflexion": "Hay una serenidad notable aquí: Clara no montó una escena, no se despidió dramáticamente. Vivió su último domingo con normalidad, mientras por dentro ya estaba en otro lugar. Eso habla de una paz que no necesita ser vista ni validada por otros para ser real. La verdadera decisión de fe no siempre se anuncia; a veces solo se sostiene, en silencio, hasta el momento de actuar.",
    "oracion": "Señor de la paz, dame esa misma paz interior para sostener mis decisiones de fe sin necesidad de anunciarlas o defenderlas antes de tiempo. Amén.",
    "propositoHoy": "Vive hoy con normalidad exterior una decisión de fe que llevas por dentro, confiando en que Dios ya la conoce y la sostiene contigo.",
    "paraTuDiaADia": "Vive lo que haces por otros con naturalidad y paz, sin mostrar cuánto te cuesta; que sea tu calma, no tu relato, lo que la gente perciba de ti."
  },
  {
    "dia": 6,
    "titulo": "La noche de la confianza",
    "conoceAClara": "La noche del Domingo de Ramos de 1212, Clara salió de su casa por una puerta secundaria y caminó hasta la Porciúncula, donde la esperaban Francisco y sus hermanos con antorchas.",
    "suPalabra": "El paso decisivo de su vida lo dio de noche, sola, sin seguridad, confiando en que otros la esperaban al otro lado del camino.",
    "reflexion": "Toda huida verdadera hacia Dios implica soltar una seguridad conocida por una promesa todavía no comprobada. Clara caminó de noche —literal y simbólicamente— porque los pasos de fe más decisivos casi nunca se dan con luz total sobre el camino. Lo que sostuvo su paso no fue ver claro el destino, sino confiar en quienes la esperaban al final.",
    "oracion": "Señor, ayúdame a no temer mis propias noches, sabiendo que Tú, y los hermanos que me das, sostienen una luz al final del camino. Amén.",
    "propositoHoy": "Da hoy un paso concreto hacia algo que has postergado por miedo a la oscuridad del camino, confiando en el acompañamiento que Dios ya te ha puesto cerca.",
    "paraTuDiaADia": "Si notas miedo en alguien ante un paso que está por dar, quédate cerca en silencio, sin necesidad de convencerlo con argumentos; sé tú esa luz constante junto a él."
  },
  {
    "dia": 7,
    "titulo": "Un signo que selló toda una vida",
    "conoceAClara": "Al llegar a la Porciúncula, Francisco y sus hermanos cortaron el cabello de Clara ante el altar, signo público e irreversible de su consagración a Cristo.",
    "suPalabra": "Necesitó un signo externo, visible, para sellar lo que ya había decidido por dentro.",
    "reflexion": "A veces una decisión interior necesita un gesto que la haga real hacia afuera. No basta con decidir en el corazón; hay momentos donde el cuerpo, un signo, un acto concreto, sella lo que ya se eligió por dentro. Clara no se conformó con una convicción privada — la volvió irreversible.",
    "oracion": "Señor, dame el valor de sellar con hechos concretos lo que ya he decidido en el corazón, sin quedarme solo en la intención. Amén.",
    "propositoHoy": "Si hay una decisión que ya tomaste por dentro pero que aún no has hecho visible, da hoy el paso concreto que la selle.",
    "paraTuDiaADia": "Que lo que haces por otros hoy no se quede en la intención — llévalo hasta el gesto concreto, aunque sea pequeño."
  },
  {
    "dia": 8,
    "titulo": "Un tiempo de espera sin lugar propio",
    "conoceAClara": "Por seguridad, Francisco llevó primero a Clara a un monasterio benedictino cercano, mientras se resolvía dónde viviría de forma estable.",
    "suPalabra": "Aceptó un tiempo de espera e incertidumbre, sin apurar ella misma la solución ni exigir claridad inmediata sobre su futuro.",
    "reflexion": "No toda vocación se acomoda de inmediato en su lugar definitivo. Clara vivió, incluso después de la decisión más radical de su vida, un tiempo de \"no lugar propio\". Aprender a esperar sin desesperar en esos tiempos intermedios es, muchas veces, tan formativo como el paso decisivo mismo.",
    "oracion": "Señor, ayúdame a vivir en paz los tiempos donde todavía no tengo un lugar definitivo, confiando en que Tú ya sabes cuál será. Amén.",
    "propositoHoy": "Identifica una situación de tu vida que sigue \"en tránsito\" o sin resolver, y ofrece hoy en oración la espera, en vez de forzar una solución antes de tiempo.",
    "paraTuDiaADia": "Si algo o alguien se va de tu vida sin que todo parezca \"resuelto\", no lo vivas como un fracaso; tu parte fue acompañar ese tramo, no forzar una conclusión antes de tiempo."
  },
  {
    "dia": 9,
    "titulo": "Una vida que habla por sí sola",
    "conoceAClara": "Su tío Monaldo y otros parientes llegaron armados a sacarla de allí. Clara se descubrió la cabeza rasurada, mostrando su consagración ya hecha, y ellos, sorprendidos, desistieron.",
    "suPalabra": "No discutió ni se defendió con palabras: mostró simplemente lo que ya era.",
    "reflexion": "Hay momentos donde defender la fe con argumentos solo alarga el conflicto, y donde mostrar con calma lo que ya se es resulta más elocuente que cualquier discurso. Clara no convenció a su familia con razones; los desarmó mostrando un hecho ya vivido, con paz.",
    "oracion": "Señor, dame la sencillez de Clara para mostrar mi fe con hechos más que con muchas palabras, y la paz para no necesitar ganar cada discusión sobre lo que ya vivo contigo. Amén.",
    "propositoHoy": "Ante una duda que alguien te plantee hoy sobre tu fe, responde con un ejemplo concreto de tu vida en lugar de un argumento largo.",
    "paraTuDiaADia": "Ante un comentario difícil, responde con serenidad y con la coherencia de tu propio trato, más que con muchas palabras; deja que tu paz hable primero."
  },
  {
    "dia": 10,
    "titulo": "Dios hace grandes las cosas pequeñas",
    "conoceAClara": "Poco después, Clara se trasladó a la pequeña iglesia de San Damián, fuera de las murallas de Asís, reparada años antes por el propio Francisco. Ahí nace la comunidad que después se llamaría \"Clarisas\".",
    "suPalabra": "Eligió literalmente el lugar más pequeño y pobre de la ciudad para comenzar algo que duraría siglos.",
    "reflexion": "San Damián no era, a los ojos de nadie, un lugar prometedor: una iglesia pequeña y humilde, fuera de las murallas. Y ahí floreció una de las formas de vida consagrada más influyentes de la historia. Los inicios pequeños, en el lugar \"equivocado\" según cualquier estándar humano, pueden ser exactamente donde Dios quiere sembrar algo grande.",
    "oracion": "Señor, que hiciste de un templo pequeño y abandonado la cuna de una obra enorme, no me dejes despreciar los inicios humildes de lo que hoy estoy empezando. Amén.",
    "propositoHoy": "Dedica hoy tiempo a algo \"pequeño y sin gloria\" de tu día —una tarea aburrida, un detalle que nadie va a notar— como si fuera tan importante como lo más visible.",
    "paraTuDiaADia": "Cuida con el mismo esmero las tareas más humildes y ocultas de tu rutina —algo que nadie va a notar— como si fueran la parte más importante de tu día, porque lo son."
  },
  {
    "dia": 11,
    "titulo": "Una vida que inspira a otros",
    "conoceAClara": "Meses después, Inés, hermana menor de Clara, huyó también de casa para unirse a ella en San Damián, a pesar de la fuerte oposición familiar.",
    "suPalabra": "El testimonio de Clara no se quedó en ella misma: atrajo a los más cercanos, aunque eso trajera un nuevo conflicto.",
    "reflexion": "A veces se piensa que entregarse a Dios \"aleja\" a la familia. En el caso de Clara, su ejemplo terminó por acercar a su propia hermana al mismo camino, aunque el costo inmediato fuera otro enfrentamiento. El testimonio real no siempre trae paz inmediata, pero sí siembra algo en quienes te observan de cerca — algo que, tarde o temprano, puede germinar.",
    "oracion": "Señor, que la vida de Clara atrajo a su propia hermana al mismo amor, deja que mi entrega de hoy sea también semilla para quienes me observan cerca, aunque hoy no lo pida directamente. Amén.",
    "propositoHoy": "Piensa en alguien cercano que observa tu vida de fe de cerca, y reza hoy específicamente por su propio camino.",
    "paraTuDiaADia": "Trata a la gente que tienes cerca con una acogida tan cálida y real que, sin decir nada sobre tu fe, sientan algo parecido a lo que atrajo a Inés hacia su hermana."
  },
  {
    "dia": 12,
    "titulo": "Una comunidad que atrae por su testimonio",
    "conoceAClara": "Poco a poco, otras jóvenes de la región, algunas también de familias nobles, se unieron a la comunidad de San Damián, atraídas por su estilo de vida radical de pobreza y oración.",
    "suPalabra": "La comunidad crecía no por publicidad, sino por el testimonio vivido de las que ya estaban dentro.",
    "reflexion": "No hay registro de que Clara haya salido a \"reclutar\" seguidoras; la comunidad crecía porque quienes la visitaban veían algo real y coherente entre lo que se predicaba y lo que se vivía. Ninguna estrategia de comunicación sustituye la fuerza silenciosa de una vida que de verdad corresponde a lo que dice creer.",
    "oracion": "Señor, que la coherencia de vida de las primeras hermanas atrajo a otras sin necesidad de grandes palabras, hazme instrumento de esa misma coherencia sencilla hoy. Amén.",
    "propositoHoy": "Revisa hoy si hay distancia entre lo que dices creer y lo que realmente vives, y corrige un punto concreto de esa distancia.",
    "paraTuDiaADia": "Antes de tratar a alguien hoy, revisa si hay coherencia entre lo que llevas por dentro y cómo vas a tratarlo; que perciban en ti algo real, no un papel actuado."
  },
  {
    "dia": 13,
    "titulo": "Servir desde el último lugar",
    "conoceAClara": "Hacia 1215, Francisco le pidió a Clara que aceptara el cargo de abadesa de la comunidad. Ella no lo quería, prefería el último lugar, pero obedeció por humildad.",
    "suPalabra": "Aceptó liderar no por ambición, sino por obediencia y amor al servicio.",
    "reflexion": "Existe una forma de liderazgo que nace no de querer estar al frente, sino de aceptar estarlo cuando hace falta por el bien de otros. Francisco mismo evitaba los cargos, llamándose \"hermano menor\"; Clara compartió ese mismo instinto de huir del primer lugar, y ambos terminaron liderando comunidades enteras. La autoridad que de verdad da fruto nace de la humildad, no la contradice.",
    "oracion": "Señor, que Francisco se llamó \"hermano menor\" incluso siendo fundador, y Clara aceptó liderar sin buscarlo, dame esa misma libertad interior para servir desde cualquier lugar que me toque, sin apego ni rechazo al liderazgo. Amén.",
    "propositoHoy": "Si hoy tienes alguna responsabilidad sobre otros, ejércela como servicio, no como estatus — buscando el bien de los demás antes que tu propia comodidad.",
    "paraTuDiaADia": "Si te toca coordinar algo hoy, ejércelo sirviendo primero; toma, si hace falta, el lugar más incómodo o menos visible sin que nadie tenga que saber que fuiste tú."
  },
  {
    "dia": 14,
    "titulo": "Un corazón libre para Dios",
    "conoceAClara": "Las hermanas vivían descalzas, dormían sobre tablas, ayunaban con frecuencia y guardaban largos silencios, todo en un edificio pequeño y pobre junto al Monte Subasio.",
    "suPalabra": "La austeridad no era un fin en sí mismo, sino un medio para tener el corazón libre y disponible para Dios.",
    "reflexion": "Es fácil malinterpretar la austeridad de Clara como pura dureza. Pero el propósito de esas prácticas —ayuno, silencio, pobreza— era liberar espacio interior, no demostrar resistencia. Es la misma lógica de cualquier sacrificio real: no se trata de \"aguantar\", sino de vaciar espacio para que algo más importante pueda entrar y quedarse.",
    "oracion": "Señor, que Clara y sus hermanas eligieron la pobreza no como castigo sino como espacio para Ti, ayúdame a vivir mis propios sacrificios con esa misma libertad interior, y no como sacrificio sin sentido. Amén.",
    "propositoHoy": "Elige hoy una pequeña renuncia concreta (silencio en una comida, un rato sin redes, sencillez en algo) y vívela como espacio abierto para Dios, no solo como privación.",
    "paraTuDiaADia": "En algún momento de tu día, vive una pequeña sencillez (ceder tu lugar, esperar tu turno, renunciar a una comodidad) sin comentarlo con nadie — que sea un lenguaje silencioso de entrega."
  },
  {
    "dia": 15,
    "titulo": "Una amistad que conduce a Dios",
    "conoceAClara": "Aunque vivían separados y se veían pocas veces, Francisco y Clara mantuvieron una relación de consejo espiritual mutuo toda la vida. Se cuenta que, ya enfermo y casi ciego, Francisco compuso el Cántico de las Criaturas cerca de San Damián.",
    "suPalabra": "La cercanía espiritual no depende de la frecuencia de los encuentros, sino de la hondura del vínculo.",
    "reflexion": "Uno de los textos más hermosos de la espiritualidad cristiana, el Cántico de las Criaturas, nació precisamente cerca de San Damián, en un tiempo en que Francisco fue acompañado espiritualmente por Clara y sus hermanas. La amistad espiritual real no necesita frecuencia constante para dar fruto; necesita profundidad y disponibilidad real cuando el otro más lo necesita.",
    "oracion": "Señor, que uniste a Francisco y Clara en un vínculo profundo aunque distante, ayúdame a cuidar mis propios vínculos de fe no por la cantidad de encuentros, sino por su hondura y fidelidad. Amén.",
    "propositoHoy": "Reza hoy por alguien con quien tienes un vínculo espiritual profundo pero poco frecuente, y si puedes, mándale un mensaje breve de aliento.",
    "paraTuDiaADia": "Con quien solo puedas dedicarle un momento breve hoy, dale en ese instante una atención tan real y entera que compense la falta de tiempo."
  },
  {
    "dia": 16,
    "titulo": "Una princesa que renunció a una corona",
    "conoceAClara": "Inés de Praga, hija del rey de Bohemia, rechazó casarse con el emperador Federico II para consagrar su vida a Cristo, siguiendo el modelo de Clara, de quien había oído hablar. Fundó un monasterio de Pobres Hermanas en Praga hacia 1234.",
    "suPalabra": "La fama de la vida de Clara había cruzado media Europa, sin que ella saliera nunca de Asís.",
    "reflexion": "Clara jamás viajó a predicar ni a fundar personalmente otros monasterios; y sin embargo, su forma de vivir el Evangelio llegó hasta una corte real en Bohemia, a cientos de kilómetros, e inspiró una decisión que cambió el destino de un reino. El alcance real de una vida entregada a Dios casi nunca se puede medir ni predecir desde dentro de esa misma vida.",
    "oracion": "Señor, que sin moverse de Asís, Clara tocó el corazón de una princesa en tierras lejanas, ayúdame a confiar en que lo que hago escondido puede llegar mucho más lejos de lo que jamás podré ver. Amén.",
    "propositoHoy": "Haz hoy un gesto de fe silencioso y escondido (una oración larga, algo que nadie note), confiando en que su alcance no depende de que tú lo veas.",
    "paraTuDiaADia": "Trata a cada persona confiando en que tu gesto de hoy —aunque pequeño y silencioso— puede tener en su vida un alcance que tú nunca llegarás a conocer ni a ver."
  },
  {
    "dia": 17,
    "titulo": "La alegría de parecerse a Cristo",
    "conoceAClara": "Clara le escribe a Inés felicitándola por su decisión, animándola a abrazar con toda su alma la pobreza de Cristo, a la que llama \"esposa\" y \"corona\" de quien la elige con amor.",
    "suPalabra": "Le recuerda que quien sirve a los pobres se hace semejante al Rey del cielo.",
    "reflexion": "Llama la atención que Clara use palabras de fiesta —\"esposa\", \"corona\"— para describir la pobreza, algo que el mundo suele ver solo como carencia. Para ella, elegir la sencillez no era resignarse a tener menos, sino ganar una libertad interior que ninguna riqueza puede comprar. Francisco pensaba igual cuando llamaba \"hermana\" a la pobreza, como a una compañera amada, no como una condena.",
    "oracion": "Señor, que Clara y Francisco llamaron a la pobreza \"esposa\" y \"hermana\", ayúdame a ver hoy la sencillez no como una pérdida, sino como espacio ganado para amarte con más libertad. Amén.",
    "propositoHoy": "Ayuda hoy a alguien en situación de necesidad real —material o afectiva— como si sirvieras directamente a Cristo en esa persona.",
    "paraTuDiaADia": "Busca hoy a quien menos protagonismo tenga en tu entorno o parezca más necesitado de atención, y trátalo como si trataras directamente a Cristo, sin que se note como algo especial."
  },
  {
    "dia": 18,
    "titulo": "El espejo de Cristo",
    "conoceAClara": "En una carta posterior, Clara invita a Inés a mirarse en Cristo \"como en un espejo\", contemplando en él su pobreza, humildad y caridad, para conformar toda su vida a esa imagen.",
    "suPalabra": "Le pide mirarse en ese espejo cada día, y adornarse con las virtudes que ahí se reflejan.",
    "reflexion": "La imagen del espejo es poderosa porque un espejo no inventa nada: solo refleja lo que ya está delante. Clara no pide a Inés imaginar a Cristo, sino contemplarlo con atención sostenida hasta que su propia vida empiece a parecerse a lo que mira. Esa es, quizás, la clave más honda de toda su espiritualidad: no se trata de esforzarse por imitar virtudes ajenas a la fuerza, sino de mirar tan fijo a Cristo que uno termine pareciéndosele casi sin darse cuenta.",
    "oracion": "Señor, que Clara enseñó a mirarte como en un espejo hasta parecerse a Ti, dame hoy esa misma mirada sostenida y confiada, sabiendo que la transformación es tuya y no solo fruto de mi esfuerzo. Amén.",
    "propositoHoy": "Dedica un tiempo de oración hoy —sin pedir nada, solo mirando a Cristo (en un crucifijo, en el Evangelio)— y observa después qué cambió en tu ánimo.",
    "paraTuDiaADia": "Que tu propia mirada serena y sin juicio hacia cada persona que trates hoy sea, sin palabras, un espejo en el que ella pueda intuir algo de cómo Cristo mismo la mira."
  },
  {
    "dia": 19,
    "titulo": "No te canses de caminar",
    "conoceAClara": "Clara anima a Inés a correr con pasos ligeros y ágiles hacia la meta eterna, sin que nada del camino la haga tropezar ni la retrase.",
    "suPalabra": "Le pide avanzar \"de virtud en virtud\", sin miedo a los tropiezos.",
    "reflexion": "Es significativo que Clara hable de \"ligereza\" y no de resistencia forzada. El camino espiritual, en su visión, no es una carga que se soporta apretando los dientes, sino una carrera que se disfruta cuando has soltado los pesos innecesarios: el miedo excesivo, la comparación, la necesidad de aprobación. Francisco insistía en algo parecido: la tristeza excesiva, decía, no viene de Dios.",
    "oracion": "Señor, que Clara pedía correr ligera y no arrastrarse en el camino, quítame hoy los pesos que no son de Ti —el miedo, la comparación, la exigencia excesiva— para poder vivir con alegría verdadera. Amén.",
    "propositoHoy": "Identifica un peso concreto (una preocupación, una autoexigencia, un rencor) que te hace \"correr pesado\" en tu vida de fe, y entrégalo hoy en oración de forma explícita.",
    "paraTuDiaADia": "Vive hoy con ligereza real, no con gesto de sacrificio o cansancio forzado, para que la gente a tu alrededor perciba gozo genuino, no una carga que llevas por obligación."
  },
  {
    "dia": 20,
    "titulo": "Una ternura que no se apagó",
    "conoceAClara": "Años después, ya muy enferma, Clara le escribe una última carta a Inés (que para entonces también sufría enfermedad), llena de ternura, llamándola \"mitad de mi alma\" y animándola a no desfallecer.",
    "suPalabra": "Incluso enferma, sus palabras seguían siendo de aliento y no de queja.",
    "reflexion": "Escribir palabras de consuelo cuando estás bien es relativamente fácil; hacerlo desde tu propio dolor es otra cosa. Esta carta revela que la ternura de Clara no dependía de su bienestar: era una decisión sostenida incluso cuando ella misma más necesitaba consuelo. Es un recordatorio fuerte de que el amor real no espera a \"sentirse bien\" para darse.",
    "oracion": "Señor, que Clara consoló a Inés incluso desde su propio dolor, ayúdame a no condicionar mis palabras de aliento a que yo misma me sienta bien primero. Amén.",
    "propositoHoy": "Aunque hoy te sientas cansado o con poca energía, busca dar una palabra concreta de aliento a alguien que lo necesite, sin esperar a \"sentirte mejor\" primero.",
    "paraTuDiaADia": "Si te sientes cansado o dolido hoy, no lo traslades en sequedad hacia los demás; trata a la gente con la misma ternura de siempre, sin que tengan que saber el costo que eso te implica."
  },
  {
    "dia": 21,
    "titulo": "Una amistad que atravesó fronteras",
    "conoceAClara": "Clara e Inés nunca volvieron a verse en persona después de la conversión de Inés, y sin embargo su vínculo espiritual, sostenido por cartas, duró décadas.",
    "suPalabra": "La distancia física no impidió una de las amistades espirituales más citadas de la historia de la Iglesia.",
    "reflexion": "En una época sin viajes rápidos ni comunicación instantánea, estas dos mujeres sostuvieron durante décadas una relación que las formó mutuamente en la fe, apoyadas solo en cartas escritas a mano. Su ejemplo desafía la idea de que un vínculo espiritual necesita cercanía constante para ser real y transformador.",
    "oracion": "Señor, que Clara e Inés se sostuvieron mutuamente en la fe a pesar de la distancia y el tiempo, enséñame a cuidar con constancia los vínculos espirituales que hoy parecen lejanos o poco frecuentes. Amén.",
    "propositoHoy": "Escribe un mensaje largo (no solo un saludo rápido) a alguien con quien tienes un vínculo espiritual importante pero distante, animándolo en su camino de fe.",
    "paraTuDiaADia": "Con la gente que sientas más lejana o difícil de alcanzar, sostén igual tu atención y tu oración por ella, aunque el vínculo parezca menos fluido que con otras."
  },
  {
    "dia": 22,
    "titulo": "La defensora de Asís",
    "conoceAClara": "Hacia 1240, durante conflictos entre el Papa y el emperador Federico II, tropas de mercenarios se acercaron a Asís, y algunos llegaron hasta los muros de San Damián. Clara ya estaba gravemente enferma para entonces, casi postrada.",
    "reflexion": "Es fácil pensar que proteger a otros requiere estar en plena forma física o emocional. La historia de Clara desmiente esa idea de raíz: en el momento de mayor peligro para su comunidad, ella no estaba en su mejor momento de salud, sino en uno de los más débiles de toda su vida. Y precisamente ahí, desde la cama, se convirtió en la defensora de todas.",
    "oracion": "Señor, que usaste la debilidad física de Clara para proteger a toda su comunidad, recuérdame que mi propio cansancio o límite actual no me inhabilita para amar; a veces es justo desde ahí donde Tú actúas con más fuerza. Amén.",
    "propositoHoy": "No esperes a \"sentirte al cien por ciento\" para hacer hoy un acto de servicio o intercesión; ofrécelo también desde tu cansancio actual, como Clara.",
    "paraTuDiaADia": "No dejes de dar hoy solo porque te sientas cansado o con poca energía; da precisamente desde ahí, sin necesidad de mostrar o explicar tu esfuerzo a nadie."
  },
  {
    "dia": 23,
    "titulo": "La fuerza escondida de la intercesión",
    "conoceAClara": "Según el testimonio de sus propias hermanas, Clara se hizo llevar hasta una ventana con el Santísimo Sacramento en una custodia de plata, y oró postrada ante Él, pidiendo protección para la comunidad.",
    "suPalabra": "Ante el peligro extremo, su primera y única respuesta fue la oración eucarística, no la negociación ni la huida.",
    "reflexion": "En el momento de mayor urgencia, Clara no organizó una estrategia de defensa ni buscó negociar: fue directamente a la fuente que ella consideraba real, la presencia de Cristo en la Eucaristía. Esto no es pasividad, sino una jerarquía clara de prioridades: primero se acude a Dios, y desde ahí se actúa, no al revés.",
    "oracion": "Señor, presente en la Eucaristía como lo estuviste ante Clara en aquella ventana, ayúdame a acudir primero a Ti en cada momento de urgencia, antes que a cualquier solución meramente humana. Amén.",
    "propositoHoy": "Ante cualquier problema o urgencia que surja hoy, detente primero a orar brevemente antes de reaccionar o resolver por tu cuenta.",
    "paraTuDiaADia": "Ante cualquier imprevisto hoy, deja que tu primer gesto —aunque sea un breve instante de oración interior— venga antes que tu reacción; que la gente perciba calma, no urgencia."
  },
  {
    "dia": 24,
    "titulo": "Permanecer en lo que da fruto",
    "conoceAClara": "Los soldados, según el relato, se retiraron sin atacar el monasterio, y las hermanas atribuyeron la protección directamente a la oración de su madre Clara.",
    "suPalabra": "Su intercesión, ya débil de cuerpo, tuvo un efecto que ella misma no podía haber logrado con fuerza física.",
    "reflexion": "El desenlace de este episodio invita a ampliar la idea de lo que cuenta como \"acción eficaz\". Clara no movió un dedo en sentido físico contra el ejército; y sin embargo, su comunidad y la tradición atribuyen a su oración un efecto real y concreto. La eficacia espiritual no siempre se mide con los mismos parámetros que la eficacia humana.",
    "oracion": "Señor, que hiciste eficaz la oración débil de Clara frente a un ejército armado, aumenta mi fe en el poder real de la intercesión, incluso cuando yo mismo me sienta sin fuerzas para hacer algo más. Amén.",
    "propositoHoy": "Elige hoy una situación que sientes fuera de tu control (una persona, un conflicto, una preocupación) y ofrécela específicamente en oración de intercesión, confiando en su eficacia real.",
    "paraTuDiaADia": "Sostén una intercesión silenciosa y constante por la gente que tratas hoy, detrás de cada gesto visible; confía en que ese sostén de fondo tiene un efecto real, aunque nadie lo vea."
  },
  {
    "dia": 25,
    "titulo": "Una autoridad que no buscó títulos",
    "conoceAClara": "Se registra un ataque similar en 1241, esta vez de tropas del propio Federico II, contra la llanura de Asís; de nuevo se atribuyó a la oración de Clara la protección de la ciudad.",
    "suPalabra": "No fue un hecho aislado: la comunidad recurrió de nuevo a lo mismo que ya había funcionado antes.",
    "reflexion": "A veces, tras vivir una experiencia profunda de oración, buscas \"algo nuevo\" para la siguiente crisis, como si repetir lo mismo fuera señal de poca creatividad espiritual. La comunidad de Clara hizo lo contrario: volvió exactamente a la misma práctica que ya la había sostenido, confiando en su fuerza más que en la novedad.",
    "oracion": "Señor, que las hermanas de San Damián volvieron a la misma oración que ya las había sostenido antes, dame la humildad de repetir lo que ya sé que funciona espiritualmente, sin necesitar siempre algo distinto o novedoso. Amén.",
    "propositoHoy": "Repite hoy una práctica espiritual concreta que ya te ha sostenido en el pasado (una oración, un salmo, una devoción), en vez de buscar algo nuevo.",
    "paraTuDiaADia": "Si una forma sencilla de estar presente ya te ha dado paz y fruto en otras ocasiones, repítela con naturalidad hoy, sin necesidad de reinventarte para impresionar a nadie."
  },
  {
    "dia": 26,
    "titulo": "Permanecer fiel al llamado recibido",
    "conoceAClara": "Por estos hechos, Clara —sin buscarlo— llegó a ser vista como protectora de Asís en vida, mucho antes de cualquier canonización oficial.",
    "suPalabra": "Su autoridad espiritual no vino de un título, sino del reconocimiento del pueblo por su vida de oración constante.",
    "reflexion": "Ningún documento oficial nombró a Clara \"protectora de Asís\" en aquel momento; fue el propio pueblo, testigo de los hechos, quien reconoció espontáneamente esa realidad. La autoridad espiritual auténtica muchas veces precede, y no depende, de cualquier reconocimiento institucional. Se gana viviendo, no solicitando.",
    "oracion": "Señor, que el pueblo de Asís reconoció a Clara sin que ella buscara ningún título, líbrame de necesitar reconocimiento externo para saber que lo que hago tiene valor ante Ti. Amén.",
    "propositoHoy": "Haz hoy algo significativo sin buscar que se note ni se reconozca públicamente, confiando en que su valor no depende de ser visto.",
    "paraTuDiaADia": "Haz hoy, para alguien, algo significativo sin que esa persona —ni nadie más— se entere de que fuiste tú quien lo hizo."
  },
  {
    "dia": 27,
    "titulo": "Escribir el camino que Dios ha puesto en el corazón",
    "conoceAClara": "Durante años, la Iglesia insistió en que la comunidad de Clara adoptara alguna de las Reglas monásticas femeninas ya existentes, todas las cuales permitían tener bienes en común.",
    "suPalabra": "Clara sintió que ninguna de esas Reglas expresaba realmente el carisma que ella y Francisco habían recibido.",
    "reflexion": "Insistir en que un modelo ajeno, aunque bueno en sí mismo, no responde a tu llamado propio requiere una claridad interior notable, sobre todo frente a la presión de instituciones respetables que ofrecían justo eso: un modelo ya aprobado y seguro. Clara prefirió años de incertidumbre institucional antes que renunciar a lo que sentía como el núcleo de su vocación.",
    "oracion": "Señor, que Clara no se conformó con un modelo ajeno aunque fuera más seguro, dame el discernimiento para reconocer cuándo un \"camino ya aprobado\" no es, sin embargo, el que Tú me pides a mí. Amén.",
    "propositoHoy": "Identifica si hay algún \"modelo prestado\" de vida espiritual que sigues por comodidad, aunque sientes que no responde a tu llamado real, y ora hoy pidiendo claridad al respecto.",
    "paraTuDiaADia": "No trates de encajar a cada persona en la misma forma de acompañamiento; ajusta tu trato y tu escucha a lo que cada quien realmente necesita, aunque no siga el \"modelo esperado\"."
  },
  {
    "dia": 28,
    "titulo": "Perseverar sin ver todavía el fruto",
    "conoceAClara": "Clara redactó personalmente una Regla para su comunidad, inspirada directamente en la de Francisco — algo inaudito para una comunidad femenina de la época.",
    "suPalabra": "Tomó la iniciativa de poner por escrito, ella misma, lo que había discernido como voluntad de Dios para su comunidad.",
    "reflexion": "En el siglo XIII, que una mujer escribiera su propia Regla de vida —y no simplemente adoptara una ya escrita por hombres— era un acto de autoridad espiritual notable. Clara no esperó permiso para pensar; discernió, escribió, y luego buscó la aprobación de lo ya discernido. Hay una diferencia importante entre pedir permiso para pensar y pedir aprobación para algo ya pensado con seriedad.",
    "oracion": "Señor, que diste a Clara la valentía de escribir ella misma su propio camino, dame también la confianza de poner por escrito, con seriedad y humildad, lo que discierno como tu voluntad para mi vida. Amén.",
    "propositoHoy": "Escribe hoy, con tus propias palabras, un párrafo que resuma lo que sientes que Dios te pide en esta etapa de tu vida.",
    "paraTuDiaADia": "Confía en tu propio discernimiento cuando alguien te busque en una situación nueva o inesperada; actúa con la responsabilidad que ya se te ha confiado, sin necesitar siempre que otro te diga exactamente qué hacer."
  },
  {
    "dia": 29,
    "titulo": "El tiempo de Dios es perfecto",
    "conoceAClara": "Clara pasó cerca de tres décadas insistiendo ante distintos Papas para que su Regla, con el \"privilegio de la pobreza\" absoluta, fuera aprobada oficialmente.",
    "suPalabra": "La perseverancia de Clara no fue un momento, sino una vida entera de insistencia paciente.",
    "reflexion": "Treinta años es más tiempo del que dura la mayoría de las cosas que hoy nos cuesta sostener. Clara mantuvo esa insistencia sin volverse amarga ni renunciar a su comunidad mientras esperaba. La perseverancia que enseña no es un arranque de entusiasmo, sino una fidelidad sostenida durante décadas, incluso sin ver resultados inmediatos.",
    "oracion": "Señor, que Clara insistió durante treinta años sin cansarse ni amargarse, dame esa misma perseverancia paciente para las causas justas que hoy sostengo, aunque su fruto tarde en llegar. Amén.",
    "propositoHoy": "Identifica una causa justa por la que has dejado de insistir por cansancio, y retómala hoy con un paso concreto, aunque sea pequeño.",
    "paraTuDiaADia": "Sostén con paciencia a quien muestre resistencia o lentitud hoy, sin esperar un cambio inmediato ni desanimarte si no lo ves de inmediato."
  },
  {
    "dia": 30,
    "titulo": "La santidad de permanecer",
    "conoceAClara": "El 9 de agosto de 1253, el Papa Inocencio IV aprobó formalmente la Regla de Clara con el privilegio de la pobreza. Ella, ya agonizante, alcanzó a recibir el documento y lo besó.",
    "suPalabra": "Vio cumplido, literalmente a las puertas de la muerte, aquello por lo que había luchado toda su vida.",
    "reflexion": "Es difícil imaginar un margen más estrecho: dos días antes de morir, después de treinta años de espera. La providencia de Dios, en este episodio, no llega \"a tiempo\" según ningún calendario razonable, y sin embargo llega. Esto no garantiza que toda espera tendrá un final igual de ajustado, pero sí es un testimonio de que Dios no está limitado por los plazos que consideramos razonables.",
    "oracion": "Señor, que hiciste llegar a Clara la aprobación de su Regla justo a tiempo, aunque pareciera imposiblemente tarde, aumenta mi confianza en tus tiempos, distintos siempre de los míos. Amén.",
    "propositoHoy": "Trae a la oración de hoy una espera larga y sin resolver en tu vida, y en vez de pedir que se resuelva ya, pide la confianza de Clara para sostenerla hasta el final.",
    "paraTuDiaADia": "Si alguien parece no mostrar ningún avance visible, no lo descuides ni lo des por perdido; sigue tratándolo con la misma entrega hasta el final."
  },
  {
    "dia": 31,
    "titulo": "Háblale a tu alma",
    "conoceAClara": "Dos días después de recibir la aprobación de su Regla, Clara murió en San Damián, rodeada de sus hermanas, después de casi 30 años de enfermedad y 41 años de vida religiosa.",
    "suPalabra": "Terminó su vida en el mismo lugar pequeño donde la había empezado, sin haber salido apenas de Asís.",
    "reflexion": "No hay en la vida de Clara grandes viajes, ni cargos públicos, ni apariciones ante multitudes. Hay, en cambio, cuarenta y un años de fidelidad en el mismo lugar pequeño. La tradición cristiana ha reconocido esta forma de santidad —la del lugar fijo, la fidelidad silenciosa y sostenida— como igual de grande que la de quienes recorren el mundo evangelizando.",
    "oracion": "Señor, que en cuarenta y un años en un mismo lugar pequeño Clara construyó una santidad que llegó a toda Europa, ayúdame a valorar la fidelidad callada en mi propio \"lugar pequeño\" tanto como valoro los grandes gestos visibles. Amén.",
    "propositoHoy": "Da gracias hoy específicamente por un lugar o rutina \"pequeña y fija\" de tu vida donde has sido fiel durante tiempo, aunque nunca haya sido reconocido públicamente.",
    "paraTuDiaADia": "Vive con la misma entrega las tareas fijas y poco vistosas de tu rutina, sin necesitar algo más visible para sentir que lo que haces realmente vale."
  },
  {
    "dia": 32,
    "titulo": "Que el amor entre nosotros sea el vínculo",
    "conoceAClara": "Testigos presentes en su muerte contaron que Clara, en sus últimas horas, se dirigía a su propia alma, animándola a partir con confianza porque tenía \"buen guía\" para el camino.",
    "suPalabra": "Supo animarse a sí misma en la fe, sin depender solo del consuelo externo de otros.",
    "reflexion": "Este gesto —hablar a la propia alma como quien habla a una amiga necesitada de aliento— revela una intimidad con la propia interioridad que no siempre cultivamos. Clara no esperó pasivamente el consuelo ajeno en su hora final; ella misma se acompañó, alimentada por toda una vida de diálogo interior con Dios. La capacidad de sostenerte a ti mismo en fe es, en parte, fruto de años de práctica silenciosa como la que ella vivió.",
    "oracion": "Señor, que Clara supo animar su propia alma en la hora final, enséñame también a dialogar con mi interior desde ya, para que en mis propios momentos difíciles no dependa solo del consuelo externo. Amén.",
    "propositoHoy": "Dedica hoy un momento a \"hablarte a ti mismo\" en oración, como lo haría un buen amigo, reconociendo tus miedos y animándote con la fe que ya tienes.",
    "paraTuDiaADia": "Cuida tu propio tiempo de oración estos días, aunque sea breve, para poder sostenerte a ti mismo y dar desde la plenitud y no desde el vacío interior."
  },
  {
    "dia": 33,
    "titulo": "También tú eres alguien a quien debes cuidar",
    "conoceAClara": "En un texto dictado cerca del final de su vida, Clara pide a sus hermanas amar siempre la pobreza que Cristo eligió y cuidarse unas a otras con caridad constante.",
    "suPalabra": "Insiste en que la caridad mutua sea \"el vínculo\" que las mantenga unidas siempre.",
    "reflexion": "Es revelador que, al final de su vida, Clara no dedique sus últimas palabras a temas organizativos, sino directamente al amor mutuo entre las hermanas. Todo lo demás —la pobreza, la Regla, el gobierno de la comunidad— tenía sentido solo si servía a ese vínculo de caridad. Un grupo que descuida el cariño real entre sus miembros, aunque tenga todo lo demás perfecto, pierde el corazón mismo de lo que intenta transmitir.",
    "oracion": "Señor, que Clara pidió a sus hermanas la caridad mutua como el vínculo más importante de todos, ayúdame a cuidar primero el amor entre quienes camino, antes que cualquier detalle de logística u organización. Amén.",
    "propositoHoy": "Haz hoy un gesto explícito de cariño hacia alguien cercano (una llamada, una palabra de aprecio, ayuda concreta), priorizándolo sobre alguna tarea pendiente.",
    "paraTuDiaADia": "Cuida hoy, con un gesto concreto, el cariño real hacia quienes te rodean; que la gente perciba un ambiente de amor genuino, sin que nadie tenga que explicárselo."
  },
  {
    "dia": 34,
    "titulo": "Una vida que se vuelve camino para otros",
    "conoceAClara": "En otro texto breve, Clara bendice a sus hermanas presentes y futuras, deseándoles ser siempre amantes de Dios y de sus propias almas y cuerpos.",
    "suPalabra": "Pide expresamente que se amen también a sí mismas, no solo a Dios y a los demás.",
    "reflexion": "En medio de una vida de tanta austeridad y sacrificio, sorprende que Clara incluya explícitamente el amor a la propia alma y al propio cuerpo como parte de la bendición final. No hay contradicción entre la entrega radical y el cuidado sano de ti mismo; de hecho, Clara parece sugerir que uno sostiene al otro. Dar desde el desprecio de ti mismo no es, a la larga, sostenible ni verdaderamente fecundo.",
    "oracion": "Señor, que Clara bendijo a sus hermanas pidiéndoles amarse también a sí mismas, ayúdame a cuidar mi propio descanso, salud y ánimo, como parte real de mi entrega y no como algo opuesto a ella. Amén.",
    "propositoHoy": "Haz hoy algo concreto de cuidado personal (descanso suficiente, una comida tranquila, un momento de recreación sana) sin culpa, como forma legítima de amor propio ante Dios.",
    "paraTuDiaADia": "Cuida tu propio descanso, alimentación y ánimo hoy, aunque eso signifique pedir ayuda o ceder algo; dar agotado no es más santo, es simplemente menos sostenible."
  },
  {
    "dia": 35,
    "titulo": "Dios sale a nuestro encuentro",
    "conoceAClara": "Solo dos años después de su muerte, en 1255, el Papa Alejandro IV canonizó a Clara — un proceso muy rápido para la época, señal de la fama de santidad que ya tenía en vida. Su fiesta se celebra el 11 de agosto, día de su muerte.",
    "reflexion": "La rapidez de su canonización no respondió a una campaña organizada, sino al reconocimiento espontáneo y extendido de quienes la conocieron en vida: hermanas, vecinos de Asís, autoridades eclesiásticas. Cuando una vida es genuinamente coherente, ese reconocimiento no necesita forzarse ni promoverse artificialmente; simplemente se hace evidente.",
    "oracion": "Señor, que la santidad de Clara se hizo evidente sin necesidad de que ella la buscara ni la promoviera, ayúdame a vivir de manera tan coherente que mi fe se haga evidente sin esfuerzo artificial. Amén.",
    "propositoHoy": "Examina hoy si hay alguna incoherencia entre tu vida pública y privada de fe, y corrige un punto concreto, aunque nadie más lo note.",
    "paraTuDiaADia": "Que la coherencia entre lo que rezas en privado y cómo tratas a la gente sea tan real que no necesite ninguna explicación; que simplemente se note en cómo la acompañas."
  },
  {
    "dia": 36,
    "titulo": "Dios también ha ido tejiendo tu historia",
    "conoceAClara": "Hoy, en oración, recorre mentalmente toda la vida de Clara: la niña caritativa, la joven que huye de noche, la fundadora de San Damián, la abadesa humilde, la escritora de cartas, la defensora con la custodia, la legisladora perseverante, la moribunda que ve aprobada su Regla.",
    "reflexion": "Después de treinta y seis días conociendo su historia, es momento de dejar que esa vida completa —no solo un episodio aislado— le hable a la tuya. Ninguna etapa de su vida se explica del todo sin las demás: la niña generosa preparó a la joven valiente; la joven valiente hizo posible a la fundadora perseverante; la fundadora perseverante llegó, finalmente, a morir en paz. Tu propia vida de fe también se construye así, etapa sobre etapa, sin saltos mágicos.",
    "oracion": "Señor, que fuiste tejiendo la vida entera de Clara paso a paso, sin prisa, dame la paciencia de ver también mi propia historia como un tejido en construcción, confiando en que Tú sostienes cada etapa. Amén.",
    "propositoHoy": "Escribe hoy, en pocas líneas, las etapas principales de tu propia historia de fe hasta ahora, reconociendo cómo cada una preparó la siguiente.",
    "paraTuDiaADia": "Deja que el momento de la vida de Clara que más te tocó se traduzca hoy en una actitud concreta hacia la gente —no en un relato sobre ella—, aunque nunca menciones su nombre."
  },
  {
    "dia": 37,
    "titulo": "Que mi vida también refleje a Cristo",
    "conoceAClara": "Clara escribió que Inés debía mirarse en Cristo \"como en un espejo\". Hoy, invierte el ejercicio: mira la vida de Clara como espejo de tu propio llamado.",
    "reflexion": "Después de tantos días conociéndola, es natural preguntarte en qué se parece —y en qué no— tu propio camino al de ella. No se trata de copiar literalmente su vida (nadie está llamado hoy a fundar una orden ni a vivir en clausura), sino de identificar el mismo espíritu de fondo: sencillez, perseverancia, entrega silenciosa, alegría al dar. Ese espíritu sí es transferible a cualquier forma de vida hoy.",
    "oracion": "Señor, que el espíritu de Clara puede vivirse en formas muy distintas a las suyas, ayúdame a identificar cómo ese mismo espíritu de sencillez y entrega se traduce en mi propia vida hoy. Amén.",
    "propositoHoy": "Escribe una frase corta que resuma \"quién es Clara para mí\", pensando en cómo compartirla de forma personal, no solo histórica, con alguien cercano.",
    "paraTuDiaADia": "Que tu propia forma de vivir, en su sencillez y entrega, sea el \"espejo\" en el que otros puedan intuir algo de Cristo, sin que necesites explicarles nunca la referencia a Clara."
  },
  {
    "dia": 38,
    "titulo": "Bendecirlas antes de conocerlas",
    "conoceAClara": "Así como Clara bendijo a sus hermanas antes de morir, escribe hoy una breve bendición u oración personal por alguien que todavía no conoces — alguien que Dios va a cruzar en tu camino, aunque todavía no sepas quién es.",
    "reflexion": "Bendecir a alguien que todavía no conoces por nombre es un acto de fe puro: confías en que Dios ya conoce a esa persona en detalle, aunque tú aún no. Esta oración anticipada te prepara no solo para un encuentro, sino para el espacio espiritual con el que vas a recibirla.",
    "oracion": "Señor, que ya conoces por nombre a quien voy a encontrar, bendícelo desde ya con la misma ternura con que Clara bendijo a sus hermanas, y prepara mi corazón para lo que quieres darme en ese encuentro. Amén.",
    "propositoHoy": "Escribe hoy esa bendición u oración personal por alguien que aún no conoces; guárdala, y confía en que Dios sabe para quién es.",
    "paraTuDiaADia": "Vive hoy tu día como una bendición silenciosa y concreta hacia quien se cruce contigo, aunque nunca puedas decirle en palabras la oración que escribiste."
  },
  {
    "dia": 39,
    "titulo": "Entregar lo que hemos preparado",
    "conoceAClara": "Clara terminó su vida entera, desde la niñez hasta la muerte, orientada a un mismo propósito: parecerse a Cristo y sostener a su comunidad. Nunca buscó ser conocida más allá de Asís, y sin embargo su nombre llega hoy, casi ochocientos años después, hasta ti.",
    "reflexion": "Hoy termina el itinerario biográfico, pero no el aprendizaje. Lo que Clara enseña, en el fondo, es que la fidelidad sostenida en lo pequeño y lo escondido puede tener un alcance que ninguna estrategia humana podría haber planeado. No necesitas ser \"experto\" en su vida para vivir con sentido; necesitas, como ella, servir desde lo que realmente eres.",
    "oracion": "Señor, que en Clara hiciste brillar una vida escondida hasta alcanzar a personas de todo el mundo siglos después, recibe hoy la entrega de estos 40 días. Que como ella, viva desde mi sencillez real, y no desde una versión perfecta que creo deber mostrar. Amén.",
    "propositoHoy": "Ofrece hoy, en una oración final y consciente, todo lo que viene después de este itinerario — tus días, tu servicio, tu camino — a Dios.",
    "paraTuDiaADia": "Vive dispuesto a que cada gesto tuyo —y no tus palabras sobre Clara— sea lo que, sin nombrarla, hable de ella a quienes te rodean."
  },
  {
    "dia": 40,
    "titulo": "El último capítulo lo escribes tú",
    "reflexion": "Llegamos al final de este camino. El propósito nunca fue convertirte en experto en Santa Clara. El propósito era permitir que su vida te llevara nuevamente a Cristo. Ahora comienza la parte más importante: vivir lo aprendido.\nNo necesitas llegar siendo perfecto. Necesitas llegar disponible: disponible para escuchar, para obedecer, para cambiar de plan, para servir donde haga falta y para desaparecer un poco para que Cristo pueda aparecer.\nTal vez quienes te rodean nunca sepan quién oró silenciosamente por ellos, quién resolvió algo en silencio, quién madrugó sin que nadie se enterara. Y está bien. Clara nos enseñó que Dios sabe hacer fecundo aquello que se entrega en silencio.\nQue tu manera de mirar, escuchar, ayudar, obedecer, abrazar, esperar y servir sea el último capítulo de estos cuarenta días. Porque quizá la mejor manera de hablar de Santa Clara no sea hablar de ella, sino vivir como ella habría querido: mirando siempre a Cristo.",
    "oracionFinal": "Señor Jesús, pongo delante de Ti este camino recorrido. Te entrego cada esfuerzo, cada cansancio, cada dificultad y cada oración. Te entrego mi historia, con sus dones y también con sus fragilidades, y la de cada persona que Tú pongas en mi camino. Tú conoces su historia, sus heridas, sus preguntas y lo que necesita encontrar. Que yo no pretenda ocupar el lugar que solo Te corresponde a Ti. Hazme sencillo, disponible, instrumento de tu amor. Y al terminar cada día, concédeme la paz de saber que hice lo que me correspondía, y dejé que Tú hicieras lo demás. Amén.",
    "paraTuDiaADia": "Vive sin necesidad de demostrar cuánto sabes, cuánto preparaste o cuánto hiciste. Deja que tu forma de vivir sea el último capítulo de este itinerario. Que quien se encuentre contigo pueda intuir, a través de un gesto sencillo y verdadero, algo del amor de Cristo.\nPaz y Bien."
  }
];

export const decalogoClara = [
  {
    "titulo": "Humildad",
    "descripcion": "Vivir sin necesidad de ocupar el centro."
  },
  {
    "titulo": "Amor por la Eucaristía",
    "descripcion": "Volver a Cristo antes de reaccionar o resolver."
  },
  {
    "titulo": "Sencillez",
    "descripcion": "Hacer extraordinario el amor puesto en lo pequeño."
  },
  {
    "titulo": "Caridad fraterna",
    "descripcion": "Cuidar primero la forma en que tratamos a los demás."
  },
  {
    "titulo": "Perseverancia",
    "descripcion": "Seguir caminando aunque todavía no veamos el fruto."
  },
  {
    "titulo": "Paz",
    "descripcion": "Ser presencia serena, especialmente cuando algo no sale como esperabas."
  },
  {
    "titulo": "Escucha",
    "descripcion": "Acompañar sin apresurar el proceso del otro."
  },
  {
    "titulo": "Fidelidad en lo pequeño",
    "descripcion": "Reconocer que ninguna tarea hecha con amor es insignificante."
  },
  {
    "titulo": "Cuidado",
    "descripcion": "Cuidar al otro y también recibir con humildad el cuidado que necesitamos."
  },
  {
    "titulo": "Transparencia de Cristo",
    "descripcion": "Disminuir para que, a través de nuestra manera de vivir, Él pueda hacerse visible."
  }
];

export const decalogoClaraCierre = "Que cada gesto de tu vida sea un espejo del amor de Cristo. ¡Paz y Bien!";

export const creditosItinerarioClara = {
  "autor": "Lida Esperanza López M.",
  "rol": "Líder EMC 2026",
  "comunidad": "Emaús Mujeres Calahorra",
  "nota": "Este itinerario se apoya principalmente en los escritos de Santa Clara de Asís y en las fuentes antiguas sobre su vida. Las reflexiones y aplicaciones son meditaciones pastorales inspiradas en esas fuentes; no pretenden sustituir una edición crítica ni una biografía académica.",
  "fuentes": [
    "Proceso de Canonización de Santa Clara de Asís.",
    "Regla de Santa Clara.",
    "Testamento de Santa Clara.",
    "Bendición de Santa Clara.",
    "Cartas de Santa Clara a Inés de Praga (I-IV).",
    "Fuentes biográficas antiguas de Santa Clara, incluida la tradición transmitida por Tomás de Celano.",
    "Escritos de San Francisco de Asís: Testamento, Admoniciones y Cántico de las Criaturas.",
    "Sagrada Escritura."
  ],
  "origen": "Este material nació en Emaús Mujeres Calahorra y se ofrece como una herramienta de preparación espiritual que puede ser adaptada por otras comunidades, respetando siempre el discernimiento pastoral y la espiritualidad propia de cada grupo."
};
