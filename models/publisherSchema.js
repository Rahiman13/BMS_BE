const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  bio: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

const publisherSchema = new mongoose.Schema({
  publisherName: { type: String, required: true },
  authors: [authorSchema]
});

module.exports = publisherSchema;
