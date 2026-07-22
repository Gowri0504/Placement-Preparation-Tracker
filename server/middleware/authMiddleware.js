const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('=== protect middleware invoked ===');
  console.log('Authorization header:', req.headers.authorization);
  console.log('Using JWT_SECRET (masked):', process.env.JWT_SECRET ? `${process.env.JWT_SECRET.slice(0,4)}...${process.env.JWT_SECRET.slice(-4)}` : 'FALLBACK TO "secret"');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted token:', token ? `${token.slice(0, 20)}...` : 'empty');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      console.log('Token decoded successfully:', decoded);
      
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? req.user.username : 'null');
      
      next();
    } catch (error) {
      console.error('=== JWT verification error ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
