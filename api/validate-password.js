// Import dependencies if needed (e.g., for hashing passwords)
// import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { password } = req.body;

    // Validate input
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }

    // Compare with environment variable
    // Note: In production, use hashed passwords (e.g., bcrypt.compare)
    const isValid = password === process.env.ADMIN_PASSWORD;

    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid password' 
      });
    }

    // Password is valid
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
