const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserByUsername);
router.get('/:userId/addresses', userController.getUserAddresses);
router.post('/:userId/addresses', userController.addAddress);
router.post('/:userId/favorites', userController.toggleFavorite);

module.exports = router;
