const fetch = require('node-fetch');

const buildPrompt = ({ question, query }) => {
    return `You are an expert SQL tutor. A student is solving this SQL problem.
Question: ${question}
Student Query: ${query}

Provide exactly ONE direct, extremely helpful hint about what SQL command or logic they are missing or getting wrong. DO NOT say "That's a great start" or provide any conversational filler. DO NOT give them the final SQL query. Get straight to the technical hint.`;
};

exports.getHint = async (req, res) => {
    const { question, query } = req.body || {};
    // Only check for Google API key since that's what the user wants to use
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: 'No GOOGLE_API_KEY configured in environment variables.' });
    }

    const prompt = buildPrompt({ question, query });

    try {
        // Use Google Generative Language API for Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                }
            }),
        });

        const textResponse = await resp.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            return res.status(500).json({ error: 'Failed to parse LLM response', details: textResponse });
        }

        if (!resp.ok) {
            return res.status(resp.status).json({ error: data?.error?.message || 'LLM API error' });
        }

        const hint = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No hint generated.';
        return res.json({ hint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
