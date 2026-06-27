import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PRIV_KEY = 'prv_test_UejvuFaIJ4dG7srQNeR1i4GFleXwX58M';
  const PUB_KEY = 'pub_test_xPgU55YobCslPvoYbXPegPXLDxC1RFyd';
  const INTEGRITY_KEY = 'test_integrity_MhVJMSER6egsMuu8efy3bKH3At2NLI1a';

  try {
    const { items, customer } = req.body;
    if (!items || !customer) return res.status(400).json({ error: 'Missing items or customer' });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amountInCents = Math.round(total * 100);
    const reference = `CDF-${Date.now()}`;
    const currency = 'COP';

    // Generar firma de integridad
    const signature = crypto
      .createHash('sha256')
      .update(`${reference}${amountInCents}${currency}${INTEGRITY_KEY}`)
      .digest('hex');

    return res.status(200).json({
      success: true,
      publicKey: PUB_KEY,
      reference,
      amountInCents,
      currency,
      signature,
      customerEmail: customer.email,
      customerName: customer.name,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}