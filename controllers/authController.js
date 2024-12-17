const Customer = require('../models/customerModel');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, mobile, email, name, password } = req.body;

  try {
    console.log('Registration attempt:', { username, email, mobile, name });

    const existingUser = await Customer.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingMobile = await Customer.findOne({ where: { mobile } });
    if (existingMobile) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Save customer to database
    const customer = await Customer.create({
      username,
      mobile,
      email,
      name,
      password, // Password will be hashed automatically by model hook
    });
    console.log('Customer created:', customer.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: customer.id, role: customer.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' }
    );
    console.log('JWT token generated');

    return res.status(201).json({
      message: "Registration successful",
      customer: {
        id: customer.id,
        username: customer.username,
        email: customer.email,
        role: customer.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map((e) => e.message),
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: "Duplicate entry",
        field: error.errors[0].path,
      });
    }

    return res.status(500).json({
      error: "Could not create customer",
      details: error.message,
    });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await Customer.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update login times
    const loginTimes = user.loginTimes || [];
    loginTimes.push({ login: new Date().toISOString() });
    await user.update({ loginTimes });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
