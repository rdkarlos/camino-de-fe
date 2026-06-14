export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  // Leccionario católico - Evangelios por día del año
  const today = new Date(year, month - 1, day);
  const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000);
  
  const gospels = [
    "JHN.3.16-21", "MAT.5.1-12", "LUK.15.11-32", "JHN.6.35-40",
    "MRK.10.17-22", "MAT.22.34-40", "JHN.15.1-8", "LUK.6.27-36",
    "MAT.6.9-13", "JHN.11.25-27", "LUK.10.25-37", "JHN.14.1-6",
    "MAT.28.1-10", "LUK.24.13-35", "JHN.20.19-31", "MAT.25.31-46",
  ];

  const passage = gospels[dayOfYear % gospels.length];
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';
  const BIBLE_ID = 'b32b9d1b64b4ef29-01'; // Reina Valera 1960

  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/passages/${passage}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`,
      {
        headers: {
          'api-key': API_KEY,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ success: false, error: err });
    }

    const data = await response.json();
    const text = data?.data?.content?.replace(/\s+/g, ' ').trim();
    const reference = data?.data?.reference || passage;

    if (!text) return res.status(404).json({ success: false, error: 'Sin contenido' });

    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;
    return res.status(200).json({ success: true, reading: title, reference: reference, text: text, reflection: '', url: 'api.bible' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}