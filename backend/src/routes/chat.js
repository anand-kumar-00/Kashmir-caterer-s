/**
 * Kashmir Caterer's (BBS) — Groq AI Chat Route
 * POST /api/chat
 *
 * The Groq API key NEVER leaves the server.
 * The frontend only talks to /api/chat on the same origin.
 */

const express   = require('express');
const rateLimit = require('express-rate-limit');
const Groq      = require('groq-sdk');

const router = express.Router();

/* ── Per-IP rate limit: 20 messages / 5 minutes ── */
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a few minutes.' },
});

/* ── Lazy-init Groq client (only when first request arrives) ── */
let groq = null;
function getGroq() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
      return null;
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

/* ── System prompt — Kashmir Caterer's AI assistant ── */
const SYSTEM_PROMPT = `You are "Kashmiria", the friendly AI assistant for Kashmir Caterers, a premium outdoor & indoor catering company based in Jammu, India.

ABOUT THE BUSINESS:
- Name: Kashmir Caterers
- Tagline: "Dovetail in quality & quantity"
- Email: kashmircaterersblb@gmail.com
- Phone: 9419123005, 9419221447, 7006377504, 9622053305
- Locations: Akalpur Morh (near Satish Furniture House, Gajansoo Road, Jammu) and Qila Mubarak (Akhnoor Road, Barnai, Jammu)

PACKAGES OFFERED:
- Mega Veg (MIN. 300 PAX) — Cold Bev×4, Hot Bev×2, Appetizers×6, Salad×5, Raita×2, Rice×2, Main Course×5, Live Counters×6, Dessert×4, Fruit Counter
- Mega Non-Veg (MIN. 250 PAX) — Includes both veg and non-veg sections for each course
- Mini Veg (MIN. 300 PAX) — Scaled-down limits across all categories
- Koshur Non-Veg (MIN. 250 PAX) — Authentic Kashmiri Wazwan-style full buffet
- High Tea (MIN. 50 PAX) — Light service for corporate/small events
- Wazwan Cloud Kitchen — Order authentic Kashmiri dishes by the kilogram

SPECIALITIES:
- Kashmiri dishes: Mutton Rogan Josh, Mutton Yakhni, Tabak Maaz, Damalloo, Nadroo Yakhni, Phirni, Shifuta, Haakh Saag
- Wide veg and non-veg spreads, live counters, chaat stations, continental options
- Additional counters: Punjabi Dhaba, Mocktails, Cocktails, Pan Counters, Ice-Cream Parlour

YOUR ROLE:
- Help visitors choose the right catering package for their event
- Answer questions about menu items, portions, pricing approach
- Guide customers to the booking form or WhatsApp for enquiries
- Be warm, knowledgeable, and brief (2–4 sentences max per reply)
- If asked about exact pricing, say rates vary by event scale and to contact us directly
- Never make up information not listed above
- Always end enquiries by suggesting: "You can book via the form on this page or WhatsApp us at 9419123005"

Language: Respond in the same language the user writes in. Default is English. Always refer to the business as "Kashmir Caterers" — never use any abbreviated forms.`;

/* ── POST /api/chat ── */
router.post('/', chatLimiter, async (req, res) => {
  const client = getGroq();
  if (!client) {
    return res.status(503).json({
      error: 'AI assistant is not configured. Please contact us directly.',
    });
  }

  /* Validate input */
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  /* Allow only the last 10 user/assistant turns to keep context manageable */
  const safeMessages = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) })); // cap content length

  if (!safeMessages.length) {
    return res.status(400).json({ error: 'No valid messages provided.' });
  }

  try {
    const completion = await client.chat.completions.create({
      model:       process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
      max_tokens:  256,
      temperature: 0.65,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
    res.json({ reply });

  } catch (err) {
    console.error('[Chat] Groq error:', err?.status, err?.message);
    res.status(502).json({ error: 'AI service unavailable. Please try again shortly.' });
  }
});

module.exports = router;
