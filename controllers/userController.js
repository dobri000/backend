const db = require('../models/index');
const User = db.User;
const { saveImage, generateImageHash, deleteImage } = require('../helpers/helpers');
const fs = require('fs');

const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile_photo = req.body.profile_photo;

        const fileName = `${generateImageHash()}.jpg`;

        saveImage(profile_photo, `../slike/profil/${fileName}`);

        const existingUser = await User.findByPk(userId);

        const imagePath = `../slike/profil/${existingUser.profile_image}`;

        deleteImage(imagePath);

        existingUser.profile_image = fileName;

        await existingUser.save();

        res.status(200).json({ message: 'Profilna slika korisnika je uspešno ažurirana.' });
    } catch (error) {
        console.error('Greška prilikom ažuriranja profilne slike korisnika:', error);
    }

}

module.exports = {
    updateProfileImage
}