const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedBackController');

router.post('/', submitFeedback);
router.get('/', getAllFeedback);

module.exports = router;
