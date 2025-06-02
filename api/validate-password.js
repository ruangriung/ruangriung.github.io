export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password } = req.body;
        const isValid = password === process.env.ADMIN_PASSWORD;
        res.status(200).json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
