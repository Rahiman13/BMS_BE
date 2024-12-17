const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Customer.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Requires admin access" });
  }
};

// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const hashedPassword = await bcrypt.hash(password, 10);
