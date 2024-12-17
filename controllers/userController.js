const { Customer, Address } = require('../models');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{
        model: Address,
        attributes: ['id', 'street', 'landmark', 'city', 'state', 'postalCode', 'country']
      }]
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Address,
        attributes: ['id', 'street', 'landmark', 'city', 'state', 'postalCode', 'country']
      }]
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Customer.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedUser = await Customer.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: "Error adding address" });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.findAll({
      where: { userId }
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching addresses" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await Customer.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let favorites = user.favorites || [];
    const index = favorites.indexOf(bookId);
    
    if (index === -1) {
      favorites.push(bookId);
    } else {
      favorites.splice(index, 1);
    }

    await user.update({ favorites });
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: "Error updating favorites" });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await Customer.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'name']
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};
