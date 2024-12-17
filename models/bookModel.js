const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  summary: DataTypes.TEXT,
  imageUrl: DataTypes.STRING,
  price: DataTypes.DECIMAL(10, 2),
  totalCopies: DataTypes.INTEGER,
  copiesAvailable: DataTypes.INTEGER,
  genre: DataTypes.STRING,
  publisherName: DataTypes.STRING,
  authorName: DataTypes.STRING,
  authorBio: DataTypes.TEXT
});

module.exports = Book;
