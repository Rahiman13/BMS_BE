const Book = require('../models/bookModel');
const { Op } = require('sequelize');

// exports.getAllBooks = async (req, res) => {
//   try {
//     const books = await Book.findAll();
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching books" });
//   }
// };


exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();  // Fetch all books from Sequelize
    if (books.length === 0) {
      return res.status(404).json({ error: 'No books found' });
    }
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
};


exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Error adding book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedBook = await Book.findByPk(id);
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating book" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { genre: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error searching books" });
  }
};
