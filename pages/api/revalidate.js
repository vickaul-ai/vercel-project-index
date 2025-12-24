export default async function handler(req, res) {
  // Check for secret to prevent unauthorized revalidation
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Revalidate the home page
    await res.revalidate('/');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
}
