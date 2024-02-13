const db = require('../models/index');
const { saveImage, generateImageHash, deleteImage } = require('../helpers/helpers');
const fs = require('fs');
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;

const createPost = async (req, res) => {
    try {
        const { image, caption } = req.body;
        const userId = req.user.id;

        console.log(caption);

        const fileName = `${generateImageHash()}.jpg`;

        saveImage(image, `../slike/post/${fileName}`);

        const newPost = await Post.create({ image: fileName, caption, userId });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Greška prilikom kreiranja posta:', error);
        res.status(500).json({ message: 'Greška prilikom kreiranja posta', error: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const postToDelete = await Post.findByPk(postId);

        if (!postToDelete) {
            return res.status(404).json({ message: 'Post nije pronađen' });
        }

        if (postToDelete.userId !== userId) {
            return res.status(403).json({ message: 'Nemate dozvolu za brisanje ovog posta' });
        }

        const imagePath = `../slike/post/${postToDelete.image}`;

        deleteImage(imagePath);

        await postToDelete.destroy();

        res.status(200).json({ message: 'Post uspešno obrisan' });
    } catch (error) {
        console.error('Greška prilikom brisanja posta:', error);
        res.status(500).json({ message: 'Greška prilikom brisanja posta', error: error.message });
    }
}

const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findByPk(postId, {
            include: [
                { model: User },
                { model: Comment, as: 'comments', include: [User] }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: 'Post nije pronađen' });
        }

        post.comments.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1;
            if (a.createdAt > b.createdAt) return 1;
            return 0;
        });

        const isLiked = await post.hasUser(userId);

        res.status(200).json({ post, isLiked });
    } catch (error) {
        console.error('Greška prilikom dohvatanja posta sa korisnikom i komentarima:', error);
        res.status(500).json({ message: 'Greška prilikom dohvatanja posta sa korisnikom i komentarima', error: error.message });
    }
}

const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post nije pronadjen' });
        }

        const isLiked = await post.hasUser(userId);
        if (isLiked) {
            return res.status(400).json({ message: 'Korisnik je vec lajkovao ovaj post' });
        }

        await post.addUser(userId);

        res.status(200).json({ message: 'Post uspesno lajkovan' });
    } catch (error) {
        console.error('Greska prilikom lajkovanja posta:', error);
        res.status(500).json({ message: 'Greska lajkovanja posta:', error: error.message });
    }
}

const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post nije pronadjen' });
        }

        const isLiked = await post.hasUser(userId);
        if (!isLiked) {
            return res.status(400).json({ message: 'Korisnik nije ni lajkovao ovaj post' });
        }

        await post.removeUser(userId);

        res.status(200).json({ message: 'Post uspesno dislajkovan' });
    } catch (error) {
        console.error('Greska prilikom dislajkovanja posta:', error);
        res.status(500).json({ message: 'Greska dislajkovanja posta:', error: error.message });
    }
}

const getPostsByPagination = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const perPage = 2;

        const offset = (page - 1) * perPage;

        const posts = await Post.findAll({
            limit: perPage,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['username', 'profile_image'] }]
        });

        if (posts.length === 0) {
            return res.status(204).end();
        }

        res.json({ posts, page });
    } catch (error) {
        console.error('Greška prilikom dohvatanja postova po paginaciji:', error);
        res.status(500).json({ message: 'Došlo je do greške prilikom dohvatanja postova.' });
    }
};

const getAllPostsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, { include: { model: Post, as: 'posts' } });

        console.log(user);

        //   if (!user) {
        //     return res.status(404).json({ error: 'Korisnik nije pronađen.' });
        //   }

        const userPosts = user.posts;

        return res.status(200).json(userPosts);
    } catch (error) {
        console.error('Greška prilikom dohvaćanja postova korisnika:', error);
        return res.status(500).json({ error: 'Došlo je do greške prilikom dohvaćanja postova korisnika.' });
    }
};


module.exports = {
    createPost,
    deletePost,
    getPost,
    likePost,
    dislikePost,
    getPostsByPagination,
    getAllPostsByUser
}