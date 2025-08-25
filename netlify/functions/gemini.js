// Netlify Function: server-side proxy to Google's Generative Language API (Gemini)
// This function reads GEMINI_API_KEY from environment variables configured in Netlify.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const userPrompt = body.userPrompt;
    if (!userPrompt) return { statusCode: 400, body: JSON.stringify({ error: 'userPrompt required' }) };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'Server missing GEMINI_API_KEY' }) };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é um Professor Interativo, um especialista de alto nível no concurso para o TJ-RJ, com profundo conhecimento da banca FGV. Sua didática é 100% simples, mas completa e visualmente agradável. Use emojis para deixar a conversa mais amigável e didática 🧑‍🏫. Use markdown simples para formatação, como **negrito** para termos importantes. Responda às dúvidas dos candidatos de forma clara, direta e estratégica, sempre focando em como o conteúdo é cobrado pela FGV. Use exemplos práticos e contextualizados. A pergunta do candidato é a seguinte: "${userPrompt}"`;

    const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Gemini error', resp.status, txt);
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error', details: txt }) };
    }

    const result = await resp.json();
    const answer = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Invalid response from Gemini', details: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (err) {
    console.error('Function error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error', details: err.message }) };
  }
};
