import { Resend } from 'resend';

const WOMPI_BASE = process.env.WOMPI_ENV === 'production'
  ? 'https://production.wompi.co/v1'
  : 'https://sandbox.wompi.co/v1';

const PRIV_KEY = process.env.WOMPI_PRIV_KEY || 'prv_test_UejvuFaIJ4dG7srQNeR1i4GFleXwX58M';

const formatCOP = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const escapeHtml = (str) =>
  String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildEmailHtml({ customerName, items, total, reference }) {
  const safeName = escapeHtml(customerName) || 'cliente';
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0E6D3;color:#3A2A1E;font-size:14px;">
        ${escapeHtml(item.icon)} ${escapeHtml(item.name)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #F0E6D3;text-align:center;color:#8B6E5A;font-size:14px;">
        ×${item.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #F0E6D3;text-align:right;color:#6B1F3E;font-weight:bold;font-size:14px;">
        ${formatCOP(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF5ED;font-family:Georgia,serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

  <div style="background:linear-gradient(135deg,#4A0F28,#6B1F3E);border-radius:16px 16px 0 0;padding:32px 28px;text-align:center;">
    <div style="font-size:42px;margin-bottom:10px;">✝️</div>
    <div style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#C9A84C;margin-bottom:4px;">Horeb</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.65);font-style:italic;">Cada día, un paso más cerca de Dios</div>
  </div>

  <div style="background:#ffffff;padding:32px 28px;border:1px solid #F0E6D3;border-top:none;">
    <div style="font-size:26px;margin-bottom:10px;">🙏</div>
    <div style="font-size:20px;font-weight:bold;color:#4A0F28;margin-bottom:10px;">
      ¡Gracias por tu compra, ${safeName}!
    </div>
    <p style="font-size:14px;color:#8B6E5A;line-height:1.75;margin:0 0 28px;">
      Tu pago fue aprobado exitosamente. Que estos artículos acompañen tu fe y tu oración diaria.
    </p>

    <div style="background:#FAF5ED;border-radius:12px;padding:20px;margin-bottom:28px;">
      <div style="font-size:11px;color:#8B6E5A;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">
        Resumen del pedido · <span style="color:#6B1F3E;">${escapeHtml(reference)}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding:14px 0 0;font-weight:bold;color:#4A0F28;font-size:15px;">Total</td>
          <td style="padding:14px 0 0;text-align:right;font-weight:bold;color:#6B1F3E;font-size:18px;">
            ${formatCOP(total)}
          </td>
        </tr>
      </table>
    </div>

    <div style="border-left:3px solid #C9A84C;padding:14px 18px;background:#FAF5ED;border-radius:0 8px 8px 0;margin-bottom:28px;">
      <div style="font-size:15px;font-style:italic;color:#4A0F28;line-height:1.7;">
        «Gratis recibisteis, dad gratis»
      </div>
      <div style="font-size:12px;color:#C9A84C;margin-top:8px;font-weight:bold;">— Mateo 10:8</div>
    </div>

    <p style="font-size:13px;color:#8B6E5A;line-height:1.6;margin:0;">
      Si tienes preguntas sobre tu pedido, responde este correo indicando la referencia
      <strong style="color:#6B1F3E;">${escapeHtml(reference)}</strong>.
    </p>
  </div>

  <div style="background:#F0E6D3;border-radius:0 0 16px 16px;padding:20px 28px;text-align:center;border:1px solid #E0D0B0;border-top:none;">
    <div style="font-size:22px;margin-bottom:8px;">✝</div>
    <div style="font-size:13px;color:#8B6E5A;">Que Dios te bendiga siempre</div>
    <div style="font-size:11px;color:#B0946E;margin-top:8px;">Horeb</div>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { transactionId, customerName, customerEmail, items, total, reference } = req.body;

  console.log('[confirm-payment] body recibido:', JSON.stringify({
    transactionId,
    reference,
    customerEmail,
    customerName,
    itemsCount: items?.length,
    total,
  }));

  if (!transactionId || !customerEmail || !items?.length) {
    console.error('[confirm-payment] campos faltantes:', { transactionId: !!transactionId, customerEmail: !!customerEmail, itemsLength: items?.length });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verificar con Wompi que el pago fue aprobado
    const wompiUrl = `${WOMPI_BASE}/transactions/${transactionId}`;
    console.log('[confirm-payment] consultando Wompi:', wompiUrl);

    const wompiRes = await fetch(wompiUrl, {
      headers: { Authorization: `Bearer ${PRIV_KEY}` },
    });

    console.log('[confirm-payment] Wompi HTTP status:', wompiRes.status);

    if (!wompiRes.ok) {
      const errBody = await wompiRes.text();
      console.error('[confirm-payment] Wompi error body:', errBody);
      return res.status(502).json({ success: false, error: 'Could not verify transaction with Wompi' });
    }

    const wompiData = await wompiRes.json();
    const status = wompiData?.data?.status;
    console.log('[confirm-payment] Wompi transaction status:', status, '| reference:', wompiData?.data?.reference);

    if (status !== 'APPROVED') {
      return res.status(400).json({ success: false, error: `Transaction not approved (status: ${status})` });
    }

    // Pago confirmado — enviar email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
    console.log('[confirm-payment] enviando email a:', customerEmail, '| from:', from);

    const emailRes = await resend.emails.send({
      from: `Horeb <${from}>`,
      to: customerEmail,
      subject: `✝️ Tu pedido ${reference} está confirmado — Horeb`,
      html: buildEmailHtml({ customerName, customerEmail, items, total, reference }),
    });

    console.log('[confirm-payment] Resend respuesta:', JSON.stringify(emailRes));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[confirm-payment] excepción:', error.message, error.stack);
    return res.status(500).json({ success: false, error: error.message });
  }
}
