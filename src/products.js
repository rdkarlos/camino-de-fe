// Productos de la tienda Camino de Fe
// Para agregar productos: copia un objeto y cambia los datos
// Precios en pesos colombianos (COP)

export const products = [
  {
    id: "rosario-madera",
    icon: "📿",
    nameEs: "Rosario de madera",
    nameEn: "Wooden Rosary",
    descEs: "Rosario artesanal en madera natural, ideal para la oración diaria.",
    descEn: "Handcrafted natural wood rosary, ideal for daily prayer.",
    price: 45000,
    tag: "Más vendido",
    type: "physical", // physical | digital
    stock: 10,
    image: null,
  },
  {
    id: "biblia-catolica",
    icon: "📖",
    nameEs: "Biblia Católica",
    nameEn: "Catholic Bible",
    descEs: "Biblia completa con deuterocanónicos, edición de estudio.",
    descEn: "Complete Bible with deuterocanonicals, study edition.",
    price: 100000,
    tag: "Nuevo",
    type: "physical",
    stock: 5,
    image: null,
  },
  {
    id: "vela-votiva",
    icon: "🕯️",
    nameEs: "Vela votiva",
    nameEn: "Votive Candle",
    descEs: "Vela artesanal perfumada, ideal para momentos de oración.",
    descEn: "Handcrafted scented candle, ideal for prayer moments.",
    price: 35000,
    tag: "",
    type: "physical",
    stock: 20,
    image: null,
  },
  {
    id: "medalla-virgen",
    icon: "✨",
    nameEs: "Medalla de la Virgen",
    nameEn: "Virgin Mary Medal",
    descEs: "Medalla de la Virgen María en metal plateado.",
    descEn: "Virgin Mary medal in silver-plated metal.",
    price: 15000,
    tag: "Popular",
    type: "physical",
    stock: 30,
    image: null,
  },
  {
    id: "libro-oraciones",
    icon: "📔",
    nameEs: "Libro de oraciones",
    nameEn: "Prayer Book",
    descEs: "Colección de oraciones católicas para toda ocasión.",
    descEn: "Collection of Catholic prayers for every occasion.",
    price: 21000,
    tag: "",
    type: "physical",
    stock: 15,
    image: null,
  },
  {
    id: "cruz-pared",
    icon: "✝️",
    nameEs: "Cruz de pared",
    nameEn: "Wall Cross",
    descEs: "Cruz artesanal en madera tallada para decorar el hogar.",
    descEn: "Handcrafted carved wood cross for home decoration.",
    price: 150000,
    tag: "Artesanal",
    type: "physical",
    stock: 8,
    image: null,
  },
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};
