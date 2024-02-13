const db = require('../models/index');
const Comment = db.Comment;

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        console.log(userId);

        const newComment = await Comment.create({ content, userId, postId });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Greška prilikom dodavanja komentara:', error);
        res.status(500).json({ message: 'Greška prilikom dodavanja komentara', error: error.message });
    }
}

module.exports = {
    addComment,
}
