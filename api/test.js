// Simple test API to verify Vercel functions are working
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
