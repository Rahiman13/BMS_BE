const sequelize = require('../config/database');
const Customer = require('./customerModel');
const Address = require('./addressModel');
const Book = require('./bookModel');
const Purchase = require('./purchaseModel');
const Favorite = require('./favoritesModel');
const Feedback = require('./feedbackModel');

// Define associations
Customer.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses',
  onDelete: 'CASCADE'
});

Address.belongsTo(Customer, {
  foreignKey: 'userId',
  as: 'customer'
});

Customer.hasMany(Purchase, {
  foreignKey: 'userId',
  as: 'purchases'
});
Purchase.belongsTo(Customer, {
  foreignKey: 'userId',
  as: 'customer'
});

// Favorites association
Customer.belongsToMany(Book, { 
  through: Favorite,
  foreignKey: 'userId',
  otherKey: 'bookId',
  as: 'favoriteBooks'
});
Book.belongsToMany(Customer, { 
  through: Favorite,
  foreignKey: 'bookId',
  otherKey: 'userId',
  as: 'favoritedBy'
});

module.exports = {
  sequelize,
  Customer,
  Address,
  Book,
  Purchase,
  Favorite,
  Feedback
};