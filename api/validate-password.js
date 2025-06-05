export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { password } = req.body;

    // Validasi input
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }

    // Bandingkan dengan environment variable
    // Catatan: Di production, gunakan bcrypt.compare() untuk password yang di-hash
    const isValid = password === process.env.ADMIN_PASSWORD;

    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid password' 
      });
    }

    // Respon sukses
    return res.status(200).json({ 
      success: true,
      message: 'Password verified' 
    });

  } catch (error) {
    console.error('Password validation error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
