// api/validate-password.js
export default function handler(req, res) {
  // 1. Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://ruangriung.my.id');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Hanya terima POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 3. Validasi password
  try {
    const { password } = req.body;
    const isValid = password === process.env.ADMIN_PASSWORD;

    // 4. Response aman
    res.status(200).json({ valid: isValid });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
