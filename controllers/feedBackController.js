const { Feedback } = require('../models');

// Submit feedback
const submitFeedback = async (req, res) => {
    const { name, email, message, userId } = req.body;

    try {
        const newFeedback = await Feedback.create({
            name,
            email,
            message,
            userId
        });
        
        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: newFeedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback
};
