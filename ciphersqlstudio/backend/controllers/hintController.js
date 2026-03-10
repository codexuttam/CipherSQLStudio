const fetch = require('node-fetch');

const buildPrompt = ({ question, query }) => {
    return `You are a SQL tutor. A student is solving this SQL problem.\n\nQuestion:\n${question}\n\nStudent Query:\n${query}\n\nProvide a helpful hint that guides them in the right direction WITHOUT giving the final SQL query.`;
};

exports.getHint = async (req, res) => {
    const { question, query } = req.body || {};
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

    const prompt = buildPrompt({ question, query });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
                temperature: 0.7,
            }),
        });
        const data = await response.json();
        const hint = data?.choices?.[0]?.message?.content || 'No hint generated.';
        res.json({ hint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
