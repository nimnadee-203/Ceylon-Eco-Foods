// BACKEND/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

// auth(allowedRoles) -> middleware
// allowedRoles: array of roles e.g. ['admin'] or ['supplier']
// If no allowedRoles provided, just verify token and set req.user.
module.exports = function auth(allowedRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header || null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      // payload should contain { id, role } as earlier code produced
      req.user = { id: payload.id, role: payload.role || 'admin' };
      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
      }
      next();
    } catch (err) {
      console.error('auth middleware error', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}; 
