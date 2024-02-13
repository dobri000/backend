const { hashPassword, comparePasswords, generateToken } = require('../auth/auth');
const { saveImage, generateImageHash } = require('../helpers/helpers');
const db = require('../models/index');
const User = db.User;

const register = async (req, res) => {

    const { username, email, password, profile_photo } = req.body;
    const existingUser = await User.findOne({ where: { username: username } });

    if (existingUser) {
        return res.status(400).json({ message: 'Korisnik sa datim korisničkim imenom već postoji' });
    }

    const hashedPassword = await hashPassword(password);

    const fileName = `${generateImageHash()}.jpg`;

    saveImage(profile_photo, `../slike/profil/${fileName}`);

    const newUser = await User.create({ username, email, password: hashedPassword, profile_image: fileName });
    const token = generateToken(newUser);
    res.status(201).json({
        username,
        email,
        token
    });
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(401).json({ message: 'Pogrešno korisničko ime ili lozinka' });
        }

        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Pogrešno korisničko ime ili lozinka' });
        }

        const token = generateToken(user);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Greška prilikom prijavljivanja korisnika:', error);
        res.status(500).json({ message: 'Greška prilikom prijavljivanja korisnika', error: error.message });
    }
}



module.exports = {
    register,
    login
}