export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const today = new Date(year, month - 1, day);
  const dayOfYear = Math.floor((today - new Date(year, 0, 0)) / 86400000);
  const gospels = [
    "JHN.3.16-JHN.3.21","MAT.5.1-MAT.5.12","LUK.15.11-LUK.15.32","JHN.6.35-JHN.6.40",
    "MRK.10.17-MRK.10.22","MAT.22.34-MAT.22.40","JHN.15.1-JHN.15.8","LUK.6.27-LUK.6.36",
    "MAT.6.9-MAT.6.13","JHN.11.25-JHN.11.27","LUK.10.25-LUK.10.37","JHN.14.1-JHN.14.6",
    "MAT.28.1-MAT.28.10","LUK.24.13-LUK.24.35","JHN.20.19-JHN.20.31","MAT.25.31-MAT.25.46",
    "MRK.1.14-MRK.1.20","LUK.4.1-LUK.4.13","JHN.2.1-JHN.2.11","MAT.14.13-MAT.14.21",
  ];
  const passage = gospels[dayOfYear % gospels.length];
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';
  const BIBLE_ID = 'e3f420b9665abaeb-01';
  try {
    const url = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/passages/${passage}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
    const response = await fetch(url, {
      headers: { 'api-key': API_KEY, 'Accept': 'application/json' }
    });
    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ success: false, error: err });
    }
    const data = await response.json();
    const text = data && data.data && data.data.content ? data.data.content.replace(/\s+/g, ' ').trim() : null;
    const reference = data && data.data && data.data.reference ? data.data.reference : passage;
    if (!text) return res.status(404).json({ success: false, error: 'Sin contenido' });
    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;
    return res.status(200).json({ success: true, reading: title, reference: reference, text: text, reflection: '', url: 'api.bible' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
