export default function handler(req, res) {
  // Debugging: Log environment variables
  console.log("ENV:", process.env.ADMIN_PASSWORD); 

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    
    // Debugging: Log input password
    console.log("Input Password:", password); 
    
    const isValid = password === process.env.ADMIN_PASSWORD;
    
    // Debugging: Log validation result
    console.log("Is Valid:", isValid); 
    
    res.status(200).json({ 
      valid: isValid,
      debug: {
        envPassword: process.env.ADMIN_PASSWORD,
        inputPassword: password
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
