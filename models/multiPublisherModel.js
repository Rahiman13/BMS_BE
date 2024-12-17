const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Ensure this connection is valid

const MultiPublisher = sequelize.define('MultiPublisher', {
  publishers: {
    type: DataTypes.JSONB,
    allowNull: false,
  }
});

module.exports = MultiPublisher;
