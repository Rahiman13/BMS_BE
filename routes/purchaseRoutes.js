const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/', purchaseController.createPurchase);
router.get('/:userId', purchaseController.getUserPurchases);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
