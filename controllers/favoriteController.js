const { Favorite } = require('../models');

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorites = await Favorite.findAll({
            where: { userId: userId }
        });
        
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: "Error fetching favorites" });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({ error: "BookId is required" });
        }

        // Check if favorite already exists
        const [favorite, created] = await Favorite.findOrCreate({
            where: {
                userId: userId,
                bookId: bookId
            }
        });

        if (!created) {
            return res.status(200).json({ message: "Already in favorites" });
        }

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: "Error adding favorite" });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const deleted = await Favorite.destroy({
            where: {
                userId: userId,
                bookId: bookId
            }
        });

        if (deleted) {
            const favorites = await Favorite.findAll({
                where: { userId: userId }
            });
            res.status(200).json(favorites);
        } else {
            res.status(404).json({ error: "Favorite not found" });
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: "Error removing favorite" });
    }
};
