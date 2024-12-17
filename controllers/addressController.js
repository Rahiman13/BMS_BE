const { Address, Customer } = require('../models');

exports.createAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Verify customer exists
    const customer = await Customer.findByPk(userId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const address = await Address.create(req.body);
    res.status(201).json(address);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: "Error creating address" });
  }
};

exports.getAddressesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.findAll({
      where: { userId },
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['name', 'email']
      }]
    });
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: "Error fetching addresses" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const [updated] = await Address.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAddress = await Address.findByPk(req.params.id);
      res.json(updatedAddress);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: "Error updating address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: "Address deleted successfully" });
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: "Error deleting address" });
  }
};
