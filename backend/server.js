const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota GET para teste rápido do backend
app.get('/', (req, res) => {
    res.send('Backend Gemini rodando!');
});

app.post('/api/gemini', async (req, res) => {
    const { userPrompt } = req.body;
    if (!userPrompt) {
        console.error('Prompt não enviado pelo frontend.');
        return res.status(400).json({ error: 'Prompt obrigatório.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Chave API não encontrada no .env.');
        return res.status(500).json({ error: 'Chave API não configurada.' });
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `Você é um Professor Interativo, um especialista de alto nível no concurso para o TJ-RJ, com profundo conhecimento da banca FGV. Sua didática é 100% simples, mas completa e visualmente agradável. Use emojis para deixar a conversa mais amigável e didática 🧑‍🏫. Use markdown simples para formatação, como **negrito** para termos importantes. Responda às dúvidas dos candidatos de forma clara, direta e estratégica, sempre focando em como o conteúdo é cobrado pela FGV. Use exemplos práticos e contextualizados. A pergunta do candidato é a seguinte: "${userPrompt}"`;
    const payload = {
        contents: [{ parts: [{ text: systemPrompt }] }]
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na API Gemini:', response.status, errorText);
            return res.status(500).json({ error: 'Erro na API Gemini.', details: errorText });
        }
        const result = await response.json();
        if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0].text) {
            console.error('Resposta inesperada da API Gemini:', JSON.stringify(result));
            return res.status(500).json({ error: 'Resposta inesperada da API Gemini.', details: result });
        }
        res.json({ answer: result.candidates[0].content.parts[0].text });
    } catch (err) {
        console.error('Erro interno no backend:', err);
        res.status(500).json({ error: 'Erro interno.', details: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
