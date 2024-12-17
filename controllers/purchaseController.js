const { Purchase, Book, Customer } = require('../models');
const sequelize = require('../config/database');

exports.createPurchase = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { 
      userId, 
      bookTitle, 
      bookimageUrl,
      author,
      price,
      quantity,
      totalPrice,
      purchasedDate,
      address 
    } = req.body;

    // Validate required fields
    if (!userId || !bookTitle || !quantity || !address || !bookimageUrl || !author || !price || !totalPrice || !purchasedDate) {
      await t.rollback();
      return res.status(400).json({ 
        error: "Missing required fields",
        received: {
          userId,
          bookTitle,
          quantity,
          address,
          bookimageUrl,
          author,
          price,
          totalPrice,
          purchasedDate
        }
      });
    }

    // Find the book and check availability
    const book = await Book.findOne({ 
      where: { title: bookTitle }
    }, { transaction: t });

    if (!book || book.copiesAvailable < quantity) {
      await t.rollback();
      return res.status(400).json({ error: "Book not available in requested quantity" });
    }

    // Find the user
    const user = await Customer.findByPk(userId);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    // Create purchase
    const purchase = await Purchase.create({
      userId,
      username: user.username,
      bookTitle,
      bookimageUrl,
      author,
      price,
      quantity,
      totalPrice,
      purchasedDate,
      deliveryAddress: address
    }, { transaction: t });

    // Update book copies
    await book.update({
      copiesAvailable: book.copiesAvailable - quantity
    }, { transaction: t });

    await t.commit();
    res.status(201).json(purchase);
  } catch (error) {
    await t.rollback();
    console.error('Purchase error:', error);
    res.status(500).json({ error: "Error processing purchase" });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;
    const purchases = await Purchase.findAll({
      where: { userId },
      order: [['purchasedDate', 'DESC']]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching purchases" });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Purchase.destroy({
      where: { id }
    });
    if (deleted) {
      res.json({ message: "Purchase deleted successfully" });
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting purchase" });
  }
};
