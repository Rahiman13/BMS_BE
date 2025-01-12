const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/:userId', favoriteController.getFavorites);
router.post('/:userId', favoriteController.addFavorite);
router.delete('/:userId/:bookId', favoriteController.removeFavorite);

module.exports = router;
